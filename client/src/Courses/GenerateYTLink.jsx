import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";

const GenerateYTLink = ({ languageId, languageName, topicname }) => {
  const [videoLink, setVideoLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const generateVideoLink = async (languageName, topicTitle) => {
    try {
      const searchQuery = `${languageName} ${topicTitle}`;
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&key=${apiKey}&type=video&maxResults=1&order=relevance`;

      const response = await fetch(url);
      const data = await response.json();
      const videoId = data.items[0]?.id?.videoId;
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (err) {
      console.error("YouTube API Error:", err);
      return null;
    }
  };

  const fetchVideoLink = async () => {
    try {
      setLoading(true);
      setError("");

      const topicTitle = topicname || "Topic";
      const newLink = await generateVideoLink(languageName, topicTitle);

      if (newLink) {
        setVideoLink(newLink);
      } else {
        setError("No video found.");
      }
    } catch (err) {
      console.error("Error generating video link:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topicname && languageId && languageName) {
      fetchVideoLink();
    }
  }, [topicname, languageId, languageName]);

  return loading ? (
    <p className="text-gray-500">Loading video...</p>
  ) : videoLink ? (
    <div className="space-y-8 w-full">
      <div className="relative group w-full">
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
          <iframe
            src={videoLink}
            title="Video"
            className="w-full h-full rounded-xl"
            allowFullScreen
          />
        </div>
      </div>
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
      <Typography className="text-[#B3B4BD]">
        No videos available for this topic.
      </Typography>
    </div>
  );
};

export default GenerateYTLink;
