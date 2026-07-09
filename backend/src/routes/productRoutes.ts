import { Router } from "express";
import * as productContoller from "./../contollers/productContoller";
import { requireAuth } from "@clerk/express";
const router = Router();

router.get("/", productContoller.getAllProducts);
router.get("/my", requireAuth(), productContoller.getMyProducts);
router.get("/:id", productContoller.getProductById);
router.post("/", requireAuth(), productContoller.createProduct);
router.put("/:id", requireAuth(), productContoller.updateProduct);
router.delete("/:id", requireAuth(), productContoller.deleteProduct);

export default router;
