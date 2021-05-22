import app from "./app";
import { getSecret } from "utils/lib/secret";
import { databaseConnect } from "database/lib";

const secret = getSecret();
databaseConnect(secret.mongodbKey);

app.listen(3001, () => {
    console.log("[LOG] Listening to port 3001");
});
