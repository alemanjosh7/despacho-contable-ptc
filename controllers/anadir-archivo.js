//Opciones para los modal
var opcionesModal = {
    preventScrolling: true,//Evita que se pueda hacer scroll a la página principal
    dismissible: false//Evita que se pueda salir mediante teclado o click afuera
}
//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.Modal.init(document.querySelectorAll('.modal'), opcionesModal);
    M.FormSelect.init(document.querySelectorAll('select'));
});
//Creamos las variables a utilizar
//Nombre de la empresa
const nombreEmpresa = document.getElementById('nombreempr-arch');
//Nombre del folder
const nombreFolder = document.getElementById('nombrefold-arch');
//Nombre del archivo
const nombreArchivo = document.getElementById('nombre-arch');
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
//Boton de confirmación de modificación de empresa
//Función al precionar el boton de subir archivo
añadirArchivobtn.addEventListener('click', function () {
    //Validar los campos vacios
    //Creamos arreglo de componentes para enviarlos a una función que los evaluará
    let arregloVCV = [nombreEmpresa, nombreFolder, nombreArchivo];
    if (validarCamposVacios(arregloVCV) != false) {
        if (archivoSubido.value.length != 0) {
            mensaje.style.display = 'none';
            preloaderAñadirArchivo.style.display = 'block';
            añadirArchivobtn.classList.add("disabled");
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
    arregloLC = [nombreEmpresa, nombreArchivo, nombreFolder, archivoSubido,nombreArchivoInp];
    borrarCampos(arregloLC);
    resetPrevisualizador();
});
var inputfile = document.getElementById('archivoInput');
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
    var extIMG = /(.JPG|.PNG|.jpg|.jpg|.GIF|.gif|.mp4|.MP4|.jpeg|.JPEG|.mp3|.MP3)$/i;//Imagen 
    var extPDF = /(.pdf|.PDF)$/i;//PDF
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
        imgPreview.style.display ='block';
        imgPreview.style.width = '45px';
        imgPreview.style.height = '45px';
        //Colocando la imagen que indica que hubo un error
        imgPreview.setAttribute("src", '../resources/img/previsualizar-imgerror.png');
        barraEstadoSub.style.display = 'none';
    } else if (extPDF.exec(archivoRuta)) {
        //Como es pdf mostraremos el pdf
        //Ocultamos la imagen y texto por default
        imgPreview.style.display ='none';
        textoPreview.style.display = 'none';
        //Mostramos el componente del previsualizador del pdf
        prevPDF.style.display = 'block';
        //Creamos evento que coloque el resultado del lector de archivo al cargar
        reader.addEventListener("load",function(e){
            prevPDF.setAttribute("src",e.target.result);
            barraEstadoSub.style.display = 'none';
        })
        //Indicamos de donde obtendra el lector de archivos el resultado
        reader.readAsDataURL(archivoSubido.files[0]);
    } else if(extIMG.exec(archivoRuta)){
        //Como es imagen mostraremos la imagen en el componente de previsualización
        prevPDF.style.display = 'none';
        //Ocultamos el texto del preview
        textoPreview.style.display='none';
        //Mostramos imagen
        imgPreview.style.display ='block';
        //Asignamos nuevos valores al componente de la imagen para que avarque el maximo de altura y anchura
        imgPreview.style.width= '100%';
        imgPreview.style.height= '100%';
        //Creamos evento que coloque el resultado del lector de archivo al cargar
        reader.addEventListener("load",function(){
            imgPreview.setAttribute("src",this.result);
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
    imgPreview.style.display ='none';
    imgPreview.style.width = '45px';
    imgPreview.style.height = '45px';
    imgPreview.setAttribute("src", '../resources/img/previsualizar-img.png');
    barraEstadoSub.style.display = 'none'; 
    prevPDF.style.display = 'none';
};
/*Acción del evento del modal de eliminar empresa*/
//Validar que se muestre el preloader al aceptar eliminar empresa
eliminarEmpresaBtn.addEventListener('click', function(){
    preloaderEliminarempre.style.display='block';
    eliminarEmpresaBtn.classList.add('disabled');
});
//Validar que si se cancela la eliminación de empresa se esconda el preloader y se reactive el boton
cancelEliminarEmprBtn.addEventListener('click', function(){
    preloaderEliminarempre.style.display='none';
    eliminarEmpresaBtn.classList.remove('disabled');
});
