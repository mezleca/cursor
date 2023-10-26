document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let isDrawing = false;

    const draw_on_canvas = (x, y) => {
        ctx.fillStyle = "rgb(124, 167, 247)";
        ctx.fillRect(x, y, 4, 4);
    };

    canvas.addEventListener("mousedown", (event) => {
        isDrawing = true;
        draw_on_canvas(event.offsetX, event.offsetY);
    });

    canvas.addEventListener("mouseup", () => {
        isDrawing = false;
    });

    canvas.addEventListener("mousemove", (event) => {
        if (isDrawing) {
            socket.emit("canvas", {x: event.offsetX, y: event.offsetY});
        }
    });

    socket.on("draw", (data) => {
        draw_on_canvas(data.x, data.y);
    });
});
