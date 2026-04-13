import http from "node:http";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const port = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
	res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
	res.end("Wisp server running");
});

server.on("upgrade", (req, socket, head) => {
	wisp.routeRequest(req, socket, head);
});

server.listen(port, () => {
	console.log(`Wisp server listening on :${port}`);
});
