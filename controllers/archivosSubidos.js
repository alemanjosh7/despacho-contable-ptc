// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPRESAS = SERVER + 'dashboard/empresas.php?action=';
const ENDPOINT_EMPRESAS = SERVER + 'dashboard/empresas.php?action=readEmprAllUser';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';
const API_ARCHIVOS = SERVER + 'dashboard/archivosSubidos.php?action=';

//Función para setar el nombre del empleado en el modal
function setEmpleado() {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_GLBVAR + 'getNombreApellido', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    NOMBREEMP.value = response.nombre + ' ' + response.apellido;
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

var hastatop = document.getElementById("hasta_arriba");

window.onscroll = function () {
    if (document.documentElement.scrollTop > 200) {
        hastatop.style.display = "block";
    } else {
        hastatop.style.display = "none";
    }
};

hastatop.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

//Opciones para los modal
var opcionesModal = {
    preventScrolling: true,//Evita que se pueda hacer scroll a la página principal
    dismissible: false,//Evita que se pueda salir mediante teclado o click afuera
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
        arregloLC = [DESCARC, NOMBREEMP, archivoSubido, nombreArchivoInp];
        borrarCampos(arregloLC);
        resetPrevisualizador();
        setEmpleado();
        // Se actualizan los campos para que las etiquetas (labels) no queden sobre los datos.
        M.updateTextFields();
        M.textareaAutoResize(DESCARC);
    }
}
//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.Modal.init(document.querySelectorAll('.modal'), opcionesModal);
    M.FormSelect.init(document.querySelectorAll('select'));
    //Inicializamos algunos metodos
    comprobarAmin();
    cargarEmpresas();//Carga las empresas disponibles para el usuario
    readRowsLimit(API_ARCHIVOS, 0);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    //Ocultamos el boton de atras para la páginación
    BOTONATRAS.style.display = 'none';
    predecirAdelante();//Predecimos si hay más datos para la páginación
});

