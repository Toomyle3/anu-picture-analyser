import LeftSidebar from "#/components/LeftSidebar";
import MobileNav from "#/components/MobileNav";
import MobileNavRight from "#/components/MobileNavRight";
import PodcastPlayer from "#/components/PodcastPlayer";
import { Toaster } from "#/components/ui/toaster";
import UsersInfo from "#/components/UsersInfo";
import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      <main className="relative flex bg-black-3 pb-20 sm:pb-0">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-4 md:px-14 overflow-auto">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            <div
              className=" bg-black-3 flex h-16 
            items-center justify-between md:justify-end"
            >
              <div className="md:hidden">
                <MobileNav />
              </div>
              <Link href="/" className="flex cursor-pointer md:hidden">
                <Image
                  src="/icons/logo.png"
                  alt="logo"
                  width={40}
                  height={40}
                />
              </Link>
              <div className="flex items-center gap-1">
                <UsersInfo />
              </div>
            </div>
            <div className="flex flex-col mt-8 md:pb-14">
              <Toaster />
              {children}
            </div>
          </div>
        </section>
      </main>

      <PodcastPlayer />
    </div>
  );
}
