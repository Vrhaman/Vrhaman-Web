import React from 'react'
import { IoMdLogOut } from "react-icons/io";

const Modal = ({ warningText, children }) => {
    return (
        <div
            className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 outline-none focus:outline-none bg-no-repeat bg-center bg-cover z-[9999]"
            id="modal-id">
            <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
            <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
                <div className="">
                    <div className="text-center p-5 flex-col justify-center items-center">
                        <IoMdLogOut className='w-16 h-16 text-red-700 mx-auto' />
                        <h2 className="text-xl font-bold py-4 ">Are you sure?</h2>
                        <p className="text-sm text-gray-500 px-8">{warningText}</p>
                    </div>
                    <div className="p-3  mt-2 text-center space-x-4 md:block">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
