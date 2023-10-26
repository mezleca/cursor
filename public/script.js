const socket = io();
const active_mouses = new Map();

let myID = undefined;

const nomes = ['cleide', 'carlos', 'carlos1', 'carlos2', 'robert0', 'antunes', 'elter', 'eduardo'];

socket.on("id", (e) => myID = e);

socket.on("mouses", (data) => {
   
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

        const cursor_div = document.createElement("div");
        const cursor = document.createElement("img");
        const p = document.createElement("p");

        cursor.src = "./imgs/cursor.png";

        p.style = "color: white; font-size: 16px;"
        p.innerText = nomes[Math.floor(Math.random() * nomes.length)];

        cursor_div.setAttribute("id", `a_${k}`);

        cursor_div.appendChild(p);
        cursor_div.appendChild(cursor);

        document.body.appendChild(cursor_div);

        active_mouses.set(k, v);
    });
});

socket.on("data", (data) => {
   
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

socket.on("delete", (id) => {
   
    active_mouses.delete(id);
    document.body.removeChild(document.querySelector(`#a_${id}`));
});

const updateInfo = (event) => {

    socket.emit("moving", {
        x: event.clientX,
        y: event.clientY
    });
};

document.body.addEventListener("mousemove", (e) => {
    updateInfo(e);
});
