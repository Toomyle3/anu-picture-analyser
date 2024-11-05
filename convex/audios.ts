import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createAudio = mutation({
  args: {
    audioDescription: v.string(),
    audioUrl: v.string(),
    views: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("audios", {
      user: user[0]._id,
      audioDescription: args.audioDescription,
      audioUrl: args.audioUrl,
      author: user[0].name,
      authorId: user[0].clerkId,
      authorAudioUrl: user[0].imageUrl,
      views: args.views,
    });
  },
});

export const getTrendingAudios = query({
  handler: async (ctx) => {
    const podcast = await ctx.db.query("audios").collect();

    return podcast.slice(0, 8);
  },
});
