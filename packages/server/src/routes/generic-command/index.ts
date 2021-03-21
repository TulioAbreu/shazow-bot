import * as yup from "yup";
import { Router } from "express";
import {
    createGenericCommand,
    findGenericCommand,
} from "../../controllers/generic-command";
import { removeGenericCommand } from "../../controllers/generic-command/remove";
import { GenericCommand } from "../../models/generic-command";

const HTTP_BAD_REQUEST = 502;
const HTTP_OK_REQUEST = 200;
const HTTP_NOT_FOUND = 404;
const genericCommandRouter = Router();

genericCommandRouter.get("/:name?", async (req, res) => {
    const { name } = req.params;
    const command = await findGenericCommand(name);
    if (!command) {
        return res.status(HTTP_NOT_FOUND).json({});
    }
    res.status(HTTP_OK_REQUEST).json(command);
});

genericCommandRouter.post("/", async (req, res) => {
    const commandSchema = yup.object().shape({
        name: yup.string().required(),
        output: yup.string().required(),
    });
    const { body } = req;
    if (!(await commandSchema.isValid(body))) {
        return res.status(HTTP_BAD_REQUEST);
    }
    const genericCommand = await createGenericCommand(body as GenericCommand);
    res.status(HTTP_OK_REQUEST).json(genericCommand);
});

genericCommandRouter.delete("/:name", async (req, res) => {
    const { name } = req.params;
    if (!name?.length) {
        return res.status(HTTP_BAD_REQUEST);
    }
    const result = await removeGenericCommand(name);
    if (result) {
        return res.status(HTTP_OK_REQUEST);
    } else {
        return res.status(HTTP_NOT_FOUND);
    }
});

export default genericCommandRouter;
