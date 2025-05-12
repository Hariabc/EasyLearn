import React from "react";
import { Card, CardBody, Typography, Avatar } from "@material-tailwind/react";

export function FeatureSection() {
  return (
    <section className="min-h-[120vh] py-16 px-8 bg-gradient-to-r from-blue-50 to-white">
      <div className="container mx-auto mb-12 text-center">
        <Typography color="blue-gray" className="mb-2 font-bold uppercase text-xl">
          EasyLearn Features
        </Typography>
        <Typography color="blue-gray" className="mb-6 text-3xl font-semibold">
          Unlock Your Potential with EasyLearn
        </Typography>
        <Typography variant="lead" className="mx-auto max-w-2xl text-gray-600">
          At EasyLearn, we provide you with the tools, resources, and support to master new skills, advance your career, and grow as an individual. Join us today and start your learning journey.
        </Typography>
      </div>

      <div className="container mx-auto grid gap-8 lg:grid-cols-3 sm:grid-cols-1">
        {/* Feature 1 */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardBody className="text-center p-6">
            <Typography variant="h5" color="blue-gray" className="mb-3 font-semibold">
              Flexible Learning
            </Typography>
            <Typography className="text-base text-gray-500 mb-4">
              Learn at your own pace with flexible schedules and personalized learning paths tailored to your needs.
            </Typography>
            <img
              src="/image/learning.svg"
              alt="Flexible Learning"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </CardBody>
        </Card>

        {/* Feature 2 */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardBody className="text-center p-6">
            <Typography variant="h5" color="blue-gray" className="mb-3 font-semibold">
              Expert-Led Courses
            </Typography>
            <Typography className="text-base text-gray-500 mb-4">
              Learn from industry experts who provide practical, real-world knowledge and hands-on experience.
            </Typography>
            <img
              src="/image/expert-course.svg"
              alt="Expert-Led Courses"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </CardBody>
        </Card>

        {/* Feature 3 */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardBody className="text-center p-6">
            <Typography variant="h5" color="blue-gray" className="mb-3 font-semibold">
              Community Support
            </Typography>
            <Typography className="text-base text-gray-500 mb-4">
              Join a vibrant community of learners, share experiences, and get support from fellow students and mentors.
            </Typography>
            <img
              src="/image/community-support.svg"
              alt="Community Support"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </CardBody>
        </Card>
      </div>

      <div className="container mx-auto grid gap-8 lg:grid-cols-3 mt-12">
        {/* Join Our Community */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardBody className="text-center p-6">
            <Typography variant="h5" color="blue-gray" className="mb-3 font-semibold">
              Join Our Community
            </Typography>
            <Typography className="text-base text-gray-500 mb-4">
              Be part of an engaging and supportive community where you can collaborate, learn, and grow together.
            </Typography>
          </CardBody>
        </Card>

        {/* Testimonials or Additional Feature */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardBody className="text-center p-6">
            <Typography variant="h5" color="blue-gray" className="mb-3 font-semibold">
              Student Success Stories
            </Typography>
            <Typography className="text-base text-gray-500 mb-4">
              Hear from our students about how EasyLearn helped them achieve their goals and succeed in their careers.
            </Typography>
            <img
              src="/image/testimonial.svg"
              alt="Testimonial"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default FeatureSection;
