// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_FOLDER = SERVER + 'dashboard/folders.php?action=';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';

//Opciones para los modal
//Modal de añadir empresa
var opcionesModalAñadir = {
    preventScrolling: true,
    onCloseEnd: function () {
        limpiarAñadirModal()
    }
};
//Modal de modificar folders
var opcionesModalModificar = {
    preventScrolling: true,
    onCloseEnd: function () {
        limpiarModificarModal()
    }
};
//Modal de modificar folders
var opcionesModalEliminar = {
    preventScrolling: true,
    onCloseEnd: function () {
        limpiarEliminarFolders()
    }
};
//Limpiar los campos de Modificar Folders
function limpiarModificarModal() {
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-modificarfold');
    //Limpiamos campos
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [modNombreFolder];
    borrarCampos(arregloVCV);
    mensaje.style.display = 'none';
    preloaderModificarFold.style.display = 'none';
    btnModificarFolder.classList.remove('disabled');
};
//Limpiar los campos de Añadir Folders
function limpiarAñadirModal() {
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-anadirfold');
    //Limpiamos campos
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [nombreFolder];
    borrarCampos(arregloVCV);
    mensaje.style.display = 'none';
    preloaderAñadirFold.style.display = 'none';
    btnAnadirFolder.classList.remove('disabled');
};
//Limpiar los campos de Eliminar Empresas
function limpiarEliminarFolders() {
    preloaderEliminarFold.style.display = 'none';
    btnAceptarEliminarFold.classList.remove('disabled');
};
//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    PRELOADER.style.display = 'block';
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.Modal.init(document.querySelectorAll('#modalAnadirFolder'), opcionesModalAñadir);
    M.Modal.init(document.querySelectorAll('#modificar-foldermodal'), opcionesModalModificar);
    M.Modal.init(document.querySelectorAll('#eliminar-foldermodal'), opcionesModalEliminar);
    M.Modal.init(document.querySelectorAll('#cerrarSesionModal'));
    AOS.init();
    //Inicializamos algunos metodos
    comprobarEmpresa();
    readRowsLimit(API_FOLDER, 0);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    //Ocultamos el boton de atras para la páginación
    BOTONATRAS.style.display = 'none';
    //Ejecutamos la función para predecir si habrá un boton de adelante
    predecirAdelante();
});
//inicializamos algunas constantes
const ANADIRFOLDERBTN = document.getElementById('añadir-folder');//Boton de añadir empresa fuera del modal
const FODLERCONT = document.getElementById('folders-card');//Contenedor de las empresas
const PRELOADER = document.getElementById('preloader-cargarJ');//Preloader de carga para los elementos
const BOTONATRAS = document.getElementById("pagnavg-atr");//Boton de navegacion de atras
const BOTONNUMEROPAGI = document.getElementById("pagnumeroi");//Boton de navegacion paginai
const BOTONNUMEROPAGF = document.getElementById("pagnumerof");//Boton de navegacion paginaf
const BOTONADELANTE = document.getElementById("pagnavg-adl");//Boton de navegacion de adelante
const BUSCADORINP = document.getElementById('inputbuscar-empresas');//Input del buscador
const MODALACT = document.getElementById('modificar-foldermodal');//Modal de modificar
const MODID = document.getElementById('id-folder');//Input del id del folder para actualizar
//Declaramos los componentes utiles para usarlos
//Input del nombre del folder añadir modal
var nombreFolder = document.getElementById('nombre-folder');
//Boton de añadir añadir modal
var btnAnadirFolder = document.getElementById('btn-añadirFolderModal');
//Preloader de Añadir folder
var preloaderAñadirFold = document.getElementById('preloader-añadirfold');
//Boton de cancelar añadir modal
var btnCancelAñadirFold = document.getElementById('cancelar-Añadirfold');
//Boton de aceptar eliminar folder
var btnAceptarEliminarFold = document.getElementById('aceptareliminarfolder_boton');
//Preloader de eliminar modal
var preloaderEliminarFold = document.getElementById('confirmareliminarfold_preloader');
//Boton de cancelar eliminar modal
btnCancelEliminarFold = document.getElementById('cancelar-eliminarfold');
//Boton de modificar modal
//Boton de añadir añadir modal
var btnModificarFolder = document.getElementById('btn-modificarFolderModal');
//Preloader de Añadir folder
var preloaderModificarFold = document.getElementById('preloader-modificarfold');
//Boton de cancelar añadir modal
var btnCancelModificarFold = document.getElementById('cancelar-modificarfold');
//Input de nombre del folder modificar modal
var modNombreFolder = document.getElementById('modnombre-folder');
///*Boton de ir hacia arrina*/
var hastatop = document.getElementById('hasta_arriba');
//Variable global de la empresa seleccionada
var idEmpresa;
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
            dynamicSearcherlimit(API_FOLDER, 'buscador-form', limitBuscar);
        }
    }
};

