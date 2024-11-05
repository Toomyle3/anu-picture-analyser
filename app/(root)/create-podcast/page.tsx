"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import GenerateThumbnail from "#/components/GenerateThumbnail";
import { useToast } from "#/components/ui/use-toast";
import { api } from "#/convex/_generated/api";
import { Id } from "#/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAction } from "convex/react";
import { Loader } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  imageUrl: z.string().min(2),
});

const CreatePodcast = () => {
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleGenerateCode = useAction(api.openai.analyzePicture);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
    },
  });

  async function onSubmit() {
    try {
      setIsSubmitting(true);
      if (!imageUrl) {
        setIsSubmitting(false);
        throw new Error("Please generate audio and image");
      }
      console.log(imageUrl);
      const response = await handleGenerateCode({
        imageUrl,
      });
      setIsSubmitting(false);
    } catch (error) {
      console.log("12322222");
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
          imagePrompt={imagePrompt}
          setImagePrompt={setImagePrompt}
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
