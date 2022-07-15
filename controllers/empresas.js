// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPRESAS = SERVER + 'dashboard/empresas.php?action=';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';

//Opciones para los modal
//Modal de añadir empresas
var opcionesModalAñadir = {
    preventScrolling: true,
    onCloseEnd: function () {
        document.getElementById('formAñadir').reset();
        M.updateTextFields();
    }
};
//Modal de modificar empresas
var opcionesModalModificar = {
    preventScrolling: true,
    onCloseEnd: function () {
        limpiarModificarModal()
    }
};
//Modal de eliminar empresas
var opcionesModalEliminar = {
    preventScrolling: true,
    onCloseEnd: function () {
        limpiarEliminarEmpresas()
    }
};
//Limpiar los campos de Modificar Empresas
function limpiarModificarModal() {
    //Ocultamos el modal
    preloaderModificarempre.style.display = 'none';
    //Habilitamos el boton de modificar empresa
    modificarEmpresaBtn.classList.remove('disabled');
    let mensaje = document.getElementById('mensaje-modificar');
    mensaje.style.display = 'none';
    //Limpiamos los campos
    //Creamos arreglo de los campos a limpiar
    let modCorreoEmpr = document.getElementById('modcorreo-empr');//Correo de la empresa modificación
    let modDireccionEmpr = document.getElementById('moddireccion-empr');
    arregloLC = [modNombreCliente, modApellidoCliente, modNombreEmpresa, modNumeroContacto, modDireccionEmpr, modNITEmpr, modCorreoEmpr];
    borrarCampos(arregloLC);
};
//Limpiar los campos de Eliminar Empresas
function limpiarEliminarEmpresas() {
    preloaderEliminarempre.style.display = 'none';
    eliminarEmpresaBtn.classList.remove('disabled');
};
//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.Modal.init(document.querySelectorAll('#modalAnadirEmpresa'), opcionesModalAñadir);
    M.Modal.init(document.querySelectorAll('#modificar-empresamodal'), opcionesModalModificar);
    M.Modal.init(document.querySelectorAll('#eliminar-empresamodal'), opcionesModalEliminar);
    M.Modal.init(document.querySelectorAll('#cerrarSesionModal'));
    AOS.init();
    //Inicializamos algunos metodos
    comprobarAmin();
    readRowsLimit(API_EMPRESAS, 0);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    //Ocultamos el boton de atras para la páginación
    BOTONATRAS.style.display = 'none';
    //Ejecutamos la función para predecir si habrá un boton de adelante
    predecirAdelante();
});
//inicializamos algunas constantes
const ANADIREMPRESABTN = document.getElementById('añadir-empresa');//Boton de añadir empresa fuera del modal
const EMPRESASCONT = document.getElementById('empresas-card');//Contenedor de las empresas
const PRELOADER = document.getElementById('preloader-cargarJ');//Preloader de carga para los elementos
const BOTONATRAS = document.getElementById("pagnavg-atr");//Boton de navegacion de atras
const BOTONNUMEROPAGI = document.getElementById("pagnumeroi");//Boton de navegacion paginai
const BOTONNUMEROPAGF = document.getElementById("pagnumerof");//Boton de navegacion paginaf
const BOTONADELANTE = document.getElementById("pagnavg-adl");//Boton de navegacion de adelante
const BUSCADORINP = document.getElementById('inputbuscar-empresas');//Input del buscador
const MODALACT = document.getElementById('modificar-empresamodal');//Modal de modificar
const MODDIRECCION = document.getElementById('moddireccion-empr');//Text area de modificar una empresa
const MODNOMBRECL = document.getElementById('modnombre-clienteempr');//Nombre de empleado de modificar una empresa
const MODAPELLIDOCL = document.getElementById('modapellido-clienteempr');//Nombre de empleado de modificar una empresa
const MODNOMBREEMP = document.getElementById('modempresa-empr');//Nombre de empresa de modificar una empresa
const MODANUMERO = document.getElementById('modnumero-empr');//Numero de empresa de modificar una empresa
const MODCORREO = document.getElementById('modcorreo-empr');//Correo de empresa de modificar una empresa
const MODANIT = document.getElementById('modNIT-empr');//NIT de empresa de modificar una empresa
const MODID = document.getElementById('modid-empr');//Id de empresa de modificar una empresa
//Variables generales
//Preloader de añadir empresa
var preloaderAñadirempre = document.getElementById('preloader-añadirempr');
//Preloader de confirmación de eliminación de empresa
var preloaderEliminarempre = document.getElementById('confirmareliminarempr_preloader');
//Boton de confirmación de eliminación del empresa
var eliminarEmpresaBtn = document.getElementById('aceptareliminarempresa_boton');
//Boton de cancelar eliminación del empresa
var cancelEliminarEmprBtn = document.getElementById('cancelar-eliminarempr');
//Boton de confirmación de modificación de empresa
var modificarEmpresaBtn = document.getElementById('btn-modificarEmpresaModal');
//Boton de cancelar modificación de la empresa
var cancelModificarEmprBtn = document.getElementById('cancelar-Modificarempr');
//Preloader de confirmación de modificación de empresa
var preloaderModificarempre = document.getElementById('preloader-modificarempr');
//Input nombre del cliente modal de añadir empresa
var nombreCliente = document.getElementById('nombre-clienteempr');
//Input apellido del cliente modal de añadir empresa
var apellidoCliente = document.getElementById('apellido-clienteempr');
//Input nombre de la empresa modal de añadir empresa
var nombreEmpresa = document.getElementById('empresa-empr');
//Input nombre del cliente modal modificar empresa
var modNombreCliente = document.getElementById('modnombre-clienteempr');
//Input nombre del cliente modal modificar empresa
var modApellidoCliente = document.getElementById('modapellido-clienteempr');
//Input nombre del cliente modal modificar empresa
var modNombreEmpresa = document.getElementById('modempresa-empr');
//Input nombre del cliente modal modificar empresa
var modNumeroContacto = document.getElementById('modnumero-empr');
//Input nombre del cliente modal modificar empresa
var modNITEmpr = document.getElementById('modNIT-empr');
///*Boton de ir hacia arrina*/
var hastatop = document.getElementById('hasta_arriba');
var limitBuscar = 6;
window.onscroll = function () {
    if (document.documentElement.scrollTop > 100) {
        hastatop.style.display = "block";
    } else {
        hastatop.style.display = "none";
    }

    //Para páginación del servidor
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {

        // Se evita recargar la página web después de enviar el formulario.
        // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
        if (BUSCADORINP.value.length > 0) {
            limitBuscar *= 6;
            // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
            dynamicSearcherlimit(API_EMPRESAS, 'buscador-form', limitBuscar);
        }
    }
};

