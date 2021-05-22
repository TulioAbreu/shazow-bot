import { Router, Request, Response } from "express";
import genericCommandRoutes from "./generic-command";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
    res.send("OK");
});

router.use("/generic-command", genericCommandRoutes);

export default router;
