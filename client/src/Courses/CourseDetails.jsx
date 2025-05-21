import React, { useState, useEffect } from 'react';
import {
  Typography,
  List,
  ListItem,
  Card,
  Textarea,
  Button,
  Spinner,
  Rating,
} from '@material-tailwind/react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import QuizQuestion from '../components/QuizComponent';
import { AuthContext } from '../context/AuthContext';
import api from "../axios";

const tabs = [
  'Notes',
  'Watch Video',
  'Quiz',
  'Coding Practice',
  'Feedback',
  'AI Assistance',
];

const CourseDetail = () => {
  const { language, topic } = useParams();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('topicId');
  const navigate = useNavigate();
  const { user, authToken } = React.useContext(AuthContext);

  const [courseId, setCourseId] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [selectedTab, setSelectedTab] = useState('Notes');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [aiLoading, setaiLoading] = useState(false);
  const [dataLoading, setdataLoading] = useState(true);
  const [topicData, setTopicData] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [feedbackData, setFeedbackData] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isTopicCompleted, setIsTopicCompleted] = useState(false);

  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const res = await api.get(`/api/topics/topicById/${topicId}`);
        const data = res.data;
        setTopicData(data);
        setCourseId(data.course);
        setLanguageId(data.language);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setdataLoading(false);
      }
    };

    const fetchQuizData = async () => {
      try {
        const res = await api.get(`/api/quizzes/${topicId}`);
        setQuizData(res.data);
      } catch (err) {
        console.error('Quiz fetch error:', err);
      }
    };

    const fetchFeedbackData = async () => {
      try {
        const res = await api.get(`/api/feedbacks/byTopic/${topicId}`);
        setFeedbackData(res.data);
      } catch (err) {
        console.error('Feedback fetch error:', err);
      }
    };

    if (topicId) {
      fetchTopicDetails();
      fetchQuizData();
      fetchFeedbackData();
    }
  }, [topicId]);

  const handleAIRequest = async () => {
    if (!prompt.trim()) return;
    setaiLoading(true);
    setResponse('');
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setResponse(aiText || 'No response generated from Gemini.');
    } catch (error) {
      console.error('AI error:', error);
      setResponse('An error occurred while fetching AI response.');
    } finally {
      setaiLoading(false);
    }
  };

  const handleOptionChange = (questionIndex, selectedOption) => {
    setSelectedOptions((prev) => ({ ...prev, [questionIndex]: selectedOption }));
  };

  const handleSubmitQuiz = async () => {
    const questions = quizData?.[0]?.questions || [];
    let newScore = 0;
    questions.forEach((q, idx) => {
      if (selectedOptions[idx] === q.correctAnswer) newScore++;
    });
    setScore(newScore);
    setIsSubmitted(true);

    if (newScore === questions.length) {
      try {
        const res = await api.post(`/api/users/markComplete`, {
          courseId,
          languageId,
          topicId,
        });

        if (res.status === 200) {
          setIsTopicCompleted(true);
          console.log('Topic marked as completed:', res.data);
        } else {
          console.error('Failed to mark topic as complete:', res.data);
        }
      } catch (err) {
        console.error('Error marking topic as complete:', err);
      }
    }
  };

  const renderContent = () => {
    if (fetchError) return <Typography color="red">{fetchError}</Typography>;
    if (dataLoading) return <Typography>Loading topic data...</Typography>;

    switch (selectedTab) {
      case 'Notes':
        return <Typography>{topicData.notes || 'No notes available for this topic.'}</Typography>;

      case 'Watch Video':
        return topicData.youtubeLinks?.length > 0 ? (
          topicData.youtubeLinks.map((link, idx) => (
            <div key={idx} className="mb-6">
              <iframe
                src={link}
                title={`Video ${idx + 1}`}
                className="w-full h-64 rounded"
                allowFullScreen
              ></iframe>
            </div>
          ))
        ) : (
          <Typography>No videos available for this topic.</Typography>
        );

      case 'Quiz': {
        const questions = quizData?.[0]?.questions || [];
        return (
          <>
            {questions.length > 0 ? (
              <>
                {questions.map((q, idx) => (
                  <QuizQuestion
                    key={idx}
                    questionIndex={idx}
                    questionData={q}
                    selectedOptions={selectedOptions}
                    handleOptionChange={handleOptionChange}
                    isSubmitted={isSubmitted}
                  />
                ))}

                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <>
                    <Typography variant="h6" className="mt-4">
                      You scored {score} out of {questions.length}
                    </Typography>
                    {isTopicCompleted && (
                      <>
                        <Typography color="green" className="mt-2">
                          ✅ Topic marked as completed!
                        </Typography>
                        <Button
                          className="mt-4 bg-blue-700 text-white"
                          onClick={() => navigate(`/courses/frontend/${languageId}`)}
                        >
                          Back to Topics
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <Typography>No quiz questions for this topic.</Typography>
            )}
          </>
        );
      }

      case 'Coding Practice':
        return topicData.codingQuestions?.length > 0 ? (
          topicData.codingQuestions.map((q, idx) => (
            <Card key={idx} className="p-4 mb-4">
              <Typography variant="h6">{q.title}</Typography>
              <Typography>{q.description}</Typography>
            </Card>
          ))
        ) : (
          <Typography>No coding practice available.</Typography>
        );

      case 'Feedback':
        return feedbackData.length > 0 ? (
          feedbackData.map((fb, idx) => (
            <Card key={idx} className="p-4 mb-4">
              <Typography variant="small" className="font-semibold">
                Rating: <Rating value={fb.rating} readonly />
              </Typography>
              <Typography className="mt-2">{fb.comment}</Typography>
            </Card>
          ))
        ) : (
          <Typography>No feedback available for this topic.</Typography>
        );

      case 'AI Assistance':
        return (
          <>
            <Typography variant="small" className="mb-2 font-medium text-gray-700">
              AI Response:
            </Typography>
            <Card className="p-4 bg-gray-100 whitespace-pre-wrap min-h-[200px] max-h-[400px] overflow-y-auto">
              {response || 'AI response will appear here.'}
            </Card>
            <Typography variant="small" className="mb-2 font-medium text-gray-700 mt-4">
              Ask your question about this topic:
            </Typography>
            <div className="flex items-start gap-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="flex-grow"
              />
              <Button
                onClick={handleAIRequest}
                disabled={aiLoading || !prompt.trim()}
                className="rounded-full bg-blue-600 hover:bg-blue-700 w-12 h-12 flex items-center justify-center p-0"
                aria-label="Submit AI prompt"
              >
                {aiLoading ? (
                  <Spinner className="h-6 w-6" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m-7 7l7-7 7 7" />
                  </svg>
                )}
              </Button>
            </div>
          </>
        );

      default:
        return <Typography>Select a tab to view its content.</Typography>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6 h-full min-h-[90vh] bg-gray-50">
      <div className="w-full md:w-1/4 bg-white shadow-lg rounded p-4">
        <Typography variant="h6" className="mb-4 capitalize">
          {language ? `${language} - ${topic}` : topic}
        </Typography>
        <List>
          {tabs.map((tab) => (
            <ListItem
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`cursor-pointer rounded ${
                selectedTab === tab
                  ? 'bg-blue-100 font-semibold text-blue-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {tab}
            </ListItem>
          ))}
        </List>
      </div>
      <div className="w-full md:w-3/4 bg-white shadow-lg rounded p-6 overflow-y-auto">
        <Typography variant="h6" className="mb-4 text-blue-800">
          {selectedTab}
        </Typography>
        {renderContent()}
      </div>
    </div>
  );
};

export default CourseDetail;


// import React, { useState } from 'react';
// import {
//   Typography,
//   List,
//   ListItem,
//   Card,
//   Textarea,
//   Button,
//   Spinner,
// } from '@material-tailwind/react';
// import { useParams } from 'react-router-dom';

// const tabs = [
//   'Notes',
//   'Watch Video',
//   'Quiz',
//   'Coding Practice',
//   'Feedback',
//   'AI Assistance',
// ];

// const dummyContent = {
//   Notes: 'Here are the notes for this topic.',
//   'Watch Video': 'Watch the introduction and advanced videos here.',
//   Quiz: 'Start quizzes to test your knowledge.',
//   'Coding Practice': 'Practice coding problems here.',
//   Feedback: 'Provide your feedback.',
// };

// // Add this list of OpenRouter-compatible models
// const models = [
//   { label: 'GPT-3.5 Turbo (OpenAI)', value: 'openai/gpt-3.5-turbo' },
//   { label: 'GPT-4 Turbo (OpenAI)', value: 'openai/gpt-4-turbo' },
//   { label: 'Claude 3 Haiku (Anthropic)', value: 'anthropic/claude-3-haiku' },
//   { label: 'Mixtral (Mistral)', value: 'mistralai/mixtral-8x7b' },
//   { label: 'LLaMA 3 (Meta)', value: 'meta-llama/llama-3-70b-instruct' },
// ];

// const CourseDetail = () => {
//   const { language, topic } = useParams();
//   const [selectedTab, setSelectedTab] = useState('Notes');
//   const [prompt, setPrompt] = useState('');
//   const [response, setResponse] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [selectedModel, setSelectedModel] = useState(models[0].value); // default model

//   const handleAIRequest = async () => {
//     if (!prompt.trim()) return;

//     setLoading(true);
//     setResponse('');
//     try {
//       const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

//       const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${apiKey}`,
//           'HTTP-Referer': 'https://yourdomain.com',
//           'X-Title': 'EasyLearn-AI',
//         },
//         body: JSON.stringify({
//           model: selectedModel,
//           messages: [
//             { role: 'system', content: 'You are an expert programming tutor.' },
//             { role: 'user', content: prompt },
//           ],
//         }),
//       });

//       const data = await res.json();
//       const aiText = data?.choices?.[0]?.message?.content;
//       setResponse(aiText || 'No response generated from OpenRouter.');
//     } catch (error) {
//       console.error('AI error:', error);
//       setResponse('An error occurred while fetching AI response.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row p-6 gap-6 h-full min-h-[90vh] bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-full md:w-1/4 bg-white shadow-lg rounded p-4">
//         <Typography variant="h6" className="mb-4 capitalize">
//           {language ? `${language} - ${topic}` : topic}
//         </Typography>
//         <List>
//           {tabs.map((tab) => (
//             <ListItem
//               key={tab}
//               onClick={() => setSelectedTab(tab)}
//               className={`cursor-pointer rounded ${
//                 selectedTab === tab
//                   ? 'bg-blue-100 font-semibold text-blue-700'
//                   : 'hover:bg-gray-100'
//               }`}
//             >
//               {tab}
//             </ListItem>
//           ))}
//         </List>
//       </div>

//       {/* Content Area */}
//       <div className="w-full md:w-3/4 bg-white shadow-lg rounded p-6 overflow-y-auto">
//         <Typography variant="h6" className="mb-4 text-blue-700">
//           {selectedTab}
//         </Typography>

//         {selectedTab === 'AI Assistance' ? (
//           <>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Choose AI Model:
//               </label>
//               <select
//                 value={selectedModel}
//                 onChange={(e) => setSelectedModel(e.target.value)}
//                 className="border border-gray-300 rounded px-3 py-2 w-full"
//               >
//                 {models.map((model) => (
//                   <option key={model.value} value={model.value}>
//                     {model.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <Typography variant="small" className="mb-2 font-medium text-gray-700">
//               AI Response:
//             </Typography>
//             <Card className="p-4 bg-gray-100 whitespace-pre-wrap min-h-[200px] max-h-[400px] overflow-y-auto">
//               {response || 'AI response will appear here.'}
//             </Card>

//             <Typography variant="small" className="mb-2 mt-4 font-medium text-gray-700">
//               Ask your question about this topic:
//             </Typography>

//             <div className="flex items-start gap-4">
//               <Textarea
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 rows={4}
//                 className="flex-grow"
//               />
//               <Button
//                 onClick={handleAIRequest}
//                 disabled={loading || !prompt.trim()}
//                 className="rounded-full bg-blue-600 hover:bg-blue-700 w-12 h-12 flex items-center justify-center p-0"
//                 aria-label="Submit AI prompt"
//               >
//                 {loading ? (
//                   <Spinner className="h-6 w-6" />
//                 ) : (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-6 w-6 text-white"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m-7 7l7-7 7 7" />
//                   </svg>
//                 )}
//               </Button>
//             </div>
//           </>
//         ) : (
//           <Typography>
//             {dummyContent[selectedTab] || 'Content for this tab will appear here soon.'}
//           </Typography>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;