//Declaramos algunas constantes
const ANADIRARCHBTN = document.getElementById('anadir_archivo');//Boton para añadir archivo
const EMPRESASCONT = document.getElementById('cont_empresas');//Contenedor de las empresas
const PRELOADER = document.getElementById('preloader-cargarJ');//Preloader de carga para los elementos
const EMPRESAINP = document.getElementById('company-searcher');//Preloader de carga para los elementos
const ARCHIVOCONT = document.getElementById('archivo_cont');//Contenedor de los archivos
const BUSCADORARCH = document.getElementById('input-file');//Contenedor de los archivos
const BOTONATRAS = document.getElementById("pagnavg-atr");//Boton de navegacion de atras
const BOTONNUMEROPAGI = document.getElementById("pagnumeroi");//Boton de navegacion paginai
const BOTONNUMEROPAGF = document.getElementById("pagnumerof");//Boton de navegacion paginaf
const BOTONADELANTE = document.getElementById("pagnavg-adl");//Boton de navegacion de adelante
const MODALARCH = document.getElementById('anadir-archivoarh');//Modal de añadir o modificar el archivo
const IDARCH = document.getElementById('id_arch');//Id del archivo
const SELECTEMP = document.getElementById('empresas_select');//Select de la empresa
const FECHAINP = document.getElementById('fecha');//Input de la fecha de subida del archivo
const FECHACONT = document.getElementById('fecha_cont');//Contenedor de la fecha de subida del archivo
const NOMBREEMPCONT = document.getElementById('nombre_empcont');//Contenedor del nombre del empleado
const SELECTEMPCONT = document.getElementById('selectemp_cont');//Contenedor del nombre del empleado
const INDICBTN = document.getElementById('titulo_guardarbtn');
var nombreArchivoDesc;
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
                if(response.cambioCtr){
                    location.href = 'index.html';
                }else if (!response.status) {
                    ANADIRARCHBTN.classList.remove('hide');
                    document.querySelectorAll('.eliminarbtn').forEach(elemen =>
                        elemen.classList.add('hide')
                    );
                } else {
                    ANADIRARCHBTN.classList.add('hide');
                    document.querySelectorAll('.eliminarbtn').forEach(elemen =>
                        elemen.classList.remove('hide')
                    );
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Función para llenar las opciones de las empresas, dependiendo si es administrador o empleado, en caso de empleado 
//solo se mostrarán las empresas a las que el tenga acceso
function cargarEmpresas() {
    fetch(API_EMPRESAS + 'readEmprAllUser', {
        method: 'get',
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //Se ejecuta el metodo de llenado
                    let content = '';
                    PRELOADER.style.display = 'block';
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    content += `
                            <li class='empresa_in select_emprarc' id="0">Todas las empresas</li>
                        `;
                    response.dataset.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                            <li class='empresa_in' id='${row.id_empresa}'>${row.nombre_empresa}</li>
                        `;
                    });

                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    EMPRESASCONT.innerHTML = content;
                    PRELOADER.style.display = 'none';
                    document.querySelectorAll('.empresa_in').forEach(element => {
                        element.addEventListener("click", e => {
                            const id = Number(e.target.getAttribute("id"));
                            console.log(id);
                            element.classList.add('select_emprarc');
                            cambiarestadoempr(id);
                            filtrosBAE();
                        });
                    });
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Función del buscador dinamico para las empresas
EMPRESAINP.addEventListener('keyup', function (e) {
    if (EMPRESAINP.value == '') {
        cargarEmpresas();
    } else {
        // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
        dynamicSearcher3(API_EMPRESAS, 'buscador_empr');
    }
});

//Función cuando el buscador no encuentra los datos
function noDatos2() {
    let h = document.createElement("h3");
    let text = document.createTextNode("0 resultados");
    h.appendChild(text);
    EMPRESASCONT.innerHTML = "";
    EMPRESASCONT.append(h);
}

//Función para llenar las opciones de las empresas, dependiendo si es administrador o empleado, en caso de empleado 
//solo se mostrarán las empresas a las que el tenga acceso pero este depende del buscador
function fillTable2(dataset) {
    let content = '';
    PRELOADER.style.display = 'block';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    content += `
        <li class='empresa_in select_emprarc' id="0">Todas las empresas</li>
    `;
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <li class='empresa_in' id='${row.id_empresa}'>${row.nombre_empresa}</li>
        `;
    });
    EMPRESASCONT.innerHTML = content;
    PRELOADER.style.display = 'none';
    document.querySelectorAll('.empresa_in').forEach(element => {
        element.addEventListener("click", e => {
            const id = Number(e.target.getAttribute("id"));
            console.log(id);
            element.classList.add('select_emprarc');
            cambiarestadoempr(id);
            filtrosBAE();
        });
    });
}

//Función para cambiar el estado de las empresas si se les da click para dar estilo y de paso cargar los archivos
function cambiarestadoempr(id) {
    document.querySelectorAll('.empresa_in').forEach(element => {
        if (element.classList.contains('select_emprarc') && element.getAttribute("id") != id) {
            element.classList.remove('select_emprarc');
        }
    });
}

//Validar la extensión del archivo
function extensionVal(archivo) {
    if (archivo.includes('.PDF') || archivo.includes('.pdf') || archivo.includes('.JPG') || archivo.includes('.PNG') || archivo.includes('.jpg') || archivo.includes('.png') || archivo.includes('.jpeg') || archivo.includes('.JPEG') || archivo.includes('.mp4') || archivo.includes('.MP4') || archivo.includes('.MP3' || archivo.includes('.mp3'))) {
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
        if (extensionVal(row.nombre_original)) {
            content += `
                <!--Contenedor del archivo-->
                <div class="file-container">
                    <!--Contendor donde va a estar el nombre y un ícono representativo del archivo por default-->
                    <div class="file-name">
                        <!--Imagen de ícono para los archivos-->
                        <img src="../resources/icons/file-icon.png" alt="">
                        <!--Nombre del archivo-->
                        <p class="title-name">${row.nombre_original}</p>
                        <p class="title-name hide-on-med-and-down">&nbsp <b>${row.tamano}</b></p>
                    </div>
                    <!--Contenedor para mostrar las opciones que tiene para poder hacer en el archivo-->
                    <div class="file-options">
                        <!--Boton para visualizar-->
                        <a href="../api/documents/archivosEmpleados/${row.nombre_archivo}" class="tooltipped " data-position="top" data-tooltip="Visualizar archivo" target="_blank">
                            <img src="../resources/icons/ver-archivo.png" alt="">
                        </a>
                        <!--Boton para descargar-->
                        <a onclick="descArch(${row.id_archivos_subidosemp})" class="tooltipped hide-on-med-and-down" data-position="top" data-tooltip="Descargar archivo">
                            <img src="../resources/icons/download.png" alt="">
                        </a>
                        <!--Boton para eliminar archivo incluyendo un modal que se abre cuando se hace click en este-->
                        <a onclick='elimArch(${row.id_archivos_subidosemp})' class="tooltipped" data-position="top" data-tooltip="Eliminar archivo">
                            <img src="../resources/icons/delete.png" alt="">
                        </a>
                    </div>
                </div>
            `;
        } else {
            content += `
                <!--Contenedor del archivo-->
                <div class="file-container">
                    <!--Contendor donde va a estar el nombre y un ícono representativo del archivo por default-->
                    <div class="file-name">
                        <!--Imagen de ícono para los archivos-->
                        <img src="../resources/icons/file-icon.png" alt="">
                        <!--Nombre del archivo-->
                        <p class="title-name">${row.nombre_original}</p>
                        <p class="title-name hide-on-med-and-down">&nbsp <b>${row.tamano}</b></p>
                    </div>
                    <!--Contenedor para mostrar las opciones que tiene para poder hacer en el archivo-->
                    <div class="file-options">
                        <!--Boton para descargar-->
                        <a onclick="descArch(${row.id_archivos_subidosemp})" class="tooltipped hide-on-med-and-down" data-position="top" data-tooltip="Descargar archivo">
                            <img src="../resources/icons/download.png" alt="">
                        </a>
                        <!--Boton para eliminar archivo incluyendo un modal que se abre cuando se hace click en este-->
                        <a onclick='elimArch(${row.id_archivos_subidosemp})' class="tooltipped" data-position="top" data-tooltip="Eliminar archivo">
                            <img src="../resources/icons/delete.png" alt="">
                        </a>
                    </div>
                </div>
            `;
        }

    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    ARCHIVOCONT.innerHTML = content;
    PRELOADER.style.display = 'none';
    // Se inicializa el componente Tooltip para que funcionen las sugerencias textuales.
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
}

//Función cuando el buscador no encuentra los datos
function noDatos() {
    let h = document.createElement("h3");
    let text = document.createTextNode("0 resultados");
    h.appendChild(text);
    ARCHIVOCONT.innerHTML = "";
    ARCHIVOCONT.append(h);
}

//Función del buscador dinamico
BUSCADORARCH.addEventListener('keyup', function (e) {
    filtrosBAE();
});

//Función para el buscador y seleccion de las empresas y filtro
function filtrosBAE() {
    if (BUSCADORARCH.value == '' && document.getElementById('0').classList.contains('select_emprarc')) {
        readRowsLimit(API_ARCHIVOS, 0);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    } else {
        let idemp;
        //Recorremos las empresas para verificar si hay un filtro de empresa o no lo hay
        document.querySelectorAll('.empresa_in').forEach(element => {
            if (element.classList.contains('select_emprarc') && element.getAttribute("id") == 0) {
                idemp = element.getAttribute("id");
            } else if (element.classList.contains('select_emprarc')) {
                idemp = element.getAttribute("id");
            }
        });
        if (idemp == 0 && BUSCADORARCH.value != '') {
            console.log('Aqui es')
            //Ya que no hay un filtro
            // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
            dynamicSearcher2(API_ARCHIVOS, 'buscador_form');
        } else if (BUSCADORARCH.value != '') {
            console.log('Es con filtro ' + idemp);
            let form = new FormData();//Creamos un formulario
            //asignamos los valores, busqueda y id de la empresa que es el filtro
            form.append('search', BUSCADORARCH.value);
            form.append('filter', idemp);
            dynamicSearcher2Filter(API_ARCHIVOS, form);
        } else {
            let form1 = new FormData();//Creamos un formulario
            //asignamos los valores, busqueda y id de la empresa que es el filtro
            form1.append('filter', idemp);
            dynamicSearcher3Filter(API_ARCHIVOS, form1);
        }
    }
}

//Paginación
//Funciones para la páginación

//Función para saber si hay otra página
function predecirAdelante() {
    //Colocamos el boton con un display block para futuras operaciones
    BOTONADELANTE.style.display = 'block';
    //Obtenemos el número de página que seguiría al actual
    let paginaFinal = (Number(BOTONNUMEROPAGI.innerHTML)) + 2;
    console.log("pagina maxima " + paginaFinal);
    //Calculamos el limite que tendria el filtro de la consulta dependiendo de la cantidad de Clientes a mostrar
    let limit = (paginaFinal * 10) - 10;
    console.log("El limite sería: " + limit);
    //Ejecutamos el metodo de la API para saber si hay productos y esta ejecutará una función que oculte o muestre el boton de adelante
    predictLImit(API_ARCHIVOS, limit);
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
        let limit = (number * 10) - 10;
        //Se ejecuta la recarga de datos enviando la variable de topAct
        //Ejecutamos la función para predecir si habrá un boton de adelante
        readRowsLimit(API_ARCHIVOS, limit);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
        //Recorremos las empresas para setear que se esta buscando todas las empresas
        document.querySelectorAll('.empresa_in').forEach(element => {
            if (element.classList.contains('select_emprarc') && element.getAttribute("id") != 0) {
                element.classList.remove('select_emprarc');
            } else if (element.getAttribute("id") == 0) {
                element.classList.add('select_emprarc');
            }
        });
    });
});

