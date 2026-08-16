import express from 'express';
import http from 'http';
async function startAccountsService() {
    const app = express();
    const server = http.createServer(app);
    console.log('Starting authentication service...');
    server.listen(5001, () => {
        console.log('authentication is running on port 5001');
    });
}
startAccountsService().catch(err => {
    console.error('Error starting authentication service:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map