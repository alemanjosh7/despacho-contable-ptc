// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPLEADOS = SERVER + 'dashboard/empleados.php?action=';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';

optionsM = {
    onCloseEnd: function () {
        LOGINBTN.classList.remove("disabled");
    },
    dismissible: false,
}

//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.Modal.init(document.querySelectorAll('.modal'),optionsM);
    //Ejecutamos algunos metodos inciales
    validarPrimerUso();//Validamos el primer usuario
    comprobarAmin();//Verificamos si hay una session
});
//Inputs
const LOGINBTN = document.getElementById('Iniciar_btn');//Boton de inicio de sesión
const USUARIOTXT = document.getElementById('username');//input del nombre del usuario
const CONTRAINPUT = document.getElementById('contraseña');
const OJOICON = document.getElementById('ocultarmostrar_contraseña');//----------
const OJOICON2 = document.getElementById('ocultarmostrar_contraseñas');//----------
const CONTRAN = document.getElementById('contraseña_nueva');//input de la contraseña nueva en restablecer contraseña
const CONTRAC = document.getElementById('contraseña_confirma');//input de la confirmación de la contraseña en restablecer contraseña
const preloader = document.getElementById('preloader-añadirfold');//preloader de la actualización de contraseña
const RESTABLECERCTR = document.getElementById('restablecerContraseña');//boton de restablecer contraseña
const PRELOADER = document.getElementById('preloader-cargarJ');//Preloader de carga para los elementos
const TELEFONO = document.getElementById('telefono-emp');
const CONTRA = document.getElementById('contra-emp');
const CONTRACP = document.getElementById('contrac-emp');
const NOMBREE = document.getElementById('nombre-emp');
const APELLIDOE = document.getElementById('apellido-emp');
const DUI = document.getElementById('dui-emp');
const CORREO = document.getElementById('correo-emp');

const MODALPINL = document.getElementById('modalVerificación');
const reenviarPIN = document.getElementById('reenviarPIN');//Boton de reenviar PIN

