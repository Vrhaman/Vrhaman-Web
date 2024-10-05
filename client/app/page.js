"use client";

import React, { useEffect, useRef } from "react";
import Booking from "@/components/Booking";
import Carousel from "@/components/Carousel";
import Explore from "@/components/Explore";
import FAQ from "@/components/FAQ";
import Featured from "@/components/Featured";
import LoginModal from "@/components/LoginModal";
import {
  loginModalState,
  loadingState,
} from "@/data/store";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import useClickOutside from "@/hooks/useClickOutside";
import Loader from "@/components/Loader";
import useApiRequest from "@/hooks/useApiRequest";
import useAuth from "@/hooks/useAuth";

const Page = () => {
  const [showLoading, setShowLoading] = useRecoilState(loadingState);
  const [showLoginModal, setShowLoginModal] = useRecoilState(loginModalState);

  const { isLoggedIn, userRole } = useAuth();

  const router = useRouter();
  const modalRef = useRef(null);

  const { error, sendRequest } = useApiRequest();

  useEffect(() => {
    const { query } = router;
    if (showLoginModal) {
      router.push("?login=true");
    }
    if (query?.login === "true" && !showLoginModal) {
      setShowLoginModal(true);
    }
  }, [showLoginModal, router?.query]);

  const closeModal = () => {
    setShowLoginModal(false);
    router.push("/");
  };

  const modalClickOutsideHandler = () => {
    closeModal();
  };

  useClickOutside(modalRef, modalClickOutsideHandler);

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="">
      {showLoading && <Loader />}
      {showLoginModal && (
        <div ref={modalRef}>
          <LoginModal onClose={closeModal} />
        </div>
      )}
      <Carousel />
      {userRole !== "Customer" && <Booking />}
      <Explore />
      <Featured />
      <FAQ />
    </div>
  );
};

export default Page;
