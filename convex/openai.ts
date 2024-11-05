import { v } from "convex/values";
import { action } from "./_generated/server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzePicture = action({
  args: {
    imageUrl: v.string(),
  },
  handler: async (_, { imageUrl }) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an image analysis expert. Analyze the image and categorize objects into general categories. 
            For example:
            - Don't list "oak tree, pine tree" separately, group them under "Trees"
            - Don't list "rose, tulip" separately, group them under "Flowers"
            - Don't list specific breeds of animals, group them under general categories like "Birds", "Mammals", etc.
            - Don't specify anything like human is just human for activities, emotions...
            Provide output like this format: 
              ["tree", "car", "person", "building", "dog"]`,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });
      const textContent = response.choices[0].message.content;
      if (!textContent) {
        throw new Error("Error analyzing image");
      }
      try {
        const categories = JSON.parse(textContent);
        return {
          success: true,
          categories,
        };
      } catch (parseError) {
        return {
          success: true,
          rawAnalysis: textContent,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Error analyzing image",
      };
    }
  },
});