hastatop.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
});
//Solo números en el input de número de contacto
var numeroContacto = document.getElementById('numero-empr');
numeroContacto.addEventListener('keypress', function (e) {
    if (!soloNumeros(event, 1)) {
        e.preventDefault();
    }
});
//Validar guión en el número de contacto
numeroContacto.addEventListener('keyup', e => {
    guionTelefono(e, numeroContacto);
});
//Validar solo números y guiones en el input del NIT de la empresa
var NITempr = document.getElementById('NIT-empr');
NITempr.addEventListener('keypress', function (e) {
    if (!soloNumeros(event, 1)) {
        e.preventDefault();
    }
});
//Validar guión en el número de NIT
NITempr.addEventListener('keyup', e => {
    if (document.getElementById('estadoEmp').checked) {
        //Desea evaluar como nit
        guionNIT(e, NITempr);
    } else {
        //Desea dui
        guionDUI(e, NITempr);
    }
});
//Validar solo letras en el nombre del cliente
nombreCliente.addEventListener('keypress', function (e) {
    if (!soloLetras(event, 1)) {
        e.preventDefault();
    }
});
//Validar solo letras en el apellido del cliente
apellidoCliente.addEventListener('keypress', function (e) {
    //Validamos que la primera tecla no sea espacio
    if (!soloLetras(event, 1)) {
        e.preventDefault();
    }
});
//Validar solo letras en el nombre de la empresa
nombreEmpresa.addEventListener('keypress', function (e) {
    //Validamos que la primera tecla no sea espacio
    if (!soloLetras(event, 1)) {
        e.preventDefault();
    }
});
//Validar solo letras en el nombre
//Acción del boton de añadir Empresa
var btnAñadirEmpr = document.getElementById('btn-añadirEmpresaModal');
btnAñadirEmpr.addEventListener('click', function () {
    let nombrecl = document.getElementById('nombre-clienteempr');
    let apellidocl = document.getElementById('apellido-clienteempr');
    let empresa = document.getElementById('empresa-empr');
    let direccion = document.getElementById('direccion-empr');
    let mensaje = document.getElementById('mensaje-anadir');
    if (nombrecl.value.length != 0 && apellidocl.value.length != 0 && empresa.value.length != 0 && direccion.value.length != 0 && numeroContacto.value.length != 0
        && NITempr.value.length != 0) {
        if ((NITempr.value.length == 17 || NITempr.value.length == 10) && numeroContacto.value.length == 9) {
            // Petición para obtener en nombre del usuario que ha iniciado sesión.
            saveRowL(API_EMPRESAS, 'create', 'formAñadir', 'modalAnadirEmpresa', 0);
            mensaje.style.display = 'none';
            preloaderAñadirempre.style.display = 'block';
            btnAñadirEmpr.classList.remove("disabled");
        }
        else {
            mensaje.style.display = 'block';
            mensaje.innerText = 'El formato del DUI o NIT son incorrectos, por favor verificarlos';
        }
    }
    else {
        mensaje.style.display = 'block';
        mensaje.innerText = '¡No se permiten espacios vacios!';
    }
});
//Validar que el preloader y el mensaje se oculten
var btnCancelarAnadirEmpr = document.getElementById('cancelar-Añadirempr');
btnCancelarAnadirEmpr.addEventListener('click', function () {
    let mensaje = document.getElementById('mensaje-anadir');
    preloaderAñadirempre.style.display = 'none';
    btnAñadirEmpr.classList.remove("disabled");
    mensaje.style.display = 'none';
    limpiarAñadirModal();
});
//Función de borrar todos los campos
function limpiarAñadirModal() {
    let nombrecl = document.getElementById('nombre-clienteempr');
    let apellidocl = document.getElementById('apellido-clienteempr');
    let empresa = document.getElementById('empresa-empr');
    let direccion = document.getElementById('direccion-empr');
    nombrecl.value = '';
    apellidocl.value = '';
    empresa.value = '';
    direccion.value = '';
    numeroContacto.value = '';
    NITempr.value = '';
    let mensaje = document.getElementById('mensaje-anadir');
    preloaderAñadirempre.style.display = 'none';
    btnAñadirEmpr.classList.remove("disabled");
    mensaje.style.display = 'none';
}
//Validar que se muestre el preloader al aceptar eliminar empresa
eliminarEmpresaBtn.addEventListener('click', function () {
    preloaderEliminarempre.style.display = 'block';
    eliminarEmpresaBtn.classList.add('disabled');
});
//Validar que si se cancela la eliminación de empresa se esconda el preloader y se reactive el boton
cancelEliminarEmprBtn.addEventListener('click', function () {
    preloaderEliminarempre.style.display = 'none';
    eliminarEmpresaBtn.classList.remove('disabled');
});
//Proceso de Modificar empresa
//Validar solo letras
modificarEmpresaBtn.addEventListener('click', function () {
    // creamos variables que se usarán solo aqui
    let modCorreoEmpr = document.getElementById('modcorreo-empr');//Correo de la empresa modificación
    let modDireccionEmpr = document.getElementById('moddireccion-empr');
    let mensaje = document.getElementById('mensaje-modificar');
    //Validar los campos vacios
    //Creamos arreglo de componentes para enviarlos a una función que los evaluará
    let arregloVCV = [modNombreCliente, modApellidoCliente, modNombreEmpresa, modNumeroContacto, modCorreoEmpr, modNITEmpr, modDireccionEmpr];
    if (validarCamposVacios(arregloVCV) != false) {
        if ((modNITEmpr.value.length == 17 || modNITEmpr.value.length == 10) && modNumeroContacto.value.length == 9) {
            // Petición para obtener en nombre del usuario que ha iniciado sesión.
            saveRowL(API_EMPRESAS, 'update', 'formActualizar', 'modificar-empresamodal', 0);
            mensaje.style.display = 'none';
            preloaderModificarempre.style.display = 'block';
            modificarEmpresaBtn.classList.remove("disabled");
        }
        else {
            mensaje.style.display = 'block';
            mensaje.innerText = 'El formato del DUI o NIT son incorrectos, por favor verificarlos';
        }
    } else {
        mensaje.style.display = 'block';
        mensaje.innerText = '¡No se permiten campos vacios!';
    }
});
//Validar que si se cancela la modificación de empresa se esconda el preloader y se reactive el boton
cancelModificarEmprBtn.addEventListener('click', function () {
    //Ocultamos el modal
    preloaderModificarempre.style.display = 'none';
    //Habilitamos el boton de modificar empresa
    modificarEmpresaBtn.classList.remove('disabled');
    let mensaje = document.getElementById('mensaje-modificar');
    mensaje.style.display = 'none';
    //Limpiamos los campos
    //Creamos arreglo de los campos a limpiar
    let modCorreoEmpr = document.getElementById('modcorreo-empr');//Correo de la empresa modificación
    let modDireccionEmpr = document.getElementById('moddireccion-empr');
    arregloLC = [modNombreCliente, modApellidoCliente, modNombreEmpresa, modNumeroContacto, modDireccionEmpr, modNITEmpr, modCorreoEmpr];
    borrarCampos(arregloLC);
});
//Validar solo números en el input de número de contacto modal modificar empresa
modNumeroContacto.addEventListener('keypress', function (e) {
    if (!soloNumeros(e, 1)) {
        e.preventDefault();
    }
});
//Validar el guión en el número telefonico modal de modificar
modNumeroContacto.addEventListener('keyup', function (e) {
    guionTelefono(e, modNumeroContacto);
});
//Validar solo números en el input de NIt modal modificar empresa
modNITEmpr.addEventListener('keypress', function (e) {
    if (!soloNumeros(e, 1)) {
        e.preventDefault();
    }
});
//Validar el guión en el NIT modal de modificar
modNITEmpr.addEventListener('keyup', function (e) {
    if (document.getElementById('estadoEmpM').checked) {
        //Desea evaluar como nit
        guionNIT(e, modNITEmpr);
    } else {
        //Desea dui
        guionDUI(e, modNITEmpr);
    }
});
//Validar solo letras en el nombre del cliente modal modificar
modNombreCliente.addEventListener('keypress', function (e) {
    if (!soloLetras(e, 1)) {
        e.preventDefault();
    }
});
//Validar solo letras en el apellido del cliente modal modificar
modApellidoCliente.addEventListener('keypress', function (e) {
    if (!soloLetras(e, 1)) {
        e.preventDefault();
    }
});
//Validar solo letras en el nombre de la empresa modal modificar
modNombreEmpresa.addEventListener('keypress', function (e) {
    if (!soloLetras(e, 1)) {
        e.preventDefault();
    }
});

