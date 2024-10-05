"use client";

import React, { useEffect, useRef, useState } from "react";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { useFormik } from 'formik';
import * as Yup from "yup";
import * as cn from "classnames";
import { FaCircleUser } from "react-icons/fa6";
import { MdOutlineAccountCircle } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { PiSignOut } from "react-icons/pi";
import { toast } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import Loader from "@/components/Loader";
import useApiRequest from "@/hooks/useApiRequest";
import useAuth from "@/hooks/useAuth";

const libraries = ["places"];;

const Account = () => {
  const [selectedOption, setSelectedOption] = useState("profile");
  const [modal, setModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState();
  const [userData, setUserData] = useState();
  const [deleteId, setDeleteId] = useState();
  const [vehicles, setVehicles] = useState();
  const [customerProduct, setCustomerProduct] = useState();
  const [bookingData, setBookingData] = useState();
  const [customerBookingData, setCustomerBookingData] = useState();
  const [model, setModel] = useState(null);
  const [modelDropDown, setModelDropDown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loader, setLoader] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const [openAccordion, setOpenAccordion] = useState(null);
  const { data, error, sendRequest } = useApiRequest();

  const { isLoggedIn, userRole, userId } = useAuth();
  const inputRef = useRef();


  const accordionItems = [
    {
      title: "User Details",
      content: (
        <ul>
          <li>
            <span className="font-semibold text-base text-slate-400">Name: </span>
            {bookingDetails?.user?.name || 'N/A'}
          </li>
          <li>
            <span className="font-semibold text-base text-slate-400">Email: </span>
            {bookingDetails?.user?.email || 'N/A'}
          </li>
          <li>
            <span className="font-semibold text-base text-slate-400">Phone: </span>
            {bookingDetails?.user?.mobile || 'N/A'}
          </li>
        </ul>
      ),
    },
    {
      title: "Customer Details",
      content: (
        <ul>
          <li>
            <span className="font-semibold text-base text-slate-400">Customer Name: </span>
            {bookingDetails?.customer?.name || 'N/A'}
          </li>
          <li>
            <span className="font-semibold text-base text-slate-400">Customer Mobile: </span>
            {bookingDetails?.customer?.mobile || 'N/A'}
          </li>
          <li>
            <span className="font-semibold text-base text-slate-400">Customer Location: </span>
            {bookingDetails?.customer?.location || 'N/A'}
          </li>
        </ul>
      ),
    },
    {
      title: "Booking Details",
      content: (
        <ul className="flex flex-col gap-4">
          <li>
            <span className="font-semibold text-base text-slate-400">Booking ID: </span>
            {bookingDetails?.booking?._id || 'N/A'}
          </li>
          <li>
            <span className="font-semibold text-base text-slate-400">Booking Pickup: </span>
            {bookingDetails?.booking?.pickUpPoint || 'N/A'}
          </li>
          <li>
            <span className="font-semibold text-base text-slate-400">Booking Status: </span>
            {bookingDetails?.booking?.status || 'N/A'}
          </li>
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold text-base text-slate-400">Pickup Date: </span>
              {bookingDetails?.booking?.pickUpDate || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-base text-slate-400">Pickup Time: </span>
              {bookingDetails?.booking?.pickUpTime || 'N/A'}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold text-base text-slate-400">Drop Date: </span>
              {bookingDetails?.booking?.dropDate || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-base text-slate-400">Drop Time: </span>
              {bookingDetails?.booking?.dropTime || 'N/A'}
            </div>
          </div>
        </ul>
      ),
    },
  ];

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    dob: Yup.string(),
    location: Yup.string(),
    kyc: Yup.string()
      .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, "Invalid Aadhaar Number")
    ,
    dl: Yup.string()
      .matches(
        /^[A-Z]{2}[0-9]{2}[0-9A-Z]{14}$/,
        "Invalid Driving Licence Number"
      )
  });

  useEffect(() => {
    getUserData();
  }, [])

  useEffect(() => {
    getBookingHistory();
  }, [selectedOption === "booking-history"])

  useEffect(() => {
    getCustomerBookings();
  }, [selectedOption === "bookings"])

  useEffect(() => {
    formik.setValues(initialValues);
  }, [initialValues]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setSubmitting(true);
      try {
        let url = "";

        if (userRole === "Customer") {
          url = "customer/edit";
        } else {
          url = "user/edit";
        }

        const response = await sendRequest(url, {
          method: "PUT",
          body: JSON.stringify(values),
        });

        if (response.data && response.data.success) {
          toast.success("User details updated!");
          getUserData();
          setModal(false);
        } else {
          toast.error("User detail updation failed!");
          setStatus({ success: false });
        }
      } catch (error) {
        console.error("Error updating data:", error);
        toast.error("User detail updation failed!");
        setStatus({ success: false });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePlaceChange = () => {
    const places = inputRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      console.log(place.formatted_address);
      formik.setFieldValue("location", place.formatted_address);
    }
  };

  const getUserData = async () => {
    try {

      let url = "";

      if (userRole === "Customer") {
        url = "customer/get";
      } else {
        url = "user/get";
      }

      const response = await sendRequest(url, {
        method: "GET",
      });

      // console.log(response);

      if (response.data && response.data.success) {
        console.log("User details fetched");

        const data = userRole === "Customer" ? response.data.customerData : response.data.userData;

        setInitialValues({
          fullName: data?.name,
          dob: data?.dob !== "N/A" ? data?.dob : "",
          mobile: data?.mobile,
          email: data?.email,
          kyc: data?.aadhaarNo,
          dl: data?.licenceNo
        })
        setUserData(data)
      } else {
        console.log("Error in fetching user data");
      }
    } catch (error) {
      console.error("Error getting data:", error);
    }
  }

  const getBookingHistory = async () => {
    try {
      let url = "";
      let params = {};

      if (userRole === "Customer") {
        url = "customer/booking-history";
        // params.customerId = userId;
      } else {
        url = "user/booking-history";
        // params.userId = userId;
      }

      const response = await sendRequest(url, {
        method: "GET",
        // params: { status: "Booked" },
      });

      // console.log(response);

      if (response.data && response.data.success) {
        console.log("Booking data fetched");
        setBookingData(response.data.bookings)
      } else {
        console.log("Error in fetching user data");
      }
    } catch (error) {
      console.error("Error getting data:", error);
    }
  }

  const getCustomerBookings = async () => {
    try {
      const response = await sendRequest("customer/bookings", {
        method: "GET",
      });

      if (response.data && response.data.success) {
        console.log("Booking data fetched");
        console.log(response.data.bookings)
        setCustomerBookingData(response.data.bookings)
      } else {
        console.log("Error in fetching user data");
      }
    } catch (error) {
      console.error("Error getting data:", error);
    }
  }

  const searchModel = async (req, res) => {
    try {
      const response = await sendRequest('market/product/list', {
        method: "GET",
      });
      if (response.data && response.data.success) {
        console.log("models fetched");
        console.log(response.data.vehicles)
        setVehicles(response.data.vehicles);
      } else {
        console.log("Error in fetching user data");
      }
    } catch (error) {
      console.error("Error getting data:", error);
    }
  }

  const handleLogout = () => {
    sendRequest("user/logout", {
      method: "POST",
    })
      .then((response) => {
        if (response.data && response.data.success) {
          console.log("logged out successfully");
          window.location.replace("/");
        } else {
          console.log("Error in logging out");
        }
      })
      .catch((error) => {
        console.error("Error getting data:", error);
        setVehicleData([]);
      });
  };

  const addCustomerProduct = async () => {
    try {
      const response = await sendRequest('market/product/add', {
        method: "POST",
        params: { marketplaceId: model?.id }
      });
      if (response.data && response.data.success) {
        console.log("added");
        toast.success("Product added..!");
      } else {
        console.log("error in adding the product");
        toast.success("Adding product failed!");
      }
    } catch (error) {
      console.error("Error getting data:", error);
      toast.success("Error occured..!");
    }
  }

  const getCustomerProducts = async () => {
    try {
      const response = await sendRequest('market/customer/get-products', {
        method: "GET",
      });
      if (response.data && response.data.success) {
        console.log("fetched products...");
        console.log("products", response.data?.products)
        setCustomerProduct(response.data?.products)
      } else {
        console.log("error in fetching the product");
      }
    } catch (error) {
      console.error("Error getting data:", error);
    }
  }

  const deleteCustomerProduct = async () => {
    try {
      const response = await sendRequest('market/product/delete', {
        method: "DELETE",
        params: { marketplaceId: deleteId }
      });
      if (response.data && response.data.success) {
        console.log("deleted product...");
      } else {
        console.log("error in fetching the product");
        toast.success("Product Deleted..!");
      }
    } catch (error) {
      console.error("Error getting data:", error);
      toast.error("Product Deletion failed..!");
    } finally {
      getCustomerProducts()
    }
  }

  const handleBikeDelete = (id) => {
    setDeleteId(id);
    deleteCustomerProduct();
  }

  const handleBikeAddModel = () => {
    addCustomerProduct();
    getCustomerProducts();
    setAddModal(false);
  }

  const handleNav = (event) => {
    if (event.target.value == "booking-history") {
      getBookingHistory();
    }
    if (event.target.value == "market") {
      getCustomerProducts();
    }
    if (event.target.value == "bookings") {
      getCustomerBookings();
    }
    console.log(event.target.value)
    setSelectedOption(event.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openModal = () => {
    setModal(true);
  };

  const handleAddModel = () => {
    searchModel();
    setAddModal(true);
  };

  const handleCloseEditModel = () => {
    setModal(false);
    getUserData();
  }

  const toggleModelDropdown = () => {
    setModelDropDown(!modelDropDown);
  };

  const handleDetailModal = async (id) => {
    setDetailsModal(true);
    try {
      const response = await sendRequest("booking/get", {
        method: "GET",
        params: { bookingId: id },
      });

      if (response.data && response.data.success) {
        console.log("booking details fetched");
        setBookingDetails(response.data.bookingData)
      } else {
        console.log("Error in fetching user data");
      }
    } catch (error) {
      console.error("Error getting data:", error);
    }
  }

  const handleAccept = async (id) => {
    try {
      const response = await sendRequest("accept-booking", {
        method: "POST",
        params: {
          bookingId: id
        }
      });
      if (response.data && response.data.success) {
        getBookingHistory();
        setDetailsModal(false);
        toast.success("Booking Accepted!");
        console.log("Order Accepted");
      } else {
        console.log("Error in accepting booking");
        toast.error("Error in accepting!");
        setDetailsModal(false);
      }
    } catch (error) {
      toast.error("Error in accepting!");
      console.error("Error getting data:", error);
    }
  };

  return (
    <>
      {loader && <Loader />}
      {modal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <form onSubmit={formik.handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter Full Name"
                      {...formik.getFieldProps('fullName')}
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                      <div className="text-red-500 text-sm">{formik.errors.fullName}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter Email"
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-sm">{formik.errors.email}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="dob" className="block text-gray-700 text-sm font-bold mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      id="dob"
                      className={
                        `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              ${formik.touched.dob && formik.errors.dob ? 'border-red-500' : ''}`
                      }
                      placeholder="Enter Date of Birth"
                      {...formik.getFieldProps('dob')}
                    />
                    {formik.touched.dob && formik.errors.dob && (
                      <div className="text-red-500 text-sm">{formik.errors.dob}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="kyc" className="block text-gray-700 text-sm font-bold mb-2">
                      KYC (Aadhaar Number)
                    </label>
                    <input
                      type="text"
                      name="kyc"
                      id="kyc"
                      className={
                        `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              ${formik.touched.kyc && formik.errors.kyc ? 'border-red-500' : ''}`
                      }
                      placeholder="Enter Aadhaar Number"
                      {...formik.getFieldProps('kyc')}
                    />
                    {formik.touched.kyc && formik.errors.kyc && (
                      <div className="text-red-500 text-sm">{formik.errors.kyc}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="dl" className="block text-gray-700 text-sm font-bold mb-2">
                      Licence Number
                    </label>
                    <input
                      type="text"
                      name="dl"
                      id="dl"
                      className={
                        `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
              ${formik.touched.dl && formik.errors.dl ? 'border-red-500' : ''}`
                      }
                      placeholder="Enter Licence Number"
                      {...formik.getFieldProps('dl')}
                    />
                    {formik.touched.dl && formik.errors.dl && (
                      <div className="text-red-500 text-sm">{formik.errors.dl}</div>
                    )}

                    <div className="pt-4">
                      <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                        Your Location
                      </label>

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
                              name="location"
                              placeholder="Enter Your Location"
                              ref={inputRef}
                              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                            />
                          </StandaloneSearchBox>
                        </LoadScript>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={formik.isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCloseEditModel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div >
      )}

      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="max-w-[28rem] mx-auto bg-slate-200 rounded-lg shadow-md sm:p-10 p-5 py-10 w-full flex flex-col gap-3">
            <div className="bg-white rounded-md w-[100%] relative">
              <div
                className="rounded-md py-4 px-4 bg-transparent focus:outline-none flex justify-between items-center cursor-pointer w-full"
                onClick={toggleModelDropdown}
              >
                <span>{model ? model?.name : "Model"}</span>
                <span>
                  <FaAngleDown />
                </span>
              </div>
              <div
                className={`transition-all duration-300 ${modelDropDown ? "absolute" : "hidden"
                  } mt-1 bg-white rounded-b-md shadow-md z-10 w-full max-h-60 overflow-y-auto`}
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
            <div className="w-full flex gap-2">
              <button className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all duration-300"
                onClick={handleBikeAddModel}>
                Add Bike
              </button>
              <button
                className="w-full py-2 border bg-white border-orange-500 rounded-md font-medium hover:border-orange-800 transition-all duration-300"
                onClick={() => setAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {detailsModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="w-full flex justify-end items-center text-2xl font-medium p-4 cursor-pointer"
                onClick={() => setDetailsModal(false)}>
                <AiOutlineClose />
              </div>
              <div className="sm:px-8 px-1 py-5 rounded-md flex sm:gap-10 gap-4 items-center w-full">
                <div>
                  <img src={bookingDetails?.vehicle?.image || '/placeholder.jpg'} className="w-40" alt="Vehicle" />
                </div>
                <div className="sm:text-2xl text-md font-semibold">
                  {bookingDetails?.vehicle?.name || 'N/A'}
                </div>
              </div>
              <div id="accordion-collapse" data-accordion="collapse">
                {accordionItems.map((item, index) => (
                  <div key={index}>
                    <h2 id={`accordion-collapse-heading-${index + 1}`}>
                      <button
                        type="button"
                        className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200F hover:bg-gray-100 gap-3"
                        data-accordion-target={`#accordion-collapse-body-${index + 1}`}
                        aria-expanded={openAccordion === index}
                        aria-controls={`accordion-collapse-body-${index + 1}`}
                        onClick={() => toggleAccordion(index)}
                      >
                        <span>{item.title}</span>
                        <svg
                          data-accordion-icon
                          className={`w-3 h-3 ${openAccordion === index ? 'rotate-180' : ''} shrink-0`}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5 5 1 1 5"
                          />
                        </svg>
                      </button>
                    </h2>
                    <div
                      id={`accordion-collapse-body-${index + 1}`}
                      className={`${openAccordion === index ? '' : 'hidden'}`}
                      aria-labelledby={`accordion-collapse-heading-${index + 1}`}
                    >
                      <div className="p-5 border border-b-0 border-gray-200">
                        {item.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300 ${userRole === "User" && "hidden"} ${bookingDetails?.booking?.status !== "Pending" && "hidden"}`}
                  onClick={() => handleAccept(bookingDetails?.booking?._id)}
                >
                  Accept
                </button>
              </div>
              <div className={`text-orange-800 border py-3 text-center rounded-b bg-orange-200 font-semibold ${bookingDetails?.booking?.status === "Pending" && "hidden"}`}>{bookingDetails?.booking?.status}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start md:flex-row flex-col md:gap-7 gap-3 w-full md:px-[7rem] sm:px-5 px-2 py-10 md:min-h-[100vh] h-auto">
        <div className="md:w-[35%] w-full flex flex-col gap-4">
          <div className="flex bg-white border rounded-md shadow-md p-8 items-center justify-start gap-2">
            <div>
              <FaCircleUser className="text-5xl text-orange-400" />
            </div>
            <div>
              <div>Hello,</div>
              <div className="font-bold">{userData?.name}</div>
            </div>
          </div>
          <div className="flex flex-col px-6 py-7 gap-3 bg-white border rounded-md shadow-md">
            <input
              type="radio"
              className="hidden"
              id="profile"
              name="account"
              value="profile"
              checked={selectedOption === "profile"}
              onChange={handleNav}
            />
            <label
              htmlFor="profile"
              className={cn(
                "flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-2 rounded-md",
                selectedOption === "profile" && "bg-slate-200"
              )}
            >
              <div>
                <MdOutlineAccountCircle className="text-xl text-orange-500" />
              </div>
              <div>My&nbsp;Profile</div>
            </label>
            <input
              type="radio"
              className="hidden"
              id="bookings"
              name="account"
              value="bookings"
              checked={selectedOption === "bookings"}
              onChange={handleNav}
            />
            <label
              htmlFor="bookings"
              className={cn(
                "flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-2 rounded-md",
                selectedOption === "bookings" && "bg-slate-200",
                userRole === "Customer" ? "" : "hidden"
              )}
            >
              <div>
                <SlCalender className="text-xl text-orange-500" />
              </div>
              <div>Bookings</div>
            </label>
            <input
              type="radio"
              className="hidden"
              id="booking-history"
              name="account"
              value="booking-history"
              checked={selectedOption === "booking-history"}
              onChange={handleNav}
            />
            <label
              htmlFor="booking-history"
              className={cn(
                "flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-2 rounded-md",
                selectedOption === "booking-history" && "bg-slate-200"
              )}
            >
              <div>
                <SlCalender className="text-xl text-orange-500" />
              </div>
              <div>Booking&nbsp;History</div>
            </label>
            <input
              type="radio"
              className="hidden"
              id="market"
              name="market"
              value="market"
              checked={selectedOption === "market"}
              onChange={handleNav}
            />
            <label
              htmlFor="market"
              className={cn(
                "flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-2 rounded-md",
                selectedOption === "market" && "bg-slate-200",
                userRole === "Customer" ? "" : "hidden"
              )}
            >
              <div>
                <SiHomeassistantcommunitystore className="text-xl text-orange-500" />
              </div>
              <div>Market&nbsp;Place</div>
            </label>
            <input
              type="radio"
              className="hidden"
              id="singout"
              name="account"
              value="signout"
              checked={selectedOption === "signout"}
              onChange={handleLogout}
            />
            <label
              htmlFor="singout"
              className={cn(
                "flex gap-3 items-center cursor-pointer hover:bg-slate-200 p-2 rounded-md",
                selectedOption === "signout" && "bg-slate-200"
              )}
            >
              <div>
                <PiSignOut className="text-xl text-orange-500" />
              </div>
              <div>Sign&nbsp;out</div>
            </label>
          </div>
        </div>
        {selectedOption === "profile" ? (
          <div className="w-full sm:p-8 p-2 border rounded-md">
            <div className=" border-b-2 border-b-black py-3 mb-2 flex justify-between items-center cursor-pointer hover:text-orange-600 transition-all duration-300">
              <div className="font-semibold text-xl">Personal Information</div>
              <div onClick={openModal}>Edit&nbsp;Profile</div>
            </div>
            <div className="flex items-center bg-white gap-16 border-b border-b-slate-200 py-3 sm:text-normal text-sm">
              <div className="font-semibold text-slate-500">Full&nbsp;Name</div>
              <div>{userData?.name}</div>
            </div>
            <div className="flex items-center bg-white gap-7 border-b border-b-slate-200 py-3 sm:text-normal text-sm">
              <div className="font-semibold text-slate-500">
                Mobile&nbsp;Number
              </div>
              <div>{userData?.mobile}</div>
            </div>
            <div className="flex items-center bg-white gap-9 border-b border-b-slate-200 py-3 sm:text-normal text-sm break-word">
              <div className="font-semibold text-slate-500">
                Email&nbsp;Address
              </div>
              <div className="break-word">{userData?.email}</div>
            </div>
            <div className="flex items-center bg-white gap-12 border-b border-b-slate-200 py-3 sm:text-normal text-sm">
              <div className="font-semibold text-slate-500">
                Date&nbsp;of&nbsp;Birth
              </div>
              <div>{userData?.dob}</div>
            </div>
            <div className="flex items-center bg-white gap-[5.2rem] border-b border-b-slate-200 py-3 sm:text-normal text-sm">
              <div className="font-semibold text-slate-500">Gender</div>
              <div>{userData?.gender}</div>
            </div>
            <div className="flex items-center bg-white gap-[3.8rem] border-b border-b-slate-200 py-3 sm:text-normal text-sm">
              <div className="font-semibold text-slate-500">
                Kyc&nbsp;Status
              </div>
              <div>Pending</div>
            </div>
            <div className="flex items-center bg-white gap-[3.8rem] border-b border-b-slate-200 py-3 sm:text-normal text-sm">
              <div className="font-semibold text-slate-500">
                Aadhar&nbsp;No
              </div>
              <div>{userData?.aadhaarNo}</div>
            </div>
            <div className="flex items-center bg-white gap-[3.8rem] border-b border-b-slate-200 py-3 sm:text-normal text-sm">
              <div className="font-semibold text-slate-500">
                Driving&nbsp;Licence
              </div>
              <div>{userData?.licenceNo}</div>
            </div>
            <div className="flex items-center bg-white gap-[4.2rem] pt-3 sm:text-normal text-sm">
              <div className="font-semibold text-slate-500">
                Location
              </div>
              <div>{userData?.location}</div>
            </div>
          </div>
        ) : selectedOption === "booking-history" ? (
          <div className="w-full sm:p-8 p-2 border rounded-md flex flex-col gap-8">
            <div className="flex flex-wrap justify-start gap-8 items-center">
              <div className="border-1 flex gap-2 flex-col w-[14rem] p-4 py-6 rounded-md shadow-lg bg-orange-100 border-orange-200">
                <div className="text-xl">Total Rides</div>
                <div className="text-lg">{bookingData && bookingData.length}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {
                bookingData?.map((item, index) => (
                  <div className="border w-96 rounded-md p-5 flex flex-col gap-2 shadow-md" key={index}>
                    <div className="flex items-center w-full justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-500">
                          <span>Booking</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-2">
                        <span className="sm:text-sm text-xs">
                          {item?.pickUpPoint}
                        </span>
                        <span className="font-semibold text-slate-600">{item?.pickUpTime}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-slate-600">{item?.dropTime}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-orange-500 cursor-pointer underline underline-offset-2 hover:text-orange-600 transition-all duration-300" onClick={() => handleDetailModal(item?._id)}>
                          View Details
                        </span>
                        <span className="text-orange-600 border px-2 py-1 rounded-md bg-orange-100">
                          {item?.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ) : selectedOption === "bookings" && userRole === "Customer" ? (
          <div className="w-full sm:p-8 p-2 border rounded-md flex flex-col gap-8">
            <div className="flex flex-wrap justify-start gap-8 items-center">
              <div className="border-1 flex gap-2 flex-col w-[14rem] p-4 py-6 rounded-md shadow-lg bg-orange-100 border-orange-200">
                <div className="text-xl">Total Rides</div>
                <div className="text-lg">{customerBookingData && customerBookingData.length}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {
                customerBookingData?.map((item, index) => (
                  <div className="border w-96 rounded-md p-5 flex flex-col gap-2 shadow-md" key={index}>
                    <div className="flex items-center w-full justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-500">
                          <span>Bookings</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-2">
                        <span className="sm:text-sm text-xs">
                          {item?.pickUpPoint}
                        </span>
                        <span className="font-semibold text-slate-600">{item?.pickUpTime}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-slate-600">{item?.dropTime}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-orange-500 cursor-pointer underline underline-offset-2 hover:text-orange-600 transition-all duration-300" onClick={() => handleDetailModal(item?._id)}>
                          View Details
                        </span>
                        <span className="text-orange-600 border px-2 py-1 rounded-md bg-orange-100">
                          {item?.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ) : selectedOption === "market" && userRole === "Customer" ? (
          <div className="w-full flex flex-col gap-3 items-end">
            <div>
              <button
                className="w-full flex gap-1 items-center bg-orange-400 px-4 py-2 rounded-md text-white hover:bg-orange-500 transition-all duration-300"
                onClick={handleAddModel}
              >
                <IoIosAddCircleOutline className="font-bold text-xl" />
                Add a Bike
              </button>
            </div>
            <div className="w-full flex flex-col gap-3 sm:px-8 sm:py-4 p-2 border rounded-md shadow-md">

              {customerProduct &&
                customerProduct?.map((item, index) => (
                  <div className="w-full flex sm:flex-row flex-col justify-between items-center border-b border-b-slate-400 py-4" key={index}>
                    <div className="sm:w-[30%] w-full">
                      <img
                        src={item?.image}
                        alt="image"
                        className="w-[12rem]"
                      />
                    </div>
                    <div className="sm:w-[30%] w-full sm:text-xl text-lg font-semibold sm:py-0 py-4">
                      {item?.name}
                    </div>
                    <div className="sm:w-[40%] w-full flex gap-2 items-start">
                      <div className="flex sm:flex-col sm:flex-nowrap flex-wrap flex-row sm:gap-1 gap-2 w-full">
                        <div className="flex gap-6 items-center">
                          <span className="text-slate-500 font-medium">
                            Speed&nbsp;Limit
                          </span>
                          <span>{item?.speedLimit}</span>
                        </div>
                        <div className="flex gap-9 items-center">
                          <span className="text-slate-500 font-medium">
                            Category
                          </span>
                          <span>{item?.category}</span>
                        </div>
                        <div className="flex gap-16 items-center">
                          <span className="text-slate-500 font-medium">Mileage</span>
                          <span>{item?.mileage}</span>
                        </div>
                        <div className="flex gap-10 items-center">
                          <span className="text-slate-500 font-medium">
                            Fuel&nbsp;Type
                          </span>
                          <span>{item?.fuelType}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 items-start">
                        <span onClick={() => handleBikeDelete(item?._id)}>
                          <MdDelete className="text-xl text-orange-500 cursor-pointer" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ) : (
          <div>Sign out</div>
        )}
      </div>
    </>
  );
};

export default Account;
