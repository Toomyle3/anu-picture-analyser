import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createImages = mutation({
  args: {
    imagesData: v.array(
      v.object({
        image_id: v.string(),
        image_url: v.string(),
        categories: v.any(), // Corrected spelling here
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
        return await ctx.db.insert("images", dataToInsert);
      })
    );

    return insertedIds;
  },
});
