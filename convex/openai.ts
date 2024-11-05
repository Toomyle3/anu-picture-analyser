import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Audio
export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as SpeechCreateParams["voice"],
      input,
    });

    const buffer = await mp3.arrayBuffer();

    return buffer;
  },
});

// Images
export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const url = response.data[0].url;

    if (!url) {
      throw new Error("Error generating thumbnail");
    }

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  },
});

// Images
const allowedResolutions = ["1024x1024", "1792x1024", "1024x1792"] as const;
const allowedQualities = ["hd", "standard"] as const;

type Resolution = (typeof allowedResolutions)[number];
type Quality = (typeof allowedQualities)[number];

export const generateImagesAction = action({
  args: { prompt: v.string(), resolution: v.string(), quality: v.string() },
  handler: async (_, { prompt, resolution, quality }) => {
    const isValidResolution = allowedResolutions.includes(
      resolution as Resolution
    );
    const selectedResolution = isValidResolution
      ? (resolution as Resolution)
      : "1024x1024";

    const isValidQuality = allowedQualities.includes(quality as Quality);
    const selectedQuality = isValidQuality ? (quality as Quality) : "standard";

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: selectedResolution,
      quality: selectedQuality,
      n: 1,
    });

    const url = response.data[0].url;

    if (!url) {
      throw new Error("Error generating image");
    }

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  },
});

export const generateScriptAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `Create a short story from this prompt (maximum: 300 words): ${prompt}`,
          },
        ],
      });

      const textContent = response.choices[0].message.content;

      if (!textContent) {
        throw new Error("Error generating response");
      }

      return textContent;
    } catch (error) {
      throw new Error("Error generating response");
    }
  },
});

// Conversation
export const generateConversationAction = action({
  args: {
    promptMessage: v.string(),
    userName: v.string(),
    history: v.string(),
  },
  handler: async (_, { promptMessage, userName, history }) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `Previous question: ${history} (split by -> 
              each was my previous question, 
              the content inside the () 
            is the notes don't 
            reveal it to the user) 
            and now the question from ${userName} (username) is: ${promptMessage}`,
          },
        ],
      });

      const textContent = response.choices[0].message.content;

      if (!textContent) {
        throw new Error("Error generating response");
      }

      return textContent;
    } catch (error) {
      throw new Error("Error generating response");
    }
  },
});

// Code generation
export const generateCodeAction = action({
  args: {
    promptMessage: v.string(),
  },
  handler: async (_, { promptMessage }) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a code generator. 
            You must answer only in markdown code snippets. 
            Use code comments for explanations.
            And the question is: ${promptMessage}`,
          },
        ],
      });

      const textContent = response.choices[0].message.content;

      if (!textContent) {
        throw new Error("Error generating response");
      }

      return textContent;
    } catch (error) {
      throw new Error("Error generating response");
    }
  },
});
