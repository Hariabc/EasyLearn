import { Card, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleEnroll = () => {
    navigate("/register");
  };

  return (
    <Card className="bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border border-slate-700 flex flex-col h-full">
      <CardBody className="p-8 flex-grow">
        {/* Course Title */}
        <Typography variant="h5" className="mb-4 font-semibold text-white leading-snug">
          {course.title}
        </Typography>

        {/* Course Description */}
        <Typography className="text-base text-slate-400 leading-relaxed">
          {course.description}
        </Typography>
      </CardBody>

      <CardFooter className="px-8 pb-8 pt-0 mt-auto">
        <Button
          size="lg"
          className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all font-medium rounded-lg shadow-md"
          onClick={handleEnroll}
        >
          Enroll Now
        </Button>
      </CardFooter>
    </Card>
  );
}
