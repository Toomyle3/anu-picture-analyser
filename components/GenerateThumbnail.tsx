import { api } from "#/convex/_generated/api";
import { Id } from "#/convex/_generated/dataModel";
import { GenerateThumbnailProps } from "#/types";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useMutation } from "convex/react";
import { Loader, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Input } from "./ui/input";

const GenerateThumbnail = ({
  setImageUrl,
  setImageStorageId,
  setUploadedImages,
  setStorageIds,
  storageIds,
  uploadedImages,
}: GenerateThumbnailProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.picture.getUrl);
  const handleImages = async (blobs: Blob[], fileNames: string[]) => {
    setIsImageLoading(true);
    try {
      const files = blobs.map(
        (blob, index) =>
          new File([blob], fileNames[index], { type: "image/png" })
      );
      const uploaded = await startUpload(files);
      const newStorageIds = uploaded
        .map((file) => (file.response as { storageId?: string })?.storageId)
        .filter((id): id is string => id !== undefined);
      const updatedStorageIds = [...storageIds, ...newStorageIds];
      setStorageIds(updatedStorageIds);
      setImageStorageId(updatedStorageIds[0] as any);

      const imageUrls = await Promise.all(
        newStorageIds.map((storageId) =>
          getImageUrl({ storageId: storageId as Id<"_storage"> })
        )
      );
      const updatedImages = [...uploadedImages, ...imageUrls];
      setImageUrl(updatedImages as string[]);
      setUploadedImages(updatedImages as string[]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;

      const blobs = await Promise.all(
        Array.from(files).map((file) =>
          file.arrayBuffer().then((ab) => new Blob([ab]))
        )
      );
      const fileNames = Array.from(files).map((file) => file.name);

      handleImages(blobs, fileNames);
    } catch (error) {
      console.log(error);
    }
  };

  const clearImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newStorageIds = storageIds.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setStorageIds(newStorageIds);
    setImageUrl(newImages);
    setImageStorageId(newStorageIds[0] as any);
  };

  const renderUploadArea = () => {
    if (isImageLoading) {
      return (
        <div className="text-16 flex-center font-medium text-white-1">
          Uploading
          <Loader size={20} className="animate-spin ml-2" />
        </div>
      );
    }

    return (
      <>
        <Image
          src="/icons/upload-image.svg"
          width={40}
          height={40}
          className="pt-4"
          alt="upload"
        />
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-12 font-bold text-orange-1">
            {uploadedImages.length > 0
              ? "Click to add more"
              : "Click to upload"}
          </h2>
          <p className="text-12 font-normal text-gray-1">
            SVG, PNG, JPG, or GIF (up to 20 images, max. 1080x1080px each)
          </p>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="image_div" onClick={() => imageRef?.current?.click()}>
        <Input
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={(e) => uploadImages(e)}
          multiple
        />
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-5">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  src={url}
                  width={150}
                  height={150}
                  className="thumbnail-preview object-cover rounded-lg"
                  alt={`thumbnail-${index}`}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage(index);
                  }}
                  className="absolute -top-2 -right-3 bg-red-500 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        {renderUploadArea()}
      </div>
    </div>
  );
};

export default GenerateThumbnail;
