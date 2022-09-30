// Constante para establecer la ruta y parámetros de comunicación con las API.
const API_GLBVAR = SERVER + 'variablesgb.php?action=';//Variable de api de variables globales


document.addEventListener('DOMContentLoaded', function () {
    //Inicializamos los componentes de materialize
    M.AutoInit();
    //Inicializamos algunas funciones importantes
    setEmpleado();
})

//Inicializamos algunas variables
//Input de subir archivo
const archivoSubido = document.getElementById('archivosubido-arch');
//Contenedor del preview file
const previewContenedor = document.getElementById('preview-col');
//Texto decorativo del previw
const textoPreview = document.getElementById('texto-prevw');
//Imagen del preview
const imgPreview = document.getElementById('imagen-Preview');
//Boton de subir archivo
const añadirArchivobtn = document.getElementById('btn-añadirArchivoarhModal');
//Fila de agregar archivo
const agregarArchivoFila = document.getElementById('fila-agregararch');
//Boton de cancelar subir archivo
const cancelarArchivobtn = document.getElementById('cancelarSupp');
//Mensaje del modal
const mensaje = document.getElementById('mensaje-anadirarh');
//Barra de estado en la subida del archivo
const barraEstadoSub = document.getElementById('barraraprg-garch');
//Constante del previsualizador del PDF
const prevPDF = document.getElementById('prevPDF-arh');
const descripArch = document.getElementById('descripcion');

///*Boton de ir hacia arrina*/
const hastatop = document.getElementById('hasta_arriba');
window.onscroll = function () {
    if (document.documentElement.scrollTop > 100) {
        hastatop.style.display = "block";
    } else {
        hastatop.style.display = "none";
    }
};

hastatop.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
});

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
                    document.getElementById('nombre_emp').value = response.nombre + ' ' + response.apellido;
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

//Función al precionar el boton de regresar o cancelar añadir archivo
cancelarArchivobtn.addEventListener('click', function () {
    let nombreArchivoInp = document.getElementById('nombreArchivo-input');
    //Habilitamos el boton de añadir
    añadirArchivobtn.classList.remove("disabled");
    //Limpiamos los campos
    //Creamos arreglo de los componentes a limpiar
    arregloLC = [descripArch, archivoSubido,];
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

//Evento que se realizará al enviar el formulario
document.getElementById('formSupport').addEventListener('submit', (event)=>{
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Enviamos la solicitud
    const url = SERVER + 'enviarSolicitudSP.php';
    fetch(url, {
        method: 'post',
        body: new FormData(document.getElementById('formSupport'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    sweetAlert(1,response.message,null);
                    M.Modal.getInstance(document.getElementById('modal-template')).close();
                } else {
                    sweetAlert(2,response.exception,null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
})

