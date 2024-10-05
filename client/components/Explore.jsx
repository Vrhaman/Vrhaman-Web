"use client";

import React, { useEffect, useState } from "react";
import { IoGrid } from "react-icons/io5";
import { RiEBikeLine } from "react-icons/ri";
import { RiMotorbikeFill } from "react-icons/ri";
import { MdOutlineElectricMoped } from "react-icons/md";
import Link from "next/link";
import useApiRequest from "@/hooks/useApiRequest";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

const Explore = () => {

  const { isLoggedIn, userRole, loading, userId } = useAuth();
  // console.log(userRole, isLoggedIn, userId)

  const [category, setCategory] = useState("all");
  const [vehicleData, setVehicleData] = useState();

  const { data, error, sendRequest } = useApiRequest();

  useEffect(() => {
    getAllVehicleData();
  }, [])

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const handleWarning = () => {
    if (!isLoggedIn) {
      toast.error("You have to login first");
    }
  }

  const getAllVehicleData = () => {
    sendRequest("market/get-products", {
      method: "GET",
    })
      .then(response => {
        if (response.data && response.data.success) {
          console.log("Products fetched");
          setVehicleData(response.data.products);
        } else {
          console.log("Error in fetching vehicles data");
          setVehicleData([]);
        }
      })
      .catch(error => {
        console.error("Error getting data:", error);
        setVehicleData([]);
      });
  };

  return (
    <div className={`${userRole !== 'Customer' ? 'mt-[18rem] md:mt-[18rem]' : 'mt-10'} p-5`}>
      <div className="flex overflow-x-scroll no-scrollbar gap-5 md:gap-14 items-center justify-center">
        <label htmlFor="all" className="cursor-pointer">
          <input
            type="radio"
            id="all"
            name="vehicle"
            className="hidden"
            checked={category === "all"}
            onChange={() => handleCategoryChange("all")}
          />
          <div
            className={`flex flex-col gap-1 justify-center items-center group ${category === "all" ? "border-b-2 border-b-orange-700" : ""
              }`}
          >
            <IoGrid className="text-5xl text-orange-600 group-hover:scale-95 transition-all" />
            <div className="group-hover:scale-95 transition-all">All</div>
          </div>
        </label>
        <label htmlFor="bike" className="cursor-pointer">
          <input
            type="radio"
            id="bike"
            name="vehicle"
            className="hidden"
            checked={category === "Bike"}
            onChange={() => handleCategoryChange("Bike")}
          />
          <div
            className={`flex flex-col gap-1 justify-center items-center group ${category === "Bike" ? "border-b-2 border-b-orange-700" : ""
              }`}
          >
            <RiMotorbikeFill className="text-5xl text-orange-600 group-hover:scale-95 transition-all" />
            <div className="group-hover:scale-95 transition-all">Bike</div>
          </div>
        </label>
        <label htmlFor="scooty" className="cursor-pointer">
          <input
            type="radio"
            id="scooty"
            name="vehicle"
            className="hidden"
            checked={category === "Scooter"}
            onChange={() => handleCategoryChange("Scooter")}
          />
          <div
            className={`flex flex-col gap-1 justify-center items-center group ${category === "Scooter" ? "border-b-2 border-b-orange-700" : ""
              }`}
          >
            <RiEBikeLine className="text-5xl text-orange-600 group-hover:scale-95 transition-all" />
            <div className="group-hover:scale-95 transition-all">Scooty</div>
          </div>
        </label>
        <label htmlFor="ev" className="cursor-pointer">
          <input
            type="radio"
            id="ev"
            name="vehicle"
            className="hidden"
            checked={category === "EV"}
            onChange={() => handleCategoryChange("EV")}
          />
          <div
            className={`flex flex-col gap-1 justify-center items-center group ${category === "EV" ? "border-b-2 border-b-orange-700" : ""
              }`}
          >
            <MdOutlineElectricMoped className="text-5xl text-orange-600 group-hover:scale-95 transition-all" />
            <div className="group-hover:scale-95 transition-all">EV</div>
          </div>
        </label>
      </div>
      <div className="mt-14 flex gap-4 justify-center flex-wrap">
        {vehicleData &&
          vehicleData
            ?.filter((item) => {
              if (category !== "all") {
                return item.category === category;
              } else {
                return true;
              }
            })
            ?.map((item, index) => (
              <div
                key={index}
                className="w-80 h-[18rem] flex flex-col items-center justify-between bg-white rounded-md p-4"
              >
                <img
                  src={item.image}
                  className="object-contain w-full h-48"
                  alt={item.name}
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="text-center pt-2">{item.name}</div>
                  <div className="text-center">
                    <span>₹</span>
                    <span>{`${item?.priceForRent[0].price} - ${item?.priceForRent[1].price}`}</span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="flex justify-center items-center mt-6">
        {userRole !== 'Customer' ? isLoggedIn ? (
          <Link
            href="/explore"
            className="py-4 px-10 sm:px-20 bg-orange-600 text-white rounded-md text-lg font-medium hover:bg-orange-700 transition-all duration-300"
          >
            Check&nbsp;Availability
          </Link>
        ) : (
          <button
            onClick={handleWarning}
            className="py-4 px-10 sm:px-20 bg-orange-600 text-white rounded-md text-lg font-medium hover:bg-orange-700 transition-all duration-300"
          >
            Check&nbsp;Availability
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Explore;
