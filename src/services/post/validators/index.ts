import z from "zod";

export const createPostSchema = z.object({
    content: z.string()
      .min(1, "Post content is required")
      .max(200, "Post content cannot exceed 200 characters"),
    mediaUrl: z.string().url().optional(),
  });