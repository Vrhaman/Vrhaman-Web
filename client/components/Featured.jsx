import React from "react";
import { FaLocationPinLock } from "react-icons/fa6";
import { RiMotorbikeFill, RiEBikeLine } from "react-icons/ri";
import { FaRegMoneyBill1 } from "react-icons/fa6";

const Featured = () => {
  return (
    <section className="bg-white">
      <div className="container px-6 py-10 mx-auto my-8 mb-10">
        <h1 className="text-2xl text-center mt-3 font-bold text-gray-800 capitalize lg:text-[3rem]">
          Why <span className="">BookRidez?</span>
        </h1>

        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
          <div className="p-8 space-y-3 border-2 border-orange-700 rounded-xl">
            <span className="inline-block text-blue-500">
              <FaLocationPinLock className="w-16 h-16 fill-orange-600" />
            </span>

            <h1 className="text-xl font-semibold text-gray-700 capitalize ">
              Protected Rides
            </h1>

            <p className="text-gray-500 ">
              BloomRidez ensures the safety and security of your rides,
              providing peace of mind for all passengers.
            </p>
          </div>

          <div className="p-8 space-y-3 border-2 border-orange-700 rounded-xl">
            <span className="inline-block text-blue-500">
              <RiMotorbikeFill className="w-16 h-16 fill-orange-600" />
            </span>

            <h1 className="text-xl font-semibold text-gray-700 capitalize ">
              Near Pickup Point
            </h1>

            <p className="text-gray-500">
              BloomRidez offers conveniently located pickup points, ensuring
              easy access for all users.
            </p>
          </div>

          <div className="p-8 space-y-3 border-2 border-orange-700 rounded-xl">
            <span className="inline-block text-blue-500">
              <FaRegMoneyBill1 className="w-16 h-16 fill-orange-600" />
            </span>

            <h1 className="text-xl font-semibold text-gray-700 capitalize ">
              Affordable Rides
            </h1>

            <p className="text-gray-500">
              With BloomRidez, enjoy affordable rides without compromising on
              quality or comfort.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Featured;
