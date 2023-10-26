const body = document.body;
const new_canvas = document.createElement("canvas");

new_canvas.setAttribute("id", "canvas");
new_canvas.width = body.clientWidth;
new_canvas.height = body.clientHeight;

body.appendChild(new_canvas);