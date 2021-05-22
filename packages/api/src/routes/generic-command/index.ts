import { Router } from "express";
import GenericCommandController from "../../controllers/generic-command";

const genericCommandRouter = Router();

genericCommandRouter.get("/:name?", GenericCommandController.get);
// TODO: Add Authentication for POST/DELETE requests
genericCommandRouter.post("/", GenericCommandController.create);
genericCommandRouter.delete("/:name", GenericCommandController.delete);

export default genericCommandRouter;
