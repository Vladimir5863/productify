import type { Request, Response } from "express";
import * as queries from "./../db/queries";
import { getAuth } from "@clerk/express";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await queries.getAllProducts();
    res.status(200).json(products);
  } catch (e) {
    console.error("Error getting products:", e);
    res.status(500).json({ error: "Failed to get products" });
  }
};

export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }
    const products = await queries.getProductByUserId(userId);
    res.status(200).json(products);
  } catch (e) {
    console.error("Error getting products:", e);
    res.status(500).json({ error: "Failed to get products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }
    const product = await queries.getProductById(id);

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (e) {
    console.error("Error getting products:", e);
    res.status(500).json({ error: "Failed to get products" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { title, description, imageUrl } = req.body;
    if (!title || !description || !imageUrl) {
      res
        .status(400)
        .json({ error: "Title, description and imageUrl are required " });
      return;
    }
    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId,
    });
    res.status(201).json(product);
  } catch (e) {
    console.error("Error creating products:", e);
    res.status(500).json({ error: "Failed to create products" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const { title, description, imageUrl } = req.body;
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }
    const existingProduct = await queries.getProductById(id);
    if (!existingProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    if (existingProduct.userId != userId) {
      res.status(403).json({ error: "You can only update your own products" });
      return;
    }
    const product = await queries.updateProduct(id, {
      title,
      description,
      imageUrl,
    });
    res.status(201).json(product);
  } catch (e) {
    console.error("Error creating products:", e);
    res.status(500).json({ error: "Failed to create products" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }
    const existingProduct = await queries.getProductById(id);
    if (!existingProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    if (existingProduct.userId != userId) {
      res.status(403).json({ error: "You can only delete your own products" });
      return;
    }
    await queries.deleteProduct(id);
    res.status(200).json({ message: "Product deleted succesfully" });
  } catch (e) {
    console.error("Error deleting products:", e);
    res.status(500).json({ error: "Failed to delete products" });
  }
};
