const mongoose = require('mongoose');
const Course = require('./models/Course');
const Language = require('./models/Language');
const Topic = require('./models/Topic');
const Quiz = require('./models/Quiz');
const Feedback = require('./models/Feedback');

// Change this to your MongoDB connection string
const MONGO_URI = '';

const runSeeder = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    Course.deleteMany({}),
    Language.deleteMany({}),
    Topic.deleteMany({}),
    Quiz.deleteMany({}),
    Feedback.deleteMany({}),
  ]);

  const courseData = [
    {
      title: "Frontend Development",
      slug: "frontend-dev",
      category: "Frontend",
      description: "Learn HTML, CSS, JavaScript, and React",
      image: "frontend.png",
      languages: [],
    },
    {
      title: "Backend Development",
      slug: "backend-dev",
      category: "Backend",
      description: "Learn Node.js, Express, MongoDB",
      image: "backend.png",
      languages: [],
    }
  ];

  for (const course of courseData) {
    const newCourse = new Course(course);
    await newCourse.save();

    const languages = course.category === "Frontend"
      ? ["HTML", "CSS", "JavaScript"]
      : ["Node.js", "Express", "MongoDB"];

    for (const langName of languages) {
      const language = new Language({ name: langName, course: newCourse._id });
      await language.save();

      const topics = [
        {
          title: `${langName} Basics`,
          content: `Introduction to ${langName}`,
          youtubeLinks: [`https://youtube.com/${langName}-intro`],
          notes: `${langName} notes content.`,
          codingQuestions: [`Write a basic ${langName} program`],
          course: newCourse._id,
          language: language._id,
        },
        {
          title: `${langName} Advanced`,
          content: `Advanced topics in ${langName}`,
          youtubeLinks: [`https://youtube.com/${langName}-advanced`],
          notes: `${langName} advanced notes.`,
          codingQuestions: [`Implement a complex ${langName} feature`],
          course: newCourse._id,
          language: language._id,
        }
      ];

      for (const topicData of topics) {
        const topic = new Topic(topicData);
        await topic.save();

        language.topics.push(topic._id);

        // Add quizzes
        const quiz = new Quiz({
          topic: topic._id,
          questions: [
            {
              question: `What is ${langName}?`,
              options: ["A language", "A drink", "A tool", "A framework"],
              correctAnswer: "A language",
            },
            {
              question: `Where is ${langName} used?`,
              options: ["Frontend", "Backend", "DevOps", "All"],
              correctAnswer: course.category,
            }
          ]
        });
        await quiz.save();

        // Add feedback
        const feedback = new Feedback({
          topic: topic._id,
          user: new mongoose.Types.ObjectId(), // Replace with actual user ID later
          comment: `${langName} topic is very helpful!`,
          rating: Math.floor(Math.random() * 5) + 1,
        });
        await feedback.save();
      }

      await language.save();
      newCourse.languages.push(language._id);
    }

    await newCourse.save();
  }

  console.log("Database seeded!");
  mongoose.disconnect();
};

runSeeder();