//Metodo para ocultar el boton en caso no sea admin el que inicio session;
function comprobarAmin() {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_GLBVAR + 'verificarAdmin', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si hay no hay una session para admins
                if (!response.status) {
                    ANADIREMPRESABTN.classList.add('hide');
                    document.querySelectorAll('.eliminarbtn').forEach(element =>
                        element.classList.add('hide')
                    );
                } else {
                    ANADIREMPRESABTN.classList.remove('hide');
                    document.querySelectorAll('.eliminarbtn').forEach(element =>
                        element.classList.remove('hide')
                    );
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Función para llenar el contenedor de clientes con los datos obtenidos del controlador de components
function fillTable(dataset) {
    let content = '';
    PRELOADER.style.display = 'block';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <!--Contenedor del card-->
            <div class="col s12 m6 l3 contenedor-card">
                <div class="card">
                    <div class="botones">
                        <!--Boton de modificar y eliminar-->
                        <div class="right-align botones-cardempresa">
                            <a onclick="modEmp(${row.id_empresa})" class="tooltipped eliminarbtn" data-position="left"
                                data-tooltip="Modificar/Visualizar Empresa"><img class="responsive-img"
                                    src="../resources/icons/modificar-empresa.png"></a>
                            <a onclick="delEmp(${row.id_empresa})"  class="tooltipped eliminarbtn" data-position="top"
                                data-tooltip="Eliminar Empresa"><img class="responsive-img"
                                    src="../resources/icons/eliminar-empresa.png"></a>
                        </div>
                    </div>
                    <!--Contenido del card-->
                    <div class="card-content" onclick="redFold(${row.id_empresa})">
                        <div class="imagen-cardempresa center-align">
                            <img class="responsive-img" src="../resources/img/icono-empresa.png">
                        </div>
                        <div class="division-empresa"></div>
                        <div class="center">
                            <h6 class="">${row.nombre_empresa}</h6>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    EMPRESASCONT.innerHTML = content;
    PRELOADER.style.display = 'none';
    // Se inicializa el componente Tooltip para que funcionen las sugerencias textuales.
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    comprobarAmin();
}

//Funciones para la páginación

//Función para saber si hay otra página
function predecirAdelante() {
    //Colocamos el boton con un display block para futuras operaciones
    BOTONADELANTE.style.display = 'block';
    //Obtenemos el número de página que seguiría al actual
    let paginaFinal = (Number(BOTONNUMEROPAGI.innerHTML)) + 2;
    console.log("pagina maxima " + paginaFinal);
    //Calculamos el limite que tendria el filtro de la consulta dependiendo de la cantidad de Clientes a mostrar
    let limit = (paginaFinal * 6) - 6;
    console.log("El limite sería: " + limit);
    //Ejecutamos el metodo de la API para saber si hay productos y esta ejecutará una función que oculte o muestre el boton de adelante
    predictLImit(API_EMPRESAS, limit);
}

function ocultarMostrarAdl(result) {
    if (result != true) {
        console.log('Se oculta el boton');
        BOTONADELANTE.style.display = 'none';
    } else {
        //Colocamos el boton con un display block para futuras operaciones
        console.log('Se muestra el boton');
        BOTONADELANTE.style.display = 'block';
    }
}

//Boton de atras
BOTONATRAS.addEventListener('click', function () {
    //Volvemos a mostrár el boton de página adelante
    BOTONADELANTE.style.display = 'block';
    //Obtenemos el número de la página inicial
    let paginaActual = Number(BOTONNUMEROPAGI.textContent);
    //Comprobamos que el número de página no sea igual a 1
    if (paginaActual != 1) {
        //Restamos la cantidad de páginas que queramos que se retroceda en este caso decidi 2 para el botoni y 1 para el botonf
        BOTONNUMEROPAGI.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) - 2;
        BOTONNUMEROPAGF.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) + 1;
        //Verificamos si el número del boton ahora es 1, en caso lo sea se ocultará el boton
        if ((Number(BOTONNUMEROPAGI.innerHTML) - 1) == 0) {
            BOTONATRAS.style.display = 'none';
        }
    }
});

