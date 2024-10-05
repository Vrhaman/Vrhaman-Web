"use client";

import React, { useState, useRef, useEffect, use } from "react";
import { TbPencil } from "react-icons/tb";
import { LuIndianRupee } from "react-icons/lu";
import { FaAngleDown } from "react-icons/fa";
import { orderDetailsState } from "@/data/store";
import { useRecoilState } from "recoil";
import { toast } from "react-hot-toast";
import useClickOutside from "@/hooks/useClickOutside";
import useApiRequest from "@/hooks/useApiRequest";

const time = [
  "1:00",
  "2:00",
  "3:00",
  "4:00",
  "5:00",
  "6:00",
  "7:00",
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "24:00",
];

const SingleObject = ({ id }) => {
  const [orderDetails, setOrderDetails] = useRecoilState(orderDetailsState);
  const [model, setModel] = useState(false);
  const [available, setAvailable] = useState(true);
  const [pickupTimeOpen, setPickupTimeOpen] = useState(false);
  const [dropTimeOpen, setDropTimeOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState(orderDetails?.pickupDate);
  const [dropDate, setDropDate] = useState(orderDetails?.dropDate);
  const [pickupLocation, setPickupLocation] = useState(orderDetails?.pickupLocation);
  const [pickupTimeIndex, setPickupTimeIndex] = useState(time.indexOf(orderDetails?.pickupTime));
  const [dropTimeIndex, setDropTimeIndex] = useState(time?.indexOf(orderDetails?.dropTime));
  const [filter, setFilter] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [vehicleData, setVehicleData] = useState();

  const { error, sendRequest } = useApiRequest();

  // console.log(orderDetails);

  useEffect(() => {
    getVehicleData()
    checkAvailability()
  }, [])


  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("orderDetails"));
    if (storedData) {
      setOrderDetails(storedData.data);
      console.log(storedData)
    }
  }, [setOrderDetails]);

  const checkAvailability = async () => {
    try {
      const response = await sendRequest('market/product/availablity', {
        method: "GET",
        params: { productId: id }
      });

      if (response.data.success) {
        console.log("checked availability");
        setAvailable(response.data.available);
      } else {
        console.log("checked availability");
        setAvailable(response.data.available);
      }
    } catch (error) {
      console.log("checked availability error");
      setAvailable(false);
    }
  }

  const getVehicleData = () => {
    sendRequest("market/product", {
      method: "GET",
      params: { productId: id }
    })
      .then(response => {
        if (response.data && response.data.success) {
          console.log("Products fetched");
          setVehicleData(response.data.product);
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

  const bookYourRide = async () => {
    const handlePayment = () => {
      return new Promise((resolve, reject) => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
          amount: 4900,
          currency: 'INR',
          name: 'BookRidez',
          description: 'Ride Booking Payment',
          handler: function (response) {
            console.log(response);
            resolve(response);
          },
          prefill: {
            name: 'Anshuman Mohapatra',
            email: 'anshumanmohapatra11121999@gmail.com',
          },
          theme: {
            color: '#F37254'
          },
          modal: {
            ondismiss: function () {
              reject(new Error('Payment process interrupted'));
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    };

    try {
      if (!pickupLocation || pickupTimeIndex === undefined || dropTimeIndex === undefined || !pickupDate || !dropDate || !id || !time) {
        console.log("Please provide all required information.");
        toast.error("Please provide all the details for the booking");
        return;
      }

      const paymentResponse = await handlePayment();

      if (paymentResponse) {
        toast.success("Payment successful!");

        const transactionId = paymentResponse.razorpay_payment_id;
        const response = await sendRequest('book', {
          method: "POST",
          body: JSON.stringify({
            vehicleId: id[0],
            pickUpPoint: pickupLocation,
            pickUpDate: pickupDate,
            dropDate: dropDate,
            pickUpTime: time[pickupTimeIndex],
            totalHour: 2,
            dropTime: time[dropTimeIndex],
            price: 200,
            transactionId: transactionId
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.success) {
          console.log("Booking confirmed");
          toast.success("Booking started...!");
          router.replace('/account');
        } else {
          console.log("Error in booking");
          toast.error("Error occurred while booking");
        }
      }
    } catch (error) {
      console.error("Error processing payment or booking:", error);
      toast.error("Error occurred during payment or booking");
    }
  };



  const togglePickupTime = () => {
    setPickupTimeOpen(!pickupTimeOpen);
  };

  const toggleDropTime = () => {
    setDropTimeOpen(!dropTimeOpen);
  };

  const handlePickupDateChange = (e) => {
    const selectedDate = e.target.value;
    if (dropDate && selectedDate >= dropDate) {
      setPickupDate(dropDate);
    } else {
      setPickupDate(selectedDate);
    }
  };

  const handleDropDateChange = (e) => {
    const selectedDate = e.target.value;

    if (pickupDate === selectedDate) {
      setFilter(true);
      setDropTimeIndex(pickupTimeIndex + 1);
    } else {
      setFilter(false);
    }

    if (pickupDate && selectedDate <= pickupDate) {
      setDropDate(pickupDate);
    } else {
      setDropDate(selectedDate);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const closeModal = () => {
    setModel(false);
  };

  const modalClickOutsideHandler = () => {
    closeModal();
  };

  const modalClickOutsideRef = useRef(null);
  useClickOutside(modalClickOutsideRef, modalClickOutsideHandler);

  const handleDateTimeChange = () => {
    setOrderDetails({
      ...orderDetails,
      pickupDate,
      dropDate,
      pickupTime: time[pickupTimeIndex],
      dropTime: time[dropTimeIndex]
    })
    setModel(false);
  };

  return (
    <>
      {model && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="mx-auto bg-slate-200 rounded-lg shadow-md p-10">
            <div className="flex flex-col items-center gap-4" ref={modalClickOutsideRef}>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div>
                  <div className="text-slate-500 font-semibold text-sm">
                    Pickup date
                  </div>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={handlePickupDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    placeholder="Enter Pickup Location"
                    className="pl-4 pr-2 py-4 rounded-md focus:outline-none text-md flex-1 w-60"
                  />
                </div>
                <div>
                  <div className="text-slate-500 font-semibold text-sm">
                    Pickup Time
                  </div>

                  <div className="bg-white rounded-md relative">
                    <div
                      className="rounded-md py-4 px-4 bg-transparent focus:outline-none flex justify-between items-center cursor-pointer w-60"
                      onClick={togglePickupTime}
                    >
                      <span>{time[pickupTimeIndex]}</span>
                      <span>
                        <FaAngleDown />
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 ${pickupTimeOpen ? "absolute" : "hidden"
                        } mt-1 bg-white rounded-b-md shadow-md z-[999] w-full pt-2m h-40 overflow-y-scroll`}
                    >
                      {time.map((item, index) => (
                        <div
                          className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                          key={index}
                          onClick={() => {
                            setPickupTimeIndex(index);
                            setPickupTimeOpen(false);
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div>
                  <div className="text-slate-500 font-semibold text-sm">
                    Drop date
                  </div>
                  <input
                    type="date"
                    value={dropDate}
                    onChange={handleDropDateChange}
                    min={pickupDate || new Date().toISOString().split("T")[0]}
                    placeholder="Enter Pickup Date"
                    className="pl-4 pr-2 py-4 rounded-md focus:outline-none text-md flex-1 w-60"
                  />
                </div>

                <div>
                  <div className="text-slate-500 font-semibold text-sm">
                    Drop Time
                  </div>
                  <div className="bg-white rounded-md relative">
                    <div
                      className="rounded-md py-4 px-4 bg-transparent focus:outline-none flex justify-between items-center cursor-pointer w-60"
                      onClick={toggleDropTime}
                    >
                      <span>{time[dropTimeIndex]}</span>
                      <span>
                        <FaAngleDown />
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 ${dropTimeOpen ? "absolute" : "hidden"
                        } mt-1 bg-white rounded-b-md shadow-md z-99 w-full pt-2 h-40 overflow-y-scroll`}
                    >
                      {time.map((item, index) =>
                        filter === true ? (
                          index > pickupTimeIndex && (
                            <div
                              className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                              key={index}
                              onClick={() => {
                                setDropTimeIndex(index);
                                setDropTimeOpen(false);
                              }}
                            >
                              {item}
                            </div>
                          )
                        ) : (
                          <div
                            className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                            key={index}
                            onClick={() => {
                              setDropTimeIndex(index);
                              setDropTimeOpen(false);
                            }}
                          >
                            {item}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="bg-orange-600 text-white px-10 py-2 rounded-3xl hover:bg-orange-700 transition-all duration-200"
                  onClick={handleDateTimeChange}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex md:flex-row flex-col gap-4 my-10 mx-4 sm:mx-16 items-start">
        <div className="flex flex-col gap-5 md:w-[50%] w-full">
          <div className="sm:px-8 px-1 py-10 shadow-md border rounded-md flex sm:gap-10 gap-4 items-center w-full">
            <div>
              <img src={vehicleData?.image} className="w-60" />
            </div>
            <div className="sm:text-2xl text-md font-semibold">
              {vehicleData?.name}
            </div>
          </div>
          <div className="border border-slate-200 flex flex-col shadow-lg sm:px-5 px-2 py-8 gap-5">
            <div className="flex flex-col gap-5">
              <div className="flex justify-between sm:items-center items-start">
                <div className="flex gap-2 items-center">
                  <span className="font-semibold sm:text-lg text-sm">
                    Pickup&nbsp;Point
                  </span>
                  <span className="text-slate-600 text-xs md:text-base font-medium">
                    {orderDetails?.pickupLocation.slice(0, 50)}...
                  </span>
                </div>
              </div>
            </div>
            <div className="flex sm:flex-row flex-col justify-between">
              <div className="flex sm:gap-2 gap-[2.7rem] items-center">
                <span className="font-semibold sm:text-normal text-sm">
                  Pickup
                </span>
                <span className="flex gap-3 items-center">
                  <span>{orderDetails?.pickupDate}, {orderDetails?.pickupTime}</span>
                  <span className="cursor-pointer text-orange-500">
                    <TbPencil onClick={() => setModel(true)} />
                  </span>
                </span>
              </div>
              <div className="flex sm:gap-2 gap-14 items-center">
                <span className="font-semibold sm:text-normal text-sm">
                  Drop
                </span>
                <span className="flex gap-3 items-center">
                  <span>{orderDetails?.dropDate}, {orderDetails?.dropTime}</span>
                  <span className="cursor-pointer text-orange-500">
                    <TbPencil onClick={() => setModel(true)} />
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center p-5 border shadow-lg rounded-md">
            <div className="flex flex-col gap-2">
              <div className="sm:text-xl text-md font-semibold">
                Security Deposit
              </div>
              <div className="text-lg">500</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="sm:text-xl text-md font-semibold">Distance</div>
              <div className="text-lg flex items-center">
                <span>
                  <LuIndianRupee />
                </span>
                30/km
              </div>
            </div>
          </div>
          <div className="border flex gap-4 shadow-lg flex-col p-5 w-full rounded-md">
            <h3 className="sm:text-xl text-lg font-semibold">
              Vehicle Details
            </h3>
            <div className="flex justify-between w-full">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <span className="font-semibold sm:text-lg text-sm">
                    Speed Limit
                  </span>
                  <span>{vehicleData?.speedLimit}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-semibold sm:text-lg text-sm">
                    Fuel Type
                  </span>
                  <span>{vehicleData?.fuelType}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-semibold sm:text-lg text-sm">
                    Seats
                  </span>
                  <span>2</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-semibold sm:text-lg text-sm">
                    Helmet
                  </span>
                  <span>1</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <span className="font-semibold sm:text-lg text-sm">
                    Top Speed
                  </span>
                  <span>100 km/hr</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-semibold sm:text-lg text-sm">
                    Battery Capacity
                  </span>
                  <span>{vehicleData?.fuelCapacity}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-semibold sm:text-lg text-sm">
                    Power
                  </span>
                  <span>3000W</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-semibold sm:text-lg text-sm">
                    Transmission
                  </span>
                  <span>{vehicleData?.transmissionType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 border shadow-lg rounded-md p-5">
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="sm:text-2xl text-lg font-semibold">
                Detailed Bill
              </h3>
              <h6 className="text-xs">(Inclusive of all taxes)</h6>
            </div>
            <div className="flex justify-between items-center">
              <div className="sm:text-xl text-md">Vehicle Rental Cost</div>
              <div className="flex gap-1 items-center font-semibold">
                <LuIndianRupee /> 514
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="sm:text-xl text-md">Advance Rental Cost</div>
              <div className="flex gap-1 items-center font-semibold">
                <LuIndianRupee /> 49
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex gap-2 items-start">
              <input
                type="checkbox"
                id="terms"
                onChange={handleCheckboxChange}
                className="mt-1.5 cursor-pointer after:bg-orange-500"
              />
              <label
                htmlFor="terms"
                className="cursor-pointer sm:text-lg text-xs"
              >
                Confirm that you are above 18 years of age and you agree to all
                <a className="text-orange-500" href="googl">
                  {" "}
                  Terms and Conditions
                </a>
              </label>
            </div>
            <button
              className={`px-4 py-2 bg-orange-500 text-white rounded-3xl hover:bg-orange-600 transition-all duration-300 ${!isChecked ? "opacity-50" : ""
                }`}
              disabled={isChecked ? !available : available}
              onClick={bookYourRide}
            >
              {available === true ? "Book your Ride" : "Vehicle not Available"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleObject;
