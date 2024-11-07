"use client";
import EmptyState from "#/components/EmptyState";
import { api } from "#/convex/_generated/api";
import { Id } from "#/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
const PictureDetails = ({
  params: { image_id },
}: {
  params: { image_id: Id<"imagesData"> };
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const image = useQuery(api.picture.getPictureByIdCategorized, { image_id });
  const handleDeletePicture = useMutation(
    api.picture.deleteImageByIdCategorized
  );
  const user = useQuery(api.users.getUserById, { id: image?.user! });

  if (!image)
    return (
      <EmptyState
        title="Picture not found"
        buttonLink="/"
        buttonText="Go Back"
      />
    );
  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await handleDeletePicture({ imageId: image?._id });
      setIsLoading(false);

      router.push("/categorized");
    } catch (error) {
      console.error(error);
      alert("Failed to delete picture. Please try again later.");
    }
  };

  return (
    <section className="flex w-full flex-col">
      <header className="flex items-center justify-between pb-10">
        <h1 className="text-20 font-bold text-white-1">Current Picture</h1>
      </header>
      <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
        <Image
          src={image?.image_url}
          width={300}
          height={300}
          alt="headphone"
        />
        <div className="flex-col flex gap-2">
          <Button
            onClick={() => handleDelete()}
            disabled={isLoading}
            className="text-16 hover:bg-black-1
            w-full bg-gray-500 font-extrabold 
            text-[#ffffff] transition-all w-[200px]
            duration-500"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin ml-2" />
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
      <div className="text-white-1 font-bold text-[20px] pt-10 flex flex-col justify-center items-center">
        Picture Information:
        <p className="text-14 text-white-1 pt-4">Categories:</p>
        <p className="text-14 text-white-1 pt-4">
          {image?.categories.join(" ")}
        </p>
        <p className="text-14 text-white-1 pt-4">Create at:</p>
        <p className="text-14 text-white-1 pt-4">{image?.create_time}</p>
        <p className="text-14 text-white-1 pt-4">Create by:</p>
        <p className="text-14 text-white-1 pt-4">
          {user?.name.toUpperCase() + " "} - {user?.email}
        </p>
        <p className="text-14 text-white-1 pt-4">Image Id:</p>
        <p className="text-14 text-white-1 pt-4">{image?.image_id}</p>
      </div>
    </section>
  );
};

export default PictureDetails;
