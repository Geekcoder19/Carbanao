import React from "react";

export default function AnimButton({ text, properties, onClick }) {
  return (
    <button
      onClick={onClick ? onClick : undefined} // ✅ only works if provided
      className={`${properties} text-white
        relative
        rounded-sm
        z-50
        cursor-pointer
        duration-300
        before:absolute
        before:-z-10
        hover:-translate-y-2
        hover:translate-x-2
        before:h-full before:w-0
        hover:before:w-full
        hover:before:transition-all
        hover:before:duration-300
        before:-left-3
        before:rounded-s-sm
        before:-bottom-2
        before:bg-black 
        before:opacity-30
        w-fit font-normal leading-6 p-2`}
    >
      {text}
    </button>
  );
}
