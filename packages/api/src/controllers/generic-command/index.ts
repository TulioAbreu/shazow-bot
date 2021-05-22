import { Request, Response } from "express";
import * as yup from "yup";
import * as GenericCommandDb from "database/dist/repositories/generic-command";
import { HTTP } from "../../utils/constants";

class GenericCommandController {
    async get(req: Request, res: Response) {
        const { name } = req.params;
        const command = name
            ? await GenericCommandDb.findOne(name)
            : await GenericCommandDb.findAll();
        if (!command) {
            res.status(HTTP.NOT_FOUND).json({});
        } else {
            res.status(HTTP.OK).json(command);
        }
    }

    async create(req: Request, res: Response) {
        const createGenericCommandSchema = yup.object({
            name: yup.string()
                .min(1, "Command Name is required")
                .required("Command Name is required"),
            output: yup.string()
                .min(1, "Command Output is required")
                .required("Command Output is required"),
        });

        const { body } = req;
        try {
            await createGenericCommandSchema.validate(body);
        } catch (error) {
            res.status(HTTP.BAD_REQUEST).json(error);
        }

        const genericCommand = await GenericCommandDb.save(body);
        if (genericCommand) {
            res.status(HTTP.CREATED).json(genericCommand);
        } else {
            // TODO: What to do when failed to create?
            res.status(HTTP.BAD_REQUEST);
        }
    }

    async delete(req: Request, res: Response) {
        const deleteGenericCommandSchema = yup.object({
            name: yup.string()
                .required("Command Name is required")
                .min(1, "Command Name is required"),
        });

        const params = req.params;
        // FIXME: delete is not working properly
        try {
            await deleteGenericCommandSchema.validate(params);
        } catch(error) {
            res.status(HTTP.BAD_REQUEST).json(error);
        }

        const { name } = params;
        const result = await GenericCommandDb.remove(name);
        res.status(result ? HTTP.OK : HTTP.NOT_FOUND);
    }
}

export default new GenericCommandController();
