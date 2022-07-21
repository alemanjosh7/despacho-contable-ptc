// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_GLBVAR = SERVER + 'variablesgb.php?action=';
const API_EMPLEADOS = SERVER + 'dashboard/empleados.php?action=';
const API_EMPRESAS = SERVER + 'dashboard/empresas.php?action=';
//Iniciando las funciones y componentes
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    //Inciando el saludo
    saludo();
    //Iniciar componenetes de Materialize
    M.Modal.init(document.querySelectorAll('.modal'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
    //Iniciando metodos
    graficoPolaTpEm();//Gráfico de # empleados x tipo de empleados
});
//Declaramos algunos componentes
const saludoUsuario = document.getElementById('saludo-usuario');
const foldersRangoI = document.getElementById('rangoi');//Rango inicial folders empresas
const foldersRangoF = document.getElementById('rangof');//Rango final folders empresas

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

/*Generando el gráfico del número de folders entre un rango*/
document.getElementById('foldersRango').addEventListener('submit',function(event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable de form
    let form = new FormData();
    form.append('rangoi',foldersRangoI.value);
    form.append('rangof',foldersRangoF.value);
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
                }else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});