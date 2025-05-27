import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  List,
  ListItem,
  Card,
  Textarea,
  Button,
  Spinner,
  Rating,
} from "@material-tailwind/react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import QuizQuestion from "../components/QuizComponent";
import { AuthContext } from "../context/AuthContext";
import api from "../axios";

const tabs = [
  "Notes",
  "Watch Video",
  "Quiz",
  "Coding Practice",
  "Feedback",
  "AI Assistance",
];

const CourseDetail = () => {
  const { language, topic } = useParams();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('topicId');
  const { user, authToken } = useContext(AuthContext);

  const [courseId, setCourseId] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [selectedTab, setSelectedTab] = useState('Notes');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotesLoading, setAiNotesLoading] = useState(false);
  const [aiNotesResponse, setAiNotesResponse] = useState('');
  const [dataLoading, setDataLoading] = useState(true);
  const [topicData, setTopicData] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [feedbackData, setFeedbackData] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isTopicCompleted, setIsTopicCompleted] = useState(false);
  const [aiQuizQuestions, setAiQuizQuestions] = useState([]);
const [aiQuizLoading, setAiQuizLoading] = useState(false);


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
        setDataLoading(false);
      }
    };

    // const fetchQuizData = async () => {
    //   try {
    //     const res = await fetch(`http://localhost:5000/api/quizzes/${topicId}`);
    //     if (res.ok) {
    //       const data = await res.json();
    //       setQuizData(data);
    //     }
    //   } catch (err) {
    //     console.error('Quiz fetch error:', err);
    //   }
    // };

    const fetchFeedbackData = async () => {
      try {
        const res = await api.get(`/api/feedbacks/byTopic/${topicId}`);
        setFeedbackData(res.data);
      } catch (err) {
        console.error("Feedback fetch error:", err);
      }
    };

    if (topicId) {
      fetchTopicDetails();
      // fetchQuizData();
      fetchFeedbackData();
    }
  }, [topicId]);

  


  const handleAIRequest = async () => {
    if (!prompt.trim()) return;
    setAiLoading(true);
    setResponse('');
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setResponse(aiText || "No response generated from Gemini.");
    } catch (error) {
      console.error("AI error:", error);
      setResponse("An error occurred while fetching AI response.");
    } finally {
      setAiLoading(false);
    }
  };


  const generateAINotes = async () => {
  if (!topic) return;
  setAiNotesLoading(true);
  setAiNotesResponse('');

  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:5173", // Change this to your site if deployed
        "X-Title": "EduQuiz AI Notes Generator",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.1-24b-instruct:free",
        messages: [
          {
            role: "system",
            content: "You are an educational assistant. Generate detailed, structured notes for students."
          },
          {
            role: "user",
            content: `Generate detailed notes on the topic: "${topic}".`
          }
        ]
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`API error: ${data.error?.message || res.statusText}`);
    }

    const aiText = data?.choices?.[0]?.message?.content?.trim();
    setAiNotesResponse(aiText || 'No AI-generated notes available.');
    if (aiText) {
      generateAIQuiz(aiText);
    }

  } catch (error) {
    console.error('AI notes generation error:', error.message);
    setAiNotesResponse('Error generating AI notes.');
  } finally {
    setAiNotesLoading(false);
  }
};



  useEffect(() => {
    if (selectedTab === 'Notes' && topicData) {
      generateAINotes();
    }
  }, [selectedTab, topicData]);
  
  const generateAIQuiz = async (notesText) => {
  if (!notesText) return;
  setAiQuizLoading(true);

  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:5173", // Change this for production
        "X-Title": "EduQuiz AI Quiz Generator",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.1-24b-instruct:free",
        messages: [
          {
            role: "system",
            content: "You are an educational assistant. Generate 5 multiple-choice quiz questions with 4 options each, based on the provided notes. Include correct answers in JSON format.",
          },
          {
            role: "user",
            content: `Generate quiz questions for these notes:\n\n${notesText}\n\nRespond in this JSON format:\n[\n  {\n    "question": "...",\n    "options": ["A", "B", "C", "D"],\n    "correctAnswer": "B"\n  }\n]`,
          },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`API error: ${data.error?.message || res.statusText}`);
    }

    let responseText = data?.choices?.[0]?.message?.content?.trim();

    if (!responseText) {
      throw new Error("No valid response from AI model");
    }

    // 🧼 Clean up Markdown code block if present
    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/```json|```/g, "").trim();
    }

    const parsedQuiz = JSON.parse(responseText);
    setAiQuizQuestions(parsedQuiz);
  } catch (err) {
    console.error("Error generating quiz:", err.message);
    setAiQuizQuestions([]);
  } finally {
    setAiQuizLoading(false);
  }
};

  const handleOptionChange = (questionIndex, selectedOption) => {
  setSelectedOptions((prev) => ({
    ...prev,
    [questionIndex]: selectedOption,
  }));
};


  const handleSubmitQuiz = async () => {
  const questions = aiQuizQuestions || [];
  let newScore = 0;

  questions.forEach((q, idx) => {
    const selected = (selectedOptions[idx] || '').toString().trim().toUpperCase();
    let correct = (q.correctAnswer || '').toString().trim().toUpperCase();

    // If correct is a letter like "A", map it to actual option
    if (correct.length === 1 && correct >= 'A' && correct <= 'Z') {
      const optionIdx = correct.charCodeAt(0) - 65;
      correct = q.options?.[optionIdx]?.trim().toUpperCase() || '';
    }

    if (selected === correct) {
      newScore++;
    }
  });

  setScore(newScore);
  setIsSubmitted(true);

  if (newScore === questions.length) {
    try {
      const res = await fetch(`http://localhost:5000/api/users/markComplete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ courseId, languageId, topicId }),
      });

      const result = await res.json();
      if (res.ok) {
        setIsTopicCompleted(true);
      } else {
        console.error('Failed to mark topic as complete:', result);
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
        return (
          <div>
            {aiNotesLoading ? (
              <Typography>Generating AI Notes...</Typography>
            ) : (
              <Typography className="whitespace-pre-wrap">{aiNotesResponse || topicData.notes}</Typography>
            )}
            <Button onClick={generateAINotes} disabled={aiNotesLoading} className="mt-4">
              Regenerate AI Notes
            </Button>
          </div>
        );

      case "Watch Video":
        return topicData.youtubeLinks?.length > 0 ? (
          topicData.youtubeLinks.map((link, idx) => (
            <div key={idx} className="mb-6">
              <iframe src={link} title={`Video ${idx + 1}`} className="w-full h-64 rounded" allowFullScreen></iframe>
            </div>
          ))
        ) : (
          <Typography>No videos available for this topic.</Typography>
        );

case 'Quiz': {
  const questions = aiQuizQuestions;

  return (
    <>
      {aiQuizLoading ? (
        <Typography>Generating Quiz Questions...</Typography>
      ) : questions.length > 0 ? (
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
                <Typography color="green" className="mt-2">
                  ✅ Topic marked as completed!
                </Typography>
              )}
            </>
          )}
        </>
      ) : (
        <Typography>No quiz questions generated yet.</Typography>
      )}
    </>
  );
}


      case "Coding Practice":
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

      case "Feedback":
        return feedbackData.length > 0 ? (
          feedbackData.map((fb, idx) => (
            <Card key={idx} className="p-4 mb-4">
              <Typography variant="small" className="font-semibold">Rating: <Rating value={fb.rating} readonly /></Typography>
              <Typography className="mt-2">{fb.comment}</Typography>
            </Card>
          ))
        ) : (
          <Typography>No feedback available for this topic.</Typography>
        );

      case "AI Assistance":
        return (
          <>
            <Typography variant="small" className="mb-2 font-medium text-gray-700">AI Response:</Typography>
            <Card className="p-4 bg-gray-100 whitespace-pre-wrap min-h-[200px] max-h-[400px] overflow-y-auto">
              {response || "AI response will appear here."}
            </Card>
            <Typography variant="small" className="mb-2 font-medium text-gray-700 mt-4">Ask your question about this topic:</Typography>
            <div className="flex items-start gap-4">
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} className="flex-grow" />
              <Button
                onClick={handleAIRequest}
                disabled={aiLoading || !prompt.trim()}
                className="rounded-full bg-blue-600 hover:bg-blue-700 w-12 h-12 flex items-center justify-center p-0"
                aria-label="Submit AI prompt"
              >
                {aiLoading ? <Spinner className="h-6 w-6" /> : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
        <Typography variant="h6" className="mb-4 capitalize">{language ? `${language} - ${topic}` : topic}</Typography>
        <List>
          {tabs.map((tab) => (
            <ListItem
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`cursor-pointer rounded ${selectedTab === tab ? 'bg-blue-100 font-semibold text-blue-700' : 'hover:bg-gray-100'}`}
            >
              {tab}
            </ListItem>
          ))}
        </List>
      </div>
      <div className="w-full md:w-3/4 bg-white shadow-lg rounded p-6 overflow-y-auto">
        <Typography variant="h6" className="mb-4 text-blue-800">{selectedTab}</Typography>
        {renderContent()}
      </div>
    </div>
  );
};

export default CourseDetail;
