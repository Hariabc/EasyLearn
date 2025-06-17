import React, { useState } from "react";
import {
    Typography,
    Rating,
    Textarea,
    Card,
} from "@material-tailwind/react";
import axios from "axios";
import api from "../axios.jsx"

const FeedbackForm = ({ topicId, userId }) => {
    const questions = [
        "How would you rate the content quality?",
        "How clear was the explanation of the topics?",
        "Was the content helpful for your learning?",
        "How was the overall user experience on the platform?",
        "Would you recommend this platform to others?",
    ];

    const [ratings, setRatings] = useState(Array(questions.length).fill(0));
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [resetKey, setResetKey] = useState(0); // for forcing re-render

    const handleRatingChange = (index, value) => {
        const updated = [...ratings];
        updated[index] = value;
        setRatings(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            const averageRating = Math.round(
                ratings.reduce((sum, val) => sum + val, 0) / ratings.length
            );

            const payload = {
                topic: topicId,
                user: userId,
                comment,
                rating: averageRating,
            };

            await api.post(`/api/feedbacks/${topicId}`, payload);

            // Reset form fields
            setRatings(Array(questions.length).fill(0));
            setComment("");
            setResetKey(prev => prev + 1); // force rerender

            // Show toast
            showToast("✅ Feedback submitted successfully!", "green");
        } catch (error) {
            showToast("❌ Failed to submit feedback.", "red");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };


    const showToast = (message, color) => {
        const toast = document.createElement("div");
        toast.innerText = message;
        // Static class based on color input
        let bgClass = "bg-blue-600"; // default
        if (color === "green") {
            bgClass = "bg-green-600";
        } else if (color === "red") {
            bgClass = "bg-red-600";
        }

        toast.className = `
    fixed top-5 left-1/2 transform -translate-x-1/2
    px-4 py-3 rounded shadow-lg text-white ${bgClass}
    z-50 text-sm font-medium transition-opacity duration-300
  `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    };


    return (
        <div className="bg-white rounded py-10 px-4 sm:px-10 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
                <div className="grid gap-8">
                    {questions.map((question, index) => (
                        <div key={`${resetKey}-${index}`}>
                            <Typography className="mb-2 text-blue-900 font-medium text-base">
                                {question}
                            </Typography>
                            <Rating
                                key={`${resetKey}-rating-${index}`}
                                value={ratings[index]}
                                onChange={(value) => handleRatingChange(index, value)}
                                className="text-blue-500"
                            />
                        </div>
                    ))}

                    <div>
                        <Typography className="mb-2 text-blue-900 font-medium text-base">
                            Additional Comments
                        </Typography>
                        <Textarea
                            label="Write your comments here..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="border border-blue-200"
                        />
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-700 hover:bg-blue-900 text-white cursor-pointer px-6 py-3 rounded shadow-md"
                            style={{ zIndex: 9999, position: "relative" }}
                        >
                            {submitting ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;
