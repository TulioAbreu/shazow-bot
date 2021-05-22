import * as mongoose from "mongoose";

export function databaseConnect(databaseURL: string): void {
    mongoose.connect(databaseURL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    mongoose.set("useFindAndModify", false);
}
