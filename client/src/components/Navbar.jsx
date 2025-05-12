// import React from "react";
// import {
//   Navbar as MTNavbar,
//   MobileNav,
//   Typography,
//   Button,
//   IconButton,
//   Card,
// } from "@material-tailwind/react";

// export function Navbar() {
//   const [openNav, setOpenNav] = React.useState(false);

//   React.useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 960) setOpenNav(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const navList = (
//     <ul className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
//       {["Home","About"].map((item) => (
//         <Typography
//           key={item}
//           as="li"
//           variant="small"
//           color="blue-gray"
//           className="font-medium"
//         >
//           <a href="#" className="hover:text-blue-500 transition-colors">
//             {item}
//           </a>
//         </Typography>
//       ))}
//     </ul>
//   );

//   return (
//     <div className="w-full bg-gray-50 min-h-screen">
//       <MTNavbar className="sticky top-0 z-50 bg-white shadow-md px-4 py-3 lg:px-8 lg:py-4">
//         <div className="flex items-center justify-between">
//           <Typography
//             as="a"
//             href="#"
//             className="text-lg font-bold text-blue-600"
//           >
//             EasyLearn
//           </Typography>
//           <div className="hidden lg:flex items-center gap-6">
//             {navList}
//             <div className="flex gap-2">
//               <Button variant="text" size="sm">
//                 Log In
//               </Button>
//               <Button variant="gradient" size="sm">
//                 Sign Up
//               </Button>
//             </div>
//           </div>
//           <IconButton
//             variant="text"
//             className="lg:hidden"
//             onClick={() => setOpenNav(!openNav)}
//           >
//             {openNav ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             )}
//           </IconButton>
//         </div>
//         <MobileNav open={openNav}>
//           <div className="flex flex-col gap-4 my-4">
//             {navList}
//             <Button variant="text" fullWidth>
//               Log In
//             </Button>
//             <Button variant="gradient" fullWidth>
//               Sign Up
//             </Button>
//           </div>
//         </MobileNav>
//       </MTNavbar>
//     </div>
//   );
// }

// import React from "react";
// import {
//   Navbar,
//   Collapse,
//   Button,
//   IconButton,
//   Typography,
//   Input,
// } from "@material-tailwind/react";
// import {
//   RectangleStackIcon,
//   UserCircleIcon,
//   CommandLineIcon,
//   Squares2X2Icon,
// } from "@heroicons/react/24/solid";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// function NavItem({ children }) {
//   return (
//     <li>
//       <Typography
//         as="a"
//         href="#"
//         variant="paragraph"
//         color="blue-gray"
//         className="text-blue-gray-700 flex items-center gap-2 font-medium"
//       >
//         {children}
//       </Typography>
//     </li>
//   );
// }

// function HeroSection() {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen((cur) => !cur);

//   React.useEffect(() => {
//     window.addEventListener("resize", () => {
//       if (window.innerWidth >= 960) setOpen(false);
//     });
//   }, []);

//   return (
//     <>
//       {/* Navbar */}
//       <Navbar shadow={false} fullWidth className="border-0">
//         <div className="container mx-auto flex items-center justify-between">
//           <Typography className="text-2xl font-bold text-blue-500 px-4">
//             EasyLearn
//           </Typography>
//           {/* <ul className="hidden items-center gap-6 lg:flex">
//             <NavItem>
//               <RectangleStackIcon className="h-5 w-5" />
//               Pages
//             </NavItem>
//             <NavItem>
//               <UserCircleIcon className="h-5 w-5" />
//               Home
//             </NavItem>
//             <NavItem>
//               <Squares2X2Icon className="h-5 w-5" />
//               About us
//             </NavItem>
//             <NavItem>
//               <CommandLineIcon className="h-5 w-5" />
//               Docs
//             </NavItem>
//           </ul> */}
//           <div className="hidden items-center gap-4 lg:flex">
//             <Button variant="text">Log in</Button>
//             <Button color="gray">Sign Up</Button>
//           </div>
//           <IconButton
//             variant="text"
//             color="gray"
//             onClick={handleOpen}
//             className="ml-auto inline-block lg:hidden"
//           >
//             {open ? (
//               <XMarkIcon strokeWidth={2} className="h-6 w-6" />
//             ) : (
//               <Bars3Icon strokeWidth={2} className="h-6 w-6" />
//             )}
//           </IconButton>
//         </div>
//         <Collapse open={open}>
//           <div className="container mx-auto mt-3 border-t border-blue-gray-50 px-4 pt-4">
//             <ul className="flex flex-col gap-4">
//               <NavItem>
//                 <RectangleStackIcon className="h-5 w-5" />
//                 Pages
//               </NavItem>
//               <NavItem>
//                 <UserCircleIcon className="h-5 w-5" />
//                 Account
//               </NavItem>
//               <NavItem>
//                 <Squares2X2Icon className="h-5 w-5" />
//                 Blocks
//               </NavItem>
//               <NavItem>
//                 <CommandLineIcon className="h-5 w-5" />
//                 Docs
//               </NavItem>
//             </ul>
//             <div className="mt-6 mb-4 flex flex-col gap-2">
//               <Button variant="text">Log in</Button>
//               <Button color="gray">Buy Now</Button>
//             </div>
//           </div>
//         </Collapse>
//       </Navbar>

//       {/* Hero Section */}
//       <header className="bg-white px-4 pt-16 pb-24 lg:pb-40">
//         <div className="container mx-auto text-center">
//           <Typography className="mx-auto mb-4 inline-flex items-center justify-center rounded-lg border border-blue-gray-100 bg-white px-4 py-1 text-xs font-medium">
//             Exciting News! Introducing our latest innovation
//           </Typography>
//           <Typography
//             variant="h1"
//             color="blue-gray"
//             className="mx-auto mb-6 max-w-3xl text-3xl font-bold leading-tight lg:text-5xl"
//           >
//             Get ready to experience a new level of{" "}
//             <span className="text-green-500">performance</span> and{" "}
//             <span className="text-green-500">functionality</span>.
//           </Typography>
//           <Typography
//             variant="lead"
//             className="mx-auto mb-10 max-w-xl text-gray-600"
//           >
//             The time is now for it to be okay to be great. For being a bright
//             color. For standing out.
//           </Typography>

//         </div>
//       </header>
//     </>
//   );
// }

// export default HeroSection;
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
              Sign Up
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
