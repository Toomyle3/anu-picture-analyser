import React from "react";
import { Avatar } from "#/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useUser } from "@clerk/clerk-react";

const UserAvatar = () => {
  const { user } = useUser();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user?.imageUrl} />
      <AvatarFallback>
        {user?.firstName}
        {user?.lastName}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
