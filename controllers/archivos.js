// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_ARCHIVO = SERVER + 'dashboard/archivos.php?action=';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';

//Función para setar el nombre de la empresa y archivo
function setEmpresaFolder() {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_ARCHIVO + 'obtenerEmpFol', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    nombreEmpresa.value = response.dataset.nombre_empresa;
                    nombreFolder.value = response.dataset.nombre_folder;
                    // Se actualizan los campos para que las etiquetas (labels) no queden sobre los datos.
                    M.updateTextFields();
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Opciones para los modal
var opcionesModal = {
    preventScrolling: true,//Evita que se pueda hacer scroll a la página principal
    dismissible: false,
    onOpenStart: function () {
        // Se restauran los elementos del formulario.
        document.getElementById('archForm').reset();
        let nombreArchivoInp = document.getElementById('nombreArchivo-input');
        //Ocultamos el preloader
        preloaderAñadirArchivo.style.display = 'none';
        //Habilitamos el boton de añadir
        añadirArchivobtn.classList.remove("disabled");
        //Ocultamos el mensaje
        mensaje.style.display = 'none';
        //Limpiamos los campos
        //Creamos arreglo de los componentes a limpiar
        arregloLC = [nombreEmpresa, nombreFolder, archivoSubido, nombreArchivoInp];
        borrarCampos(arregloLC);
        resetPrevisualizador();
        setEmpresaFolder();
        // Se actualizan los campos para que las etiquetas (labels) no queden sobre los datos.
        M.updateTextFields();
    }
}
//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.Modal.init(document.querySelectorAll('.modal'), opcionesModal);
    M.FormSelect.init(document.querySelectorAll('select'));
    //Inicializamos algunos metodos
    comprobarFolders();
    readRowsLimit(API_ARCHIVO, 0);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    //Ocultamos el boton de atras para la páginación
    BOTONATRAS.style.display = 'none';
    //Ejecutamos la función para predecir si habrá un boton de adelante
    predecirAdelante();
});

var hastatop = document.getElementById("hasta_arriba");

window.onscroll = function () {
    if (document.documentElement.scrollTop > 200) {
        hastatop.style.display = "block";
    } else {
        hastatop.style.display = "none";
    }

    //Para páginación del servidor
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {

        // Se evita recargar la página web después de enviar el formulario.
        // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
        if (BUSCADORINP.value.length > 0) {
            limitBuscar *= 10;
            // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
            dynamicSearcherlimit(API_ARCHIVO, 'buscador-form', limitBuscar);;
        }
    }
};

hastatop.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

