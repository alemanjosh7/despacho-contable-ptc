// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPLEADOS = SERVER + 'dashboard/empleados.php?action=';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';

//Función de actividad
var inactivityTime = function () {
    var timer;//Declaramos la variable timer
    var adviceTimer;//Declaramos la variable adviceTimer para enviar aviso cuando esta apunto de cerrar session
    var seg = 0;
    var itrv;
    window.onload = resetTimer; //Añadimos el método de resetTimer a la ventana al cargar
    document.onmousemove = resetTimer; ////Añadimos el método de resetTimer a al mover el mouse
    document.onkeydown = resetTimer; ////Añadimos el método de resetTimer a al dar click
    window.onmousedown = resetTimer; ////Añadimos el método de resetTimer a al dar click
    window.ontouchstart = resetTimer; // Reconoce deslizes de pantalla táctil    
    window.ontouchmove = resetTimer;  // Reconoce movimientos en algunas pantallas
    window.onclick = resetTimer;      //Añadimos método al dar click
    window.addEventListener('scroll', resetTimer, true);//Reconoce el Scroll

    //Función para cerrar session
    function activityLogOut() {
        fetch(API_GLBVAR + 'logOut', {
            method: 'get'
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                // Se obtiene la respuesta en formato JSON.
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.status) {
                        sweetAlert(1, 'Se ha cerrado session por tu inactividad', 'index.html');
                    } else {
                        sweetAlert(2, response.exception, null);
                    }
                });
            } else {
                console.log(request.status + ' ' + request.statusText);
            }
        });
    }

    function logAlert() {
        Swal.fire({
            background: '#F7F0E9',
            confirmButtonColor: 'black',
            icon: 'info',
            title: 'La session esta a punto de caducar da',
            showConfirmButton: true,
            html:
                ` 
                <p>Da click fuera de esta alerta</p>
                <h5 id="swal-adviceTimer">Se cerrara en <b></b> milisegundos</h5>              
            `,
            timer: 270000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            },
            focusConfirm: false,
            confirmButtonText:
                'Evitar',
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                activityLogOut();
            }
        })
    }

    //Reseteador del timer
    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(activityLogOut, 300000);
        clearTimeout(adviceTimer);
        adviceTimer = setTimeout(function () {
            logAlert();
        }, 270000);
    }
}




window.onload = function () {
    inactivityTime();
}

var gAuthv;

var optionsAuth = {
    onCloseEnd: function () {
        gAuthv = true;
        window.location.reload();
    }
}

//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.Modal.init(document.querySelectorAll('.modal'));
    M.Modal.init(document.querySelectorAll('#modalCambiarContraseña'));
    M.Modal.init(document.querySelectorAll('#gAuth_modal'),optionsAuth);
    comprobarAmin();
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
                    if(response.dataset[0].secret_auth){
                        gAuthv = true;
                    }else{
                        gAuthv = false;
                    }
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
});
//Declarando algunas constantes
const CONTRAN = document.getElementById('contrasena_nueva');//input de la contraseña nueva en restablecer contraseña
const CONTRAC = document.getElementById('contrasena_confirma');//input de la confirmación de la contraseña en restablecer contraseña

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
regresarbtn.addEventListener('click', function () {
    history.go(-1)
});

