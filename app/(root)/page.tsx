"use client";
import GenerateThumbnail from "#/components/GenerateThumbnail";
import { api } from "#/convex/_generated/api";
import { Id } from "#/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import classNames from "classnames";
import { useAction, useMutation } from "convex/react";
import { Loader } from "lucide-react";
import { useState } from "react";

const CreatePodcast = () => {
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [storageIds, setStorageIds] = useState<string[]>([]);

  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    imageUrl || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleGenerateCode = useAction(api.openai.analyzePicture);
  const handleSaveData = useMutation(api.picture.createImages);
  async function onSubmit() {
    try {
      setIsSubmitting(true);
      if (!imageUrl) {
        setIsSubmitting(false);
        throw new Error("Please generate audio and image");
      }
      if (imageUrl.length > 0) {
        imageUrl.forEach(async (url) => {
          const payload = {
            imagesData: [
              {
                image_id: crypto.randomUUID(),
                image_url: url,
                create_time: new Date().toISOString(),
              },
            ],
          };
          await handleSaveData(payload);
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  }
  const clearAllImages = () => {
    setUploadedImages([]);
    setStorageIds([]);
    setImageUrl([]);
    setImageStorageId(undefined as any);
  };
  return (
    <section className="mt-10 pb-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Import Pictures</h1>
      <div className="flex flex-col pt-10">
        <GenerateThumbnail
          uploadedImages={uploadedImages}
          setImageUrl={setImageUrl}
          setImageStorageId={setImageStorageId}
          setUploadedImages={setUploadedImages}
          setStorageIds={setStorageIds}
          storageIds={storageIds}
        />
        <div className="mt-10 w-full justify-between flex gap-2">
          <Button
            onClick={() => onSubmit()}
            disabled={isSubmitting}
            className={classNames(
              "text-16 w-full bg-orange-1 font-extrabold text-white-1 transition-all duration-500",
              {
                "hover:bg-black-1": !isSubmitting,
              }
            )}
          >
            {isSubmitting ? (
              <>
                Submitting
                <Loader size={20} className="animate-spin ml-2" />
              </>
            ) : (
              "Import Images"
            )}
          </Button>
          <Button
            className="text-16 hover:bg-black-1
            w-full bg-gray-500 font-extrabold 
            text-[#ffffff] transition-all 
            duration-500"
            disabled={uploadedImages.length === 0}
            onClick={(e) => {
              e.stopPropagation();
              clearAllImages();
            }}
          >
            Clear All
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CreatePodcast;
