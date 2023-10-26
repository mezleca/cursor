import express from "express"
import { Server } from "socket.io"
import { createServer } from "http"
import { join } from "path";

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server);

const active_mouses = new Map();

app.use(express.json())
app.use(express.static(join(__dirname, "public")));

io.on("connection", (socket) => {

    if (!active_mouses.has(socket.id)) {
        active_mouses.set(socket.id, {
            x: 0,
            y: 0
        });

        socket.join("elter");

        socket.emit("id", socket.id);
        io.to("elter").emit("mouses", Array.from(active_mouses));
        io.to("elter").emit("data", { id: socket.id, pos: active_mouses.get(socket.id) });
    }

    socket.on("moving", (data) => {
        active_mouses.set(socket.id, { x: data.x, y: data.y });
        io.to("elter").emit("data", { id: socket.id, pos: active_mouses.get(socket.id) });
    });

    socket.on("canvas", (data) => {
        io.to("elter").emit("draw", {x: data.x, y: data.y});
    });

    socket.on("disconnect", () => {
        active_mouses.delete(socket.id);
        io.to("elter").emit("delete", socket.id);

        console.log("usuario", socket.id, "foi removido da lista");
    });
});

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "public/") + "index.html");
});

server.listen(8080, () => {
    console.log("iniciando server");
});