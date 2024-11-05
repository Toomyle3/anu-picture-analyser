import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  videos: defineTable({
    user: v.id("users"),
    videoUrl: v.optional(v.string()),
    author: v.string(),
    authorId: v.string(),
    authorVideoUrl: v.string(),
    videoDescription: v.string(),
    views: v.number(),
  }),
  audios: defineTable({
    user: v.id("users"),
    audioUrl: v.optional(v.string()),
    author: v.string(),
    authorId: v.string(),
    authorAudioUrl: v.string(),
    audioDescription: v.string(),
    views: v.number(),
  }),
  images: defineTable({
    user: v.id("users"),
    imageUrl: v.optional(v.string()),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    imageDescription: v.string(),
    views: v.number(),
  }),
  podcasts: defineTable({
    user: v.id("users"),
    podcastTitle: v.string(),
    podcastDescription: v.string(),
    audioUrl: v.optional(v.string()),
    audioStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    audioDuration: v.number(),
    views: v.number(),
  })
    .searchIndex("search_author", { searchField: "author" })
    .searchIndex("search_title", { searchField: "podcastTitle" })
    .searchIndex("search_body", { searchField: "podcastDescription" }),
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),
});