hastatop.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
});
//Acción del boton de añadir Folder
btnAnadirFolder.addEventListener('click', function () {
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-anadirfold');
    //Validamos campos Vacios
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [nombreFolder];
    mensaje.style.display = 'none';
    preloaderAñadirFold.style.display = 'block';
    btnAnadirFolder.classList.add('disabled');
    if (validarCamposVacios(arregloVCV) != false) {
        // Petición para obtener en nombre del usuario que ha iniciado sesión.
        saveRowL(API_FOLDER, 'create', 'formAnadir', 'modalAnadirFolder', 0);
        mensaje.style.display = 'none';
        preloaderAñadirFold.style.display = 'none';
        btnAnadirFolder.classList.remove('disabled');
    } else {
        preloaderAñadirFold.style.display = 'none';
        btnAnadirFolder.classList.remove('disabled');
        mensaje.innerText = '¡No olvides ponerle un nombre a tu folder!';
        mensaje.style.display = 'block';
    }
});
//Acción del boton de cancelar Añadir folder
btnCancelAñadirFold.addEventListener('click', function () {
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-anadirfold');
    //Limpiamos campos
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [nombreFolder];
    borrarCampos(arregloVCV);
    mensaje.style.display = 'none';
    preloaderAñadirFold.style.display = 'none';
    btnAnadirFolder.classList.remove('disabled');
});
//Acción del boton de confirmar eliminar folder
btnAceptarEliminarFold.addEventListener('click', function () {
    preloaderEliminarFold.style.display = 'block';
    btnAceptarEliminarFold.classList.add('disabled');
});
//Acción del boton de cancelar eliminar folder
btnCancelEliminarFold.addEventListener('click', function () {
    preloaderEliminarFold.style.display = 'none';
    btnAceptarEliminarFold.classList.remove('disabled');
});
//Acción del boton de modificar folder
btnModificarFolder.addEventListener('click', function () {
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-modificarfold');
    //Validamos campos Vacios
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [modNombreFolder];
    preloaderModificarFold.style.display = 'block';
    btnModificarFolder.classList.add('disabled');
    if (validarCamposVacios(arregloVCV) != false) {
        // Petición para obtener en nombre del usuario que ha iniciado sesión.
        saveRowL(API_FOLDER, 'update', 'formActualizar', 'modificar-foldermodal', 0);
        mensaje.style.display = 'none';
        preloaderModificarFold.style.display = 'none';
        btnModificarFolder.classList.remove('disabled');
    } else {
        mensaje.innerText = '¡No olvides ponerle un nombre a tu folder!';
        mensaje.style.display = 'block';
        preloaderModificarFold.style.display = 'none';
        btnModificarFolder.classList.remove('disabled');
    }
});
//Accion del boton de cancelar modificación del folder
btnCancelModificarFold.addEventListener('click', function () {
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-modificarfold');
    //Limpiamos campos
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [modNombreFolder];
    borrarCampos(arregloVCV);
    mensaje.style.display = 'none';
    preloaderModificarFold.style.display = 'none';
    btnModificarFolder.classList.remove('disabled');
});
//Redireccionar a archivos
var cards = document.getElementsByClassName('card-content');
for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
        window.location.href = "archivos.html";
    });
}

