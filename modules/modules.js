let contenedor = document.getElementById("contenedor")
let contenedorChekbox = document.getElementById("contenedor-checkbox")
let inputBusqueda = document.getElementById("busqueda")
let botonBuscar = document.getElementById("botonBuscar")
let mensaje = document.getElementById("mensaje")

export function obtenerDatos() {
    return fetch("https://aulamindhub.github.io/amazing-api/events.json")
        .then(response => response.json()).then(data => {
        return data
    })
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