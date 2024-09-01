import * as modules from '../modules/modules.js';
modules.obtenerDatos().then(data => {
    function filtrarArreglo(fecha) {
        return data.events.filter((evento) => new Date(evento.date) > new Date(fecha))
    }
    modules.crearPagina(filtrarArreglo(data.currentDate))
})


