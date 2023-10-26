const socket = io();
const active_mouses = new Map();

let myID = undefined;
const nomes = ['cleide', 'carlos', 'carlos1', 'carlos2', 'robert0', 'antunes', 'elter', 'eduardo'];

document.addEventListener("DOMContentLoaded", () => {

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

            cursor.src = "https://cdn.discordapp.com/attachments/1114650576274342018/1167164303716126840/cursor.png?ex=654d2176&is=653aac76&hm=a1f26ddfc0c17ebef14edec02860ee29284c2179691b1057032662c08c68e1e2&";

            p.style = "color: white; font-size: 16px;"
            p.innerText = nomes[Math.floor(Math.random() * nomes.length)];

            cursor_div.setAttribute("id", `a_${k}`);

            cursor_div.appendChild(p);
            cursor_div.appendChild(cursor);
            cursor_div.style = "z-index: 1;"
            document.body.appendChild(cursor_div);

            active_mouses.set(k, v);
        });
    });

    socket.on("data", (data) => {
    
        active_mouses.set(data.id, { x: data.pos.x, y: data.pos.y });

        active_mouses.forEach((v, k) => {
            const text = `translate(${v.x + 12}px, ${v.y - 12}px)`;
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
            x: event.offsetX,
            y: event.offsetY
        });
    };

    document.body.addEventListener("mousemove", (e) => {
        updateInfo(e);
    }); 
});