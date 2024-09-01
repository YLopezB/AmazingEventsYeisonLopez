let contenedor = document.getElementById("contenedor")
let contenedorChekbox = document.getElementById("contenedor-checkbox")
let inputBusqueda = document.getElementById("busqueda")
let botonBuscar = document.getElementById("botonBuscar")
let mensaje = document.getElementById("mensaje")
let contenedorTbody = document.getElementById("eventsStatissticsTable")
let contenedorPast = document.getElementById("PastByCategory")
let contenedorUp = document.getElementById("UpcomingByCategory")

export function obtenerDatos() {
    return fetch("https://aulamindhub.github.io/amazing-api/events.json")
        .then(response => response.json())
}

export function crearPagina(data){
function mostrarEventos(eventos) {
    contenedor.innerHTML = ''
    if (eventos.length === 0) {
        mensaje.textContent = "No se encontró ningún resultado"
    } else {
        eventos.forEach(evento => {
            mensaje.textContent = ''
            let tarjeta = document.createElement("div")
            tarjeta.innerHTML = `   
                <div class="card2 card m-2 p-1" id="${evento._id}">
                    <img class="imagenCard" src="${evento.image}" class="card-img-top h-50" alt="...">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${evento.name}</h5>
                        <p class="card-text">${evento.description}</p>
                        <div class="d-flex justify-content-between mt-auto">
                            <p class="price fs-5 fw-bold">$${evento.price}</p>
                            <a href="/pages/Details.html?id=${evento._id}" class="btn btn-primary">Details</a>
                        </div>
                    </div>
                </div>
            `
            contenedor.appendChild(tarjeta)
        })
    }
}

function unificarCategorias() {
    let categorias = data.reduce((acc, event) => {acc[event.category] = true
        return acc
    }, {})
    return Object.keys(categorias)
}

function crearCheckboxes() {
    for (let element of unificarCategorias()) {
        let crearCheckbox = document.createElement("div")
        crearCheckbox.innerHTML = `
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="${element}" value="${element}">
                <label class="form-check-label" for="${element}"><p class="category fs6 fw-bold">${element}</p></label>
            </div>
        `
        contenedorChekbox.appendChild(crearCheckbox)
    }
}

function obtenerCategoriasSeleccionadas() {
    let checkboxes = document.querySelectorAll('#contenedor-checkbox input[type="checkbox"]:checked')
    return Array.from(checkboxes).map(checkbox => checkbox.value)
}

function aplicarFiltros() {
    let valorBusqueda = inputBusqueda.value.toLowerCase()
    let categoriasSeleccionadas = obtenerCategoriasSeleccionadas()
    let eventosFiltrados = data.filter(evento => {
        let coincideTexto = evento.name.toLowerCase().includes(valorBusqueda) || evento.description.toLowerCase().includes(valorBusqueda) || evento.category.toLowerCase().includes(valorBusqueda)
        let coincideCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(evento.category)
        return coincideTexto && coincideCategoria
    });
    mostrarEventos(eventosFiltrados)
}

inputBusqueda.addEventListener('keyup', aplicarFiltros)
contenedorChekbox.addEventListener('change', aplicarFiltros)
botonBuscar.addEventListener('click', aplicarFiltros)

mostrarEventos(data)
crearCheckboxes()
}

export function stats(data) {
    let [pastEvents, upcomingEvents] = filterCurrentDate(data)
    eventsStatisstics(pastEvents)
    contenedorUp.appendChild(ByCategory(upcomingEvents))
    contenedorPast.appendChild(ByCategory(pastEvents))
}

function eventsStatisstics(pastEvents){
    let highest = [...pastEvents].sort((a, b) => b.percentage - a.percentage)
    let lowest = [...pastEvents].sort((a, b) => a.percentage - b.percentage)
    let largerCapacity = [...pastEvents].sort((a, b) => b.capacity - a.capacity)
    for(let i = 0; i < 3; i++){
        let crearTbody = document.createElement("tbody")
        crearTbody.innerHTML = `
                <tr>
                    <td>${highest[i].percentage}%</td>
                    <td>${highest[i].name}</td>
                    <td>${lowest[i].percentage}%</td>
                    <td>${lowest[i].name}</td>
                    <td>${largerCapacity[i].capacity}</td>
                    <td>${largerCapacity[i].name}</td>
                </tr>
                `
        contenedorTbody.appendChild(crearTbody)
    }
}

function ByCategory(data) {
    let crearTbody = document.createElement("tbody")
    let ByCategory = data.reduce((acc, event) => {
        let {categoria, assistance, price, capacity, estimate} = event
        if (estimate === undefined) {
            let revenue = assistance * price
            if (!acc[categoria]) {//si el evento es pasado
                acc[categoria] = {
                    revenues: revenue,
                    asis_stimate: assistance,
                    capacity: capacity,
                    category : categoria
                }
            } else {
                acc[categoria].revenues += revenue
                acc[categoria].asis_stimate += assistance
                acc[categoria].capacity += capacity
            }
        }else{//si el evento es futuro
            let revenue = estimate * price
            if (!acc[categoria]) {
                acc[categoria] = {
                    revenues: revenue,
                    asis_stimate: estimate,
                    capacity: capacity,
                    category : categoria
                }
            } else {
                acc[categoria].revenues += revenue
                acc[categoria].asis_stimate += estimate
                acc[categoria].capacity += capacity
            }
        }
        return acc;
    }, {})
    Object.values(ByCategory).forEach(event => {
        let porcentaje = Math.round((event.asis_stimate/event.capacity)*100)
            let fila = document.createElement("tr")
            fila.innerHTML = `
                <td>${event.category}</td>
                <td>${event.revenues}</td>
                <td>${porcentaje}%</td>
            `;
            crearTbody.appendChild(fila)
    });
    return crearTbody
}

function filterCurrentDate(data) {
    let pastEvents = data.events.filter((event) => new Date(event.date) < new Date(data.currentDate)).map((event) => {
        let asistencia = event.assistance 
        let capacidad = event.capacity
        let porcentaje = Math.round((asistencia/capacidad)*100)
        return {
            categoria: event.category,
            name: event.name,
            percentage: porcentaje,
            capacity: event.capacity,
            assistance: event.assistance,
            price: event.price
            }
    })
    let upEvents = data.events.filter((event) => new Date(event.date) > new Date(data.currentDate)).map((event) => {
        let asistencia = event.assistance 
        let capacidad = event.capacity
        let porcentaje = Math.round((asistencia/capacidad)*100)
        return {
            categoria: event.category,
            name: event.name,
            percentage: porcentaje,
            capacity: event.capacity,
            estimate: event.estimate,
            price: event.price
            }
    })
    return [pastEvents, upEvents]
}

