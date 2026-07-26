import express from "express";
import http from "http";
import morgan from "morgan";
async function startAccountsService() {
    const app = express();
    const server = http.createServer(app);
    server.listen(5000, () => {
        console.log("Accounts service is running on port 5000");
    });
}
startAccountsService().catch((err) => {
    console.error("Error starting accounts service:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map