//Funciones para la previsualización de archivos
//Creamos las variables a utilizar
//Nombre del empleado
const NOMBREEMP = document.getElementById('nombre_emp');
const DESCARC = document.getElementById('descripcion');
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

//Función para preparar el modal/formulario de añadir archivo
function crearArch() {
    // Se abre la caja de diálogo (modal) que contiene el formulario.
    M.Modal.getInstance(MODALARCH).open();
    document.getElementById('titulo_modal').innerText = 'Añadir Archivo';
    document.getElementById('indicacion_modal').innerHTML = 'Añada un archivo, este se guardará con el nombre que lo suba <b>¡No todos los archivos podran visualizarse!, los podrá descargar despues pero se recomienda eliminar tras descargar para no acumular</b>';
    fillSelect2(ENDPOINT_EMPRESAS, 'empresas_select', '¿A que empresa pertenece?', null, true);
    FECHACONT.classList.add('hide');
    NOMBREEMPCONT.classList.replace('l4', 'l6');
    SELECTEMPCONT.classList.replace('l5', 'l6');
    INDICBTN.innerText = 'Subir Archivo';
    DESCARC.removeAttribute('disabled', null);
    SELECTEMP.removeAttribute('disabled', null);
    archivoSubido.removeAttribute('disabled',null);
}

