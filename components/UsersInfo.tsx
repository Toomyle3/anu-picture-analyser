"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";

const UsersInfo = () => {
  const { user } = useUser();
  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-10 h-10",
      userButtonPopoverCard: "bg-white!important",
      userButtonPopoverActionButton: "text-white",
    },
  };
  return (
    <SignedIn>
      <UserButton appearance={userButtonAppearance} />
      <div className="flex pl-1 font-serif w-full items-center justify-between">
        <h1
          className="text-14
          text-[#ffffff]
          font-[600] truncate"
        >
          {user?.firstName?.toUpperCase() + " "}
          {user?.lastName?.toUpperCase()}
        </h1>
      </div>
    </SignedIn>
  );
};

export default UsersInfo;
