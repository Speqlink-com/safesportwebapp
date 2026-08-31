import Image from "next/image";
import React from "react";

export default function Logo({ iconOnly }: { iconOnly?: boolean }) {
  return (
    <div className="flex justify-center items-center gap-1 w-max">
      <Image
        src={"/android-chrome-512x512.png"}
        width={30}
        height={30}
        alt="Safesport logo"
      />
      <div
        className={`${iconOnly && "hidden"} font-extrabold text-xl text-primary`}
      >
        Safe<span className="text-foreground">Sport™</span>
      </div>
    </div>
  );
}
