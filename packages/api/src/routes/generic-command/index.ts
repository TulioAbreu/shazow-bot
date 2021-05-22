import { Router } from "express";
import {
    createGenericCommand,
    deleteGenericCommand,
    findGenericCommand,
} from "../../controllers/generic-command";

const genericCommandRouter = Router();

genericCommandRouter.get("/:name?", findGenericCommand);
genericCommandRouter.post("/", createGenericCommand);
genericCommandRouter.delete("/:name", deleteGenericCommand);

export default genericCommandRouter;
