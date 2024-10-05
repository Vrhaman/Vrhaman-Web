'use client'

import React, { useState, useRef, useEffect } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import useApiRequest from "@/hooks/useApiRequest";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const LoginModal = ({ onClose }) => {
  const [otp, setOtp] = useState(undefined);
  const [timerRunning, setTimerRunning] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(undefined);
  const [stage, setStage] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const { data, error, sendRequest } = useApiRequest();
  const { isLoggedIn, userRole, userId } = useAuth();

  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let intervalId;
    if (timerRunning) {
      intervalId = setInterval(() => {
        setTimerSeconds((prevSeconds) => {
          if (prevSeconds === 1) {
            clearInterval(intervalId);
            setTimerRunning(false);
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerRunning]);

  useEffect(() => {
    if (stage === 1 && timerRunning) {
      const interval = setInterval(() => {
        setTimerSeconds((prevSeconds) => {
          if (prevSeconds === 1) {
            clearInterval(interval);
            setTimerRunning(false);
          }
          return prevSeconds - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stage, timerRunning]);

  const handleMobileChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = (event) => {
    event.preventDefault();
    sendOtp();
  };

  const sendOtp = () => {
    sendRequest("user/send-otp", {
      method: "POST",
      body: JSON.stringify({ mobileNumber: mobileNumber }),
    })
      .then((response) => {
        setStage(2);
        setTimerRunning(true);
        if (response && response.data.success) {
          toast.success("Otp sent!");
        } else {
          toast.error("Otp Sending failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        toast.error("Failed to send OTP. Please try again.");
      });
  };

  const handleVerifyOtp = (event) => {
    event.preventDefault();
    verifyOtp();
  };

  const verifyOtp = () => {
    sendRequest("user/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        mobileNumber: mobileNumber,
        otp: otp,
      }),
    })
      .then((response) => {
        if (response && response.data.success) {
          closeModal();
          router.replace("/");
          window.location.reload();
          // console.log(document.cookie);
          console.log("OTP verified successfully!");
        } else {
          console.error("OTP verification failed.");
          toast.error("OTP verification failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        toast.error("An error occurred. Please try again later.");
      });
  };

  const handleResendOTP = () => {
    if (!timerRunning) {
      sendOtp();
    }
  };

  const closeModal = () => {
    onClose();
  };

  const modalClickOutsideHandler = () => {
    closeModal();
  };

  const modalClickOutsideRef = useRef(null);
  useClickOutside(modalClickOutsideRef, modalClickOutsideHandler);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div ref={modalClickOutsideRef}>
        <div className="sm:w-96 w-[18rem] mx-auto overflow-hidden bg-white rounded-lg shadow-md sm:p-10 p-4 flex flex-col gap-3">
          <h3 className="text-2xl text-center pb-4 font-semibold">Login</h3>
          <div>
            <input
              type="number"
              value={mobileNumber}
              onChange={handleMobileChange}
              className="w-full bg-slate-300 focus:outline-none border px-2 py-4 border-slate-300 rounded-md"
              placeholder="Enter Your Mobile Number"
            />
          </div>
          <div className="">
            <input
              type="number"
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
              disabled={stage === 1}
              className="w-full bg-slate-300 focus:outline-none border px-2 py-4 border-slate-300 rounded-md"
            />
          </div>
          <div className="flex items-center justify-center pt-2">
            <button
              className="px-5 py-2 bg-orange-500 text-white rounded-md"
              onClick={stage === 1 ? handleSendOtp : handleVerifyOtp}
              disabled={!otp && !mobileNumber && stage === 2 || !mobileNumber && stage === 1}
            >
              {stage === 1 ? "Send OTP" : "Verify OTP"}
            </button>
          </div>
          <div className="flex justify-center items-center gap-2 pt-3">
            <button
              className={`text-orange-500 cursor-pointer hover:text-orange-600 transition-all duration-300 ${stage === 1 ? "hidden" : ""}`}
              disabled={timerRunning || stage === 1}
              onClick={handleResendOTP}
              style={{ opacity: timerRunning || stage === 1 ? 0.5 : 1 }}
            >
              Resend OTP
            </button>
            <span>{timerRunning ? `${timerSeconds}s` : ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
