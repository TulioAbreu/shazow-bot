import * as express from "express";
import genericCommandRoutes from "./generic-command";

const server = express();

server.use(express.json());

server.get("/health", (req: express.Request, res: express.Response) => {
    res.send("OK");
});

server.use("/generic-command", genericCommandRoutes);

export default server;
