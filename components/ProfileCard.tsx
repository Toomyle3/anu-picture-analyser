"use client";
import Image from "next/image";
import { ProfileCardProps } from "#/types";
import LoaderSpinner from "./LoaderSpinner";
const ProfileCard = ({
  imageUrl,
  userFirstName,
  email,
  createTime,
}: ProfileCardProps) => {
  const formattedDate = new Date(createTime).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "2-digit",
  });
  if (!imageUrl) return <LoaderSpinner />;
  return (
    <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
      <Image
        src={imageUrl}
        width={250}
        height={250}
        alt="Podcaster"
        className="aspect-square rounded-lg"
      />
      <div className="flex flex-col justify-center max-md:items-center">
        <div className="flex flex-col gap-2.5">
          <figure className="flex gap-2 max-md:justify-center">
            <Image
              src="/icons/verified.svg"
              width={15}
              height={15}
              alt="verified"
            />
            <h2 className="text-14 font-medium text-white-2">
              Verified ANU User
            </h2>
          </figure>
          <h1
            className="text-[25px] 
          flex justify-center
          font-serif tracking-[-0.32px]
           text-white-1"
          >
            {userFirstName.toUpperCase()}
          </h1>
          <h1 className="text-[25px] flex justify-center font-serif tracking-[-0.32px] text-white-1">
            {email}
          </h1>
          <h1 className="text-[20px] flex justify-center font-serif tracking-[-0.32px] text-white-1">
            Join the system since: {formattedDate}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
