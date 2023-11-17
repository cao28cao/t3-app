import React from "react";
import Image from "next/image";
import { VscAccount } from "react-icons/vsc";
type ProfileImageProps = {
  src?: string | null;
  className?: string;
};

export default function ProfileImage({
  src,
  className = "",
}: ProfileImageProps) {
  return (
    <div>
      {/* {src} */}
      <div
        className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
      >
        {src == null ? (
          <VscAccount className="h-full w-full" />
        ) : (
          <Image
            src={src}
            alt="Profile Image"
            layout="fill"
          />
        )}
      </div>
    </div>
  );
}
