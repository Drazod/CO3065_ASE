import React from "react";

const RoomPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] md:w-[600px] flex flex-col md:flex-row overflow-hidden">
        <img
          src="/assets/service-card.png"
          alt="Service"
          className="w-full md:w-1/2 h-auto object-cover"
        />
        <div className="p-6 md:w-1/2">
            <div className="bg-gray-100 p-4 flex justify-between items-center">
                <div className="flex space-x-3">
                    <div className="w-10 h-4 rounded bg-gray-300"></div>
                    <div className="w-10 h-4 rounded bg-gray-300"></div>
                </div>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                    onClick={onClose}
                >
                    Book Now
                </button>
            </div>
            <h3 className="text-lg font-semibold mb-2">Room B4-302</h3>
            <p className="text-sm text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
            </p>
            <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default RoomPopup;
