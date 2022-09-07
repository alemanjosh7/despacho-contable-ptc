// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_GLBVAR = SERVER + 'variablesgb.php?action=';
const API_EMPLEADOS = SERVER + 'dashboard/empleados.php?action=';
const API_EMPRESAS = SERVER + 'dashboard/empresas.php?action=';
const API_FOLDERS = SERVER + 'dashboard/folders.php?action=';
const API_ARCHIVOSEMP = SERVER + 'dashboard/archivosSubidos.php?action=';
const API_TIPO_EMPLEADO = SERVER + 'dashboard/tipoEmpleado.php?action=obtenerTipoEmpleado';
const API_ARCHIVO = SERVER + 'dashboard/archivos.php?action=';
//Iniciando las funciones y componentes
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    //Inciando el saludo
    saludo();
    comprobarAmin();
    //Iniciar componenetes de Materialize
    M.Modal.init(document.querySelectorAll('.modal'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    M.FormSelect.init(document.querySelectorAll('select'));
    //Iniciando metodos
    graficoPolaTpEm();//Gráfico de # empleados x tipo de empleados
    barGraphEmpresas() //Gráfico de barra para saber las 5 empresas con más archivos
    pieGraphFoldersEmpresas();//Gráfico de pie de empresas con más folders
    lineaGraphEmpresasAccess();//Empresas a la cual más empleados poseen acceso
    fillSelectBugMtz(API_TIPO_EMPLEADO, 'tipo-de-empleado', null);
});
//Declaramos algunos componentes
const saludoUsuario = document.getElementById('saludo-usuario');
const foldersRangoI = document.getElementById('rangoi');//Rango inicial folders empresas
const foldersRangoF = document.getElementById('rangof');//Rango final folders empresas
const accesosRangoI = document.getElementById('rangoia');//Rango inicial folders empresas
const accesosRangoF = document.getElementById('rangofa');//Rango final folders empresas

//Creando función para el saludo
function saludo() {
    // Se define un objeto con la fecha y hora actual.
    let today = new Date();
    // Se define una variable con el número de horas transcurridas en el día.
    let hour = today.getHours();
    // Se define una variable para guardar un saludo.
    let greeting = '';
    // Dependiendo del número de horas transcurridas en el día, se asigna un saludo para el usuario.
    if (hour < 12) {
        greeting = 'mañana';
    } else if (hour < 19) {
        greeting = 'tarde';
    } else if (hour <= 23) {
        greeting = 'noche';
    }
    fetch(API_GLBVAR + 'verificarSaludoI', {
        method: 'get',
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si existe una sesión, de lo contrario se revisa si la respuesta es satisfactoria.
                if (response.session) {
                } else if (response.status) {
                    sweetAlert(4, "Bienvenido " + response.nombre + " " + response.apellido + " ¡Ten una " + greeting + " productiva!", null);
                    saludoUsuario.textContent = 'Felíz ' + greeting + " " + response.nombre + " " + response.apellido;
                } else {
                    saludoUsuario.textContent = 'Felíz ' + greeting + " " + response.nombre + " " + response.apellido;
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Gráfica de barras de número de empleados por tipo de empleados
function graficoPolaTpEm() {
    // Petición para obtener los datos del gráfico.
    fetch(API_EMPLEADOS + 'cantidadTpEmp', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let tipoEmp = [];
                    let cantidades = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        tipoEmp.push(row.tipo_empleado);
                        cantidades.push(row.cantidad);
                    });
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    polarAreaGraph('grf_polar1', tipoEmp, cantidades, 'Cantidad de empleados', '');
                } else {
                    document.getElementById('grf_polar1').remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

/*Validando inputs de modals para gráficas parametrizadas*/
foldersRangoI.addEventListener('keypress', function (e) {
    if (!soloNumeros(event, 1)) {
        e.preventDefault();
    }
});

/*Validando inputs de modals para gráficas parametrizadas*/
foldersRangoF.addEventListener('keypress', function (e) {
    if (!soloNumeros(event, 1)) {
        e.preventDefault();
    }
});

/*Validando inputs de modals para gráficas parametrizadas*/
accesosRangoF.addEventListener('keypress', function (e) {
    if (!soloNumeros(event, 1)) {
        e.preventDefault();
    }
});

/*Validando inputs de modals para gráficas parametrizadas*/
accesosRangoI.addEventListener('keypress', function (e) {
    if (!soloNumeros(event, 1)) {
        e.preventDefault();
    }
});

/*Generando el gráfico del número de folders entre un rango*/
document.getElementById('foldersRango').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable de form
    let form = new FormData();
    form.append('rangoi', foldersRangoI.value);
    form.append('rangof', foldersRangoF.value);
    // Petición para obtener los datos del gráfico.
    fetch(API_EMPRESAS + 'graficaCantidadFlEm', {
        method: 'post',
        body: form
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let empresas = [];
                    let cantidades = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        empresas.push(row.nombre_empresa);
                        cantidades.push(row.cantidad);
                    });
                    document.getElementById('grf_polar2').width = document.getElementById('grf_polar2').width;
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    polarAreaGraphP('grf_polar2', empresas, cantidades, 'Cantidad de folders', '');
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});

document.getElementById('empleadoMasArchivos').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // var text = select.options[select.selectedIndex];
    // Se define una variable de form
    // Petición para obtener los datos del gráfico.

    let form = new FormData();
    if (document.getElementById('tipo-de-empleado').value > 0) {
        form.append('tipo-de-empleado', document.getElementById('tipo-de-empleado').value);
        fetch(API_ARCHIVOSEMP + 'top3EmpleadosArchivos', {
            method: 'post',
            body: form
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                    if (response.status) {
                        // Se declaran los arreglos para guardar los datos a graficar.
                        let nombres = [];
                        let total = [];
                        // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                        response.dataset.map(function (row) {
                            // Se agregan los datos a los arreglos.
                            nombres.push(row.nombre_empleado);
                            total.push(row.cuenta);
                        });

                        // fillSelect(API_TIPO_EMPLEADO, 'tipo-de-empleado', response.dataset.fk_id_tipo_empleado);
                        document.getElementById('empleado_archivo_bar').width = document.getElementById('empleado_archivo_bar').width;
                        // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                        barGraphParametrizado('empleado_archivo_bar', nombres, total, 'Top 3 empleados con más archivos', '');
                    } else {
                        sweetAlert(2, response.exception, null);
                    }
                });
            } else {
                console.log(request.status + ' ' + request.statusText);
            }
        });
    }else{
        sweetAlert(3,'Debe seleccionar un tipo de empleado',null);
    }

});

