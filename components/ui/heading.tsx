import { cn } from "#/lib/utils";
import { Icon, LucideIcon } from "lucide-react";
import React from "react";

interface HeadingProps {
  title: string;
  desc: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}
const Heading = ({
  title,
  desc,
  icon: Icon,
  iconColor,
  bgColor,
}: HeadingProps) => {
  return (
    <div className="flex items-center gap-x-3">
      <div className={cn("p-2 w-fit rounded-md ", bgColor)}>
        <Icon className={cn("w-10 h-10", iconColor)} />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white-1">{title}</h2>
        <p className="text-sm text-white-1">{desc}</p>
      </div>
    </div>
  );
};

export default Heading;
