import { Router } from "express";
import { syncUser } from "./../contollers/userContoller";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/sync", requireAuth(), syncUser);

export default router;
