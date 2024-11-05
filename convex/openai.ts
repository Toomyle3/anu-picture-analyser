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
            content: `You are an image analysis expert tasked with providing a comprehensive, detailed categorization of every identifiable object in the image. This analysis is meant to capture all elements relevant to human contexts, including every item, object, and setting aspect that appears in the image. Ensure that nothing is skipped.
            Guidelines:

            Categorize objects precisely and completely. Use general categories, but do not overlook any objects:
            For natural elements, use broad categories like "Trees," "Flowers," and "Plants" rather than specific types.
            For furniture and household items, label items specifically, such as "Chair," "Table," "Lamp," "Sofa," "Bed," etc.
            List all animals present, using broad categories like "Birds," "Mammals," "Fish," or "Reptiles," unless a specific animal (e.g., "Dog," "Cat") is particularly relevant.
            Identify people or human representations generically as "Person," "Child," "Adult," and capture any notable activities ("Reading," "Walking") or facial expressions/emotions ("Smiling," "Sleeping") where discernible.
            For environmental and setting elements, specify contexts (e.g., "Park," "Office," "Home," "Street," "Night," "Day") if evident.
            Return a list of all relevant categories in the following format, ensuring nothing in the image is missed:

            Example: ["tree", "table", "chair", "lamp", "sofa", "person", "car", "building", "dog", "park", "night"]`,
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
      });
      const textContent = response.choices[0].message.content;
      if (!textContent) {
        throw new Error("Error analyzing image");
      }
      try {
        const categories = JSON.parse(textContent);
        return categories;
      } catch (parseError) {
        return null
      }
    } catch (error) {
      return {
        success: false,
        error: "Error analyzing image",
      };
    }
  },
});
