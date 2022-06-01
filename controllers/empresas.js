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
});
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
    guionNIT(e, NITempr);
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
        mensaje.style.display = 'none';
        preloaderAñadirempre.style.display = 'block';
        btnAñadirEmpr.classList.add("disabled");
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
        mensaje.style.display = 'none';
        preloaderModificarempre.style.display = 'block';
        modificarEmpresaBtn.classList.add("disabled");
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
    guionNIT(e, modNITEmpr);
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
//Redireccionar a folders
var cards = document.getElementsByClassName('card-content');
for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function (e) {
        window.location.href = "folders.html";
    });
}