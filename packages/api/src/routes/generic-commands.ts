import { Router } from "express";
import {
    createGenericCommandController,
    getGenericCommandsController,
} from "../controllers/generic-commands";

const router = Router();

router.get("/:source/:serverId", getGenericCommandsController);
router.post("/:source/:serverId", createGenericCommandController);

export default router;
