import React from "react";

export default function ContentList({ data }) {
  return (
    <div
      className={`flex self-start  flex-col gap-y-4 max-[1100px]:flex-[1.2] flex-[0.7]`}
    >
      {data.map((item, index) => {
        return (
          <div key={index} className="flex p flex-row  gap-x-5">
            <div>
              <svg
                width="85"
                height="56"
                viewBox="0 0 103 76"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M49.8379 0.570043C71.647 0.212126 94.5708 7.42666 101.067 23.5968C107.392 39.342 92.3015 53.8451 75.1471 63.5715C57.8255 73.3927 35.2508 80.4428 17.7095 70.8596C-0.44043 60.9439 -2.55638 41.4151 4.86652 25.1756C11.6479 10.3396 29.5685 0.902692 49.8379 0.570043Z"
                  fill="black"
                />
                {item.svgFile}
              </svg>
            </div>
            <div>
              <h1 className="text-black font-semibold text-2xl">
                {item.title}
              </h1>
              <p className="text-black opacity-60 font-normal">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
