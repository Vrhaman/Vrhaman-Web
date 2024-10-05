"use client";

import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const FAQ = () => {
  const [isOpen, setIsOpen] = useState(Array(faqData.length).fill(false));

  const toggleFAQ = (index) => {
    setIsOpen((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <section className="bg-white mx-6">
      <div className="container px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 lg:text-3xl ">
          FAQ&apos;s
        </h1>

        <hr className="my-6 border-gray-200" />

        <div>
          {faqData.map((faq, index) => (
            <div key={index}>
              <button
                className="flex items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                {isOpen[index] ? (
                  <FiMinus className="flex-shrink-0 w-6 h-6 text-orange-600 " />
                ) : (
                  <FiPlus className="flex-shrink-0 w-6 h-6 text-orange-600" />
                )}
                <h1 className="mx-4 sm:text-xl text-md text-gray-700">{faq.question}</h1>
              </button>

              {isOpen[index] && (
                <div className="flex mt-8 md:mx-10">
                  <span className="border border-orange-600"></span>

                  <p className="max-w-3xl px-4 text-gray-500">{faq.answer}</p>
                </div>
              )}

              <hr className="my-8 border-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const faqData = [
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

export default FAQ;
