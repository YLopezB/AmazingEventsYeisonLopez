import * as modules from '../modules/modules.js';
modules.obtenerDatos().then(data => {
let url = window.location.search
let urlObjeto = new URLSearchParams(url)

let evento = data.events.find(e => e._id == urlObjeto.get("id"))
console.log(evento)
let contenedor = document.getElementById("contenedor-tarjeta")
let formattedRevenues = evento.capacity.toLocaleString('es-ES')
let crearTarjeta = document.createElement("div");
crearTarjeta.className = "card col-8 m-3";
crearTarjeta.innerHTML = `
    <div class="row g-0 justify-content-center">
        <div class="col-lg-6 col-md-5">
            <img src="${evento.image}" class="img-fluid rounded-start h-100 p-4 mt-2 mb-5" alt="...">
        </div>
        <div class="col-lg-6 col-md-5">
            <div class="card-body">
                <h5 class="card-title">${evento.name}</h5>
                <p class="card-text"><span class="fs-6 fw-bold">Date:</span> ${evento.date}</p>
                <p class="card-text"><span class="fs-6 fw-bold">Description:</span><br> ${evento.description}</p>
                <p class="card-text"><span class="fs-6 fw-bold">Category:</span> ${evento.category}</p>
                <p class="card-text"><span class="fs-6 fw-bold">Place:</span> ${evento.place}</p>
                <p class="card-text"><span class="fs-6 fw-bold" id="formatted-number">Capacity:</span> ${formattedRevenues}</p>
                ${evento.estimate ? `<p class="card-text" id="formatted-number"><span class="fs-6 fw-bold">Estimate:</span> ${evento.estimate}</p>` : ''}
                <p class="card-text"><span class="fs-6 fw-bold">Price:</span> $${evento.price}</p>
            </div>
        </div>
    </div>
`;
contenedor.appendChild(crearTarjeta)
})



