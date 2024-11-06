import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const createImages = mutation({
  args: {
    imagesData: v.array(
      v.object({
        image_id: v.string(),
        image_url: v.string(),
        create_time: v.string(),
      })
    ),
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

    const insertedIds = await Promise.all(
      args.imagesData.map(async (data) => {
        const dataToInsert = {
          user: user[0]._id,
          image_id: data.image_id,
          image_url: data.image_url,
          create_time: data.create_time,
        };
        return await ctx.db.insert("images", dataToInsert);
      })
    );

    return insertedIds;
  },
});

export const createImagesData = mutation({
  args: {
    imagesData: v.array(
      v.object({
        image_id: v.string(),
        image_url: v.string(),
        categories: v.any(),
        create_time: v.string(),
      })
    ),
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

    const insertedIds = await Promise.all(
      args.imagesData.map(async (data) => {
        const dataToInsert = {
          user: user[0]._id,
          image_id: data.image_id,
          image_url: data.image_url,
          categories: data.categories,
          create_time: data.create_time,
        };
        return await ctx.db.insert("imagesData", dataToInsert);
      })
    );

    return insertedIds;
  },
});

export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getAllPics = query({
  handler: async (ctx) => {
    return await ctx.db.query("images").order("desc").collect();
  },
});

export const getAllCategorizedPics = query({
  handler: async (ctx) => {
    return await ctx.db.query("imagesData").order("desc").collect();
  },
});

export const getPictureById = query({
  args: {
    image_id: v.id("images"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.image_id);
  },
});

export const getPictureByIdCategorized = query({
  args: {
    image_id: v.id("imagesData"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.image_id);
  },
});

export const deleteImageById = mutation({
  args: {
    imageId: v.id("images"),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);

    if (!image) {
      throw new ConvexError("ImageId not found");
    }

    return await ctx.db.delete(args.imageId);
  },
});

export const deleteImageByIdCategorized = mutation({
  args: {
    imageId: v.id("imagesData"),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);

    if (!image) {
      throw new ConvexError("ImageId not found");
    }

    return await ctx.db.delete(args.imageId);
  },
});