// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_GLBVAR = SERVER + 'variablesgb.php?action=';


//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Modal.init(document.querySelectorAll('.modal'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    //Inicializando metodos
    comprobarAmin();//Comprobar que sea el jefe que ingrese
    //Colocando los estilos para las restricciones
    restricciones(arrayRec, null);
});

//Declaramos algunas constantes

const ojo = document.getElementById('ocultarmostrar');//Icono de ojo
const codigoa = document.getElementById('codicoa');//Input del codigo antiguo
const codigon = document.getElementById('codigon');//Input del codigo nuevo
const recnumero = document.getElementById('rec_numero');//Rectriccion del número
const recletrama = document.getElementById('rec_letrama');//Rectriccion de letra mayuscula
const recletramin = document.getElementById('rec_letrami');//Rectriccion del letra minuscula
const recblanco = document.getElementById('res_blanco');//Rectriccion del espacio en blanco
const reccaracter = document.getElementById('rec_6');//Rectriccion del 6 caracteres
const recpin = document.getElementById('rec_pin');//Rectriccion del pin
const arrayRec = [recblanco, recletrama, recletramin, recnumero, reccaracter, recpin];//Array con todas las reestricciones
const btnrecuperarPin = document.getElementById('recuperarpinbtn');//Boton para recuperar Codigo de restablecer contraseña
const modalPIN = document.getElementById('modalAnadirFolder');//Modal para reestablecer el codigo de restablecer contraseña
const reenviarPIN = document.getElementById('reenviarPIN');//Boton de reenviar PIN
//Función para comprobar que halla una session y esta sea del jefe
function comprobarAmin() {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_GLBVAR + 'getIdUsuario', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                //Se compueba si el administrador es 1
                if (response.exception) {
                    location.href = 'index.html';
                }
                else if (response.idusuario != 1) {
                    location.href = 'inicio.html';
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

/*Boton de ir hacia arriba*/

var hastatop = document.getElementById("hasta_arriba");

window.onscroll = function () {
    if (document.documentElement.scrollTop > 150) {
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

//Método para mostrar y ocultar el codigo de recuperación
ojo.addEventListener("click", function () {
    if (codigoa.type == "password") {
        codigoa.type = "text"
        codigon.type = "text"
        ojo.innerText = "visibility_off"
    } else {
        codigoa.type = "password"
        codigon.type = "password"
        ojo.innerText = "visibility"
    }
});

//Función para colocar los estilos para las restricciones
function restricciones(arrayRec, arrayC) {
    //Colocamos en un try catch por si se envia un dato vacio
    try {
        //Colocando el color rojo a los que no tienen la restriccion 
        arrayRec.forEach(element => {
            element.style.color = 'red';
        });
        //Colocando el color verde a los que tienen la restriccion
        arrayC.forEach(element => {
            element.style.color = 'green';
        });
    } catch (error) {
    }
}

//Función para verificar si se cumple las restricciones del codigo
function verificarRec() {
    //Creando el arreglo de las reestricciones que cumple
    let arrayC = [];

    //Evaluamos si cumplen las restricciones para añadirlas al que las cumple
    if (!/\s/.test(codigon.value) && codigon.value.length != 0) {//Validando si hay espacios vacios
        arrayC.push(recblanco);
    } if (codigon.value.length == 6) { //Validando si hay caracteres
        arrayC.push(reccaracter);
    } if (/[a-z]/.test(codigon.value)) {//Validando si hay minusculas
        arrayC.push(recletramin);
    } if (/[A-Z]/.test(codigon.value)) {//Validando que halla mayusculas
        arrayC.push(recletrama)
    } if (/[0-9]/.test(codigon.value)) {//Validado que halla números
        arrayC.push(recnumero);
    } if (codigoa.value.length != '') {
        arrayC.push(recpin);
    }

    //Ejecutamos el metodo de restricciones enviando las restricciones que no cumplio y las que si
    restricciones(arrayRec, arrayC);
}

//Añadimos la función de reestriccion a los inputs para accionarse al apretar
codigon.addEventListener('keyup', function () {
    verificarRec();
})

codigoa.addEventListener('keyup', function () {
    verificarRec();
})

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar el nuevo codigo.
document.getElementById('formCodigoRc').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Evaluamos si hay alguna reestriccion que no se cumpla
    let reestriccion = true;
    arrayRec.forEach(element => {
        if (element.style.color == 'red') {
            reestriccion = false;
            return;
        }
    });
    let vacio = validarCamposVacios([codigon, codigoa]);
    //Verificar si hay reestricciones
    if (reestriccion == true && vacio != false) {
        //Se consulta si realmente se desea hacer el cambio de contraseña
        Swal.fire({
            title: 'Advertencia',
            text: '¿Desea cambiar el codigo de recuperación de contraseña?',
            icon: 'warning',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: 'Cancelar',
            allowEscapeKey: false,
            allowOutsideClick: false,
            background: '#F7F0E9',
            confirmButtonColor: 'green',
        }).then(function (value) {
            // Se comprueba si fue cliqueado el botón Sí para hacer la petición de borrado, de lo contrario no se hace nada.
            if (value.isConfirmed) {
                fetch(API_GLBVAR + 'actualizarCodigoR', {
                    method: 'post',
                    body: new FormData(document.getElementById('formCodigoRc'))
                }).then(function (request) {
                    // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                    if (request.ok) {
                        // Se obtiene la respuesta en formato JSON.
                        request.json().then(function (response) {
                            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                            if (response.status) {
                                sweetAlert(1, response.message, 'inicio.html');
                            } else {
                                sweetAlert(2, response.exception, null);
                            }
                        });
                    } else {
                        console.log(request.status + ' ' + request.statusText);
                    }
                });
            }
        });
    } else {
        verificarRec();
        sweetAlert(2, 'Debe cumplir con las reestricciones', null);
    }
});

//Método que se ejecuta al apretar el boton de olvido del codigo
btnrecuperarPin.addEventListener('click',function(){
    //Se consulta si realmente se desea hacer el cambio de contraseña
    Swal.fire({
        title: 'Advertencia',
        text: '¿Desea que le enviemos el codigo de recuperación al correo asociado?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: 'Cancelar',
        allowEscapeKey: false,
        allowOutsideClick: false,
        background: '#F7F0E9',
        confirmButtonColor: 'green',
    }).then(function (value) {
        // Se comprueba si fue cliqueado el botón Sí para hacer la petición de borrado, de lo contrario no se hace nada.
        if (value.isConfirmed) {
            //Generamos el pin
            generarPIN();
        }
    });
});

//Función para establecer el pin
function generarPIN() {
    //Generamos la hora en que se creo el pin
    let hora = new Date().getHours();
    console.log(hora);
    //Añadimos ese pin a la variable de sessión de PIN
    //Creamos un formulario y añadimos el pin al formulario
    let form = new FormData();
    form.append('hora', hora);
    fetch(API_GLBVAR + 'setPINCTRR', {
        method: 'post',
        body: form
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //console.log('El pin se ha seteado' + ' ' + response.PIN);
                    //Enviamos el mensaje
                    enviarPINCorreo();
                    M.Modal.getInstance(modalPIN).open();
                } else {
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

function enviarPINCorreo() {
    //Primero obtenemos el correo del usuario
    //Creamos un formulario y añadimos el nombre del usuario y realizamos la petición
    let form = new FormData();
    let url = SERVER + 'enviarCorreo.php';
    if (codigon.value.length > 0) {
        fetch(API_GLBVAR + 'getCorreoJ', {
            method: 'get',
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.status) {
                        correo = response.dataset.correo_empleadocontc;
                        document.getElementById('correo-format').innerHTML = response.correoF;
                        form.append('correo', correo);
                        //Una vez seteado ejecutamos el metodo para enviar el correo
                        fetch(url, {
                            method: 'post',
                            body: form
                        }).then(function (request) {
                            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                            if (request.ok) {
                                request.json().then(function (response) {
                                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                                    if (response.status) {
                                        console.log('Correo enviado');
                                    } else {
                                        sweetAlert(2, response.exception, null);
                                    }
                                });
                            } else {
                                console.log(request.status + ' ' + request.statusText);
                            }
                        });
                    } else {
                        sweetAlert(2, response.exception, null);
                    }
                });
            } else {
                LOGINBTN.classList.remove('disabled');
                console.log(request.status + ' ' + request.statusText);
            }
        });
    } else {
        sweetAlert(3, 'Favor llenar el campo de codigo de recuperación nuevo en el formulario anterior', null);
    }

}