document.getElementById('cerrarSesionModalbtn').addEventListener('click', function () {
    fetch(API_EMPLEADOS + 'logOut', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    sweetAlert(1, response.message, 'index.html');
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});

document.getElementById('ocultarmostrar_contraseñas').addEventListener('click', function () {
    if (document.getElementById('contrasena_actual').type == "password") {
        document.getElementById('contrasena_actual').type = "text"
        document.getElementById('contrasena_nueva').type = "text"
        document.getElementById('contrasena_confirma').type = "text"
        document.getElementById('ocultarmostrar_contraseñas').innerText = "visibility_off"
    } else {
        document.getElementById('contrasena_actual').type = "password"
        document.getElementById('contrasena_nueva').type = "password"
        document.getElementById('contrasena_confirma').type = "password"
        document.getElementById('ocultarmostrar_contraseñas').innerText = "visibility"
    }
});

//Función para comprobar si las contraseñas son iguales
//Función para comprobar si las contraseñas son iguales
function contrasenasIguales() {
    let mensaje = document.getElementById('mensaje-anadirfold');//mensaje
    if (CONTRAN.value != CONTRAC.value) {
        mensaje.innerText = 'Las contraseñas no coinciden';
        mensaje.style.display = 'block';
    } else if (CONTRAN.value.length < 8) {
        mensaje.innerText = 'Las contraseñas deben tener más de 8 caracteres';
        mensaje.style.display = 'block';
    } else if (!validarCarateresEsp(CONTRAN.value)) {
        mensaje.innerText = 'Las contraseñas deben poseer un caracter especial como #, =, + etc';
        mensaje.style.display = 'block';
    } else if (/\s/.test(CONTRAN.value)) {
        mensaje.innerText = 'Las contraseñas no deben tener espacios en blanco';
        mensaje.style.display = 'block';
    } else if (!/[a-zA-Z]/.test(CONTRAN.value)) {
        mensaje.innerText = 'Las contraseñas debe ser alfanumerica';
        mensaje.style.display = 'block';
    }
    else {
        mensaje.style.display = 'none';
    }
}

//Función para validar caracteres especiales recibe como parametro un texto
function validarCarateresEsp(contra) {
    let cEpeciales = ['#', '°', '!', '#', '$', '%', '?', '¡', '¿', '+', '*', '.', ',', '/', '=', ';', ':', '-'];

    let incluye = false;

    cEpeciales.forEach((caracter) => {
        if (contra.includes(caracter)) {
            incluye = true;
        }
    });
    return incluye;
}

//Funciónes para comprobar las contraseñas mientras estan siendo escritas
CONTRAN.addEventListener('keyup', function () {
    contrasenasIguales();
});
CONTRAC.addEventListener('keyup', function () {
    contrasenasIguales();
});

/*Boton de ir hacia arriba*/

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

//Actualizar los datos del perfil
document.getElementById('aceptaractdatosperfil_boton').addEventListener("click", function () {
    fetch(API_EMPLEADOS + 'updateProf', {
        method: 'post',
        body: new FormData(document.getElementById('perfil-form'))
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
});

//Validar solo número en el input
document.getElementById('dui_usuario-perfil').addEventListener('keypress', function (e) {
    if (!soloNumeros(event, 1)) {
        e.preventDefault();
    }
});

document.getElementById('telefono_usuario-perfil').addEventListener('keypress', function (e) {
    if (!soloNumeros(event, 1)) {
        e.preventDefault();
    }
});
//Guion en el número de telfono y dui
//Validar guión en el número de NIT
document.getElementById('telefono_usuario-perfil').addEventListener('keyup', e => {
    guionTelefono(e, document.getElementById('telefono_usuario-perfil'));
});

document.getElementById('dui_usuario-perfil').addEventListener('keyup', e => {
    guionDUI(e, document.getElementById('dui_usuario-perfil'));
});

//Función para comprobar que halla una session
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
                if (response.cambioCtr) {
                    location.href = 'index.html';
                } else if (response.session && !response.cambioCtr) {

                } else if (!response.session) {
                    location.href = 'inicio.html';
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Función para verificar que existe el usuario posee un método de verificación de 3 pasos
const verificarGAuth = (confirma) => {
    //Se confirma si el empleado ya posee método o desea eliminarlo
    if (confirma == false) {
        Swal.fire({
            title: 'Advertencia',
            text: '¿Desea asignar un pin de Google Authenticator para proteger más su cuenta?(Su cuenta estará más segura pero deberás descargar la aplicación)',
            icon: 'warning',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: 'Cancelar',
            allowEscapeKey: false,
            allowOutsideClick: false,
            background: '#F7F0E9',
            confirmButtonColor: 'green',
        }).then(function (value) {
            if (value.isConfirmed) {
                copyQRC.style.color = 'black';
                //Como acepto iniciamos el proceso de creación
                if (!gAuthv) {
                    M.Modal.getInstance(document.getElementById('gAuth_modal')).open();
                }
            }
        });
    } else {
        Swal.fire({
            title: 'Advertencia',
            text: '¿Desea desvincular el código de Google Authenticator de su cuenta?(Puede generarlo de nuevo,pero su cuenta estará más vulnerable)',
            icon: 'warning',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: 'Cancelar',
            allowEscapeKey: false,
            allowOutsideClick: false,
            background: '#F7F0E9',
            confirmButtonColor: 'green',
        }).then(function (value) {
            if (value.isConfirmed) {
                //Como acepto iniciamos el proceso de eliminación
                if (gAuthv) {
                    eliminarGAuth();
                }
            }
        });
    }
}

//Seteando la función en la el boton al dar click
document.getElementById('gauth_btn').addEventListener('click', () => {
    verificarGAuth(gAuthv);
});

//Método para copiar
document.getElementById('copyQRC').addEventListener('click', () => {
    /*Obtenemos el texto dentro del div*/
    let content = document.getElementById('QRC_Auth').innerHTML;
    /*Ordenamos al navegador a guadar el texto en el portapapeles*/
    navigator.clipboard.writeText(content);
    copyQRC.style.color = 'green';
    let Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    })
    Toast.fire({
        icon: 'success',
        title: 'Codigo QR copiado'
    })
});

//Método para generar el codigo QR como const function
const generarQR = () => {
    //Verificamos que el input de la contraseña no este vacio
    let contra = document.getElementById('contraEmp_Auth');
    let mensaje = document.getElementById('QRC_Auth');
    if (contra.value != '') {
        let form = new FormData();
        form.append('contrasena',contra.value);
        fetch(API_EMPLEADOS + 'generarQRGAUTH', {
            method: 'post',
            body: form
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                // Se obtiene la respuesta en formato JSON.
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.status) {
                        console.log(response.dataset);
                        //Colocamos el pin de GAUTH en el espacio designado
                        mensaje.style.color = 'black';
                        mensaje.innerHTML = response.dataset[0];
                        document.getElementById('QR_Auth').setAttribute('src',response.dataset[1]);
                        document.getElementById('generarQR_Auth').classList.add('disabled');
                        document.getElementById('generarQR_Auth').style.display = "none";
                    } else {
                        //Indicamos el error en el modal
                        mensaje.style.color = 'red';
                        mensaje.innerHTML = response.exception;
                    }
                });
            } else {
                console.log(request.status + ' ' + request.statusText);
            }
        });
    }else{
        //Como la contraseña esta vacia, enviamos un mensaje
        mensaje.style.color = 'red';
        mensaje.innerHTML = 'Ingrese la contraseña actual';
    }
}


