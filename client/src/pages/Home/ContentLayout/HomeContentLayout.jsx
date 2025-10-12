import React from "react";

export default function HomeContentLayout({ children, properties = "" }) {
  return (
    <div
      className={`relative flex flex-col mt-20 justify-between gap-10 items-center flex-wrap lg:flex-row ${properties}`}
    >
      {children}
    </div>
  );
}
