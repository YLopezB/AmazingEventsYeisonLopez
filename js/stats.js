import * as modules from '../modules/modules.js'
modules.obtenerDatos().then(data => {
    modules.stats(data)
})
