import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createVideo = mutation({
  args: {
    videoDescription: v.string(),
    videoUrl: v.string(),
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

    return await ctx.db.insert("videos", {
      user: user[0]._id,
      videoDescription: args.videoDescription,
      videoUrl: args.videoUrl,
      author: user[0].name,
      authorId: user[0].clerkId,
      authorVideoUrl: user[0].imageUrl,
      views: args.views,
    });
  },
});

export const getTrendingAudios = query({
  handler: async (ctx) => {
    const podcast = await ctx.db.query("videos").collect();

    return podcast.slice(0, 8);
  },
});
