"use client";

import GenerateThumbnail from "#/components/GenerateThumbnail";
import { api } from "#/convex/_generated/api";
import { Id } from "#/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { Loader } from "lucide-react";
import { useState } from "react";

const CreatePodcast = () => {
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleGenerateCode = useAction(api.openai.analyzePicture);
  const handleSaveData = useMutation(api.picture.createImages);
  async function onSubmit() {
    console.log("====================================");
    console.log("123");
    console.log("====================================");
    try {
      setIsSubmitting(true);
      if (!imageUrl) {
        setIsSubmitting(false);
        throw new Error("Please generate audio and image");
      }
      const response = await handleGenerateCode({
        imageUrl,
      });
      const payload = {
        imagesData: [
          {
            image_id: crypto.randomUUID(),
            image_url: imageUrl,
            categories: response ? response : [],
            create_time: new Date().toISOString(),
          },
        ],
      };
      console.log("====================================");
      console.log(payload, response);
      console.log("====================================");
      if (response) handleSaveData(payload);
      setIsSubmitting(false);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      setIsSubmitting(false);
    }
  }
  return (
    <section className="mt-10 pb-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Import Pictures</h1>
      <div className="flex flex-col pt-10">
        <GenerateThumbnail
          setImage={setImageUrl}
          setImageStorageId={setImageStorageId}
          image={imageUrl}
        />
        <div className="mt-10 w-full">
          <Button
            onClick={() => onSubmit()}
            className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
          >
            {isSubmitting ? (
              <>
                Submitting
                <Loader size={20} className="animate-spin ml-2" />
              </>
            ) : (
              "Submit & Publish"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CreatePodcast;
