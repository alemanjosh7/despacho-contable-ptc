/*
*   Controlador de uso general en las páginas web del sitio privado cuando se ha iniciado sesión.
*   Sirve para manejar las plantillas del encabezado y pie del documento.
*/

// Constante para establecer la ruta y parámetros de comunicación con la API_HEADER_GLBVAR.
const API_HEADER = SERVER + 'variablesgb.php?action=';//Colocar la direccion correcta aqui

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_HEADER + 'verificarAdmin', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si hay una session
                if (response.session) {
                    //Comprobamos si es admin
                    if (response.status) {
                        //Como es admin, declaramos el header de admins y lo colocamos 
                        //Como hay una sessión cargamos el header
                        const header = `
                        <!--Navbar-->
                        <div class="navbar-fixed">
                            <nav class="navbar-contenedor z-depth-3">
                                <div class="nav-wrapper">
                                    <!--Titulo del apartado-->
                                    <a class="brand-logo center titulo-nav"><span>${getAbsolutePath()}</span></a>
                                    <!--Boton para el sidenav responsive-->
                                    <a href="#" data-target="side-navbarcont" class="sidenav-trigger"><i
                                            class="material-icons menuicon-navbar">menu</i></a>
                                    <!--Apartado del usuario y logou-->
                                    <ul class="right hide-on-small-and-down opciones-navbar">
                                        <!--Usuario solo para tablets y computadoras-->
                                        <li><a class="waves-effect waves-light tooltipped" data-position="bottom"
                                                data-tooltip="Ver el perfil" href="perfil.html" id="username-navbar">${response.usuario}<i
                                                    class="material-icons right usericon-apartadot">person</i></a>
                                        </li>
                                        <!--Boton de logout solo para tablets y computadoras-->
                                        <li><a href="#cerrarSesionModal" class="logout-navbar tooltipped modal-trigger"
                                                data-position="bottom" data-tooltip="Cerrar Sesión"><img class="responsive-img"
                                                    src="../resources/icons/logout-icon-navbar.png"></a></li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                        <!--Sidenav-->
                        <ul id="side-navbarcont" class="sidenav sidenav-fixed">
                            <!--Icono de la empresa-->
                            <li>
                                <div class="icono-sidenav">
                                    <img class="responsive-image" src="../resources/img/logo-sidenav.png">
                                </div>
                            </li>
                            <!--Menu de opciones-->
                            <li>
                                <div class="menuopciones-sidenav">
                                    <!--Boton de Inicio-->
                                    <a class="row waves-effect  botones-sidenav" href="inicio.html">
                                        <div class="col s6" id="icono-opcion-sidenav">
                                            <img class="responsive-img" src="../resources/icons/inicio-icon-sidenav.png">
                                        </div>
                                        <div class="col s6" id="texto-opcion-sidenav">
                                            Inicio
                                        </div>
                                    </a>
                                    <!--Boton de Empleados-->
                                    <a class="row waves-effect  botones-sidenav" href="empleados.html">
                                        <div class="col s6" id="icono-opcion-sidenav">
                                            <img class="responsive-img" src="../resources/icons/empleados-icon-sidenav.png">
                                        </div>
                                        <div class="col s6" id="texto-opcion-sidenav">
                                            Empleados
                                        </div>
                                    </a>
                                    <!--Boton de Archivos subidos-->
                                    <a class="row waves-effect  botones-sidenav" href="archivosSubidos.html">
                                        <div class="col s6" id="icono-opcion-sidenav">
                                            <img class="responsive-img" src="../resources/icons/archivossub-icon-sidenav.png">
                                        </div>
                                        <div class="col s6" id="texto-opcion-sidenav">
                                            Archivos Subidos
                                        </div>
                                    </a>
                                    <!--Boton de Empresas-->
                                    <a class="row waves-effect  botones-sidenav" href="empresas.html">
                                        <div class="col s6" id="icono-opcion-sidenav">
                                            <img class="responsive-img" src="../resources/icons/empresas-icon-sidenav.png">
                                        </div>
                                        <div class="col s6" id="texto-opcion-sidenav">
                                            Empresas
                                        </div>
                                    </a>
                                    <!--Boton de Perfil solo para telefonos-->
                                    <a class="row waves-effect hide-on-med-and-up botones-sidenav" href="perfil.html">
                                        <div class="col s6" id="icono-opcion-sidenav">
                                            <img class="responsive-img user-icon" src="../resources/icons/user-icon-sidenav.png">
                                        </div>
                                        <div class="col s6" id="texto-opcion-sidenav-nav">
                                            <span>${response.usuario}</span>
                                        </div>
                                    </a>
                                    <!--Boton de logout solo para telefonos-->
                                    <a class="row waves-effect hide-on-med-and-up botones-sidenav modal-trigger"
                                        href="#cerrarSesionModal">
                                        <div class="col s6" id="icono-opcion-sidenav">
                                            <img class="responsive-img user-icon" src="../resources/icons//logout-icon-sidenav.png">
                                        </div>
                                        <div class="col s6" id="texto-opcion-sidenav-nav">
                                            Cerrar Sesión
                                        </div>
                                    </a>
                                </div>
                            </li>
                        </ul>
                        `;
                        document.querySelector('header').innerHTML = header;
                        M.Sidenav.init(document.querySelectorAll(".sidenav"));
                    } else {
                        //Como hay una sessión cargamos el header para no admins
                        const header = `
                        <!--Navbar-->
                        <div class="navbar-fixed">
                            <nav class="navbar-contenedor z-depth-3">
                                <div class="nav-wrapper">
                                    <!--Titulo del apartado-->
                                    <a class="brand-logo center titulo-nav"><span>${getAbsolutePath()}</span></a>
                                    <!--Boton para el sidenav responsive-->
                                    <a href="#" data-target="side-navbarcont" class="sidenav-trigger"><i
                                            class="material-icons menuicon-navbar">menu</i></a>
                                    <!--Apartado del usuario y logou-->
                                    <ul class="right hide-on-small-and-down opciones-navbar">
                                        <!--Usuario solo para tablets y computadoras-->
                                        <li><a class="waves-effect waves-light tooltipped" data-position="bottom"
                                                data-tooltip="Ver el perfil" href="perfil.html" id="username-navbar">${response.usuario}<i
                                                    class="material-icons right usericon-apartadot">person</i></a>
                                        </li>
                                        <!--Boton de logout solo para tablets y computadoras-->
                                        <li><a href="#cerrarSesionModal" class="logout-navbar tooltipped modal-trigger"
                                                data-position="bottom" data-tooltip="Cerrar Sesión"><img class="responsive-img"
                                                    src="../resources/icons/logout-icon-navbar.png"></a></li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                        <!--Sidenav-->
                        <ul id="side-navbarcont" class="sidenav sidenav-fixed">
                            <!--Icono de la empresa-->
                            <li>
                                <div class="icono-sidenav">
                                    <img class="responsive-image" src="../resources/img/logo-sidenav.png">
                                </div>
                            </li>
                            <!--Menu de opciones-->
                            <li>
                                <div class="menuopciones-sidenav">
                                    <!--Boton de Inicio-->
                                    <a class="row waves-effect  botones-sidenav" href="inicio.html">
                                        <div class="col s6" id="icono-opcion-sidenav">
                                            <img class="responsive-img" src="../resources/icons/inicio-icon-sidenav.png">
                                        </div>
                                        <div class="col s6" id="texto-opcion-sidenav">
                                            Inicio
                                        </div>
                                    </a>
                                    <!--Boton de Archivos subidos-->
                                    <a class="row waves-effect  botones-sidenav" href="archivosSubidos.html">
                                        <div class="col s6" id="icono-opcion-sidenav">
                                            <img class="responsive-img" src="../resources/icons/archivossub-icon-sidenav.png">
                                        </div>
                                        <div class="col s6" id="texto-opcion-sidenav">
                                            Archivos Subidos
                                        </div>
                                    </a>
                                    <!--Boton de Empresas-->
                                    <a class="row waves-effect  botones-sidenav" href="empresas.html">
                                        <div class="col s6" id="icono-opcion-sidenav">
                                            <img class="responsive-img" src="../resources/icons/empresas-icon-sidenav.png">
                                        </div>
                                        <div class="col s6" id="texto-opcion-sidenav">
                                            Empresas
                                        </div>
                                    </a>
                                    <!--Boton de Perfil solo para telefonos-->
                                    <a class="row waves-effect hide-on-med-and-up botones-sidenav" href="perfil.html">
                                        <div class="col s6" id="icono-opcion-sidenav">
                                            <img class="responsive-img user-icon" src="../resources/icons/user-icon-sidenav.png">
                                        </div>
                                        <div class="col s6" id="texto-opcion-sidenav-nav">
                                            <span>${response.usuario}</span>
                                        </div>
                                    </a>
                                    <!--Boton de logout solo para telefonos-->
                                    <a class="row waves-effect hide-on-med-and-up botones-sidenav modal-trigger"
                                        href="#cerrarSesionModal">
                                        <div class="col s6" id="icono-opcion-sidenav">
                                            <img class="responsive-img user-icon" src="../resources/icons//logout-icon-sidenav.png">
                                        </div>
                                        <div class="col s6" id="texto-opcion-sidenav-nav">
                                            Cerrar Sesión
                                        </div>
                                    </a>
                                </div>
                            </li>
                        </ul>
                        `;
                        document.querySelector('header').innerHTML = header;
                        M.Sidenav.init(document.querySelectorAll(".sidenav"));
                    }
                } else {
                    //Como no hay una sessión, reenviamos al 
                    location.href = 'index.html';
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});

//Metodo para el boton de cerrar session
document.getElementById('cerrarSesionModalbtn').addEventListener('click',function(){
    fetch(API_HEADER + 'logOut', {
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

function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname;
    if(pathName.includes("inicio.html")){
        return 'Inicio';
    }else if(pathName.includes("empresas.html")){
        return 'Empresas';
    }else if(pathName.includes("folders.html")){
        return 'Folders';
    }else if(pathName.includes("archivos.html")){
        return 'Archivos';
    }else if(pathName.includes("empleados.html")){
        return 'Empleados';
    }else if(pathName.includes("archivosSubidos")){
        return 'Archivos-subidos'
    }
}