//Colocamos la función de generar Codigo QR al boton
document.getElementById('generarQR_Auth').addEventListener('click', ()=>{
    generarQR();
});
//Colocamos la función de ocultar o mostrar la contraseña
document.getElementById('ocultarmostrar_Auth').addEventListener('click',()=>{
    //Instanciamos el objeto del input para cambiarle el estilo
    let contra = document.getElementById('contraEmp_Auth');
    let ojo = document.getElementById('ocultarmostrar_Auth')
    if (contra.type == "password") {
        contra.type = "text"
        ojo.innerText = "visibility_off"
    } else {
        contra.type = "password"
        ojo.innerText = "visibility"
    }
});

const eliminarGAuth = () =>{
    (async () => {

        const { value: formValues } = await Swal.fire({
            background: '#F7F0E9',
            confirmButtonColor: 'black',
            showDenyButton: true,
            denyButtonText: '<i class="material-icons">cancel</i> Cancelar',
            icon: 'info',
            title: 'Introduzca el PIN del código de su Google AUTH en su telefono, para desvincular el codigo',
            html:
                `   
                <div class="input-field">
                    <label for="swal-input1"><b>Código en su aplicación:</b></label>
                    <input type="text" placeholder="Código de Google AUTH" id="swal-input1" class="center" maxlength="6">
                </div>
            `,
            focusConfirm: false,
            confirmButtonText:
                '<i class="material-icons">delete_forever</i>Desvincular',
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                ]
            }
        })

        if (formValues) {
            if(formValues[0].length>0){
                let form = new FormData();
                form.append('codigo',formValues[0]);
                fetch(API_EMPLEADOS + 'quitarQRAUTH', {
                    method: 'post',
                    body: form
                }).then(function (request) {
                    // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                    if (request.ok) {
                        // Se obtiene la respuesta en formato JSON.
                        request.json().then(function (response) {
                            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                            if (response.status) {
                                sweetAlert(1,response.message,'perfil.html');
                            } else {
                                sweetAlert(2,response.exception,null);
                            }
                        });
                    } else {
                        console.log(request.status + ' ' + request.statusText);
                    }
                });
            }else{
                sweetAlert(3,'Debe colocar el código dado por la aplicación de Google authenticator',null);
            }
            
        }
    })()
}

//Función para cerrar el modal una vez creado el codigo de verificación
function cerrarAuthM(){
    Swal.fire({
        title: 'Advertencia',
        text: '¿Deseas cerrar el modal? Una vez fuera no podrás regresar por ende copia tu código o guarda el QR',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: 'Cancelar',
        allowEscapeKey: false,
        allowOutsideClick: false,
        background: '#F7F0E9',
        confirmButtonColor: 'green',
    }).then(function (value) {
        if (value.isConfirmed) {
            copyQRC.style.color = 'black';
            //Como acepto iniciamos el proceso de creación
            if (!gAuthv) {
                M.Modal.getInstance(document.getElementById('gAuth_modal')).close();
            }
        }
    });
}