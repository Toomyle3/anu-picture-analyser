import { useToast } from "#/components/ui/use-toast";
import { api } from "#/convex/_generated/api";
import { cn } from "#/lib/utils";
import { GeneratePodcastProps } from "#/types";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useAction, useMutation } from "convex/react";
import { Loader } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const getAudioUrl = useMutation(api.podcasts.getUrl);
  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("");

    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setIsGenerating(false);
    } catch (error) {
      console.log("Error generating podcast", error);
      setIsGenerating(false);
    }
  };

  return { isGenerating, generatePodcast };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [generatingContent, isGeneratingContent] = useState(false);
  const [promptsContext, setPromptsContext] = useState("");
  const handleGenerateContent = useAction(api.openai.generateScriptAction);

  const generateTextForPodcast = async () => {
    isGeneratingContent(true);
    const response = await handleGenerateContent({ prompt: promptsContext });
    props.setVoicePrompt(response);
    isGeneratingContent(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <div className="generate_prompt">
          <Button
            type="button"
            variant="plain"
            onClick={() => setIsAiThumbnail(true)}
            className={cn("", {
              "bg-black-6": isAiThumbnail,
            })}
          >
            Use AI to generate Prompt
          </Button>
          <Button
            type="button"
            variant="plain"
            onClick={() => setIsAiThumbnail(false)}
            className={cn("", {
              "bg-black-6": !isAiThumbnail,
            })}
          >
            Add Prompts for Podcast
          </Button>
        </div>
        {isAiThumbnail && (
          <div className="flex flex-col sm:flex-row sm:gap-10 pb-5">
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide Prompts to AI"
              rows={3}
              value={promptsContext}
              onChange={(e: any) => setPromptsContext(e.target.value)}
            />
            <div className="mt-5 w-full max-w-[200px]">
              <Button
                type="submit"
                className="text-16 bg-green-500 py-4 font-bold text-white-1"
                onClick={generateTextForPodcast}
              >
                {generatingContent ? (
                  <>
                    Generating
                    <Loader size={20} className="animate-spin ml-2" />
                  </>
                ) : (
                  "Generate Text"
                )}
              </Button>
            </div>
          </div>
        )}
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder={
            isAiThumbnail ? "Text from Ai" : "Provide text to generate audio"
          }
          rows={5}
          disabled={isAiThumbnail}
          value={props.voicePrompt}
          onChange={(e: any) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
