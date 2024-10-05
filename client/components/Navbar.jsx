"use client";

import React, { useState, useEffect } from "react";
import { FaCircleUser } from "react-icons/fa6";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { loginModalState, modalWarningState, joinAsCustomerModalState } from "@/data/store";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showLoginModal, setShowLoginModal] = useRecoilState(loginModalState);
  const [warningModal, setWarningModal] = useRecoilState(modalWarningState);
  const [joinAsCustomerModal, setJoinAsCustomerModal] = useRecoilState(joinAsCustomerModalState);

  const { isLoggedIn, userRole, userId } = useAuth();


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleAccount = () => {
    setShowAccount(!showAccount);
  };

  const handleWarning = () => {
    if (!isLoggedIn) {
      toast.error("You have to login first");
    }
  }

  const handleLoginButtonClick = () => {
    const text = isOpen
      ? document.getElementById("mobileLogin").innerText
      : document.getElementById("login").innerText;

    if (text === "Log in") {
      setShowLoginModal(true);
    } else if (text === "Log out") {
      setWarningModal(true);
    }

    setIsOpen(false);
    toggleAccount();
  };

  const joinAsCustomer = async () => {
    setShowAccount(false);
    setJoinAsCustomerModal(true);
  }

  const handleLoginText = () => {
    return isLoggedIn ? "Log out" : "Log in";
  };

  const handleCustomerText = () => {
    return userRole && userRole === "User" ? "Join as Customer" : "";
  };

  return (
    <nav className="theme-light relative bg-orange-400">
      <div className="container px-6 py-3 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img
                className="h-16 sm:h-18 w-auto"
                src="/logo.png"
                alt="Logo"
              />
            </Link>

            {/* Mobile menu button */}

            <div className="flex lg:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="text-base hover:text--muted focus:outline-none focus:text-muted"
                aria-label="Toggle menu"
              >
                {!isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu open: "block", Menu closed: "hidden" */}

          <div
            className={`${isOpen
              ? "translate-x-0 opacity-100 "
              : "opacity-0 -translate-x-full"
              } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-orange-400 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center`}
          >
            <div className="flex flex-col mt-4 lg:mt-0 lg:flex-row lg:items-center lg:mx-8">
              <Link
                href="#"
                className="px-3 py-2 mx-3 mt-2 text-color-text-base transition-colors duration-300 transform rounded-md lg:mt-0"
              >
                {isOpen ? (
                  isLoggedIn ? (
                    <Link href="/account">
                      <div className="ml-1">
                        <FaCircleUser className="text-4xl cursor-pointer" />
                      </div>
                    </Link>
                  ) : (
                    <button className="border-2 px-5 py-2 rounded-md hover:bg-orange-600"
                      onClick={handleLoginButtonClick}
                      id="mobileLogin">
                      {handleLoginText()}
                    </button>
                  )
                ) : null}
              </Link>
              <Link
                href="/"
                className="px-3 py-2 mx-3 mt-2 text-white transition-colors duration-300 transform rounded-md lg:mt-0  hover:bg-[#ea580c]"
              >
                Explore
              </Link>
              <Link
                href="/faq"
                className="px-3 py-2 mx-3 mt-2 text-white transition-colors duration-300 transform rounded-md lg:mt-0 hover:bg-[#ea580c]"
              >
                FAQ
              </Link>
              <Link
                href="/support"
                className="px-3 py-2 mx-3 mt-2 text-white transition-colors duration-300 transform rounded-md lg:mt-0 hover:bg-[#ea580c]"
              >
                Support
              </Link>
              <Link
                href="#"
                className="px-3 py-2 mx-3 mt-2 text-white transition-colors duration-300 transform rounded-md lg:mt-0  hover:bg-[#ea580c] lg:hidden"
                onClick={joinAsCustomer}
              >
                {handleCustomerText()}
              </Link>
              <div
                className="px-3 py-2 mx-3 mt-2 text-white transition-colors duration-300 transform rounded-md lg:mt-0  hover:bg-[#ea580c] lg:hidden"
                id="mobileLogin"
                onClick={handleLoginButtonClick}
              >
                {handleLoginText()}
              </div>
            </div>
            {!isOpen && (
              <div className="flex flex-col items-center lg:mt-0">
                {isLoggedIn ? <FaCircleUser
                  className="text-2xl cursor-pointer text-white"
                  onClick={toggleAccount}
                /> :
                  <button onClick={() => setShowLoginModal(true)}
                    className="text-white bg-orange-500 text-md font-medium px-3 py-2 rounded-md border- border-orange-800"
                  >
                    Log in
                  </button>
                }
                {showAccount && (
                  <div className="absolute right-6 top-10 bg-white shadow-lg py-2 px-2 rounded-md flex flex-col text-left gap-2 transition-opacity duration-300">
                    {
                      isLoggedIn ? <Link
                        href="/account"
                        className="hover:bg-orange-400 cursor-pointer rounded-sm transition-all pr-8 py-1 p-1"
                        onClick={toggleAccount}
                      >
                        Account
                      </Link> : <div
                        className="hover:bg-orange-400 cursor-pointer pl-4 rounded-sm transition-all pr-8 py-1"
                        onClick={handleWarning}
                      >
                        Account
                      </div>
                    }
                    <Link
                      href="#"
                      className={`hover:bg-orange-400 cursor-pointer rounded-sm transition-all pr-2 p-1 py-1 ${isLoggedIn && userRole === "User" ? "block" : "hidden"}`}
                      onClick={joinAsCustomer}
                    >
                      Join as Vendor
                    </Link>
                    <div
                      className="hover:bg-orange-400 cursor-pointer pr-8 py-1 rounded-sm transition-all p-1"
                      id="login"
                      onClick={() => setWarningModal(true)}
                    >
                      Log out
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
