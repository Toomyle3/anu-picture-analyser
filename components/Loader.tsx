import React from "react";

const Loader = ({ content }: { content: string }) => {
  return (
    <div
      className="
      h-[130px]
      mb-[1rem]
      rounded
     bg-gray-300 
     flex 
     flex-col
     gap-y-4 items-center 
     justify-center"
    >
      <div className="loader-container">
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <p className="text-sm text-styles">{content}</p>
    </div>
  );
};

export default Loader;
