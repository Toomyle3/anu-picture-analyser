import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createImage = mutation({
  args: {
    imageDescription: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
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

    return await ctx.db.insert("images", {
      user: user[0]._id,
      imageDescription: args.imageDescription,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user[0].name,
      authorId: user[0].clerkId,
      authorImageUrl: user[0].imageUrl,
      views: args.views,
    });
  },
});

export const getTrendingImages = query({
  handler: async (ctx) => {
    const podcast = await ctx.db.query("images").collect();

    return podcast.slice(0, 8);
  },
});