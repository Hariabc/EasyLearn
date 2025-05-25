import Groq from "groq-sdk";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { addContent, getContent } from "../../services/contentService";
import { FallingLines } from "react-loader-spinner";

const GenerateContent = ({ topic, subject }) => {
  const apiKey = import.meta.env.VITE_groqApiKey;
  const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const generateContent = async () => {
    try {
      const response = await groq.chat.completions.create({
        model: "openai/gpt-4o-mini", // OpenRouter model, change if needed
        messages: [
          {
            role: "user",
            content: `Imagine you as a professional ${subject} teacher.
              Explain about ${topic} from ${subject} in detail in 10000 words or more.
              Guidelines for Generating PDF Content:
              Avoid including the main heading.
              Ensure the content is clear, concise, and formatted for easy readability.
              Maintain proper spacing between paragraphs for improved flow and visual appeal.
              Use bold, italic, and strikethrough formatting for emphasis and importance.
              Use headings for clarity and organization.
              Use bullet points, numbered lists, or subheadings where applicable to organize key information.
              Use proper grammar and spelling.
              Use proper capitalization and punctuation.
              Ensure no references or citations are included.`,
          },
        ],
        max_tokens: 3000, // Adjust as per your quota; 10k words is a lot, consider chunking if needed
        temperature: 0.7,
      });

      const generatedContent = response.choices[0].message.content;
      setContent(generatedContent);
      return generatedContent;
    } catch (error) {
      console.error("Error generating content:", error);
      setError("Failed to generate content. Please try again later.");
      throw error;
    }
  };

  const addContentHandler = async (subject, subtopic, content) => {
    try {
      await addContent(subject, subtopic, content);
    } catch (error) {
      console.error("Error adding content:", error);
    }
  };

  const getContentHandler = async (subject, subtopic) => {
    try {
      const response = await getContent(subject, subtopic);

      if (response.status === 404 || !response.content) {
        // Content not found, generate and save it
        const generatedContent = await generateContent();
        await addContentHandler(subject, subtopic, generatedContent);
      } else {
        setContent(response.content);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to load content. Please try again later.");
    }
  };

  useEffect(() => {
    setContent("");
    setError(null);
    getContentHandler(subject, topic);
  }, [subject, topic]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-h-[60vh]">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (content === "") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-h-[60vh]">
        <FallingLines
          color="black"
          width="150"
          visible={true}
          ariaLabel="falling-circles-loading"
        />
        <p className="text-base text-gray-500 font-light my-4">
          Loading Content...
        </p>
      </div>
    );
  }

  return (
    <div>
      <ReactMarkdown breaks={true} className="markdown-body">
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default GenerateContent;
