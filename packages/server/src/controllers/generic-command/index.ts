import { Request, Response } from "express";
import { GenericCommand } from "../../models/generic-command";
import * as GenericCommandDb from "../../repositories/generic-command";
import { HTTP } from "../../utils/constants";
import { createGenericCommandSchema } from "./validator";

export async function findGenericCommand(
    req: Request,
    res: Response
): Promise<void> {
    const { name: rawName } = req.params;

    const name = escape(rawName);

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
    res: Response,
): Promise<void> {
    const { body } = req;

    try {
        await createGenericCommandSchema.isValid(body);
    } catch (error) {
        res.status(HTTP.BAD_REQUEST).json(error);
        return;
    }

    const sanitizedBody = {
        name: escape(body.name),
        output: escape(body.name),
    } as GenericCommand;

    const genericCommand = await GenericCommandDb.save(sanitizedBody);
    if (!genericCommand) {
        res.status(HTTP.BAD_REQUEST);
        return;
    }
    res.status(HTTP.CREATED).json(genericCommand);
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