//Boton de adelante
BOTONADELANTE.addEventListener('click', function () {
    //Volvemos a mostrár el boton de página anterior
    BOTONATRAS.style.display = 'block';
    //Ejecutamos la función para predecir si hay más páginas
    //Sumamos la cantidad de página que queramos que avance, en este caso decidi 2 para el botoni y 3 para el botonf
    BOTONNUMEROPAGI.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) + 2;
    predecirAdelante();
    //Luego verificamos si el boton de adelante aun continua mostrandose
    if (BOTONADELANTE.style.display = 'block') {
        //Sumamos la cantidad de página que queramos que avance, en este caso decidi 2 para el botoni y 3 para el botonf
        BOTONNUMEROPAGF.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) + 1;
    } else {
        BOTONNUMEROPAGI.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) - 2;
    }
});

//Función que realizará los botones con numero de la páginacion
document.querySelectorAll(".contnpag").forEach(el => {
    el.addEventListener("click", e => {
        //Se obtiene el numero dentro del span
        let number = Number(el.lastElementChild.textContent);
        console.log('numero seleccionado ' + number);
        //Se hace la operación para calcular cuanto será el top de elementos a no mostrarse en la consulta en este caso seran 8
        let limit = (number * 6) - 6;
        //Se ejecuta la recarga de datos enviando la variable de topAct
        //Ejecutamos la función para predecir si habrá un boton de adelante
        readRowsLimit(API_EMPRESAS, limit);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    });
});

