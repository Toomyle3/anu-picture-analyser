import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  images: defineTable({
    user: v.id("users"),
    image_id: v.string(),
    image_url: v.string(),
    image_name: v.string(),
    create_time: v.string(),
  }),
  imagesData: defineTable({
    user: v.id("users"),
    image_id: v.string(),
    image_url: v.string(),
    categories: v.any(),
    create_time: v.string(),
  }),
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),
});
