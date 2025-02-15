import React from "react";

export default function TitleLeft({ title, subTitle }) {
  return (
    <div>
      <p className="text-2xl sm:text-3xl my-1">{title}</p>
      <p className="text-sm">{subTitle}</p>
    </div>
  );
}
