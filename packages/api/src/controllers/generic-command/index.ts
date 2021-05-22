import { Request, Response } from "express";
import * as yup from "yup";
import * as GenericCommandDb from "database/dist/repositories/generic-command";
import { HTTP } from "../../utils/constants";

export async function findGenericCommand(
    req: Request,
    res: Response
): Promise<void> {
    const { name } = req.params;
    const command = name
        ? await GenericCommandDb.findOne(name)
        : await GenericCommandDb.findAll();
    if (!command) {
        res.status(HTTP.NOT_FOUND).json({});
        return;
    }
    res.status(HTTP.OK).json(command);
}

export async function createGenericCommand(
    req: Request,
    res: Response
): Promise<void> {
    const commandSchema = yup.object().shape({
        name: yup.string().required(),
        output: yup.string().required(),
    });

    const { body } = req;
    if (!(await commandSchema.isValid(body))) {
        res.status(HTTP.BAD_REQUEST);
        return;
    }
    const genericCommand = await GenericCommandDb.save(body);
    res.status(HTTP.OK).json(genericCommand);
}

export async function deleteGenericCommand(
    req: Request,
    res: Response
): Promise<void> {
    const { name } = req.params;
    if (!name) {
        res.status(HTTP.BAD_REQUEST);
        return;
    }
    const result = await GenericCommandDb.remove(name);
    res.status(result ? HTTP.OK : HTTP.NOT_FOUND);
}