//Creamos las variables a utilizar
//Nombre de la empresa
const nombreEmpresa = document.getElementById('nombreempr-arch');
//Nombre del folder
const nombreFolder = document.getElementById('nombrefold-arch');
//Input de subir archivo
var archivoSubido = document.getElementById('archivosubido-arch');
//Contenedor del preview file
const previewContenedor = document.getElementById('preview-col');
//Texto decorativo del previw
var textoPreview = document.getElementById('texto-prevw');
//Imagen del preview
var imgPreview = document.getElementById('imagen-Preview');
//Boton de subir archivo
const añadirArchivobtn = document.getElementById('btn-añadirArchivoarhModal');
//Fila de agregar archivo
const agregarArchivoFila = document.getElementById('fila-agregararch');
//Boton de cancelar subir archivo
const cancelarArchivobtn = document.getElementById('cancelar-Añadirempr');
//Mensaje del modal
const mensaje = document.getElementById('mensaje-anadirarh');
//Preloader del modal Añadir Archivo
const preloaderAñadirArchivo = document.getElementById('preloader-añadirarh');
//Barra de estado en la subida del archivo
const barraEstadoSub = document.getElementById('barraraprg-garch');
//Constante del previsualizador del PDF
const prevPDF = document.getElementById('prevPDF-arh');
//Preloader de confirmación de eliminación de empresa
var preloaderEliminarempre = document.getElementById('confirmareliminarempr_preloader');
//Boton de confirmación de eliminación del empresa
var eliminarEmpresaBtn = document.getElementById('aceptareliminarempresa_boton');
//Boton de cancelar eliminación del empresa
var cancelEliminarEmprBtn = document.getElementById('cancelar-eliminarempr');
//Variable global de la empresa seleccionada
var idFolder;
var limitBuscar
//Contenedor de los archivos 
const ARCHCONT = document.getElementById('contenedorArch');
//Boton de añadir archivo
const ANADIRARCHBTN = document.getElementById('añadir-archivo');
const PRELOADER = document.getElementById('preloader-cargarJ');//Preloader de carga para los elementos
const BOTONATRAS = document.getElementById("pagnavg-atr");//Boton de navegacion de atras
const BOTONNUMEROPAGI = document.getElementById("pagnumeroi");//Boton de navegacion paginai
const BOTONNUMEROPAGF = document.getElementById("pagnumerof");//Boton de navegacion paginaf
const BOTONADELANTE = document.getElementById("pagnavg-adl");//Boton de navegacion de adelante
const BUSCADORINP = document.getElementById('inputbuscar-archivos');//Input del buscador
const MODALARCH = document.getElementById('anadir-archivoarh');//Modal de añadir o modificar el archivo
const IDARCH = document.getElementById('id_arch');
//Boton de confirmación de modificación de empresa
//Función al precionar el boton de subir archivo
añadirArchivobtn.addEventListener('click', function () {
    let nombreArchivoInp = document.getElementById('nombreArchivo-input');
    //Validar los campos vacios
    //Creamos arreglo de componentes para enviarlos a una función que los evaluará
    let arregloVCV = [nombreEmpresa, nombreFolder];
    if (validarCamposVacios(arregloVCV) != false) {
        if (archivoSubido.value.length != 0 || IDARCH.value.length !=0) {
            mensaje.style.display = 'none';
            preloaderAñadirArchivo.style.display = 'block';
            añadirArchivobtn.classList.add("disabled");
            // Se define una variable para establecer la acción a realizar en la API.
            let action = '';
            // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
            (IDARCH.value) ? action = 'update' : action = 'create';
            // Petición para obtener en nombre del usuario que ha iniciado sesión.
            let form = new FormData(document.getElementById('archForm'));
            form.append('nombre', nombreArchivoInp.value);
            let date = new Date();
            let fecha = date.toISOString().split('T')[0];
            form.append('fecha', fecha);
            form.append('id', IDARCH.value);
            console.log(form.get('nombre'))
            fetch(API_ARCHIVO + action, {
                method: 'post',
                body: form
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    // Se obtiene la respuesta en formato JSON.
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            // Se cierra la caja de dialogo (modal) del formulario.
                            M.Modal.getInstance(MODALARCH).close();
                            // Se cargan nuevamente las filas en la tabla de la vista después de guardar un registro y se muestra un mensaje de éxito.
                            readRowsLimit(API_ARCHIVO, 0);
                            sweetAlert(1, response.message, null);
                        } else {
                            //Ocultamos el preloader
                            preloaderAñadirArchivo.style.display = 'none';
                            //Habilitamos el boton de añadir
                            añadirArchivobtn.classList.remove("disabled");
                            //Ocultamos el mensaje
                            mensaje.style.display = 'none';
                            sweetAlert(2, response.exception, null);
                        }
                    });
                } else {
                    console.log(request.status + ' ' + request.statusText);
                }
            });
        } else {
            mensaje.style.display = 'block';
            mensaje.innerText = '¡No olvides añadir un archivo!';
        }
    } else {
        mensaje.style.display = 'block';
        mensaje.innerText = '¡No se permiten campos vacios!';
    }
});
//Función al precionar el boton de regresar o cancelar añadir archivo
cancelarArchivobtn.addEventListener('click', function () {
    let nombreArchivoInp = document.getElementById('nombreArchivo-input');
    //Ocultamos el preloader
    preloaderAñadirArchivo.style.display = 'none';
    //Habilitamos el boton de añadir
    añadirArchivobtn.classList.remove("disabled");
    //Ocultamos el mensaje
    mensaje.style.display = 'none';
    //Limpiamos los campos
    //Creamos arreglo de los componentes a limpiar
    arregloLC = [nombreEmpresa, nombreFolder, archivoSubido, nombreArchivoInp];
    borrarCampos(arregloLC);
    resetPrevisualizador();
});
//Creamos evento para que al seleccionar un archivo se pueda visualizar o mostrar una opción que 
archivoSubido.addEventListener('change', function (e) {
    //Mostramos la barra de carga
    barraEstadoSub.style.display = 'block';
    //Validamos que no este vacio
    if (archivoSubido.value != 0) {
        prevArchivo(e);
    } else {
        resetPrevisualizador();
    }
    ;
});
//Creamos función para previsualizar
function prevArchivo(e) {
    //Creamos la  ruta del archivo
    var archivoRuta = archivoSubido.value;
    //Creamos las extensiones de imagenes y pdf para saber si es pdf o imagen
    var extIMG = /(.JPG|.PNG|.jpg|.jpg|.jpeg|.JPEG)$/i;//Imagen 
    var extPDF = /(.pdf|.PDF|.GIF|.gif|.mp3|.MP3)$/i;//PDF
    //Creamos un lector de archivos
    const reader = new FileReader();
    //Comprobamos si es compatible para previsualizar
    if (!extIMG.exec(archivoRuta) && !extPDF.exec(archivoRuta)) {
        //Como no lo es
        //Ocultamos el contenedor del previsualizador del pdf por si acaso
        prevPDF.style.display = 'none';
        //Cambiamos el texto del previsualizar para indicar que no se pudo previsualizar
        textoPreview.style.display = 'block';
        textoPreview.innerText = 'Este archivo esta subido pero no esta disponible para visualizar';
        //Regresando la imagen a su estado original
        imgPreview.style.display = 'block';
        imgPreview.style.width = '45px';
        imgPreview.style.height = '45px';
        //Colocando la imagen que indica que hubo un error
        imgPreview.setAttribute("src", '../resources/img/previsualizar-imgerror.png');
        barraEstadoSub.style.display = 'none';
    } else if (extPDF.exec(archivoRuta)) {
        //Como es pdf mostraremos el pdf
        //Ocultamos la imagen y texto por default
        imgPreview.style.display = 'none';
        textoPreview.style.display = 'none';
        //Mostramos el componente del previsualizador del pdf
        prevPDF.style.display = 'block';
        //Creamos evento que coloque el resultado del lector de archivo al cargar
        reader.addEventListener("load", function (e) {
            prevPDF.setAttribute("src", e.target.result);
            barraEstadoSub.style.display = 'none';
        })
        //Indicamos de donde obtendra el lector de archivos el resultado
        reader.readAsDataURL(archivoSubido.files[0]);
    } else if (extIMG.exec(archivoRuta)) {
        //Como es imagen mostraremos la imagen en el componente de previsualización
        prevPDF.style.display = 'none';
        //Ocultamos el texto del preview
        textoPreview.style.display = 'none';
        //Mostramos imagen
        imgPreview.style.display = 'block';
        //Asignamos nuevos valores al componente de la imagen para que avarque el maximo de altura y anchura
        imgPreview.style.width = '100%';
        imgPreview.style.height = '100%';
        //Creamos evento que coloque el resultado del lector de archivo al cargar
        reader.addEventListener("load", function () {
            imgPreview.setAttribute("src", this.result);
            barraEstadoSub.style.display = 'none';
        })
        //Indicamos de donde obtendra el lector de archivos el resultado
        reader.readAsDataURL(archivoSubido.files[0]);
    }
}
//Regresar el previsualizar a estado normal
function resetPrevisualizador() {
    //Regresamos todo al estado original
    textoPreview.innerText = 'Previsualizador de Archivos';
    textoPreview.style.display = 'block';
    //Mostramos imagen
    imgPreview.style.display = 'block';
    imgPreview.style.width = '45px';
    imgPreview.style.height = '45px';
    imgPreview.setAttribute("src", '../resources/img/previsualizar-img.png');
    barraEstadoSub.style.display = 'none';
    prevPDF.style.display = 'none';
};
//Metodo para verificar que se halla seleccionado una empresa
function comprobarFolders() {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_GLBVAR + 'getIdFolder', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si hay no hay una session para admins
                if (response.status) {
                    //Seteamos la variable global de empresa
                    idFolder = response.id_folder;
                    console.log(idFolder);
                    //Ejecutamos el metodo de comprobarAdmin
                    comprobarAmin();
                } else {
                    location.href = 'folders.html';
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
                    ANADIRARCHBTN.classList.add('hide');
                    document.querySelectorAll('.eliminarbtn').forEach(elemen =>
                        elemen.classList.add('hide')
                    );
                } else {
                    ANADIRARCHBTN.classList.remove('hide');
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

//Validar la extensión del archivo
function extensionVal(archivo) {
    if (archivo.includes('.PDF') || archivo.includes('.pdf') || archivo.includes('.JPG') || archivo.includes('.PNG') || archivo.includes('.jpg') || archivo.includes('.png') || archivo.includes('.jpeg') || archivo.includes('.JPEG') || archivo.includes('.mp4') || archivo.includes('.MP4')) {
        return true;
    } else {
        return false;
    }
}

//Función para llenar el contenedor de clientes con los datos obtenidos del controlador de components
function fillTable(dataset) {
    let content = '';
    PRELOADER.style.display = 'block';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.nombre_original}</td>
                <td>${row.tamano}</td>
                <td>${row.fecha_subida}</td>
                <td class="col s9">
        `;
        if (extensionVal(row.nombre_original)) {
            content += `
                    <a onclick="delArch(${row.id_archivo})" class="tooltipped eliminarbtn" data-position="top"
                    data-tooltip="Eliminar archivo permanentemente"><img class="icono-eliminar"
                    src="../resources/icons/eliminar-archivo.png"></a>
                    <a onclick="modArch(${row.id_archivo})" class="tooltipped eliminarbtn" data-position="top"
                    data-tooltip="Modificar archivo"><img class="icono-modificar"
                    src="../resources/icons/modificar-archivo.png"></a>
                    <a href="../api/documents/archivosFolders/${row.nombre_archivo}" class="tooltipped" data-position="top"
                    data-tooltip="Descargar archivo" download="${row.nombre_original}"><img class="icono-descarga"
                    src="../resources/icons/descarga.png"></a>
                    <a href="../api/documents/archivosFolders/${row.nombre_archivo}" class="tooltipped" data-position="top"
                    data-tooltip="Visualizar archivo" target="_blank"><img class="icono-ver"
                    src="../resources/icons/ver-archivo.png"></a>
                </td>
            `;
        } else {
            content += `
                    <a onclick="delArch(${row.id_archivo})" class="tooltipped eliminarbtn" data-position="top"
                    data-tooltip="Eliminar archivo permanentemente"><img class="icono-eliminar"
                    src="../resources/icons/eliminar-archivo.png"></a>
                    <a onclick="modArch(${row.id_archivo})" class="tooltipped eliminarbtn" data-position="top"
                    data-tooltip="Modificar archivo"><img class="icono-modificar"
                    src="../resources/icons/modificar-archivo.png"></a>
                    <a href="../api/documents/archivosFolders/${row.nombre_archivo}" class="tooltipped" data-position="top"
                    data-tooltip="Descargar archivo" download="${row.nombre_original}"><img class="icono-descarga"
                    src="../resources/icons/descarga.png"></a>
                </td>
            `;
        }

    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    ARCHCONT.innerHTML = content;
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
    let limit = (paginaFinal * 5) - 5;
    console.log("El limite sería: " + limit);
    //Ejecutamos el metodo de la API para saber si hay productos y esta ejecutará una función que oculte o muestre el boton de adelante
    predictLImit(API_ARCHIVO, limit);
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
    }else{
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
        let limit = (number * 5) - 5;
        //Se ejecuta la recarga de datos enviando la variable de topAct
        //Ejecutamos la función para predecir si habrá un boton de adelante
        readRowsLimit(API_ARCHIVO, limit);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    });
});

//Función del buscador dinamico
BUSCADORINP.addEventListener('keyup', function (e) {
    if (BUSCADORINP.value == '') {
        readRowsLimit(API_ARCHIVO, 0);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    } else {
        limitBuscar = 10;
        // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
        dynamicSearcherlimit(API_ARCHIVO, 'buscador-form', limitBuscar);
    }
});

//Función cuando el buscador no encuentra los datos
function noDatos() {
    let h = document.createElement("h3");
    let text = document.createTextNode("0 resultados");
    h.appendChild(text);
    ARCHCONT.innerHTML = "";
    ARCHCONT.append(h);
}

//Función para preparar el modal/formulario de añadir archivo
function crearArch() {
    // Se abre la caja de diálogo (modal) que contiene el formulario.
    M.Modal.getInstance(MODALARCH).open();
}

//Creamos función para previsualizar
function prevArchivoMod(archivomod) {
    //Creamos la  ruta del archivo
    var archivoRutaMod = '../api/documents/archivosFolders/' + archivomod;
    //Creamos las extensiones de imagenes y pdf para saber si es pdf o imagen
    var extIMG = /(.JPG|.PNG|.jpg|.jpg|.jpeg|.JPEG)$/i;//Imagen 
    var extPDF = /(.pdf|.PDF|.GIF|.gif|.mp3|.MP3)$/i;//PDF
    //Creamos un lector de archivos
    const reader = new FileReader();
    //Comprobamos si es compatible para previsualizar
    if (!extIMG.exec(archivoRutaMod) && !extPDF.exec(archivoRutaMod)) {
        //Como no lo es
        //Ocultamos el contenedor del previsualizador del pdf por si acaso
        prevPDF.style.display = 'none';
        //Cambiamos el texto del previsualizar para indicar que no se pudo previsualizar
        textoPreview.style.display = 'block';
        textoPreview.innerText = 'Este archivo esta subido pero no esta disponible para visualizar';
        //Regresando la imagen a su estado original
        imgPreview.style.display = 'block';
        imgPreview.style.width = '45px';
        imgPreview.style.height = '45px';
        //Colocando la imagen que indica que hubo un error
        imgPreview.setAttribute("src", '../resources/img/previsualizar-imgerror.png');
        barraEstadoSub.style.display = 'none';
    } else if (extPDF.exec(archivoRutaMod)) {
        //Como es pdf mostraremos el pdf
        //Ocultamos la imagen y texto por default
        imgPreview.style.display = 'none';
        textoPreview.style.display = 'none';
        //Mostramos el componente del previsualizador del pdf
        prevPDF.style.display = 'block';
        //Creamos evento que coloque el resultado del lector de archivo al cargar
        prevPDF.setAttribute("src", archivoRutaMod);
    } else if (extIMG.exec(archivoRutaMod)) {
        //Como es imagen mostraremos la imagen en el componente de previsualización
        prevPDF.style.display = 'none';
        //Ocultamos el texto del preview
        textoPreview.style.display = 'none';
        //Mostramos imagen
        imgPreview.style.display = 'block';
        //Asignamos nuevos valores al componente de la imagen para que avarque el maximo de altura y anchura
        imgPreview.style.width = '100%';
        imgPreview.style.height = '100%';
        //Creamos evento que coloque el resultado del lector de archivo al cargar
        imgPreview.setAttribute("src", archivoRutaMod);
    }
}

//Función para modificar el folder
function modArch(id) {
    //Se muestra el cargador
    PRELOADER.style.display = 'block';
    // Se define un objeto con los datos del registro seleccionado.
    const form = new FormData();
    form.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_ARCHIVO + 'readOne', {
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
                    M.Modal.getInstance(MODALARCH).open();
                    //Llenamos los datos 
                    IDARCH.value = response.dataset.id_archivo;
                    let nombreArchivoInp = document.getElementById('nombreArchivo-input');
                    nombreArchivoInp.value = response.dataset.nombre_original;
                    //Cargamos la imagen en caso se puedea
                    prevArchivoMod(response.dataset.nombre_archivo);
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

//Eliminar archivo
function delArch(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const form = new FormData();
    form.append('id', id);
    // Se llama a la función que elimina un registro. Se encuentra en el archivo components.js y paso el valor de 8 para recargar los clientes
    confirmDeleteL(API_ARCHIVO, form, 0);
}