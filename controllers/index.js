// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPLEADOS = SERVER + 'dashboard/empleados.php?action=';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';

//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
});
//Inputs
const LOGINBTN = document.getElementById('Iniciar_btn');//Boton de inicio de sesión
const USUARIOTXT = document.getElementById('username');//input del nombre del usuario
const CONTRAINPUT = document.getElementById('contraseña');
const OJOICON = document.getElementById('ocultarmostrar_contraseña');

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
//Visualizar u ocultar contraseña
OJOICON.addEventListener('click',function(){
    if (CONTRAINPUT.type == "password") {
        CONTRAINPUT.type = "text"
        OJOICON.innerText = "visibility_off"
    } else {
        CONTRAINPUT.type = "password"
        OJOICON.innerText = "visibility"
    }
});





//Función de log in
LOGINBTN.addEventListener('click', function () {
    if (USUARIOTXT.value.length > 0 && CONTRAINPUT.value.length > 0) {
        LOGINBTN.classList.add('disabled');
        fetch(API_EMPLEADOS + 'logIn', {
            method: 'post',
            body: new FormData(document.getElementById('session-form'))
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.status) {
                        sweetAlert(1, response.message, 'inicio.html');
                        LOGINBTN.classList.remove('disabled');
                    } else {
                        LOGINBTN.classList.remove('disabled');
                        sweetAlert(2, response.exception, null);
                    }
                });
            } else {
                LOGINBTN.classList.remove('disabled');
                console.log(request.status + ' ' + request.statusText);
            }
        });
    } else {
        sweetAlert(3, 'Debe de completar el formulario para iniciar sesion', null);
    }
});
