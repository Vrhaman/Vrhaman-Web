"use client";

import { Raleway } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { RecoilRoot, useRecoilState } from "recoil";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import Modal from "@/components/Modal";
import { modalWarningState, joinAsCustomerModalState } from "@/data/store";
import useApiRequest from "@/hooks/useApiRequest";

const raleway = Raleway({ subsets: ["latin"] });

function ModalManager() {
  const [warningModal, setWarningModal] = useRecoilState(modalWarningState);
  const [joinAsCustomerModal, setJoinAsCustomerModal] = useRecoilState(joinAsCustomerModalState);
  const { error, sendRequest } = useApiRequest();

  const handleLogout = () => {
    localStorage.removeItem("token");

    sendRequest("user/logout", {
      method: "POST",
    })
      .then((response) => {
        if (response.data && response.data.success) {
          console.log("logged out successfully");
          window.location.replace("/");
          window.location.reload();
        } else {
          console.log("Error in logging out");
        }
      })
      .catch((error) => {
        console.error("Error getting data:", error);
        setVehicleData([]);
      });
  };
  const handleJoinAsCustomer = () => {
    sendRequest("customer/join", {
      method: "POST",
    })
      .then((response) => {
        if (response.data && response.data.success) {
          console.log("switched to customer successfully");
          window.location.reload();
        } else {
          console.log("Error in switching out");
        }
      })
      .catch((error) => {
        console.error("Error switching role:", error);
      });
  };


  return (
    <>
      {warningModal && (
        <Modal warningText="Are you really want to Logout?">
          <button
            className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
            onClick={() => setWarningModal(false)}
          >
            Cancel
          </button>
          <button
            className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </Modal>
      )}
      {joinAsCustomerModal && (
        <Modal warningText="Do you really want to join as customer?">
          <button
            className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
            onClick={() => setJoinAsCustomerModal(false)}
          >
            Cancel
          </button>
          <button
            className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
            onClick={handleJoinAsCustomer}
          >
            Join
          </button>
        </Modal>
      )}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Vrhaman</title>
        <meta name="description" content="Book rides online" />
        <link rel="icon" href="/logo.ico" />
        <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      </head>
      <body className={raleway.className}>
        <RecoilRoot>
          <Toaster />
          <Navbar />
          {children}
          <Footer />
          <ModalManager />
        </RecoilRoot>
      </body>
    </html>
  );
}
