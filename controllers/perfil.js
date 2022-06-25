// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPLEADOS = SERVER + 'dashboard/empleados.php?action=';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';

//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.Modal.init(document.querySelectorAll('.modal'));
    M.Modal.init(document.querySelectorAll('#cerrarSesionModal'));
    M.Modal.init(document.querySelectorAll('#modalCambiarContraseña'));

    fetch(API_EMPLEADOS + 'readProfile', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del usuario que ha iniciado sesión.
                    document.getElementById('nombre_usuario-perfil').value = response.dataset[0].nombre_empleado;
                    document.getElementById('apellido_usuario-perfil').value = response.dataset[0].apellido_empleado;
                    document.getElementById('e-mail').value = response.dataset[0].correo_empleadocontc;
                    document.getElementById('dui_usuario-perfil').value = response.dataset[0].dui_empleado;
                    document.getElementById('telefono_usuario-perfil').value = response.dataset[0].telefono_empleadocontc;
                    document.getElementById('Username').value = response.dataset[0].usuario_empleado;
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
    // Se inicializa el componente Tooltip para que funcionen las sugerencias textuales.
});


var botonRestablecer = document.getElementById('restablecerContraseña');
botonRestablecer.addEventListener('click', () => {
    fetch(API_EMPLEADOS + 'actualizarContraL', {
        method: 'post',
        body: new FormData(document.getElementById('renovarcontr-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se muestra un mensaje de éxito.
                    sweetAlert(1, response.message, 'perfil.html');
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
})


var ojo = document.getElementById('ocultarmostrar_duiuser');
var dui = document.getElementById('dui_usuario-perfil');

ojo.addEventListener("click", function () {
    if (dui.type == "password") {
        dui.type = "text"
        ojo.innerText = "visibility_off"
    } else {
        dui.type = "password"
        ojo.innerText = "visibility"
    }
});

/*Telefono*/
var ojo2 = document.getElementById('ocultarmostrar_teleuser');
var telefono = document.getElementById('telefono_usuario-perfil');

ojo2.addEventListener("click", function () {
    if (telefono.type == "password") {
        telefono.type = "text"
        ojo2.innerText = "visibility_off"
    } else {
        telefono.type = "password"
        ojo2.innerText = "visibility"
    }
});

const regresarbtn = document.getElementById('regresarbtn-perfil');


//Evento para que regrese a la página anterior
regresarbtn.addEventListener('click',function(){
    history.go(-1)
});
