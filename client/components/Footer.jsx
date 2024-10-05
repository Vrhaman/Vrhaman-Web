import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white">
      <hr />
      <div className="container flex flex-col items-center justify-between px-6 py-14 mx-auto lg:flex-row">
        <a href="#">
          <img
            className="w-auto h-14"
            src="/logo.png"
            alt=""
          />
        </a>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
          <a
            href="#"
            className="text-sm text-gray-600 transition-colors duration-300  hover:text-orange-600 0"
          >
            Overview
          </a>

          <a
            href="#"
            className="text-sm text-gray-600 transition-colors duration-300 hover:text-orange-600"
          >
            Features
          </a>
          <a
            href="#"
            className="text-sm text-gray-600 transition-colors duration-300 hover:text-orange-600"
          >
            Careers
          </a>

          <a
            href="#"
            className="text-sm text-gray-600 transition-colors duration-300 hover:text-orange-600"
          >
            Help
          </a>

          <Link
            href="/terms-and-conditions"
            className="text-sm text-gray-600 transition-colors duration-300 hover:text-orange-600"
          >
            Terms and Conditions
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500 lg:mt-0">
          © Copyright 2024 BookRidez.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
