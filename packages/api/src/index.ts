import { databaseConnect } from "database";
import express from "express";
import { getSecret } from "utils/dist/secret";
import routes from "./routes";
import morgan from "morgan";

const { mongodbKey } = getSecret();

const app = express();
const PORT = 3000;

app.use(morgan("dev"));

app.use("/api", routes);

app.listen(PORT, () => {
    console.log("INFO | Listening to port", PORT);
});

databaseConnect(mongodbKey);