//Creamos función para previsualizar
function prevArchivoMod(archivomod) {
    //Creamos la  ruta del archivo
    var archivoRutaMod = '../api/documents/archivosEmpleados/' + archivomod;
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

//Función para preparar el modal del formulario para descargar
function descArch(id) {
    document.getElementById('titulo_modal').innerText = 'Descargar Archivo';
    document.getElementById('indicacion_modal').innerHTML = 'Descarga un archivo, <b>¡No todos los archivos podran visualizarse!</b>Tras haberlo descargado puede eliminarlo para liberar espacio y no acumularlo';
    FECHACONT.classList.remove('hide');
    NOMBREEMPCONT.classList.replace('l6', 'l4');
    SELECTEMPCONT.classList.replace('l6', 'l5');
    INDICBTN.innerText = 'Descargar archivo';
    DESCARC.setAttribute('disabled', null);
    SELECTEMP.setAttribute('disabled', null);
    archivoSubido.setAttribute('disabled',null);
    //Se muestra el cargador
    PRELOADER.style.display = 'block';
    // Se define un objeto con los datos del registro seleccionado.
    const form = new FormData();
    form.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_ARCHIVOS + 'readOne', {
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
                    IDARCH.value = response.dataset.id_archivos_subidosemp;
                    let nombreArchivoInp = document.getElementById('nombreArchivo-input');
                    nombreArchivoInp.value = response.dataset.nombre_original;
                    DESCARC.value = response.dataset.descripcion;
                    FECHAINP.value = response.dataset.fecha_subida;
                    nombreArchivoDesc = response.dataset.nombre_archivo;
                    fillSelect2(ENDPOINT_EMPRESAS, 'empresas_select', '¿A que empresa pertenece?', response.dataset.fk_id_empresa, true);
                    //Cargamos la imagen en caso se puedea
                    prevArchivoMod(response.dataset.nombre_archivo);
                    M.updateTextFields();
                    M.textareaAutoResize(DESCARC);
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
    arregloLC = [DESCARC, NOMBREEMP, archivoSubido, nombreArchivoInp];
    borrarCampos(arregloLC);
    resetPrevisualizador();
});

//Función al precionar el boton de subir archivo
añadirArchivobtn.addEventListener('click', function () {
    let nombreArchivoInp = document.getElementById('nombreArchivo-input');
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (IDARCH.value) ? action = 'download' : action = 'create';
    //Validar los campos vacios
    //Creamos arreglo de componentes para enviarlos a una función que los evaluará
    let arregloVCV = [DESCARC, NOMBREEMP];
    //Evaluamos si la acción es para crear o descargar
    switch (action) {
        case action = 'download':
            //Como es el caso para descargar
            let descabtn = document.createElement('a');
            descabtn.setAttribute('href', '../api/documents/archivosEmpleados/' + nombreArchivoDesc);
            descabtn.setAttribute('download', nombreArchivoInp.value);
            console.log(nombreArchivoDesc);
            document.body.appendChild(descabtn);
            descabtn.click();
            sweetAlert(1, 'La descarga del archivo a iniciado, si resulta un error puede reintentarlo, recuerde que puede borrar el archivo para liberar espacio y no acumular', null);
            //Cambiamos el estado del archivo a descargado para reportes
            let form2 = new FormData(document.getElementById('archForm'));
            form2.append('id', IDARCH.value);
            fetch(API_ARCHIVOS + 'estadoDesc', {
                method: 'post',
                body: form2
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    // Se obtiene la respuesta en formato JSON.
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                        } else {
                            sweetAlert(2, response.exception, null);
                        }
                    });
                } else {
                    console.log(request.status + ' ' + request.statusText);
                }
            });
            break;
        case action = 'create':
            //Como es el caso para crear
            if (validarCamposVacios(arregloVCV) != false && SELECTEMP.value != '¿A que empresa pertenece?') {
                if (archivoSubido.value.length != 0 && nombreArchivoInp.value.length <=15) {
                    mensaje.style.display = 'none';
                    preloaderAñadirArchivo.style.display = 'block';
                    añadirArchivobtn.classList.add("disabled");
                    // Petición para obtener en nombre del usuario que ha iniciado sesión.
                    let form = new FormData(document.getElementById('archForm'));
                    form.append('nombre', nombreArchivoInp.value);
                    let date = new Date();
                    let fecha = date.toISOString().split('T')[0];
                    form.append('fecha', fecha);
                    form.append('id', IDARCH.value);
                    console.log(form.get('nombre'))
                    fetch(API_ARCHIVOS + action, {
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
                                    readRowsLimit(API_ARCHIVOS, 0);
                                    //Recorremos las empresas para setear que se esta buscando todas las empresas
                                    document.querySelectorAll('.empresa_in').forEach(element => {
                                        if (element.classList.contains('select_emprarc') && element.getAttribute("id") != 0) {
                                            element.classList.remove('select_emprarc');
                                        } else if (element.getAttribute("id") == 0) {
                                            element.classList.add('select_emprarc');
                                        }
                                    });
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
                    mensaje.innerText = '¡No olvides añadir un archivo con un nombre menor a 15 caracteres!';
                }
            } else {
                mensaje.style.display = 'block';
                mensaje.innerText = '¡No se permiten campos vacios!';
            }
            break;
        default: sweetAlert(4, 'No se ha podido verificar si desea descargar o subir un archivo', null);
    }
});

