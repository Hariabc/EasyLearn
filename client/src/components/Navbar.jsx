import React from "react";
import {
  Navbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UserCircleIcon,
  CommandLineIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import FeatureSection from "./Sample";
import CoursesPage from "../pages/CoursesPage";
import { Link } from "react-router-dom";

// Navigation item component
function NavItem({ children }) {
  return (
    <li>
      <Typography
        as="a"
        href="#"
        variant="paragraph"
        color="blue-gray"
        className="text-blue-gray-700 flex items-center gap-2 font-medium"
      >
        {children}
      </Typography>
    </li>
  );
}

// Main Hero Section component
function HeroSection() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar shadow={false} fullWidth className="border-0 ">
        <div className="container mx-auto flex items-center justify-between gap-0.5 p-2">
          <Typography className="text-3xl font-bold text-blue-500 px-1">
            EasyLearn
          </Typography>
          <div className="hidden items-center gap-4 lg:flex">
            <Button variant="text" className="text-lg p-3">
              <Link to='/login'>Log in</Link> 
            </Button>
            <Button color="gray" className="text-lg p-3 text-black">
              <Link to='/register'>Sign Up</Link>
            </Button>
          </div>
          <IconButton
            variant="text"
            color="gray"
            onClick={handleOpen}
            className="ml-auto inline-block lg:hidden"
          >
          </IconButton>
        </div>
      </Navbar>

      {/* Hero Section */}
      <header className="bg-white px-4 pt-40 lg:pb-20 h-screen">
        <div className="container mx-auto text-center">
          <Typography className="mx-auto mb-4 inline-flex items-center justify-center rounded-lg border border-blue-gray-100 bg-white px-4 py-1 text-xs font-medium">
            Exciting News! Start your learning journey today
          </Typography>
          <Typography
            variant="h1"
            color="blue-gray"
            className="mx-auto mb-6 max-w-3xl text-3xl font-bold leading-tight lg:text-5xl drop-shadow-sm"
          >
            Unlock your potential with{" "}
            <span className="text-blue-500">knowledge</span> and{" "}
            <span className="text-blue-500">skills</span> you can use.
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto mb-10 max-w-xl text-gray-600"
          >
            The time to learn is now. Explore, grow, and transform your future.
          </Typography>

          {/* Explore Button */}
          <div className="mt-8">
            <Button
              color="green"
              size="lg"
              className="p-3 bg-amber-50 text-black"
              aria-label="Explore Courses"
            >
              Explore Courses
            </Button>
          </div>
        </div>
      </header>
      <FeatureSection/>
      <CoursesPage/>
    </>
  );
}

export default HeroSection;
