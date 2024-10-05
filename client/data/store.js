"use client";

import { useEffect } from "react";
import { atom, selector, useSetRecoilState } from "recoil";

export const fullNameState = atom({
  key: "role",
  default: "customer",
});

export const loginModalState = atom({
  key: "loginModalState",
  default: false,
});

export const modalWarningState = atom({
  key: "modalWarningState",
  default: false,
});

export const loadingState = atom({
  key: "loadingState",
  default: false,
});

export const joinAsCustomerModalState = atom({
  key: "joinAsCustomerModalState",
  default: false,
});

export const orderDetailsState = atom({
  key: "orderDetailsState",
  default: {
    pickupLocation: "",
    pickupDate: "",
    dropDate: "",
    pickupTime: "",
    dropTime: "",
  },
});

export function useOrderDetailsFromLocalStorage() {
  const setOrderDetails = useSetRecoilState(orderDetailsState);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("orderDetails"));
    if (storedData) {
      setOrderDetails(storedData);
    }
  }, [setOrderDetails]);
}
