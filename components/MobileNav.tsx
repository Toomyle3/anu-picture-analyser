"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "#/components/ui/sheet";
import { sidebarLinks } from "#/constants";
import { cn } from "#/lib/utils";
import { SignedIn, useClerk, useUser } from "@clerk/clerk-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import "./index.css";

const MobileNav = () => {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const router = useRouter();
  const { user } = useUser();

  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetTitle></SheetTitle>
        <SheetContent
          side="left"
          className="border-none bg-black-1 max-w-[250px] overflow-auto"
        >
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-1 pb-10 pl-4"
          >
            <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
            <h3 className="text-20 font-extrabold text-white-1 ml-2">
              Tommy AI
            </h3>
          </Link>
          <div className="flex flex-col justify-between gap-[40px]">
            <SheetClose asChild>
              <nav className="nav-scroll flex flex-col max-h-[500px] overflow-auto gap-6 text-white-1">
                {sidebarLinks.map(({ route, label, imgURL }) => {
                  const isActive =
                    pathname === route || pathname.startsWith(`${route}/`);
                  const finalRoute =
                    route === "/profile" ? `/profile/${user?.id}` : route;
                  return (
                    <SheetClose asChild key={finalRoute}>
                      <Link
                        href={finalRoute}
                        className={cn(
                          "flex gap-3 items-center py-4 max-lg:px-4 justify-start",
                          {
                            "bg-nav-focus border-r-4 border-orange-1": isActive,
                          }
                        )}
                      >
                        <Image
                          src={imgURL}
                          alt={label}
                          width={20}
                          height={20}
                        />
                        <p className="text-sm">{label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetClose>
            <SignedIn>
              <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
                <Button
                  className="text-16 w-full bg-orange-1 font-extrabold logout-btn"
                  onClick={() => signOut(() => router.push("/sign-in"))}
                >
                  Log Out
                </Button>
              </div>
            </SignedIn>
          </div>
        </SheetContent>
        <SheetDescription></SheetDescription>
      </Sheet>
    </section>
  );
};

export default MobileNav;
