import type { Request, Response } from "express";
import * as queries from "./../db/queries";
import { getAuth } from "@clerk/express";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { productId } = req.params;
    const { content } = req.body;
    if (typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }
    if (typeof productId !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }
    const product = await queries.getProductById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (!content)
      return res.status(400).json({ error: "Comment content is required" });
    const comment = await queries.createComment({ content, userId, productId });
    return res.status(201).json(comment);
  } catch (e) {
    console.error("Error creating comment:", e);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { commentId } = req.params;

    if (typeof commentId !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }

    if (typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }

    const comment = await queries.getCommentById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.userId != userId)
      return res
        .status(403)
        .json({ error: "You can only delete your commets" });
    await queries.deleteComment(commentId);
    res.status(200).json({ message: "Product deleted succesfully" });
  } catch (e) {
    console.error("Error deleting products:", e);
    res.status(500).json({ error: "Failed to delete products" });
  }
};
