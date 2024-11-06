"use client";
import { useQuery } from "convex/react";
import LoaderSpinner from "#/components/LoaderSpinner";
import ProfileCard from "#/components/ProfileCard";
import { api } from "#/convex/_generated/api";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId,
  });

  if (!user) return <LoaderSpinner />;

  return (
    <section className="flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        User Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          createTime={user._creationTime}
          email={user?.email}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
    </section>
  );
};

export default ProfilePage;
