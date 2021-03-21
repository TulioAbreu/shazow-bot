import CommandDb from "../../models/generic-command";

export async function removeGenericCommand(
    commandName: string
): Promise<boolean> {
    const operationResult = await CommandDb.deleteOne({ name: commandName });
    try {
        if (!operationResult && operationResult.deletedCount !== undefined) {
            return false;
        }
        return operationResult["deletedCount"] >= 1;
    } catch (error) {
        console.error(error);
        return false;
    }
}
