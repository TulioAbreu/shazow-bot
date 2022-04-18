import { Router } from "express";
import genericCommandsRouter from "./generic-commands";
const routes = Router();

routes.use("/generic-commands", genericCommandsRouter);

export default routes;
