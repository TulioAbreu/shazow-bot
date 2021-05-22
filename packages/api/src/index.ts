import app from "./app";
import { getSecret } from "utils/dist/secret";
import { databaseConnect } from "database";

const secret = getSecret();
databaseConnect(secret.mongodbKey);

app.listen(3001, () => {
    console.log("[LOG] Listening to port 3001");
});
