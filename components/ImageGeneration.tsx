"use client";
import { Button } from "#/components/ui/button";
import { imageOptions, imageResolutionOptions } from "#/constants";
import { api } from "#/convex/_generated/api";
import { Id } from "#/convex/_generated/dataModel";
import { cn } from "#/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useAction, useMutation } from "convex/react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import Heading from "./ui/heading";
import download from "#/public/icons/download.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Loader from "./Loader";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  imagePrompt: z.string(),
});

const ImageGeneration = () => {
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createImage = useMutation(api.images.createImage);
  const router = useRouter();
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);
  const handleImagesAction = useAction(api.openai.generateImagesAction);
  const [isLoading, setIsLoading] = useState(false);
  const [resolution, setResolution] = useState("1024x1024");
  const [quality, setQuality] = useState("standard");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imagePrompt: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await handleImagesAction({
        prompt: data.imagePrompt,
        resolution: resolution,
        quality: quality,
      });
      const blob = new Blob([response], { type: "image/png" });
      handleImage(blob, `thumbnail-${uuidv4()}`);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const handleImage = async (blob: Blob, fileName: string) => {
    setImage("");

    try {
      const file = new File([blob], fileName, { type: "image/png" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadPicture = async () => {
    if (!image) {
      console.error("No image URL available to download");
      return;
    }

    const response = await fetch(image);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tommy_art.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleSubmitPicture = async () => {
    try {
      setIsSubmitting(true);
      await createImage({
        imageDescription: form?.getValues("imagePrompt"),
        imageUrl: image,
        imageStorageId: imageStorageId!,
        views: 0,
      });
      setIsSubmitting(false);
      router.push("/");
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <div className="flex gap-5">
        <Heading
          title="Image Generation"
          desc="Our most advanced Image Generation model"
          icon={ImageIcon}
          iconColor="text-white-1"
          bgColor="bg-orange-1"
        />
      </div>
      <div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-12 flex w-full flex-col"
            >
              <div className="border rounded flex flex-col items-center sm:flex-row gap-2 bg-white-1 border-1 border-[#ffffff] p-8">
                <FormField
                  control={form.control}
                  name="imagePrompt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2.5 w-full">
                      <FormControl>
                        <Input
                          className="border-none"
                          placeholder="Input your prompt to get the image!"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-white-1" />
                    </FormItem>
                  )}
                />
                <Select
                  value={quality}
                  onValueChange={(value) => setQuality(value)}
                >
                  <SelectTrigger
                    className={cn(
                      "text-16 max-w-[130px] border bg-white-1 text-gray-1 focus-visible:ring-offset-orange-1"
                    )}
                  >
                    <SelectValue
                      placeholder="Select Amount"
                      className="placeholder:text-gray-1 "
                    />
                  </SelectTrigger>
                  <SelectContent className="text-16 border bg-white-1 text-black-1 focus:ring-orange-1">
                    {imageOptions?.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="capitalize focus:bg-orange-1 cursor-pointer"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={resolution}
                  onValueChange={(value) => setResolution(value)}
                >
                  <SelectTrigger
                    className={cn(
                      "text-16 max-w-[120px] border bg-white-1 text-gray-1 focus-visible:ring-offset-orange-1"
                    )}
                  >
                    <SelectValue
                      placeholder="Select Resolutions"
                      className="placeholder:text-gray-1 "
                    />
                  </SelectTrigger>
                  <SelectContent className="text-16 border bg-white-1 text-black-1 focus:ring-orange-1">
                    {imageResolutionOptions?.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="capitalize focus:bg-orange-1 cursor-pointer"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  className="text-16 w-full sm:w-[100px] bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
                >
                  generate
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="pt-[1rem]">
          {isLoading && <Loader content="Tommy is drawing..." />}
          {image && (
            <div className="flex-center w-full">
              <Card>
                <CardContent>
                  <Image
                    src={image}
                    width={400}
                    height={400}
                    className="mt-5"
                    alt="thumbnail"
                  />
                </CardContent>
                <CardFooter className="flex justify-center gap-2 flex-col sm:flex-row">
                  <Button
                    onClick={handleDownloadPicture}
                    className="text-16 
                  flex
                  gap-2 h-[40px]
                  items-center
                  w-full 
                  sm:w-[150px]
                   bg-orange-1 py-4 
                    text-white-1 
                   transition-all duration-500 hover:bg-black-1"
                  >
                    <Image
                      src={download}
                      width={20}
                      height={20}
                      alt="thumbnail"
                    />
                    Download
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    onClick={handleSubmitPicture}
                    className="text-16 
                  flex
                  gap-2 h-[40px]
                  items-center
                  w-full 
                  sm:w-[150px]
                   bg-orange-1 py-4 
                    text-white-1 
                   transition-all duration-500 hover:bg-black-1"
                  >
                    {isSubmitting ? "Publicising" : "Public Image"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageGeneration;
