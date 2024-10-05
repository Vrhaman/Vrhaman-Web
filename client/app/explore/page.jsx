"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaAngleDown, FaTimes, FaSortDown } from "react-icons/fa";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { MdMyLocation } from "react-icons/md";
import useApiRequest from "@/hooks/useApiRequest";
import Link from "next/link";

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

const Explore = () => {
  const [dropDown, setDropDown] = useState(false);
  const [pickupTimeOpen, setPickupTimeOpen] = useState(false);
  const [dropTimeOpen, setDropTimeOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [vehicleData, setVehicleData] = useState();
  const [vehicles, setVehicles] = useState();
  const [vehicleList, setVehicleList] = useState();
  const [pickupTimeIndex, setPickupTimeIndex] = useState(0);
  const [dropTimeIndex, setDropTimeIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [modelDropDown, setModelDropDown] = useState(false);
  const [engineDropDown, setEngineDropDown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState(false);
  const [area, setArea] = useState(null);
  const [fuel, setFuel] = useState("Any");
  const [transmission, setTransmission] = useState("Any");
  const [engine, setEngine] = useState(null);
  const [model, setModel] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { error, sendRequest } = useApiRequest();

  useEffect(() => {
    getAllVehicleData();
  }, [])

  const getAllVehicleData = () => {
    const params = {};
    if (model) {
      params.name = model?.name;
    }
    if (fuel !== "Any") {
      params.fuelType = fuel;
    }
    if (transmission !== "Any") {
      params.transmissionType = transmission;
    }
    if (engine) {
      params.cc = engine;
    }
    sendRequest("market/get-products/filter", {
      method: "GET",
      params: params
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

  const searchModel = async (req, res) => {
    try {
      const response = await sendRequest('market/product/list', {
        method: "GET",
      });
      if (response.data && response.data.success) {
        console.log("models fetched");
        // console.log(response.data.vehicles)
        setVehicles(response.data.vehicles);
      } else {
        console.log("Error in fetching user data");
      }
    } catch (error) {
      console.error("Error getting data:", error);
    }
  }

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  const inputRef = useRef();

  const toggleDropdown = () => {
    setDropDown(!dropDown);
  };

  const toggleEngineDropdown = () => {
    setEngineDropDown(!engineDropDown);
  };

  const toggleModelDropdown = () => {
    if (modelDropDown === false) {
      searchModel();
    } else {
      setVehicles(null)
    }
    setModelDropDown(!modelDropDown);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSidebar = () => {
    setShowFilters(!showFilters);
  };

  const handleFuelChange = (event) => {
    setFuel(event.target.value);
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleTransmissionChange = (event) => {
    setTransmission(event.target.value);
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

  const handlePlaceChange = () => {
    const places = inputRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      console.log(place.formatted_address);
      setPickupLocation(place.formatted_address);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === "OK" && results && results.length > 0) {
            const address = results[0].formatted_address;
            setPickupLocation(address);
          } else {
            console.error("Geocoder failed due to: " + status);
          }
        });
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const setPickupLocation = (address) => {
    inputRef.current.value = address;
    handlePlaceChange();
  };

  const handleFilterButtonClick = () => {
    getAllVehicleData();
  }

  const handleResetFilter = () => {
    setFuel("Any");
    setTransmission("Any");
    setEngine(null);
    setModel(null);
    getAllVehicleData();
  }

  return (
    <div className="relative">
      <>
        <div className="lg:hidden flex flex-col cursor-pointer w-full bg-slate-300 my-1 items-center justify-center pb-2">
          <FaSortDown
            className={`w-full text-4xl text-slate-800`}
            style={{ transform: `rotate(${isExpanded ? 180 : 0}deg)` }}
            onClick={toggleSection}
          />
        </div>
        <div
          className={`border-b flex  w-full gap-3 items-center sm:px-[7.2rem] px-3 lg:py-8 py-2 flex-wrap lg:flex-nowrap ${isExpanded ? "block" : "hidden"
            }`}
        >
          <div className="flex flex-col md:flex-row md:justify-evenly md:items-center pt-4 lg:w-auto w-full">
            <div className="w-full">
              <LoadScript
                googleMapsApiKey="AIzaSyAy1Vgp6BmeMsnEp5Jc_ice2MrB0KDoZEE"
                libraries={["places"]}
              >
                <StandaloneSearchBox
                  onLoad={(ref) => (inputRef.current = ref)}
                  onPlacesChanged={handlePlaceChange}
                >
                  <input
                    type="text"
                    placeholder="Enter Pickup Location"
                    ref={inputRef}
                    className="pl-4 pr-2 lg:w-[16rem] w-full py-4 rounded-md focus:outline-none text-md bg-slate-200"
                  />
                </StandaloneSearchBox>
              </LoadScript>
            </div>
          </div>
          <div className="w-full">
            <div className="font-semibold text-sm">Pickup date</div>
            <input
              type="date"
              value={pickupDate}
              onChange={handlePickupDateChange}
              min={new Date().toISOString().split("T")[0]}
              placeholder="Enter Pickup Location"
              className="pl-4 pr-2 py-4 rounded-md focus:outline-none text-md flex-1 lg:w-60 w-full bg-slate-200"
            />
          </div>
          <div className="w-full">
            <div className="font-semibold text-sm">Pickup Time</div>
            <div className="bg-slate-200 rounded-md w-[100%] relative">
              <div
                className=" w-[100%] rounded-md py-4 px-4 bg-transparent focus:outline-none flex justify-between items-center cursor-pointer"
                onClick={togglePickupTime}
              >
                <span>{time[pickupTimeIndex]}</span>
                <span>
                  <FaAngleDown />
                </span>
              </div>
              <div
                className={`transition-all duration-300 ${pickupTimeOpen ? "absolute" : "hidden"
                  } mt-1 bg-white rounded-b-md shadow-md z-10 w-full pt-2 h-40 overflow-y-scroll`}
              >
                {time.map((item, index) => (
                  <div
                    className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                    key={index}
                    onClick={() => {
                      setPickupTimeIndex(index);
                      setPickupTimeOpen(false);
                      setDropTimeIndex(index + 1);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="font-semibold text-sm">Drop date</div>
            <input
              type="date"
              value={dropDate}
              onChange={handleDropDateChange}
              min={pickupDate || new Date().toISOString().split("T")[0]}
              placeholder="Enter Pickup Date"
              className="pl-4 pr-2 py-4 rounded-md focus:outline-none text-md flex-1 lg:w-60 w-full bg-slate-200"
            />
          </div>
          <div className="w-full">
            <div className="font-semibold text-sm">Drop Time</div>
            <div className="bg-slate-200 rounded-md relative">
              <div
                className="w-[100%] rounded-md py-4 px-4 bg-transparent focus:outline-none flex justify-between items-center cursor-pointer"
                onClick={toggleDropTime}
              >
                <span>{time[dropTimeIndex]}</span>
                <span>
                  <FaAngleDown />
                </span>
              </div>
              <div
                className={`transition-all duration-300 ${dropTimeOpen ? "absolute" : "hidden"
                  } mt-1 bg-white rounded-b-md shadow-md z-10 w-full pt-2 h-40 overflow-y-scroll`}
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
          <div className="w-full pt-4">
            <button className="w-full px-8 py-4 bg-orange-500 rounded-md text-white hover:bg-orange-600 hover:border-none transition-all duration-300">
              Search
            </button>
          </div>
        </div>
      </>
      <div className="flex items-start gap-4 md:px-[7rem] sm:px-5 px-2 pt-5">
        <div className="md:w-[25%] sticky top-[20px] w-full hidden sm:flex flex-col gap-4 border py-5 px-3 rounded-md shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Filters</h3>
            <button className="text-orange-500 border rounded-sm px-2 py-1 hover:text-orange-600 transition-all"
              onClick={handleResetFilter}>
              clear&nbsp;all
            </button>
          </div>

          {/* Search by area */}
          <div className="bg-slate-200 rounded-md w-[100%] relative">
            <div
              className="w-[100%] rounded-md py-4 px-4 bg-transparent focus:outline-none flex justify-between items-center cursor-pointer"
              onClick={toggleDropdown}
            >
              <span>{area ? area : "Search by Area"}</span>
              <span>
                <FaAngleDown />
              </span>
            </div>
            <div
              className={`transition-all duration-300 ${dropDown ? "absolute" : "hidden"
                } mt-1 bg-white rounded-b-md shadow-md z-10 w-full pt-2`}
            >
              <div
                className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                onClick={() => {
                  setArea("Law Gate");
                  setDropDown(false);
                }}
              >
                Law Gate
              </div>
              <div
                className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                onClick={() => {
                  setArea("Main Gate");
                  setDropDown(false);
                }}
              >
                Main gate
              </div>
              <div
                className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                onClick={() => {
                  setArea("Apna Chai Cafe");
                  setDropDown(false);
                }}
              >
                Apna Chai cafe
              </div>
              <div
                className="mb-1 py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                onClick={() => {
                  setArea("Phagwara");
                  setDropDown(false);
                }}
              >
                Phagwara
              </div>
            </div>
          </div>

          {/* Fuel type filter */}
          <div className="flex flex-col gap-2">
            <h3 className="text-md font-semibold">Fuel&nbsp;Type</h3>
            <div className="flex justify-between items-center temd-lg">
              <label htmlFor="any" className="cursor-pointer">
                Any
              </label>
              <input
                type="radio"
                name="fuel"
                id="any"
                value="Any"
                className="text-3xl cursor-pointer text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600"
                checked={fuel === "Any"}
                onChange={handleFuelChange}
              />
            </div>
            <div className="flex justify-between items-center text-md">
              <label htmlFor="petrol" className="cursor-pointer">
                Petrol
              </label>
              <input
                type="radio"
                name="fuel"
                id="petrol"
                value="Petrol"
                className="text-3xl cursor-pointer text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600"
                checked={fuel === "Petrol"}
                onChange={handleFuelChange}
              />
            </div>
            <div className="flex justify-between items-center text-md">
              <label htmlFor="diesel" className="cursor-pointer">
                Diesel
              </label>
              <input
                type="radio"
                name="fuel"
                id="diesel"
                value="Diesel"
                className="text-3xl cursor-pointer text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600"
                checked={fuel === "Diesel"}
                onChange={handleFuelChange}
              />
            </div>
            <div className="flex justify-between items-center tmdt-lg">
              <label htmlFor="ev" className="cursor-pointer">
                EV
              </label>
              <input
                type="radio"
                name="fuel"
                id="ev"
                value="Electric"
                className="text-3xl cursor-pointer text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600"
                checked={fuel === "Electric"}
                onChange={handleFuelChange}
              />
            </div>
          </div>

          {/* Transmission type filter */}
          <div className="flex flex-col gap-2">
            <h3 className="text-md font-semibold">Transmission&nbsp;Type</h3>
            <div className="flex justify-between items-center text-lg cursor-pointer">
              <label htmlFor="any" className="cursor-pointer">
                Any
              </label>
              <input
                type="radio"
                name="transType"
                id="any"
                value="Any"
                checked={transmission === "Any"}
                onChange={handleTransmissionChange}
              />
            </div>
            <div className="flex justify-between items-center text-lg cursor-pointer">
              <label htmlFor="geared" className="cursor-pointer">
                Geared
              </label>
              <input
                type="radio"
                name="transType"
                id="geared"
                value="Geared"
                checked={transmission === "Geared"}
                onChange={handleTransmissionChange}
              />
            </div>
            <div className="flex justify-between items-center text-lg cursor-pointer">
              <label htmlFor="gearless" className="cursor-pointer">
                Gearless
              </label>
              <input
                type="radio"
                name="transType"
                id="gearless"
                value="Gearless"
                checked={transmission === "Gearless"}
                onChange={handleTransmissionChange}
              />
            </div>
          </div>

          {/* Engine capacity filter */}
          <div className="bg-slate-200 rounded-md w-[100%] relative">
            <div
              className="w-[100%] rounded-md py-4 px-4 bg-transparent focus:outline-none flex justify-between items-center cursor-pointer"
              onClick={toggleEngineDropdown}
            >
              <span>{engine ? engine : "Engine Capacity"}</span>
              <span>
                <FaAngleDown />
              </span>
            </div>
            <div
              className={`transition-all duration-300 ${engineDropDown ? "absolute" : "hidden"
                } mt-1 bg-white rounded-b-md shadow-md z-20 w-full pt-2`}
            >
              <div
                className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                onClick={() => {
                  setEngine(null);
                  setEngineDropDown(false);
                }}
              >
                Engine Capacity
              </div>
              <div
                className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                onClick={() => {
                  setEngine(120);
                  setEngineDropDown(false);
                }}
              >
                120
              </div>
              <div
                className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                onClick={() => {
                  setEngine(150);
                  setEngineDropDown(false);
                }}
              >
                150
              </div>
              <div
                className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                onClick={() => {
                  setEngine(180);
                  setEngineDropDown(false);
                }}
              >
                180
              </div>
              <div
                className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                onClick={() => {
                  setEngine(200);
                  setEngineDropDown(false);
                }}
              >
                200
              </div>
            </div>
          </div>

          {/* Model Filter */}
          <div className="bg-slate-200 rounded-md w-[100%] relative">
            <div
              className="w-[100%] rounded-md py-4 px-4 bg-transparent focus:outline-none flex justify-between items-center cursor-pointer"
              onClick={toggleModelDropdown}
            >
              <span>{model ? model?.name : "Model"}</span>
              <span>
                <FaAngleDown />
              </span>
            </div>
            <div
              className={`transition-all duration-300 ${modelDropDown ? "absolute" : "hidden"
                } mt-1 bg-white rounded-b-md shadow-md z-10 w-full max-h-40 overflow-y-auto`}
            >
              <input
                type="text"
                placeholder="Search model..."
                className="w-full p-2 border rounded-md focus:outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {vehicles && vehicles
                .filter((model) =>
                  model.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .slice(0, 5)
                .map((model, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setModel(model);
                      setModelDropDown(false);
                      console.log(model)
                    }}
                    className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                  >
                    {model?.name}
                  </div>
                ))}
            </div>
          </div>

          <div className="flex justify-center items-center py-5">
            <button className="bg-orange-600 text-white px-10 py-2 rounded-3xl hover:bg-orange-700 transition-all duration-200"
              onClick={handleFilterButtonClick}>
              Apply Filter
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50">
            <div className="fixed inset-y-0 left-0 bg-white w-4/5 shadow-lg overflow-y-auto">
              <div className="flex justify-between items-center px-4 py-2 border-b">
                <h3 className="text-xl font-semibold">Filters</h3>
                <button
                  className="text-orange-500"
                  onClick={handleSidebar}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="px-4 py-5">
                <div className="w-full flex flex-col gap-4 py-5 px-3 transition-all">
                  <div className="flex justify-end items-center">
                    <button className="text-orange-500 border rounded-sm px-2 py-1 hover:text-orange-600 transition-all">
                      clear all
                    </button>
                  </div>

                  {/* Search by area */}
                  <div className="bg-slate-200 rounded-md w-[100%] relative">
                    <div
                      className="w-[100%] rounded-md py-4 px-4 bg-transparent focus:outline-none flex justify-between items-center cursor-pointer"
                      onClick={toggleDropdown}
                    >
                      <span>Search by Area</span>
                      <span>
                        <FaAngleDown />
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 ${dropDown ? "absolute" : "hidden"
                        } mt-1 bg-white rounded-b-md shadow-md z-10 w-full pt-2`}
                    >
                      <div className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1">
                        1:00
                      </div>
                      <div className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1">
                        2:00
                      </div>
                      <div className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1">
                        3:00
                      </div>
                      <div className="mb-1 py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1">
                        4:00
                      </div>
                    </div>
                  </div>

                  {/* Fuel type filter */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-md font-semibold"> Fuel Type</h3>
                    <div className="flex justify-between items-center temd-lg">
                      <label htmlFor="any" className="cursor-pointer">
                        Any
                      </label>
                      <input
                        type="radio"
                        name="fuel"
                        id="any"
                        className="text-3xl cursor-pointer text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600"
                      />
                    </div>
                    <div className="flex justify-between items-center text-md">
                      <label htmlFor="petrol" className="cursor-pointer">
                        Petrol
                      </label>
                      <input
                        type="radio"
                        name="fuel"
                        id="petrol"
                        className="text-3xl cursor-pointer text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600"
                      />
                    </div>
                    <div className="flex justify-between items-center text-md">
                      <label htmlFor="diesel" className="cursor-pointer">
                        Diesel
                      </label>
                      <input
                        type="radio"
                        name="fuel"
                        id="diesel"
                        className="text-3xl cursor-pointer text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600"
                      />
                    </div>
                    <div className="flex justify-between items-center tmdt-lg">
                      <label htmlFor="ev" className="cursor-pointer">
                        EV
                      </label>
                      <input
                        type="radio"
                        name="fuel"
                        id="ev"
                        className="text-2xl"
                      />
                    </div>
                  </div>

                  {/* Transmission type filter */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-md font-semibold">Transmission Type</h3>
                    <div className="flex justify-between items-center text-lg cursor-pointer">
                      <label htmlFor="any" className="cursor-pointer">
                        Any
                      </label>
                      <input type="radio" name="transType" id="any" />
                    </div>
                    <div className="flex justify-between items-center text-lg cursor-pointer">
                      <label htmlFor="geared" className="cursor-pointer">
                        Geared
                      </label>
                      <input type="radio" name="transType" id="geared" />
                    </div>
                    <div className="flex justify-between items-center text-lg cursor-pointer">
                      <label htmlFor="gearless" className="cursor-pointer">
                        Gearless
                      </label>
                      <input type="radio" name="transType" id="gearless" />
                    </div>
                  </div>

                  {/* Engine capacity filter */}
                  <div className="bg-slate-200 rounded-md w-[100%] relative">
                    <div
                      className="w-[100%] rounded-md py-4 px-4 bg-transparent focus:outline-none flex justify-between items-center cursor-pointer"
                      onClick={toggleEngineDropdown}
                    >
                      <span>Engine Capacity</span>
                      <span>
                        <FaAngleDown />
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 ${engineDropDown ? "absolute" : "hidden"
                        } mt-1 bg-slate-200 rounded-b-md shadow-md z-10 w-full pt-2`}
                    >
                      <div className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1" onClick={() => {
                        setEngine(120);
                        setEngineDropDown(false);
                      }}>
                        120
                      </div>
                      <div className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1" onClick={() => {
                        setEngine(150);
                        setEngineDropDown(false);
                      }}>
                        150
                      </div>
                      <div className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1" onClick={() => {
                        setEngine(180);
                        setEngineDropDown(false);
                      }}>
                        180
                      </div>
                      <div className="mb-1 py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1" onClick={() => {
                        setEngine(200);
                        setEngineDropDown(false);
                      }}>
                        200
                      </div>
                    </div>
                  </div>

                  {/* Model Filter */}
                  <div className="bg-slate-200 rounded-md w-[100%] relative">
                    <div
                      className="w-[100%] rounded-md py-4 px-4 bg-transparent focus:outline-none flex justify-between items-center cursor-pointer"
                      onClick={toggleModelDropdown}
                    >
                      <span>{model ? model?.name : "Model"}</span>
                      <span>
                        <FaAngleDown />
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 ${modelDropDown ? "absolute" : "hidden"
                        } mt-1 bg-white rounded-b-md shadow-md z-10 w-full max-h-40 overflow-y-auto`}
                    >
                      <input
                        type="text"
                        placeholder="Search model..."
                        className="w-full p-2 border rounded-md focus:outline-none"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                      {vehicles && vehicles
                        .filter((model) =>
                          model.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(0, 5)
                        .map((model, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setModel(model);
                              setModelDropDown(false);
                              console.log(model)
                            }}
                            className="py-2 pl-4 rounded-md cursor-pointer hover:bg-slate-200 mx-1"
                          >
                            {model?.name}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex justify-center items-center py-5">
                    <button className="bg-orange-600 text-white px-10 py-2 rounded-3xl hover:bg-orange-700 transition-all duration-200">
                      Apply Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sm:w-[75%] w-full">
          <div className="flex gap-2 mx-4 border-b my-2 border-b-orange-500 pb-4 sm:hidden">
            <button className="border border-orange-500 px-4 py-1 rounded-3xl text-sm cursor-pointer">
              Sort
            </button>
            <button
              className="border border-orange-500 px-4 py-1 rounded-3xl text-sm cursor-pointer"
              onClick={handleSidebar}
            >
              Filter
            </button>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            {vehicleData && vehicleData?.map((item, index) => (
              <Link
                href={`/explore/${item?._id}`}
                key={index}
                className="sm:w-[18rem] w-full mx-4 sm:mx-0 sm:h-[18rem] flex flex-col items-center justify-between bg-white rounded-md cursor-pointer border"
              >
                <div className="bg-orange-400 w-full flex justify-center items-center py-2 rounded-t-md">
                  {item?.name}
                </div>
                <img
                  src={item?.image}
                  className="object-contain w-full h-48"
                  alt={item?.name}
                />
                <div className="flex gap-2 items-center justify-center border-t w-full py-2">
                  <div className="flex items-center">
                    <span>₹</span>
                    <span className="text-sm">{`${item?.priceForRent[0].price} - ${item?.priceForRent[1].price}`}</span>
                  </div>
                  <div>/day</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
