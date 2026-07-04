import { Router } from "express";
import { ExpressRequestWithAuth, requireAuth } from "@clerk/express";
import * as commentContoller from "./../contollers/commentContoller";

const router = Router();

router.post("/:productId", requireAuth(), commentContoller.createComment);
router.delete("/:commentId", requireAuth(), commentContoller.deleteComment);

export default router;
