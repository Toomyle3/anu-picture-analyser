"use client";

import { sidebarLinks } from "#/constants";
import { cn } from "#/lib/utils";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAudio } from "../app/provider/AudioProvider";
import "./index.css";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { audio } = useAudio();

  return (
    <section
      className={cn("left_sidebar h-[calc(100vh-5px)]", {
        "h-[calc(100vh-140px)]": audio?.audioUrl,
      })}
    >
      <div className="flex w-full flex-col gap-10">
        <Link
          href="/"
          className="flex cursor-pointer items-center justify-start gap-5 pl-[17px]"
        >
          <div
            className="flex justify-center items-center"
            style={{
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              backgroundColor: "white",
            }}
          >
            <Image src="/icons/logo.png" alt="logo" width={40} height={40} />
          </div>
          <h3 className="text-20 font-extrabold text-white">ANU Picture Analyser</h3>
        </Link>
        <nav className="nav-scroll flex flex-col gap-6 items-start overflow-auto max-h-[600px]">
          {sidebarLinks.map(({ route, label, imgURL }) => {
            const isActive =
              pathname === route || pathname.startsWith(`${route}/`);
            const finalRoute =
              route === "/profile" ? `/profile/${user?.id}` : route;

            return (
              <Link
                href={finalRoute}
                key={label}
                className={cn(
                  "flex w-full justify-start gap-3 items-start py-4 max-lg:px-4",
                  {
                    "bg-nav-focus border-r-4 border-orange-1": isActive,
                  }
                )}
              >
                <Image src={imgURL} alt={label} width={20} height={20} />
                <p className="text-sm">{label}</p>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
};

export default LeftSidebar;
