"use client";
import EmptyState from "#/components/EmptyState";
import Loader from "#/components/Loader";
import { Button } from "#/components/ui/button";
import { api } from "#/convex/_generated/api";
import download from "#/public/icons/download.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useMutation } from "convex/react";
import { Music, VideoIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardFooter } from "./ui/card";
import Heading from "./ui/heading";

const formSchema = z.object({
  promptMusic: z.string(),
});

const VideoGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createVideo = useMutation(api.videos.createVideo);
  const router = useRouter();
  const [video, setVideo] = useState<any>();
  const handleGenerateVideo = useAction(api.music.generateVideoAction);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptMusic: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setVideo("");
      setIsLoading(true);
      const response = await handleGenerateVideo({
        prompt: data.promptMusic,
      });
      setVideo(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error generating music:", error);
    }
  }

  const handleDownload = async () => {
    if (!video) {
      console.error("No music URL available to download");
      return;
    }

    try {
      const response = await fetch(video);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tommy_music.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the audio file:", error);
    }
  };

  const handleSubmitAudio = async () => {
    try {
      setIsSubmitting(true);
      await createVideo({
        videoDescription: form?.getValues("promptMusic"),
        videoUrl: video!.toString(),
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
          title="Video Generation"
          desc="Turn your prompt into video"
          icon={VideoIcon}
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
                  name="promptMusic"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2.5 w-full">
                      <FormControl>
                        <Input
                          className="border-none"
                          placeholder="Prompt to video"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-white-1" />
                    </FormItem>
                  )}
                />
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
      </div>
      <div className="pt-[1rem]">
        {isLoading && <Loader content="Tommy is acting..." />}
        {!video && !isLoading && <EmptyState title="No Video generated." />}
        {video && (
          <Card
            className="flex flex-col 
          justify-center items-center
          bg-orange-1
          min-h-[250px]

          gap-10
          "
          >
            <video controls className="w-full aspect-video rounded border">
              <source src={video} />
            </video>
            <CardFooter className="flex justify-center flex-col sm:flex-row gap-2">
              <Button
                onClick={handleDownload}
                className="text-16 
              flex
              gap-2 h-[40px]
              items-center
              min-w-[120px]
              w-full
               bg-gray-800 py-4 
                text-white-1 
               transition-all duration-500 hover:bg-black-1"
              >
                <Image src={download} width={20} height={20} alt="thumbnail" />
                Download
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={handleSubmitAudio}
                className="text-16 
              flex
              gap-2 h-[40px]
              items-center
              min-w-[120px]
              w-full 
              sm:w-[150px]
               bg-gray-800 py-4 
                text-white-1 
               transition-all duration-500 hover:bg-black-1"
              >
                {isSubmitting ? "Publicising" : "Public Video"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </section>
  );
};

export default VideoGeneration;
