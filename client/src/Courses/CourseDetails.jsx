import React, { useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  Card,
  Textarea,
  Button,
  Spinner,
} from '@material-tailwind/react';
import { useParams } from 'react-router-dom';

const tabs = [
  'Notes',
  'Watch Video',
  'Quiz',
  'Coding Practice',
  'Feedback',
  'AI Assistance',
];

const dummyContent = {
  Notes: 'Here are the notes for this topic.',
  'Watch Video': 'Watch the introduction and advanced videos here.',
  Quiz: 'Start quizzes to test your knowledge.',
  'Coding Practice': 'Practice coding problems here.',
  Feedback: 'Provide your feedback.',
};

const CourseDetail = () => {
  const { language, topic } = useParams(); // handles /:language/:topic or /dsa/:topic
  const [selectedTab, setSelectedTab] = useState('Notes');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAIRequest = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log(apiKey);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setResponse(aiText || 'No response generated from Gemini.');
    } catch (error) {
      console.error('AI error:', error);
      setResponse('An error occurred while fetching AI response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6 h-full min-h-[90vh] bg-gray-50">
      {/* Sidebar */}
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

      {/* Content Area */}
      <div className="w-full md:w-3/4 bg-white shadow-lg rounded p-6 overflow-y-auto">
        <Typography variant="h6" className="mb-4 text-blue-700">
          {selectedTab}
        </Typography>

       {selectedTab === 'AI Assistance' ? (
  <>
    <Typography variant="small" className="mb-2 font-medium text-gray-700">
      AI Response:
    </Typography>
    <Card className="p-4 bg-gray-100 whitespace-pre-wrap min-h-[200px] max-h-[400px] overflow-y-auto">
  {response || 'AI response will appear here.'}
</Card>

    <Typography variant="small" className="mb-2 font-medium text-gray-700">
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
        disabled={loading || !prompt.trim()}
        className="rounded-full bg-blue-600 hover:bg-blue-700 w-12 h-12 flex items-center justify-center p-0"
        aria-label="Submit AI prompt"
      >
        {loading ? (
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
) : (
  <Typography>
    {dummyContent[selectedTab] || 'Content for this tab will appear here soon.'}
  </Typography>
)}

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
