//Opciones para los modal
//Modal de añadir empresa
var opcionesModalAñadir={
    preventScrolling: true,
    onCloseEnd: function(){
        limpiarAñadirModal()
    }
}; 
//Modal de modificar folders
var opcionesModalModificar={
    preventScrolling: true,
    onCloseEnd: function(){
        limpiarModificarModal()
    }
};
//Modal de modificar folders
var opcionesModalEliminar={
    preventScrolling: true,
    onCloseEnd: function(){
        limpiarEliminarFolders()
    }
};
//Limpiar los campos de Modificar Folders
function limpiarModificarModal(){
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-modificarfold');
    //Limpiamos campos
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [modNombreFolder];
    borrarCampos(arregloVCV);
    mensaje.style.display='none';
    preloaderModificarFold.style.display='none';
    btnModificarFolder.classList.remove('disabled');
};
//Limpiar los campos de Añadir Folders
function limpiarAñadirModal(){
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-anadirfold');
    //Limpiamos campos
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [nombreFolder];
    borrarCampos(arregloVCV);
    mensaje.style.display='none';
    preloaderAñadirFold.style.display='none';
    btnAnadirFolder.classList.remove('disabled');
};
//Limpiar los campos de Eliminar Empresas
function limpiarEliminarFolders(){
    preloaderEliminarFold.style.display='none';
    btnAceptarEliminarFold.classList.remove('disabled');
};
//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.Modal.init(document.querySelectorAll('#modalAnadirFolder'),opcionesModalAñadir);
    M.Modal.init(document.querySelectorAll('#modificar-foldermodal'),opcionesModalModificar);
    M.Modal.init(document.querySelectorAll('#eliminar-foldermodal'),opcionesModalEliminar);
    M.Modal.init(document.querySelectorAll('#cerrarSesionModal'));
});
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
window.onscroll = function(){
    if(document.documentElement.scrollTop >100){
        hastatop.style.display = "block";
    }else{
        hastatop.style.display = "none";
    }
};

hastatop.addEventListener('click', function(){
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
});
//Acción del boton de añadir Folder
btnAnadirFolder.addEventListener('click',function(){
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-anadirfold');
    //Validamos campos Vacios
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [nombreFolder];
    if(validarCamposVacios(arregloVCV)!=false){
        mensaje.style.display = 'none';
        preloaderAñadirFold.style.display = 'block';
        btnAnadirFolder.classList.add('disabled');
    }else{
        mensaje.innerText= '¡No olvides ponerle un nombre a tu folder!';
        mensaje.style.display = 'block';
    }
});
//Acción del boton de cancelar Añadir folder
btnCancelAñadirFold.addEventListener('click',function(){
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-anadirfold');
    //Limpiamos campos
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [nombreFolder];
    borrarCampos(arregloVCV);
    mensaje.style.display='none';
    preloaderAñadirFold.style.display='none';
    btnAnadirFolder.classList.remove('disabled');
});
//Acción del boton de confirmar eliminar folder
btnAceptarEliminarFold.addEventListener('click',function(){
    preloaderEliminarFold.style.display='block';
    btnAceptarEliminarFold.classList.add('disabled');
});
//Acción del boton de cancelar eliminar folder
btnCancelEliminarFold.addEventListener('click',function(){
    preloaderEliminarFold.style.display='none';
    btnAceptarEliminarFold.classList.remove('disabled');
});
//Acción del boton de modificar folder
btnModificarFolder.addEventListener('click',function(){
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-modificarfold');
    //Validamos campos Vacios
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [modNombreFolder];
    if(validarCamposVacios(arregloVCV)!=false){
        mensaje.style.display = 'none';
        preloaderModificarFold.style.display = 'block';
        btnModificarFolder.classList.add('disabled');
    }else{
        mensaje.innerText= '¡No olvides ponerle un nombre a tu folder!';
        mensaje.style.display = 'block';
    }
});
//Accion del boton de cancelar modificación del folder
btnCancelModificarFold.addEventListener('click',function(){
    //Obtenemos el componente de mensaje
    let mensaje = document.getElementById('mensaje-modificarfold');
    //Limpiamos campos
    //Creamos arreglo para enviar los componentes a evaluar
    let arregloVCV = [modNombreFolder];
    borrarCampos(arregloVCV);
    mensaje.style.display='none';
    preloaderModificarFold.style.display='none';
    btnModificarFolder.classList.remove('disabled');
});
//Redireccionar a archivos
var cards = document.getElementsByClassName('card-content');
for(var i=0; i<cards.length;i++){
    cards[i].addEventListener("click",function(){
        window.location.href = "archivos.html"; 
    });
}