/*Validar el PIN de restablecer contraseñas*/
var comprobarPIN = document.getElementById('btn-añadirFolderModal');
comprobarPIN.addEventListener('click', function () {
    let pinintro = document.getElementById('PIN-numeros');
    let mensaje = document.getElementById('mensaje-restablecer');
    let modal = M.Modal.getInstance(document.querySelector('#modalAnadirFolder'));
    let restablecermodal = M.Modal.getInstance(document.querySelector('#modalrestablecer'));
    if (USUARIOTXT.value.length != 0) {
        mensaje.style.display = 'none';
        if (pinintro.value.length != 0) {
            fetch(API_GLBVAR + 'comprobarPINLog', {
                method: 'post',
                body: new FormData(document.getElementById('pin-sesion'))
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si existe una sesión, de lo contrario se revisa si la respuesta es satisfactoria.
                        if (response.session) {
                        } else if (response.status) {
                            modal.close();
                            restablecermodal.open();
                        } else {
                            sweetAlert(2, response.exception, null)
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
        mensaje.style.display = 'block';
        mensaje.innerText = 'Por favor coloque su usuario en el formulario anterior antes de continuar';
    }
});

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
//Visualizar u ocultar contraseña
OJOICON.addEventListener('click', function () {
    if (CONTRAINPUT.type == "password") {
        CONTRAINPUT.type = "text"
        OJOICON.innerText = "visibility_off"
    } else {
        CONTRAINPUT.type = "password"
        OJOICON.innerText = "visibility"
    }
});

//Visualizar u ocultar contraseña para restablecerla
OJOICON2.addEventListener('click', function () {
    if (CONTRAC.type == "password") {
        CONTRAC.type = "text"
        CONTRAN.type = "text"
        OJOICON2.innerText = "visibility_off"
    } else {
        CONTRAC.type = "password"
        CONTRAN.type = "password"
        OJOICON2.innerText = "visibility"
    }
});

//Validar contraseñas iguales y campos vacios en el restablecer contraseña modal y actualizar la contraseña
RESTABLECERCTR.addEventListener('click', function () {
    /*Creamos una variable del mensaje dentro del formulario*/
    let mensaje = document.getElementById('mensaje-anadirfold');//mensaje
    let restablecermodal = M.Modal.getInstance(document.querySelector('#modalrestablecer'));//modal
    //creamos el form para añadir el usuario
    let form = new FormData(document.getElementById('renovarcontr-form'));
    form.append('usuario', USUARIOTXT.value);
    if (CONTRAN.value.length != 0 || CONTRAC.value.length != 0) {
        contrasenasIguales();
        if (mensaje.style.display != 'block') {
            //Ejecutamos metodo que busque el usuario de acuerdo al escrito
            RESTABLECERCTR.classList.add('disabled');
            preloader.style.display = 'block';
            fetch(API_EMPLEADOS + 'actualizarContra', {
                method: 'post',
                body: form
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si existe una sesión, de lo contrario se revisa si la respuesta es satisfactoria.
                        if (response.session && response.cambioCtr == false) {
                            sweetAlert(3, response.cambioCtr, 'inicio.html')
                        } else if (response.status) {
                            preloader.style.display = 'none';
                            RESTABLECERCTR.classList.remove('disabled');
                            sweetAlert(1, response.message, null)
                            restablecermodal.close();
                            comprobarAmin();
                        } else {
                            preloader.style.display = 'none';
                            RESTABLECERCTR.classList.remove('disabled');
                            sweetAlert(2, response.exception, null)
                        }
                    });
                } else {
                    RESTABLECERCTR.classList.remove('disabled');
                    console.log(request.status + ' ' + request.statusText);
                }
            });
        } else {
            mensaje.innerText = 'Las contraseñas deben coincidir';
            mensaje.style.display = 'block';
        }
    } else {
        mensaje.style.display = 'block';
        mensaje.innerText = 'No se permiten espacios vacios';
    }
});

//Función de log in
LOGINBTN.addEventListener('click', function () {
    PRELOADER.style.display = 'block';
    //Para presentar el proyecto descomentar las dos comentarios siguientes y comentar la función loginF();
    //LOGINBTN.classList.add("disabled");
    //generarPIN();
    loginF();
});

//Función para el login 
function loginF() {
    if (USUARIOTXT.value.length > 0 && CONTRAINPUT.value.length > 0) {
        LOGINBTN.classList.add('disabled');
        PRELOADER.style.display = 'block';
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
                    PRELOADER.style.display = 'none';
                });
            } else {
                LOGINBTN.classList.remove('disabled');
                console.log(request.status + ' ' + request.statusText);
            }
        }).catch(function (error) {
            sweetAlert(2, 'Error al iniciar session', null)
        });;
    } else {
        PRELOADER.style.display = 'none';
        sweetAlert(3, 'Debe de completar el formulario para iniciar sesion', null);
    }
}


//Metodo para verificar si hay una session
function comprobarAmin() {
    let restablecermodal = M.Modal.getInstance(document.querySelector('#modalrestablecer'));
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
                    sweetAlert(3, 'Es obligatorio cambiar la contraseña cada 90 días hagalo', null);
                    USUARIOTXT.value = response.usuario;
                    document.getElementById('cancelarRC').classList.add('hide');
                    restablecermodal.open();
                } else if (response.session && !response.cambioCtr) {
                    location.href = 'inicio.html';
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    }).catch(function (error) {
        sweetAlert(2, 'Error al conectar al servidor', null)
    });
}

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
//Funciónes para comprobar las contraseñas mientras estan siendo escritas
CONTRAN.addEventListener('keyup', function () {
    contrasenasIguales();
});
CONTRAC.addEventListener('keyup', function () {
    contrasenasIguales();
});

