import React from "react";

const Output = ({ output }) => {
  return (
    <div className="mt-6 w-full max-w-md">
      <div className="bg-green-900 text-green-100 p-4 rounded-xl shadow-md border border-green-700">
        <p className="text-center font-medium">
          {output || "Scan a product to see result"}
        </p>
      </div>
    </div>
  );
};

export default Output;