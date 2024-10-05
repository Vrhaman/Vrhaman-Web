"use client";

import React, { useState } from "react";

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion((prevOpenQuestion) =>
      prevOpenQuestion === index ? null : index
    );
  };

  const faqs = [
    {
      question: "How do I book a bike?",
      answer:
        "Booking a bike with BloomRidez is simple. Just download our app, create an account, and search for available bikes near you. Once you find a bike you like, select it, choose your rental duration, and confirm your booking. You're all set to ride!",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards, online banking, and mobile wallets. You can securely pay for your bike rental through our app.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking anytime before the scheduled pickup time. However, please note that cancellation fees may apply depending on the time of cancellation and our cancellation policy.",
    },
    {
      question: "Are there any age restrictions for renting a bike?",
      answer:
        "Yes, to rent a bike with BloomRidez, you must be at least 18 years old and hold a valid driver's license or government-issued ID.",
    },
    {
      question:
        "What if I encounter a problem with the bike during my rental period?",
      answer:
        "If you encounter any issues with the bike during your rental period, such as mechanical problems or damage, please contact our customer support immediately. We'll assist you in resolving the issue and ensure you have a smooth riding experience.",
    },
  ];

  return (
    <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-bold leading-tight text-black sm:text-4xl lg:text-3xl">
            Explore Common Questions
          </h2>
        </div>
        <div className="mx-auto mt-8 space-y-4 md:mt-16">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="transition-all duration-200 bg-white border border-gray-200 shadow-md cursor-pointer hover:bg-gray-50"
            >
              <button
                type="button"
                id={`question${index}`}
                data-state="closed"
                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
                onClick={() => toggleQuestion(index)}
              >
                <span className="flex text-sm sm:text-lg font-semibold text-black">
                  {faq.question}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-6 h-6 text-gray-400 transform ${
                    openQuestion === index ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div
                id={`answer${index}`}
                className={`text-xs sm:text-base px-4 pb-5 sm:px-6 sm:pb-6 ${
                  openQuestion === index ? "block" : "hidden"
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 textbase mt-9">
          Still have questions?{" "}
          <a
            href="/support"
            className="cursor-pointer font-medium text-tertiary transition-all duration-200 hover:text-tertiary focus:text-tertiary hover-underline"
          >
            Contact our support
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQ;
