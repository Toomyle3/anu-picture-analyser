"use client";
import GenerateThumbnail from "#/components/GenerateThumbnail";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { api } from "#/convex/_generated/api";
import { Id } from "#/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import classNames from "classnames";
import { useMutation } from "convex/react";
import { Loader } from "lucide-react";
import { useState } from "react";

const CreatePodcast = () => {
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [storageIds, setStorageIds] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    imageUrl || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSaveData = useMutation(api.picture.createImages);
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  async function onSubmit() {
    try {
      setIsSubmitting(true);
      const startTime = Date.now();
      if (!imageUrl) {
        setIsSubmitting(false);
        throw new Error("Please generate audio and image");
      }
      if (imageUrl.length > 0) {
        const savePromises = imageUrl.map(async (url) => {
          const payload = {
            imagesData: [
              {
                image_id: crypto.randomUUID(),
                image_url: url,
                create_time: new Date().toISOString(),
              },
            ],
          };
          return handleSaveData(payload);
        });
        await Promise.all(savePromises);
      }
      const operationTime = Date.now() - startTime;
      if (operationTime < 2000) {
        await delay(2000 - operationTime);
      }
      setShowSuccessDialog(true);
      clearAllImages();
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
  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false);
    clearAllImages();
  };
  return (
    <section className="mt-10 pb-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Import Pictures</h1>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent
          className="fixed top-1/3 flex justify-center flex-col h-[200px]
        border-none bg-gray-600 text-white-1"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              Your images have been saved successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessConfirm}>
              <Button
                className="text-16 hover:bg-black-1
            w-full bg-gray-500 font-extrabold 
            text-[#ffffff] transition-all 
            duration-500"
              >
                Continue
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
            disabled={isSubmitting || uploadedImages.length === 0}
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