//Función para eliminar archivo
function elimArch(id){
    // Se define un objeto con los datos del registro seleccionado.
    const form = new FormData();
    form.append('id', id);
    // Se llama a la función que elimina un registro. Se encuentra en el archivo components.js y paso el valor de 8 para recargar los clientes
    confirmDeleteL(API_ARCHIVOS, form, 0);
}

//Programación para los reportes
document.getElementById('reporteFAE').addEventListener('click', function () {
    obtenerFechasRFAE();
    M.updateTextFields();
});

function obtenerFechasRFAE() {
    (async () => {

        const { value: formValues } = await Swal.fire({
            background: '#F7F0E9',
            confirmButtonColor: 'black',
            showDenyButton: true,
            denyButtonText: '<i class="material-icons">cancel</i> Cancelar',
            icon: 'info',
            title: 'Indique las fechas para el reporte, en formato YY-M-D',
            html:
                `   
                <div class="input-field">
                    <label for="swal-input1"><b>Fecha Inicial</b></label>
                    <input type="date" placeholder="Fecha inicial" id="swal-input1" class="center">
                </div>
                <div class="input-field">
                    <label for="swal-input2"><b>Fecha Final</b></label>
                    <input type="date" placeholder="Fecha Final" id="swal-input2" class="center">
                </div>
            `,
            focusConfirm: false,
            confirmButtonText:
                '<i class="material-icons">assignment</i> Generar reporte',
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ]
            }
        })

        if (formValues) {
            if(formValues[0].length>0 && formValues[1].length>0){
                //Swal.fire(JSON.stringify(formValues[0]))
                let params = '?fechai=' + formValues[0] + '&fechaf=' + formValues[1];
                // Se establece la ruta del reporte en el servidor.
                let url = SERVER + 'reports/reportArchivosESFX.php';
                // Se abre el reporte en una nueva pestaña del navegador web.
                window.open(url + params);
                console.log(params);
            }else{
                sweetAlert(3,'Debe seleccionar un rango de fechas',null);
            }
            
        }
    })()
}