//Gráfico de barras para las 5 empresas con más archivos
function barGraphEmpresas() {
    // Petición para obtener los datos del gráfico.
    fetch(API_EMPRESAS + 'top5EmpresasArchivos', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let nombre = [];
                    let arch = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        arch.push(row.archivos);
                        nombre.push(row.nombre_empresa);
                    });
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    barGraph('empresas_bar', nombre, arch, 'Número de archivos', '');
                } else {
                    document.getElementById('empresas_bar').remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Gráfico de pie para las empresas con más folders
function pieGraphFoldersEmpresas() {
    // Petición para obtener los datos del gráfico.
    fetch(API_FOLDERS + 'top5EmpresasFolders', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let nombre = [];
                    let folder = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        nombre.push(row.nombre_empresa);
                        folder.push(row.folders);
                    });
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    pieGraph('folders_empresas_pie', nombre, folder, '');
                } else {
                    document.getElementById('folders_empresas_pie').remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Gráfico de linea para las empresas con más accesos
function lineaGraphEmpresasAccess(){
    // Petición para obtener los datos del gráfico.
    fetch(API_EMPRESAS + 'top5EmpresasAccesos', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let nombre = [];
                    let accesos = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        nombre.push(row.nombre_empresa);
                        accesos.push(row.accesos);
                    });
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    lineGraph('accesos_empresas_linea', nombre, accesos, 'Número de accesos', '');
                } else {
                    document.getElementById('accesos_empresas_linea').remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}


document.getElementById('empleadoMAForm').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // var text = select.options[select.selectedIndex];
    // Se define una variable de form
    // Petición para obtener los datos del gráfico.

    let form = new FormData();
    if (document.getElementById('fechagi').value.length > 0 && document.getElementById('fechagf').value.length > 0) {
        form.append('fechai', document.getElementById('fechagi').value);
        form.append('fechaf', document.getElementById('fechagf').value);
        fetch(API_ARCHIVO + 'graficaArchivosEmpXF', {
            method: 'post',
            body: form
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                    if (response.status) {
                        // Se declaran los arreglos para guardar los datos a graficar.
                        let nombres = [];
                        let total = [];
                        // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                        response.dataset.map(function (row) {
                            // Se agregan los datos a los arreglos.
                            nombres.push(row.nombre_empresa);
                            total.push(row.archivos);
                        });

                        // fillSelect(API_TIPO_EMPLEADO, 'tipo-de-empleado', response.dataset.fk_id_tipo_empleado);
                        document.getElementById('grf_linear2').width = document.getElementById('grf_linear2').width;
                        // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                        lineGraphP('grf_linear2', nombres, total, 'Número de archivos por empresa', '');
                    } else {
                        sweetAlert(2, response.exception, null);
                    }
                });
            } else {
                console.log(request.status + ' ' + request.statusText);
            }
        });
    }else{
        sweetAlert(3,'Debe seleccionar una fecha',null);
    }
});

/*Generando el gráfico del número de folders entre un rango*/
document.getElementById('numeroAccEmpForm').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable de form
    let form = new FormData();
    form.append('rangoi', accesosRangoI.value);
    form.append('rangof', accesosRangoF.value);
    // Petición para obtener los datos del gráfico.
    fetch(API_EMPLEADOS + 'graficaEmpAcc', {
        method: 'post',
        body: form
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let nombrec = [];
                    let accesos = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        nombrec.push(row.nombre_empleado+' '+row.apellido_empleado);
                        accesos.push(row.accesos);
                    });
                    document.getElementById('grf_donut1').width = document.getElementById('grf_donut1').width;
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    doughnutGraphP('grf_donut1', nombrec, accesos, 'Cantidad de accesos', '');
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});

//Metodo para ocultar el boton en caso no sea admin el que inicio session;
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
                if(response.cambioCtr){
                    location.href = 'index.html';
                } else if (!response.status) {
                    document.querySelectorAll('.eliminarbtn').forEach(elemen =>
                        elemen.classList.add('hide')
                    );
                } else {
                    document.querySelectorAll('.eliminarbtn').forEach(element =>
                        element.classList.remove('hide')
                    );
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}