import { Card, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";

export default function CourseCard({ course }) {
  return (
    <Card className="bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden border border-slate-700">
      <CardBody className="p-8">
        {/* Course Title */}
        <Typography variant="h5" className="mb-3 font-bold text-white">
          {course.title}
        </Typography>

        {/* Course Description */}
        <Typography className="text-base text-slate-400 leading-relaxed">
          {course.description}
        </Typography>
      </CardBody>

      <CardFooter className="pt-0 px-8 pb-8">
        <Button 
          size="lg" 
          className="w-full p-5 bg-blue-200 text-black"
        >
          Enroll
        </Button>
      </CardFooter>
    </Card>
  );
}
