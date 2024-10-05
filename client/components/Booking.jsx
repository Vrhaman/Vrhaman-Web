import React, { useRef, useState, useEffect } from "react";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { FaAngleDown } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
import { orderDetailsState, useOrderDetailsFromLocalStorage } from "@/data/store";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

const libraries = ["places"];

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

const Booking = () => {
  const [pickupLocation, setPickupLocation] = useState();
  const [pickupTimeOpen, setPickupTimeOpen] = useState(false);
  const [dropTimeOpen, setDropTimeOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [pickupTimeIndex, setPickupTimeIndex] = useState(0);
  const [dropTimeIndex, setDropTimeIndex] = useState(1);
  const [filter, setFilter] = useState(false);
  const setOrderDetails = useSetRecoilState(orderDetailsState);

  useOrderDetailsFromLocalStorage();

  const inputRef = useRef();
  const router = useRouter();

  const { isLoggedIn, userRole, userId } = useAuth();

  const handleSearch = () => {
    if (!isLoggedIn) {
      const text = "Login First"
      handleWarning(text);
      return;
    }
    if (!pickupLocation) {
      const text = "Select pickup location first"
      handleWarning(text)
      return;
    }

    const expirationTime = new Date().getTime() + 60 * 60 * 1000;

    localStorage.setItem("orderDetails", JSON.stringify({
      data: {
        pickupLocation,
        pickupDate,
        dropDate,
        pickupTime: time[pickupTimeIndex],
        dropTime: time[dropTimeIndex]
      }, expirationTime: expirationTime
    }));

    setOrderDetails({
      pickupLocation: pickupLocation,
      pickupDate,
      dropDate,
      pickupTime: time[pickupTimeIndex],
      dropTime: time[dropTimeIndex]
    });

    router.push("/explore");
  };

  const handleWarning = (text) => {
    if (!isLoggedIn) {
      toast.error(text);
    }
  }


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
      setDropTimeIndex(pickupTimeIndex + 3);
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
            // console.log(address);
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

  const handleChange = (e) => {
    setPickupLocation(e.target.value)
  }

  return (
    <div className="absolute md:top-[27rem] top-[15rem] left-[50%] translate-x-[-50%] px-8 pt-8 pb-8 flex flex-col gap-4 rounded-md bg-orange-500 shadow-lg min-w-[90%] md:min-w-[30rem]">
      <div className="flex flex-col md:flex-row md:justify-evenly md:items-center gap-2">
        <div className="w-full">
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
          >
            <StandaloneSearchBox
              onLoad={(ref) => (inputRef.current = ref)}
              onPlacesChanged={handlePlaceChange}
            >
              <input
                type="text"
                value={pickupLocation}
                onChange={handleChange}
                placeholder="Enter Pickup Location"
                ref={inputRef}
                className="pl-4 pr-2 py-4 w-full rounded-md focus:outline-none text-md"
              />
            </StandaloneSearchBox>
          </LoadScript>
          <div
            className="text-white flex gap-1 items-center font-semibold text-sm cursor-pointer py-2 hover:hover:text-slate-300 transition-all duration-300"
            onClick={handleUseMyLocation}
          >
            <MdMyLocation className="text-xl" />
            Use My Location
          </div>
        </div>
      </div>

      <div className="flex sm:flex-row flex-col gap-2 w-full">
        <div className="w-full">
          <div className="text-white font-semibold text-sm">Pickup date</div>
          <input
            type="date"
            value={pickupDate}
            onChange={handlePickupDateChange}
            min={new Date().toISOString().split("T")[0]}
            placeholder="Enter Pickup Location"
            className="pl-4 pr-2 py-4 rounded-md focus:outline-none text-md flex-1 sm:w-60 w-full"
          />
        </div>
        <div className="w-full">
          <div className="text-white font-semibold text-sm">Drop date</div>
          <input
            type="date"
            value={dropDate}
            onChange={handleDropDateChange}
            min={pickupDate || new Date().toISOString().split("T")[0]}
            placeholder="Enter Pickup Date"
            className="pl-4 pr-2 py-4 rounded-md focus:outline-none text-md flex-1 sm:w-60 w-full"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-evenly items-center gap-2">
        <div className="w-[100%]">
          <div className="text-white font-semibold text-sm">Pickup Time</div>
          <div className="bg-white rounded-md w-[100%] relative">
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
                    setDropTimeIndex(index + 3);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-[100%]">
          <div className="text-white font-semibold text-sm">Drop Time</div>
          <div className="bg-white rounded-md relative">
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
                  index > pickupTimeIndex + 3 && (
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
      <div className="flex items-center justify-center pt-5">
        <button className=" px-8 py-2 border-orange-800 bg-white rounded-md hover:bg-[#ea580c] hover:text-slate-200 hover:border-none transition-all duration-300" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default Booking;
