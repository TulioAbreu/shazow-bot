import * as yup from "yup";
import { Request, Response } from "express";
import { findAllById, save } from "database/dist/repositories/generic-command";
import { parseSource, Source } from "database/dist/types";
import { HttpCode } from "../http-code";
import { isNullOrUndefined } from "utils";

interface CreateGenericCommandController {
    source?: string;
    serverId?: string;
}

export async function createGenericCommandController(
    req: Request<CreateGenericCommandController>,
    res: Response
): Promise<void> {
    const paramsSchema = yup.object({
        source: yup.string().required(),
        serverId: yup.string().required(),
    });

    const bodySchema = yup.object({
        name: yup.string().required(),
        output: yup.string().required(),
    });

    try {
        const params = await paramsSchema.validate(req.params, {
            stripUnknown: true,
            strict: true,
        });
        const source = parseSource(params.source);
        if (isNullOrUndefined(source)) {
            res.status(HttpCode.BadRequest).json({
                status: HttpCode.BadRequest,
                message: "Invalid 'source' value.",
            });
            return;
        }

        const { name, output } = await bodySchema.validate(req.body, {
            stripUnknown: true,
            strict: true,
        });
        await save({
            serverId: params.serverId,
            name,
            output,
            source: source as Source,
            createdAt: new Date(),
        });

        return;
    } catch (error) {
        if (error instanceof Error) {
            res.status(HttpCode.InternalServerError).json({
                status: HttpCode.InternalServerError,
                message: error.message,
            });
            return;
        }
    }
}

interface GetGenericCommandsControllerParams {
    source?: string;
    serverId?: string;
}

export async function getGenericCommandsController(
    req: Request<GetGenericCommandsControllerParams>,
    res: Response
): Promise<void> {
    const schema = yup.object({
        source: yup.string().required(),
        serverId: yup.string().required(),
    });

    try {
        const params = await schema.validate(req.params, { stripUnknown: true });
        const source = parseSource(params.source);
        if (isNullOrUndefined(source)) {
            res.status(HttpCode.BadRequest).json({
                status: HttpCode.BadRequest,
                message: "Invalid 'source' value.",
            });
            return;
        }
        const genericCommands = await findAllById(source as Source, params.serverId);
        if (!genericCommands?.length) {
            res.status(HttpCode.NotFound).json({
                status: HttpCode.NotFound,
                message: "No generic commands found.",
                data: [],
            });
            return;
        }
        res.status(HttpCode.Ok).json({
            status: HttpCode.Ok,
            message: "",
            data: genericCommands,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(HttpCode.InternalServerError).json({
                status: HttpCode.InternalServerError,
                message: error.message,
                data: [],
            });
            return;
        }
    }
}
