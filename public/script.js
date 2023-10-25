const socket = io();
const active_mouses = new Map();

let myID = undefined;

socket.on("id", (e) => myID = e);

socket.on("mouses", (data) => { // evento de novo cursor / inicializacao
   /** @type { Map } */
    const array_mouses = data;
    const mouses = new Map();

    for (let i = 0; i < array_mouses.length; i++) {
        mouses.set(array_mouses[i][0], array_mouses[i][1]);
    }

    mouses.forEach((v, k) => {

        const cursor_exist = document.querySelector(`#a_${k}`) ? true : false;
        if (cursor_exist || k == myID) {
            return;
        }

        const cursor = document.createElement("img");

        cursor.setAttribute("id", `a_${k}`);
        cursor.src = "./imgs/cursor.png";

        document.body.appendChild(cursor);

        active_mouses.set(k, v);
    });
});

socket.on("data", (data) => { // evento e emitido quando ha uma alteracao no active_mouses
    active_mouses.set(data.id, { x: data.pos.x, y: data.pos.y });

    active_mouses.forEach((v, k) => {
        const text = `translate(${v.x}px, ${v.y}px)`;
        const element = document.getElementById("a_" + k) || null;
    
        if (!element) {
            return;
        }
    
        element.style.transform = text;
    })
});

socket.on("delete", (id) => { // remove cursor que esta offline
    active_mouses.delete(id);
    document.body.removeChild(document.querySelector(`#a_${id}`));
});

const updateInfo = (event) => {

    socket.emit("moving", { // evento que no servidor e usado para atualizar as variaveis x e y, depois que as variaveis forem atualizadas ele emite um outro evento com o nome "data"
        x: event.clientX,
        y: event.clientY
    });
};

document.body.addEventListener("mousemove", (e) => {
    updateInfo(e);
});