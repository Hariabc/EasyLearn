import { Card, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";

export default function CourseCard({ course }) {
  return (
    <Card className="mt-6 w-96 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
      <CardBody>
        <Typography variant="h5" color="white" className="mb-2">
          {course.title}
        </Typography>
        <Typography color="white" className="text-gray-200">
          {course.description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button size="sm" variant="filled" color="yellow" className="flex items-center gap-2">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
}
