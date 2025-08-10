import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-background-paper)] py-4  ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bottom text */}
        <div className="border-t border-[var(--color-background-default)] pt-4 text-center">
          <p className="text-[var(--color-text-inverse)] text-sm">
            © {new Date().getFullYear()} EasyLearn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