//Función para validar caracteres especiales recibe como parametro un texto
function validarCarateresEsp(contra) {
    let cEpeciales = ['#', '°', '!', '#', '$', '%', '?', '¡', '¿', '+', '*', '.', ',', '/', '=', ';', ':', '-', '+'];
    let incluye = false;

    cEpeciales.forEach((caracter) => {
        if (contra.includes(caracter)) {
            incluye = true;
        }
    });
    return incluye;
}

//Función para validar el primer uso de usuario
function validarPrimerUso() {
    let options = {
        dismissible: false,
    }
    fetch(API_EMPLEADOS + 'checkPUsuario', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si existe una sesión, de lo contrario se revisa si la respuesta es satisfactoria.
                if (response.status) {
                } else {
                    sweetAlert(3, 'Debe registrarse primero para poder loguearse', '');
                    M.Modal.init(document.querySelectorAll('#modal-template'), options);
                    M.Modal.getInstance(document.querySelector('#modal-template')).open();
                }
            });
        } else {
            RESTABLECERCTR.classList.remove('disabled');
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Método para guardar el primer usuario
document.getElementById('save-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    fetch(API_EMPLEADOS + 'crearPrimerUsuario', {
        method: 'post',
        body: new FormData(document.getElementById('save-form'))
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
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    //saveRowL(API_EMPLEADOS, action, 'save-form', 'modal-template', 0);
});

//Función para comprobar si las contraseñas son iguales
function contrasenasIguales2() {
    let mensaje = document.getElementById('mensaje-anadirarh');//mensaje
    if (document.getElementById('contra-emp').value != document.getElementById('contrac-emp').value) {
        mensaje.innerText = 'Las contraseñas no coinciden';
        mensaje.style.display = 'block';
    } else if (document.getElementById('contra-emp').value.length < 8) {
        mensaje.innerText = 'Las contraseñas deben tener más de 8 caracteres';
        mensaje.style.display = 'block';
    } else if (!validarCarateresEsp(document.getElementById('contra-emp').value)) {
        mensaje.innerText = 'Las contraseñas deben poseer un caracter especial como #, =, + etc';
        mensaje.style.display = 'block';
    } else if (/\s/.test(document.getElementById('contra-emp').value)) {
        mensaje.innerText = 'Las contraseñas no deben tener espacios en blanco';
        mensaje.style.display = 'block';
    } else if (!/[a-zA-Z]/.test(document.getElementById('contra-emp').value)) {
        mensaje.innerText = 'Las contraseñas debe ser alfanumerica';
        mensaje.style.display = 'block';
    }
    else {
        mensaje.style.display = 'none';
    }
}

//Funciónes para comprobar las contraseñas mientras estan siendo escritas
document.getElementById('contra-emp').addEventListener('keyup', function () {
    contrasenasIguales2();
});
document.getElementById('contrac-emp').addEventListener('keyup', function () {
    contrasenasIguales2();
});

//Validar solo número en el input
TELEFONO.addEventListener('keypress', function (e) {
    if (!soloNumeros(event, 1)) {
        e.preventDefault();
    }
});

DUI.addEventListener('keypress', function (e) {
    if (!soloNumeros(event, 1)) {
        e.preventDefault();
    }
});
//Validar solo letras
//Validar solo número en el input del telefono
NOMBREE.addEventListener('keypress', function (e) {
    if (!soloLetras(event, 1)) {
        e.preventDefault();
    }
});

APELLIDOE.addEventListener('keypress', function (e) {
    if (!soloLetras(event, 1)) {
        e.preventDefault();
    }
});

//Guion en el número de telfono y dui
//Validar guión en el número de NIT
TELEFONO.addEventListener('keyup', e => {
    guionTelefono(e, TELEFONO);
});

DUI.addEventListener('keyup', e => {
    guionDUI(e, DUI);
});


