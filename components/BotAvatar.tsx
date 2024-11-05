import { Avatar } from "#/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

const BotAvatar = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage className="p-1" src="/icons/logo.png" />
    </Avatar>
  );
};

export default BotAvatar;
