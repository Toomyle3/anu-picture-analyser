import { v } from "convex/values";
import Replicate from "replicate";
import { action } from "./_generated/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface GenerateMusicResponse {
  audio: string;
}

// Music
export const generateMusicAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const input = {
      prompt_b: prompt,
    };
    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      { input }
    );

    if (!response) {
      throw new Error("Error generating thumbnail");
    }
    return response as GenerateMusicResponse;
  },
});

// Videos
export const generateVideoAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const input = {
      steps: 25,
      prompt: prompt,
    };

    const response = await replicate.run(
      "lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f",
      { input }
    );

    if (!response) {
      throw new Error("Error generating thumbnail");
    }
    return response;
  },
});
