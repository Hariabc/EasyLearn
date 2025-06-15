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
import FeedbackForm from "../Courses/FeedbackForm"
import api from "../axios";
import ReactMarkdown from 'react-markdown';

const tabs = [
  "Notes",
  "Watch Video",
  "Quiz",
  "Feedback",
  "AI Assistance",
];

const CourseDetail = () => {
  const { language, topic } = useParams();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('topicId');
  const { user, authToken } = useContext(AuthContext);
  const [startQuizLoading, setStartQuizLoading] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [selectedTab, setSelectedTab] = useState('Notes');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotesLoading, setAiNotesLoading] = useState(false);
  const [aiNotesResponse, setAiNotesResponse] = useState('');
  const [generatedTopics, setGeneratedTopics] = useState({});
  const [dataLoading, setDataLoading] = useState(true);
  const [topicData, setTopicData] = useState(null);
  const [languageName, setLanguageName] = useState('');
  const [quizError, setQuizError] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isTopicCompleted, setIsTopicCompleted] = useState(false);
  const [aiQuizQuestions, setAiQuizQuestions] = useState([]);
  const [aiQuizLoading, setAiQuizLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);


  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        // console.log('Fetching topic details for topicId:', topicId);
        const res = await api.get(`/api/topics/topicById/${topicId}`);
        const data = res.data;
        setTopicData(data);
        setCourseId(data.course);
        setLanguageId(data.language);
        // console.log('Topic data fetched, languageId:', data.language);

        // Fetch language name
        const langRes = await api.get(`/api/languages/byId/${data.language}`);
        setLanguageName(langRes.data.name);
        // console.log('Language name fetched:', langRes.data.name);
      } catch (err) {
        // console.error('Error fetching topic or language details:', err);
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

    // const fetchFeedbackData = async () => {
    //   try {
    //     const res = await api.get(`/api/feedbacks/byTopic/${topicId}`);
    //     setFeedbackData(res.data);
    //   } catch (err) {
    //     console.error("Feedback fetch error:", err);
    //   }
    // };

    if (topicId) {
      fetchTopicDetails();
      // fetchQuizData();
      fetchFeedbackData();
    }
  }, [topicId]);

  const fetchFeedbackData = async () => {
    try {
      const res = await api.get(`/api/feedbacks/byTopic/${topicId}`);
      setFeedbackData(res.data);
    } catch (err) {
      console.error("Feedback fetch error:", err);
    }
  };

  const handleAIRequest = async () => {
    if (!prompt.trim()) return;
    setAiLoading(true);
    setResponse('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      // Basic greeting or short message detection
      const isShortPrompt = prompt.trim().split(" ").length <= 3;
      const finalPrompt = isShortPrompt
        ? prompt
        : `Reply in very simple English in 4-5 lines: ${prompt}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: finalPrompt }] }],
          }),
        }
      );

      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setResponse(aiText || "No response generated from Gemini.");
      setPrompt(""); // Clear input box
    } catch (error) {
      console.error("AI error:", error);
      setResponse("An error occurred while fetching AI response.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateAINotes = async () => {
    if (!topic || aiNotesLoading) return;

    // Return from cache if available
    if (generatedTopics[topic]) {
      setAiNotesResponse(generatedTopics[topic]);
      return;
    }

    console.log("Generating notes for:", user._id);
    console.log('Attempting to generate AI notes for topic:', topic, 'in language:', languageName);
    setAiNotesLoading(true);
    setAiNotesResponse('');

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      const referer = window.location.origin;

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": referer,
          "X-Title": "EduQuiz AI Notes Generator",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-small-3.1-24b-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are a professional educational assistant. Write clearly structured, high-quality notes for students. Use Markdown for headings and code blocks."
            },
            {
              role: "user",
              content: `Write well-structured educational notes for the topic: "${topic}" in Markdown format.

Guidelines:
- Do NOT include the topic title at the top.
- Use section headings in **uppercase bold text**, like **INTRODUCTION**, **KEY POINTS**, **EXAMPLES**, etc.
- Add a blank line **after each heading** to separate it from the content.
- Write short, clear paragraphs (3–4 lines max) and separate them with line breaks for readability.
- Use bullet points where appropriate (e.g., in KEY POINTS, ADVANTAGES).
- For code examples, use triple backticks (\\\`\\\`\\\`) to format Markdown code blocks.
- Include simple code examples in the EXAMPLES section to aid understanding.
- Keep the tone student-friendly, clean, and easy to follow.
- Do NOT use numbered sections or extra formatting like italics or underlines.
- Finish with a **CONCLUSION** summarizing the topic.

Language: ${languageName}`
            }
          ]
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(`API error: ${data.error?.message || res.statusText}`);
      }

      const aiText = data?.choices?.[0]?.message?.content?.trim();
      if (aiText) {
        setAiNotesResponse(aiText);
        setGeneratedTopics(prev => ({ ...prev, [topic]: aiText }));
        generateAIQuiz(aiText); // Optional quiz generation
      } else {
        setAiNotesResponse('No AI-generated notes available.');
      }

    } catch (error) {
      console.error('AI notes generation error:', error.message);
      setAiNotesResponse('Error generating AI notes.');
    } finally {
      setAiNotesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTab === 'Notes' && topic && !generatedTopics[topic] && languageName) {
      generateAINotes(); // run only if not already cached and language name is available
    }
  }, [selectedTab, topic, languageName]);


  const generateAIQuiz = async (notesText) => {
    if (!notesText || notesText.trim().length < 10) {
      console.warn("⚠️ No sufficient notes provided to generate quiz.");
      setQuizError(true);
      setAiQuizLoading(false);
      return;
    }

    setAiQuizLoading(true);
    setQuizError(false);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      const referer = window.location.origin;

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": referer,
          "X-Title": "EduQuiz AI Quiz Generator",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-small-3.1-24b-instruct:free",
          messages: [
            {
              role: "user",
              content: `You are a smart quiz generator assistant.

Based on the following educational notes, generate exactly 5 multiple-choice questions (MCQs).

Notes:
"""
${notesText}
"""

### Required JSON Format:
[
  {
    "question": "What is ...?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Option 2"
  },
  ...
]

### Guidelines:
- Each question must have 4 answer options.
- Include the correct answer in the "correctAnswer" field.
- Respond ONLY with a valid JavaScript array of 5 questions.
- DO NOT include any text, comments, markdown code blocks, or explanations—just raw JSON.`
            }
          ]
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(`API error: ${data.error?.message || res.statusText}`);
      }

      let responseText = data?.choices?.[0]?.message?.content?.trim();
      console.log("🧪 Raw model response:", responseText);

      if (!responseText) throw new Error("Empty response from model.");

      if (responseText.startsWith("```")) {
        responseText = responseText.replace(/```json|```/g, "").trim();
      }

      const parsedQuiz = JSON.parse(responseText);
      if (!Array.isArray(parsedQuiz) || parsedQuiz.length !== 5) {
        throw new Error("Quiz format invalid or incomplete.");
      }

      console.log("✅ Parsed quiz questions:", parsedQuiz);
      setAiQuizQuestions(parsedQuiz);
    } catch (err) {
      console.error("❌ Error generating quiz:", err);
      setAiQuizQuestions([]);
      setQuizError(true);
    } finally {
      setAiQuizLoading(false);
    }
  };


  const handleOptionChange = (questionIndex, selectedOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: selectedOption.trim().toLowerCase()
    }));
  };


  const handleSubmitQuiz = async () => {
    const questions = aiQuizQuestions || [];
    let newScore = 0;

    questions.forEach((q, idx) => {
      const selected = (selectedOptions[idx] || '').toString().trim().toLowerCase();
      let correct = (q.correctAnswer || '').toString().trim().toLowerCase();

      // If correct is a letter like "A", map it to actual option
      if (correct.length === 1 && correct >= 'a' && correct <= 'z') {
        const optionIdx = correct.charCodeAt(0) - 97; // Use lowercase 'a' (97) instead of 'A' (65)
        correct = q.options?.[optionIdx]?.trim().toLowerCase() || '';
      }

      if (selected === correct) {
        newScore++;
      }
    });

    setScore(newScore);
    setIsSubmitted(true);

    if (newScore === questions.length) {
      try {
        const res = await api.post(`/api/users/markComplete`, {
          courseId,
          languageId,
          topicId
        }, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          }
        });

        if (res.status === 200) {
          setIsTopicCompleted(true);
        } else {
          console.error('Failed to mark topic as complete:', res.data);
        }
      } catch (err) {
        console.error('Error marking topic as complete:', err);
      }
    }
  };




  const renderContent = () => {
    if (fetchError) {
      return <Typography className="text-red-600">{fetchError}</Typography>;
    }

    if (dataLoading) {
      return <Typography>Loading topic data...</Typography>;
    }

    switch (selectedTab) {
      case 'Notes':
        return (
          <div>
            {aiNotesLoading ? (
              <Typography className="text-white font-sans">Generating AI Notes...</Typography>
            ) : (
              <div
                className="text-white font-sans text-base leading-relaxed"
                style={{ fontFamily: '"Segoe UI", Roboto, Arial, sans-serif' }}
              >
                <div className="prose prose-invert text-white max-w-none">
                  <ReactMarkdown>
                    {aiNotesResponse}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                // Clear previous notes for this topic and regenerate
                setGeneratedTopics(prev => {
                  const updated = { ...prev };
                  delete updated[topic];
                  return updated;
                });
                generateAINotes(); // re-generate
              }}
              disabled={aiNotesLoading}
              className="mt-4"
            >
              🔄 Regenerate AI Notes
            </Button>
          </div>
        );

      case 'Watch Video':
        return topicData.youtubeLinks?.length > 0 ? (
          <div className="space-y-8 w-full">
            {topicData.youtubeLinks.map((link, idx) => (
              <div key={idx} className="relative group w-full">
                <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                  <iframe
                    src={link}
                    title={`Video ${idx + 1}`}
                    className="w-full h-full rounded-xl"
                    allowFullScreen
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Typography variant="small" className="text-white font-medium">
                    Video {idx + 1}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-[#141619] rounded-xl">
            <svg
              className="w-16 h-16 text-[#B3B4BD] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <Typography className="text-[#B3B4BD]">No videos available for this topic.</Typography>
          </div>
        );

      case 'Quiz':
        return (
          <div className="quiz-container text-white">
            {aiQuizQuestions.length === 0 ? (
              aiQuizLoading ? (
                <Typography>Generating Quiz Questions...</Typography>
              ) : !quizError ? (
                <Button
                  className="bg-[#0A21C0] hover:bg-[#050A44] text-[#B3B4BD] flex items-center justify-center gap-2"
                  onClick={async () => {
                    setStartQuizLoading(true);
                    setQuizError(false);

                    try {
                      await generateAIQuiz(); // ensure this returns a Promise

                      if (aiQuizQuestions.length === 0) {
                        setQuizError(true);
                      }
                    } catch (error) {
                      setQuizError(true);
                    } finally {
                      setStartQuizLoading(false);
                    }
                  }}
                >
                  {startQuizLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      <span className="ml-2">Generating...</span>
                    </>
                  ) : (
                    "Start Quiz"
                  )}
                </Button>
              ) : (
                <Typography className="text-red-500 mt-4">
                  Unable to take quiz as of now. Try again later.
                </Typography>
              )
            ) : !isSubmitted ? (
              <div>
                <QuizQuestion
                  questionIndex={currentQuestionIndex}
                  questionData={aiQuizQuestions[currentQuestionIndex]}
                  selectedOptions={selectedOptions}
                  handleOptionChange={handleOptionChange}
                  isSubmitted={false}
                />

                <div className="flex justify-between mt-4">
                  <Button
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    disabled={currentQuestionIndex === 0}
                    className="bg-gray-600 text-white"
                  >
                    Previous
                  </Button>

                  {currentQuestionIndex === aiQuizQuestions.length - 1 ? (
                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={selectedOptions[currentQuestionIndex] == null}
                      className="bg-[#0A21C0] hover:bg-[#050A44] text-[#B3B4BD]"
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      disabled={selectedOptions[currentQuestionIndex] == null}
                      className="bg-[#0A21C0] hover:bg-[#050A44] text-[#B3B4BD]"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Typography variant="h6">
                  You scored {score} out of {aiQuizQuestions.length}
                </Typography>

                {isTopicCompleted && (
                  <Typography className="mt-2 text-[#0A21C0]">
                    ✅ Topic marked as completed!
                  </Typography>
                )}

                <Button
                  onClick={() => {
                    setSelectedOptions({});
                    setCurrentQuestionIndex(0);
                    setIsSubmitted(false);
                    setScore(0);
                    setQuizError(false);
                    setAiQuizQuestions([]);
                  }}
                  className="mt-4 bg-[#0A21C0] hover:bg-[#050A44] text-[#B3B4BD]"
                >
                  Take Quiz Again
                </Button>
              </div>
            )}
          </div>
        );

      case 'Feedback':
        return topicData?._id ? (
          <FeedbackForm
            topicId={topic}
            userId={user._id}
            fetchFeedbackData={fetchFeedbackData}
          />
        ) : (
          <Typography>Loading feedback section...</Typography>
        );

      case 'AI Assistance':
        return (
          <div className="text-white font-sans">
            <Typography className="mb-2 font-semibold text-white text-sm">
              AI Response:
            </Typography>

            <Card className="p-4 bg-[#1e1f22] whitespace-pre-wrap min-h-[200px] max-h-[400px] overflow-y-auto text-white text-sm rounded-md shadow-sm">
              {response || 'AI response will appear here.'}
            </Card>

            <Typography className="mb-2 font-semibold text-white mt-4 text-sm">
              Ask your question about this topic:
            </Typography>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAIRequest(); // Send on Enter
                  }
                }}
                rows={4}
                placeholder="Type your question here and press Enter to ask..."
                className="flex-grow text-white bg-[#1a1a1d] border border-gray-600 rounded-md p-3 placeholder-gray-400"
              />

              <Button
                onClick={handleAIRequest}
                disabled={aiLoading || !prompt.trim()}
                className="rounded-full bg-[#0A21C0] hover:bg-[#050A44] w-12 h-12 flex items-center justify-center p-0 shadow-md"
                aria-label="Submit AI prompt"
              >
                {aiLoading ? (
                  <Spinner className="h-6 w-6 text-white" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19V5m-7 7l7-7 7 7"
                    />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return <Typography>Select a tab to view its content.</Typography>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-6 gap-6 h-full min-h-[100vh] bg-[#141619]">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-[#2C2E3A] shadow-lg rounded p-4">
        <Typography variant="h6" className="mb-4 capitalize text-[#B3B4BD]">
          {language ? `${language} - ${topic}` : topic}
        </Typography>
        <List>
          {tabs.map((tab) => (
            <ListItem
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`cursor-pointer rounded px-3 py-2 ${selectedTab === tab
                ? 'bg-[#0A21C0] font-semibold text-[#B3B4BD]'
                : 'hover:bg-[#141619] text-[#B3B4BD]'
                }`}
            >
              {tab}
            </ListItem>
          ))}
        </List>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 bg-[#2C2E3A] shadow-lg rounded p-6">
        <Typography variant="h6" className="mb-4 text-[#0A21C0]">
          {selectedTab}
        </Typography>
        {renderContent()}
      </div>
    </div>
  );
};

export default CourseDetail;