//Función para comprobar que halla pasado una hora
function comprobarHora(hora) {
    let horaact = new Date().getHours();
    console.log(horaact)
    if (horaact == hora) {
        return true;
    } else {
        return false;
    }
}

var contador = document.getElementById('cronometro');
let seg = 0;
var cronometro;
reenviarPIN.addEventListener('click', function () {
    if (seg == 0) {
        cronometro = setInterval(function () {
            if (seg >= 0) {
                if (seg == 31) {
                    reenviarPIN.style.opacity = '1';
                    contador.style.display = "none";
                    clearInterval(cronometro);
                    seg = 0;
                } else {
                    contador.style.display = "block";
                    reenviarPIN.style.opacity = "0.8";
                    contador.innerHTML = seg + "s";
                    seg++;
                }
            } else {

            }
        }, 1000);
        //Ejecutamos el metodo de generar pin para reenviarlo
        generarPIN();
    }
});
const btncancelr = document.getElementById('cancelar-Añadirfold');
btncancelr.addEventListener('click', function () {
    reenviarPIN.style.opacity = 1;
    contador.style.display = "none";
    clearInterval(cronometro);
    seg = 0;
});

document.getElementById('btn-añadirFolderModal').addEventListener('click', function () {
    //Validamos que halla colocado un usuario en el formulario anterior
    let pinintro = document.getElementById('PIN-numeros');
    let mensaje = document.getElementById('mensaje-restablecer');
    let modal = M.Modal.getInstance(modalPIN);
    let form = new FormData();
    form.append('pin', pinintro.value);
    if (codigon.value.length != 0) {
        if (pinintro.value.length != 0) {
            fetch(API_GLBVAR + 'comprobarPINRCR', {
                method: 'post',
                body: form
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status && comprobarHora(response.hora)) {
                            modal.close();
                            mensaje.style.display = 'none';
                            pinintro.value = '';
                            //Actualizamos el pin
                            fetch(API_GLBVAR + 'actualizarCodigoRP', {
                                method: 'post',
                                body: new FormData(document.getElementById('formCodigoRc'))
                            }).then(function (request) {
                                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                                if (request.ok) {
                                    // Se obtiene la respuesta en formato JSON.
                                    request.json().then(function (response) {
                                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                                        if (response.status) {
                                            sweetAlert(1, response.message, 'inicio.html');
                                        } else {
                                            sweetAlert(2, response.exception, null);
                                        }
                                    });
                                } else {
                                    console.log(request.status + ' ' + request.statusText);
                                }
                            });
                        } else {
                            mensaje.innerText = 'El pin no coincide o ha caducado, por favor reenviar uno nuevo ';
                            mensaje.style.display = 'block';
                        }
                    });
                } else {
                    console.log(request.status + ' ' + request.statusText);
                }
            });
        } else {
            mensaje.style.display = 'block';
            mensaje.innerText = 'No se permiten espacios vacios';
        }
    } else {
        mensaje.innerText = 'Coloque el codigo de recuperación nuevo en el formulario anterior';
        mensaje.style.display = 'block';
    }
});