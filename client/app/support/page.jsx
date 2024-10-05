import React from "react";

const Support = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="py-5 bg-black font-bold text-orange-400 w-full text-center text-3xl">
        Contact Us
      </div>
      <div className="sm:py-20 py-6 sm:pb-32 pb-10 sm:px-0 px-6 flex md:flex-row flex-col justify-center items-center gap-10 w-full">
        <div className="flex flex-col gap-4 sm:w-96 w-full">
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-bold">You can find us here</h3>
            <h5 className="text-sm text-slate-500 font-medium pl-1">
              Find help for the queries here:
            </h5>
          </div>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full bg-slate-200 focus:outline-none border px-2 py-4 border-slate-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Enter your Email Address"
              className="w-full bg-slate-200 focus:outline-none border px-2 py-4 border-slate-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Enter your Mobile Number"
              className="w-full bg-slate-200 focus:outline-none border px-2 py-4 border-slate-300 rounded-md"
            />
            <textarea
              type="text"
              placeholder="Enter your query"
              cols="20"
              className="w-full bg-slate-200 focus:outline-none border px-2 py-4 border-slate-300 rounded-md"
            />
          </div>
          <div>
            <button className="w-full px-5 py-2 bg-orange-500 text-white rounded-md">
              Submit
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:w-96 w-full gap-4">
          <div className="text-md font-semibold">Office Address</div>
          <div className="text-sm font-medium text-slate-500">
            Roppen Transportation Services Pvt Ltd, 3rd Floor, Sai Prithvi
            Arcade, Megha Hills, Sri Rama Colony, Madhapur, Hyderabad - 500081.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