//Función del buscador dinamico
BUSCADORINP.addEventListener('keyup', function (e) {
    if (BUSCADORINP.value == '') {
        readRowsLimit(API_EMPRESAS, 0);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    } else {
        limitBuscar = 6;
        // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
        dynamicSearcherlimit(API_EMPRESAS, 'buscador-form', limitBuscar);
    }
});

//Función cuando el buscador no encuentra los datos
function noDatos() {
    let h = document.createElement("h3");
    let text = document.createTextNode("0 resultados");
    h.appendChild(text);
    EMPRESASCONT.innerHTML = "";
    EMPRESASCONT.append(h);
}

//Función para actualizar la empresa
function modEmp(id) {
    //Se muestra el cargador
    PRELOADER.style.display = 'block';
    // Se define un objeto con los datos del registro seleccionado.
    const form = new FormData();
    form.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_EMPRESAS + 'readOne', {
        method: 'post',
        body: form
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //Se muestra el modal
                    M.Modal.getInstance(MODALACT).open();
                    //Llenamos los datos 
                    MODID.value = response.dataset.id_empresa;
                    MODNOMBRECL.value = response.dataset.nombre_cliente;
                    MODAPELLIDOCL.value = response.dataset.apellido_cliente;
                    MODNOMBREEMP.value = response.dataset.nombre_empresa;
                    MODANUMERO.value = response.dataset.numero_empresacontc;
                    MODCORREO.value = response.dataset.correo_empresacontc;
                    MODDIRECCION.value = response.dataset.direccion_empresa;
                    MODANIT.value = response.dataset.nit_empresa;
                    M.updateTextFields();
                    M.textareaAutoResize(MODDIRECCION);
                    if (MODANIT.value.length <= 10) {
                        document.getElementById('estadoEmpM').checked = false;
                    } else {
                        document.getElementById('estadoEmpM').checked = true;
                    }
                    //Se oculta el cargador
                    PRELOADER.style.display = 'none';
                } else {
                    sweetAlert(2, response.exception, null);
                    //Se oculta el cargador
                    PRELOADER.style.display = 'none';
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Función para eliminar una empresa
function delEmp(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const form = new FormData();
    form.append('id', id);
    // Se llama a la función que elimina un registro. Se encuentra en el archivo components.js y paso el valor de 8 para recargar los clientes
    confirmDeleteL(API_EMPRESAS, form, 0);
}

//Función para setear el id de la empresa para el folder
function redFold(id) {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    // Se define un objeto con los datos del registro seleccionado.
    const form = new FormData();
    form.append('id', id);
    fetch(API_GLBVAR + 'setIdEmpresa', {
        method: 'post',
        body: form
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si hay no hay una session para admins
                if (response.status) {
                    location.href = 'folders.html';
                } else {
                    sweetAlert(3, 'No se pudo redirigir a los folders de las empresas', null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

/*Identificar si es empresa juridica o natural*/
document.getElementById('estadoEmp').addEventListener('change', function () {
    if (document.getElementById('estadoEmp').checked) {
        //Es empresa juridica
        NITempr.setAttribute('maxlength', 17);
    } else {
        //Es natural o sea que es dui
        NITempr.setAttribute('maxlength', 10);
    }
});

/*Identificar si es empresa juridica o natural*/
document.getElementById('estadoEmpM').addEventListener('change', function () {
    if (document.getElementById('estadoEmpM').checked) {
        //Es empresa juridica
        modNITEmpr.setAttribute('maxlength', 17);
    } else {
        //Es natural o sea que es dui
        modNITEmpr.setAttribute('maxlength', 10);
    }
});