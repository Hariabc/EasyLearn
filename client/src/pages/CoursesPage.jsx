import React from "react";
import graduateImg from "../assets/graduate_4253213.png";
import CourseCard from "../components/CourseCard";

const sampleCourses = [
  {
    title: "Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, and React from scratch.",
  },
  {
    title: "Python for Data Science",
    description: "Analyze data and build machine learning models with Python.",
  },
  {
    title: "UI/UX Design Principles",
    description: "Create beautiful and user-friendly interfaces.",
  },
  {
    title: "Cloud Fundamentals",
    description:
      "Understand cloud concepts and start working with AWS & Azure.",
  },
  {
    title: "Cybersecurity Basics",
    description: "Learn how to protect systems and data securely.",
  },
  {
    title: "Machine Learning Introduction",
    description: "Start your ML journey with hands-on projects.",
  },
];

export default function CoursesPage() {
  const positions = [
    "top-0 left-14/30 -translate-x-1/2", // top center
    "top-1/4 left-8/9 -translate-x-full -translate-y-1/2", // right top
    "top-3/4 left-8/9 -translate-x-full -translate-y-1/2", // right bottom
    "bottom-0 left-14/30 -translate-x-1/2", // bottom center
    "top-3/4 left-1/20 -translate-y-1/2", // left bottom
    "top-1/4 left-1/21 -translate-y-1/2", // left top
  ];

  return (
  <>
  <h4 className="text-4xl font-bold text-blue-400 z-0 flex justify-center items-center">
        What we OFFER..?
      </h4>
    <main className="relative mb-20 w-full flex justify-center items-center overflow-hidden h-[90vh]">
      {/* Central image */}
      <div className="w-40 h-40 rounded-full bg-white z-10 flex justify-center items-center shadow-md">
        <img src={graduateImg} alt="Graduation icon" className="w-28 h-28" />
      </div>
      {/* <h4 className="absolute text-8xl font-bold text-blue-400 z-0">
        What we OFFER..?
      </h4>
      <h4 className="absolute text-8xl font-bold text-blue-400 z-20">
        What we OFFER..?
      </h4> */}
      {/* Circular cards */}
      {sampleCourses.map((course, index) => (
        <div
          key={index}
          className={`absolute ${positions[index]} transform`}
          style={{ width: "300px" }}
        >
          <CourseCard course={course} />
        </div>
      ))}
    </main>
    </>
  );
}
