import React from "react";
import Image from "next/image";
import { VscAccount } from "react-icons/vsc";
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'

type ProfileImageProps = {
  src?: string | null;
  className?: string;
};

export default function ProfileImage({
  src,
  className = "",
}: ProfileImageProps) {
  // Append a timestamp to the image URL
  const imageUrl = src ? `${src}?timestamp=${new Date().getTime()}` : null;
  return (
    <div className="flex flex-col">
      <div
        className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
      >
        {imageUrl == null ? (
          <VscAccount className="h-full w-full" />
        ) : (
          <Image
            src={imageUrl}
            alt="Profile Image"
            quality={100}
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
    </div>
  );
}