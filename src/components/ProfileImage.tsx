import React from "react";
import Image from "next/image";
import { VscAccount } from "react-icons/vsc";
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
type ProfileImageProps = {
  src?: string | null;
  name: string | null;
  className?: string;
};

export default function ProfileImage({
  src,
  name,
  className = "",
}: ProfileImageProps) {
  return (
    <div>
      <div
        className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
      >
        {name == null ? (
          <VscAccount className="h-full w-full" />
        ) : (
          <Avatar
            name={name}
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