//Metodo para verificar que se halla seleccionado una empresa
function comprobarEmpresa() {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_GLBVAR + 'getIdEmpresa', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si hay no hay una session para admins
                if(response.cambioCtr){
                    location.href = 'index.html';
                }else if (response.status) {
                    //Seteamos la variable global de empresa
                    idEmpresa = response.id_empresa;
                    console.log(idEmpresa);
                    //Ejecutamos el metodo de comprobarAdmin
                    comprobarAmin();
                } else {
                    location.href = 'empresas.html';
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

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
                    ANADIRFOLDERBTN.classList.add('hide');
                    document.querySelectorAll('.eliminarbtn').forEach(elemen =>
                        elemen.classList.add('hide')
                    );
                } else {
                    ANADIRFOLDERBTN.classList.remove('hide');
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
                            <a onclick="modFol(${row.id_folder})" class="tooltipped eliminarbtn" data-position="left"
                                data-tooltip="Modificar/Visualizar Folders"><img class="responsive-img"
                                    src="../resources/icons/modificar-empresa.png"></a>
                            <a onclick="delFol(${row.id_folder})" class="tooltipped eliminarbtn" data-position="top"
                                data-tooltip="Eliminar Folder"><img class="responsive-img"
                                    src="../resources/icons/eliminar-empresa.png"></a>
                        </div>
                    </div>
                    <!--Contenido del card-->
                    <div class="card-content" onclick="redArc(${row.id_folder})">
                        <div class="imagen-cardempresa center-align">
                            <img class="responsive-img" src="../resources/img/icono-folder.png">
                        </div>
                        <div class="division-folder"></div>
                        <div class="center">
                            <h6 class="">${row.nombre_folder}</h6>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    FODLERCONT.innerHTML = content;
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
    predictLImit(API_FOLDER, limit);
    let limit2 = ( (Number(BOTONNUMEROPAGI.innerHTML)+1) * 6) - 6;
    predictButton(API_FOLDER, limit2);
}

function ocultarButton2(cases) {
    switch (cases) {
        case 1:
            BOTONNUMEROPAGF.parentNode.parentNode.classList.add('hide');
            document.getElementById('pagpoints').parentNode.classList.add('hide');
            break;
        case 2:
            document.getElementById('contenedor_pags').classList.add('hide');
            let h = document.createElement("h3");
            let text = document.createTextNode("Empresa vacia");
            h.appendChild(text);
            FODLERCONT.innerHTML = "";
            FODLERCONT.append(h);
        default:
            break;
    }
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
    BOTONNUMEROPAGF.parentNode.parentNode.classList.remove('hide');
    document.getElementById('pagpoints').parentNode.classList.remove('hide');
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
        PRELOADER.style.display = 'block';
        //Se obtiene el numero dentro del span
        let number = Number(el.lastElementChild.textContent);
        console.log('numero seleccionado ' + number);
        //Se hace la operación para calcular cuanto será el top de elementos a no mostrarse en la consulta en este caso seran 8
        let limit = (number * 6) - 6;
        //Se ejecuta la recarga de datos enviando la variable de topAct
        //Ejecutamos la función para predecir si habrá un boton de adelante
        //Ejecutamos el metodo de la API para saber si hay productos y esta ejecutará una función que oculte o muestre el boton de adelante
        readRowsLimit(API_FOLDER, limit);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
        document.getElementById('numbe_paginc').innerText = number;
    });
});

//Función del buscador dinamico
BUSCADORINP.addEventListener('keyup', function (e) {
    PRELOADER.style.display = 'block';
    if (BUSCADORINP.value == '') {
        readRowsLimit(API_FOLDER, 0);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    } else {
        limitBuscar = 6;
        // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
        dynamicSearcherlimit(API_FOLDER, 'buscador-form', limitBuscar);
    }
});

//Función cuando el buscador no encuentra los datos
function noDatos() {
    PRELOADER.style.display = 'none';
    let h = document.createElement("h3");
    let text = document.createTextNode("0 resultados");
    h.appendChild(text);
    FODLERCONT.innerHTML = "";
    FODLERCONT.append(h);
}

//Función para modificar el folder
function modFol(id) {
    //Se muestra el cargador
    PRELOADER.style.display = 'block';
    // Se define un objeto con los datos del registro seleccionado.
    const form = new FormData();
    form.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_FOLDER + 'readOne', {
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
                    MODID.value = response.dataset.id_folder;
                    modNombreFolder.value = response.dataset.nombre_folder;
                    M.updateTextFields();
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

//Función para eliminar un folder
function delFol(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const form = new FormData();
    form.append('id', id);
    // Se llama a la función que elimina un registro. Se encuentra en el archivo components.js y paso el valor de 8 para recargar los clientes
    confirmDeleteL(API_FOLDER, form, 0);
}


//Función para setear el id de la empresa para el folder
function redArc(id) {
    // Se define un objeto con los datos del registro seleccionado.
    PRELOADER.style.display = 'block';
    const form = new FormData();
    form.append('id', id);
    fetch(API_GLBVAR + 'setIdFolder', {
        method: 'post',
        body: form
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si hay no hay una session para admins
                if (response.status) {
                    // Se define un objeto con los datos del registro seleccionado.
                    PRELOADER.style.display = 'none';
                    console.log(response.id_folder);
                    location.href = 'archivos.html';
                } else {
                    sweetAlert(3, 'No se pudo redirigir a los folders de las empresas', null);
                    // Se define un objeto con los datos del registro seleccionado.
                    PRELOADER.style.display = 'none';
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}