//Función para establecer el pin
const generarPIN = () => {
    //Generamos la hora en que se creo el pin
    let hora = new Date().getHours();
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
                    //console.log('El pin se ha seteado' + ' ' + response.pinr);
                    //Enviamos el mensaje
                    enviarPINCorreo();
                } else {
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

const enviarPINCorreo = () => {
    //Primero obtenemos el correo del usuario
    //Creamos un formulario y añadimos el nombre del usuario y realizamos la petición
    let form = new FormData();
    let url = SERVER + 'enviarSegundoFactor.php';
    if (USUARIOTXT.value.length > 0 && CONTRAINPUT.value.length > 0) {
        fetch(API_EMPLEADOS + 'obtenerCorreoEmp', {
            method: 'post',
            body: new FormData(document.getElementById('session-form'))
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.status) {
                        let correo = response.correo;
                        let usuario = USUARIOTXT.value;
                        document.getElementById('correo-format').innerHTML = response.correoF;
                        form.append('correo', correo);//Coloco el correo a ser enviado
                        form.append('usuario', usuario);//Coloco el usuario a ser enviado
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
                                        M.Modal.getInstance(MODALPINL).open();
                                        console.log("Se envio el correo con exito");
                                        PRELOADER.style.display = 'none';
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
        sweetAlert(3, 'Debe de completar el formulario para iniciar sesion', null);
    }

    LOGINBTN.classList.remove("disabled");
}

//Funciones para reenviar PIN
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
const btncancelr = document.getElementById('cancelarPINL');
btncancelr.addEventListener('click', function () {
    reenviarPIN.style.opacity = 1;
    contador.style.display = "none";
    clearInterval(cronometro);
    seg = 0;
});


document.getElementById('btn-PINL').addEventListener('click', function () {
    PRELOADER.style.display = 'block';
    //Validamos que halla colocado un usuario en el formulario anterior
    let pinintro = document.getElementById('PIN-numerosI');
    let mensaje = document.getElementById('mensaje-restablecerL');
    let modal = M.Modal.getInstance(MODALPINL);
    let form = new FormData();
    form.append('pin', pinintro.value);
    if (USUARIOTXT.value.length > 0 && CONTRAINPUT.value.length > 0) {
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
                            //Comprobamos que no posea el tercer factor de autenticación
                            LOGINBTN.classList.add('disabled');
                            fetch(API_EMPLEADOS + 'checkCodigoGAuth', {
                                method: 'post',
                                body: new FormData(document.getElementById('session-form'))
                            }).then(function (request) {
                                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                                if (request.ok) {
                                    request.json().then(function (response) {
                                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                                        if (response.dataset) {
                                            modal.close();
                                            mensaje.style.display = 'none';
                                            pinintro.value = '';
                                            verificarGAuth();
                                        } else {
                                            modal.close();
                                            mensaje.style.display = 'none';
                                            pinintro.value = '';
                                            loginF();//Ejecutamos el método de login
                                        }
                                    });
                                } else {
                                    LOGINBTN.classList.remove('disabled');
                                    console.log(request.status + ' ' + request.statusText);
                                }
                                PRELOADER.style.display = 'none';
                            }).catch(function (error) {
                                modal.close();
                                mensaje.style.display = 'none';
                                pinintro.value = '';
                                loginF();//Ejecutamos el método de login
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
        sweetAlert(3, 'Debe de completar el formulario para iniciar sesion', null);
        mensaje.style.display = 'block';
    }
});

const verificarGAuth = () => {
    M.Modal.getInstance(document.getElementById('gAuth_modal')).open();
}

document.getElementById('generarQR_Auth').addEventListener('click', () => {
    PRELOADER.style.display = 'block';
    let form = new FormData(document.getElementById('session-form'));
    form.append('codigo',document.getElementById('contraEmp_Auth').value);
    fetch(API_EMPLEADOS + 'verificarCGA', {
        method: 'post',
        body: form
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //Como el código es el correcto se inicia el método de login y se oculta el modal
                    M.Modal.getInstance(document.getElementById('gAuth_modal')).close();
                    loginF();
                } else {
                    sweetAlert(2, response.exception, null);
                }
                PRELOADER.style.display = 'none';
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});