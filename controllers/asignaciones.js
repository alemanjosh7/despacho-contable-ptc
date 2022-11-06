const API_GLBVAR = SERVER + "variablesgb.php?action=";
const API_TAREAS = SERVER + "dashboard/tareas.php?action=";
const API_TAREASEMP = SERVER + "dashboard/tareasEmpleados.php?action=";
const ENDPOINT_EMPRESAS =
    SERVER + "dashboard/empresas.php?action=readEmprAllUser";
const ENDPOINT_FOLDERS =
    SERVER + "dashboard/folders.php?action=readFoldAllUser";
const ENDPOINT_EMPLEADOS = SERVER + "dashboard/empleados.php?action=search";

document.addEventListener("DOMContentLoaded", function () {
    PRELOADER.style.display = "block";
    //Inicializar algunos componentes de Materialize
    M.Tabs.init(document.querySelectorAll(".tabs"));
    var elems = document.querySelectorAll(".fixed-action-btn");
    instances = M.FloatingActionButton.init(elems, {
        direction: "bottom",
        hoverEnabled: false,
    });
    M.Modal.init(document.querySelectorAll(".modal"));
    // Se inicializa el componente Select del formulario para que muestre las opciones.
    M.FormSelect.init(document.querySelectorAll("select"));
    //Inicializamos algunos metodos
    comprobarAmin();
    readRowsLimit(API_TAREAS, 0); //Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    //Ocultamos el boton de atras para la páginación
    BOTONATRAS.style.display = "none";
    predecirAdelante(); //Predecimos si hay más datos para la páginación
});

//Declaramos algunas constantes
const PRELOADER = document.getElementById("preloader-cargarJ"); //Preloader de carga para los elementos
const BOTONATRAS = document.getElementById("pagnavg-atr"); //Botón de navegacion de atras
const BOTONNUMEROPAGI = document.getElementById("pagnumeroi"); //Botón de navegacion paginai
const BOTONNUMEROPAGF = document.getElementById("pagnumerof"); //Botón de navegacion paginaf
const BOTONADELANTE = document.getElementById("pagnavg-adl"); //Botón de navegacion de adelante
const ANADIRBOTON = document.getElementById("añadir-empresa"); //Botón para añadir una empresa
const MODATAREAS = document.getElementById("modalAnadirTarea"); //Modal para añadir tarea
const TITULOMOD = document.getElementById("modal-title"); //Titulo del modal
const IDTASK = document.getElementById("id-task"); //Id de la tarea a editar
const FASIGN = document.getElementById("fecha_asignada"); //Input de la fecha asignada
const FLIMIT = document.getElementById("fecha_limit"); //Input de la fecha limite
const FORMTAREA = document.getElementById("formModal"); //Formulario del
const EMPTABL = document.getElementById("empleados-table"); //Tabla de empleados
const EMPSEARCH = document.getElementById("emp-search"); //Tabla de empleados
const EMPCONTTBL = document.getElementById("table-task-empl"); //Contenedor de la tabla
const PRELOADERMODAL = document.getElementById("preloader-añadirempr"); //Preloader del modal
const MENSAJE = document.getElementById("mensaje-anadir"); //Mensaje del modal
const SELECTEMP = document.getElementById("empresa_select"); //Select de la empresa
const SELECTFOL = document.getElementById("folder_select"); //Select de la empresa
const SELECTAPA = document.getElementById("apartado_select"); //Select de la empresa
const TAREASCONT = document.getElementById("tareas-card"); //Contenedor de tareas
const GUARDARTSK = document.getElementById("btn-añadirEmpresaModal"); //Botón de guardar tarea
const BUSCADOREMP = document.getElementById("inputbuscar-empl-task"); //Buscador de empleados
const MENSAJEM = document.getElementById("mensaje-modificar"); //Mensaje del modal empleados
const PRELOADERA = document.getElementById("preloader-añadirempr"); //Preloader de carga del modal de añadir tarea
const PRELOADERM = document.getElementById("preloader-modificarempr"); //Preloader del modal de empleados
const IDTASKE = document.getElementById("id-task-emp"); //ID de la tarea en el form de empleados
const MODEMP = document.getElementById("modalEmpleados"); //Modal de empleados

//Función para cerrar los menu de selección no usados.
function changeOption(val) {
    var cnt = 0;
    instances.map(function (elem) {
        if (val != cnt) {
            console.log(cnt);
            elem.close();
        }
        cnt++;
    });
}

//Función para prepara el modal para añadir tarea
ANADIRBOTON.addEventListener("click", function () {
    //Preparando el modal para añdir la tarea
    IDTASK.value = ""; //Reiniciamos el id de la tarea
    PRELOADER.style.display = "block";
    TITULOMOD.innerText = "Añadir Tarea"; //Añadiendo el titulo al modal
    FASIGN.classList.add("hide"); //Ocultando la fecha de asignación
    FLIMIT.classList.add("offset-m3");
    // Se restauran los elementos del formulario.
    FORMTAREA.reset();
    SELECTEMP.parentNode.parentNode.classList.add("hide"); //Ocultando el select de empresas
    SELECTFOL.parentNode.parentNode.classList.add("hide"); //Ocultando el select de folders
    GUARDARTSK.classList.remove("disabled"); //Removiendo el disabled del botón
    // Se actualizan los campos para que las etiquetas (labels) no queden sobre los datos.
    M.updateTextFields();
    MENSAJE.style.display = "none";
    BUSCADOREMP.value = "";
    IDTASK.value = "";
    M.Modal.getInstance(MODATAREAS).open();
    PRELOADER.style.display = "none";
});

//Metodo para ocultar el boton en caso no sea admin el que inicio session;
function comprobarAmin() {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_GLBVAR + "verificarAdmin", {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si hay no hay una session para admins
                if (response.cambioCtr) {
                    location.href = "index.html";
                } else if (!response.status) {
                    ANADIRBOTON.remove();
                    document
                        .querySelectorAll(".eliminarbtn")
                        .forEach((element) =>
                            element.parentNode.removeChild(element)
                        );
                } else {
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

function ocultarButton2(cases) {
    switch (cases) {
        case 1:
            BOTONNUMEROPAGF.parentNode.parentNode.classList.add("hide");
            document
                .getElementById("pagpoints")
                .parentNode.classList.add("hide");
            break;
        case 2:
            document.getElementById("contenedor_pags").classList.add("hide");
            let h = document.createElement("h3");
            let text = document.createTextNode(
                "No hay asignaciones registradas de momento"
            );
            h.appendChild(text);
            TAREASCONT.innerHTML = "";
            TAREASCONT.append(h);
        default:
            break;
    }
}

function ocultarMostrarAdl(result) {
    if (result != true) {
        console.log("Se oculta el boton");
        BOTONADELANTE.style.display = "none";
    } else {
        //Colocamos el boton con un display block para futuras operaciones
        console.log("Se muestra el boton");
        BOTONADELANTE.style.display = "block";
    }
}
//Funciones para la páginación
//Boton de atras
BOTONATRAS.addEventListener("click", function () {
    BOTONNUMEROPAGF.parentNode.parentNode.classList.remove("hide");
    document.getElementById("pagpoints").parentNode.classList.remove("hide");
    //Volvemos a mostrár el boton de página adelante
    BOTONADELANTE.style.display = "block";
    //Obtenemos el número de la página inicial
    let paginaActual = Number(BOTONNUMEROPAGI.textContent);
    //Comprobamos que el número de página no sea igual a 1
    if (paginaActual != 1) {
        //Restamos la cantidad de páginas que queramos que se retroceda en este caso decidi 2 para el botoni y 1 para el botonf
        BOTONNUMEROPAGI.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) - 2;
        BOTONNUMEROPAGF.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) + 1;
        //Verificamos si el número del boton ahora es 1, en caso lo sea se ocultará el boton
        if (Number(BOTONNUMEROPAGI.innerHTML) - 1 == 0) {
            BOTONATRAS.style.display = "none";
        }
    }
});

//Boton de adelante
BOTONADELANTE.addEventListener("click", function () {
    //Volvemos a mostrár el boton de página anterior
    BOTONATRAS.style.display = "block";
    //Ejecutamos la función para predecir si hay más páginas
    //Sumamos la cantidad de página que queramos que avance, en este caso decidi 2 para el botoni y 3 para el botonf
    BOTONNUMEROPAGI.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) + 2;
    predecirAdelante();
    //Luego verificamos si el boton de adelante aun continua mostrandose
    if ((BOTONADELANTE.style.display = "block")) {
        //Sumamos la cantidad de página que queramos que avance, en este caso decidi 2 para el botoni y 3 para el botonf
        BOTONNUMEROPAGF.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) + 1;
    } else {
        BOTONNUMEROPAGI.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) - 2;
    }
});

//Función que realizará los botones con numero de la páginacion
document.querySelectorAll(".contnpag").forEach((el) => {
    el.addEventListener("click", (e) => {
        PRELOADER.style.display = "block";
        //Se obtiene el numero dentro del span
        let number = Number(el.lastElementChild.textContent);
        console.log("numero seleccionado " + number);
        //Se hace la operación para calcular cuanto será el top de elementos a no mostrarse en la consulta en este caso seran 8
        let limit = number * 6 - 6;
        //Se ejecuta la recarga de datos enviando la variable de topAct
        //Ejecutamos la función para predecir si habrá un boton de adelante
        readRowsLimit(API_TAREAS, limit); //Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
        document.getElementById("numbe_paginc").innerText = number;
    });
});
//Función para saber si hay otra página
function predecirAdelante() {
    //Colocamos el boton con un display block para futuras operaciones
    BOTONADELANTE.style.display = "block";
    //Obtenemos el número de página que seguiría al actual
    let paginaFinal = Number(BOTONNUMEROPAGI.innerHTML) + 2;
    console.log("pagina maxima " + paginaFinal);
    //Calculamos el limite que tendria el filtro de la consulta dependiendo de la cantidad de Clientes a mostrar
    let limit = paginaFinal * 10 - 10;
    console.log("El limite sería: " + limit);
    //Ejecutamos el metodo de la API para saber si hay productos y esta ejecutará una función que oculte o muestre el boton de adelante
    predictLImit(API_GLBVAR, limit);
    let limit2 = (Number(BOTONNUMEROPAGI.innerHTML) + 1) * 10 - 10;
    predictButton(API_GLBVAR, limit2);
}

//Añadiendo método escucha al cambiar el select
SELECTAPA.addEventListener("change", function () {
    //Obtenemos el valor
    let seleccion = this.options[SELECTAPA.selectedIndex];
    if (seleccion.value == 4 && seleccion.text == "Empresas") {
        PRELOADER.style.display = "block";
        fillSelect2(
            ENDPOINT_EMPRESAS,
            "empresa_select",
            "¿Cual empresa?",
            null,
            true
        );
        SELECTEMP.parentNode.parentNode.classList.remove("hide");
        PRELOADER.style.display = "none";
    } else {
        SELECTEMP.parentNode.parentNode.classList.add("hide");
        SELECTFOL.parentNode.parentNode.classList.add("hide");
    }
});

function llenarFolders(endpoint, select, indicacion, selected, disable, form) {
    return new Promise((resolve, reject) => {
        resolve(
            fetch(endpoint, {
                method: "post",
                body: form,
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    // Se obtiene la respuesta en formato JSON.
                    request.json().then(function (response) {
                        let content = "";
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            // Se añade la indicación pero se evalua si se desea deshabilitarla o no.
                            if (disable) {
                                content +=
                                    "<option disabled selected>" +
                                    indicacion +
                                    "</option>";
                            } else {
                                content +=
                                    "<option selected>" +
                                    indicacion +
                                    "</option>";
                            }
                            // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                            response.dataset.map(function (row) {
                                // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
                                value = Object.values(row)[0];
                                // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
                                text = Object.values(row)[1];
                                // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
                                if (value != selected) {
                                    content += `<option value="${value}">${text}</option>`;
                                } else {
                                    content += `<option value="${value}" selected>${text}</option>`;
                                }
                            });
                            SELECTFOL.parentNode.parentNode.classList.remove(
                                "hide"
                            );
                        } else {
                            content +=
                                "<option>No hay opciones disponibles</option>";
                        }
                        // Se agregan las opciones a la etiqueta select mediante su id.
                        document.getElementById(select).innerHTML = content;
                        PRELOADER.style.display = "none";
                        // Se inicializa el componente Select del formulario para que muestre las opciones.
                        M.FormSelect.init(document.querySelectorAll("select"));
                    });
                } else {
                    console.log(request.status + " " + request.statusText);
                }
            })
        );
    });
}

function cargarFoldSelect(){
//Obtenemos el valor
    return new Promise((resolve, reject) => {
        let seleccion = SELECTEMP.options[SELECTEMP.selectedIndex];
        let form = new FormData();
        form.append("idemp", seleccion.value);
        PRELOADER.style.display = "block";
        llenarFolders(
            ENDPOINT_FOLDERS,
            "folder_select",
            "¿Cual folder?",
            null,
            true,
            form
        ).then(
            resolve(true)
        );
    })
    
};

//Añadiendo método escucha al cambiar el select
SELECTEMP.addEventListener("change", async function () {
    //Obtenemos el valor
    let seleccion = this.options[SELECTEMP.selectedIndex];
    let form = new FormData();
    form.append("idemp", seleccion.value);
    PRELOADER.style.display = "block";
    llenarFolders(
        ENDPOINT_FOLDERS,
        "folder_select",
        "¿Cual folder?",
        null,
        true,
        form
    );
});


//Función para validar la fecha
function validarFecha(componente) {
    let fecha_aux = componente.value.split("/");
    let fechaInput = componente.value;

    let fecha = new Date();

    let mes = (fecha.getMonth() + 1).toString();
    if (mes.length <= 1) {
        mes = "0" + mes;
    }

    let dia = fecha.getDate().toString();
    if (dia.length <= 1) {
        dia = "0" + dia;
    }

    let fechaActual = fecha.getFullYear() + "-" + mes + "-" + dia;

    if (isNaN(Date.parse(fecha_aux))) {
        sweetAlert(3, "La fecha no existe", null);
        return false;
    } else if (fechaInput < fechaActual) {
        sweetAlert(
            3,
            "La fecha debe ser mayor o igual a la fecha actual",
            null
        );
        return false;
    } else {
        //mensajeC.style.display = 'none';
        return true;
    }
}

//Función para insertar los empleados en la tabla();
async function llenarEmpleados(tipo, dataset, componente) {
    //Si tipo es true inserta en el modal, si no inserta en las card
    let content = "";
    return new Promise((resolve, reject) => {
        dataset.map(function (row) {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            if (tipo) {
                content += `
                    <tr>
                        <td>${
                            row.nombre_empleado + " " + row.apellido_empleado
                        }</td>
                        <td><a onclick="eliminarEmp(${
                            row.id_empleado
                        })" class="icons-add-task"><i
                            class="small material-icons icons-remove-emp">remove_circle</i></a></td>
                    </tr>
            `;
            } else {
                content += `
                <tr>
                    <td>${
                        row.nombre_empleado + " " + row.apellido_empleado
                    }</td>
                </tr>
            `;
            }
        });
        if (tipo) {
            componente.innerHTML = content;
        } else {
            document.getElementById(componente).innerHTML = content;
        }

        resolve(true);
    });
}

//Función para cargar los datos en el modal de empleados
const obtenerEmpleadosASG = (opcion, id, componente = true) => {
    //Analizamos la opción, si es true los introduce en el modal, si es false los retorna
    let form = new FormData();
    let llenado = true;
    form.append("idtask", id);

    return new Promise((resolve, reject) => {
        fetch(API_TAREASEMP + "readEmpTask", {
            method: "post",
            body: form,
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                // Se obtiene la respuesta en formato JSON.
                request.json().then(async function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.status) {
                        if (opcion) {
                            EMPTABL.innerHTML = "";
                            llenado = await llenarEmpleados(
                                opcion,
                                response.dataset,
                                EMPTABL
                            );
                        } else {
                            componente.innerHTML = "";
                            llenado = await llenarEmpleados(
                                opcion,
                                response.dataset,
                                componente
                            );
                        }

                        resolve(llenado);
                    } else {
                        opcion
                            ? (EMPTABL.innerHTML = "")
                            : (CARDAEMPTAB.innerHTML = "");
                        resolve(llenado);
                    }
                });
            } else {
                sweetAlert(
                    2,
                    "Tarea creado pero hubo un error al intentar asignar empleados",
                    null
                );
                console.log(request.status + " " + request.statusText);
            }
        });
    });
};

//Función para guardar una tarea
//Función para guardar una tarea
GUARDARTSK.addEventListener("click", async function () {
    let metodo;
    (IDTASK.value != "") ? (metodo = "update") : (metodo = "create");
    console.log(metodo);
    //Evaluamos que todos los datos esten correctos
    let vVacio = [
        document.getElementById("asignacion-empr"),
        document.getElementById("fecha_lmt"),
    ];

    if (
        validarCamposVacios(vVacio) != false &&
        validarFecha(document.getElementById("fecha_lmt"))
    ) {
        MENSAJE.style.display = "none";
        let form = new FormData(FORMTAREA);
        PRELOADERA.style.display = "block";
        GUARDARTSK.classList.add("disabled");
        try {
            let request = await fetch(API_TAREAS + metodo, {
                method: "post",
                body: form,
            });
            if (!request.ok) {
                console.log(request.status + " " + request.statusText);
            } else {
                let response = await request.json();
                if (response.status && response.dataset) {
                    IDTASKE.value = response.dataset.id_tarea;
                    let llenado = await obtenerEmpleadosASG(true, IDTASK.value);
                    EMPSEARCH.innerHTML = "";
                    sweetAlert(1, response.message, null);
                    M.Modal.getInstance(MODATAREAS).close();
                    M.Modal.getInstance(MODEMP).open();
                    PRELOADERA.style.display = "none";
                } else {
                    sweetAlert(2, response.exception, null);
                    GUARDARTSK.classList.remove("disabled");
                }
            }
        } catch (error) {
            PRELOADERA.style.display = "none";
            GUARDARTSK.classList.remove("disabled");
            sweetAlert(2, "Ha habido un error al guardar la asignación", null);
            console.log(error);
        }
    } else {
        MENSAJE.innerText =
            "Asegurese de llenar almenos la asignación y la fecha limite";
        MENSAJE.style.display = "block";
    }
});

//Función para reiniciar el modal de empleados
function reiniciarModal() {
    EMPSEARCH.innerHTML = "";
    IDTASKE.value = "";
    EMPTABL.innerHTML = "";
    BUSCADOREMP.value = "";

    //Se llama a la función de leer todo.
    readRowsLimit(API_TAREAS, 0); //Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
}

//Función para que cargue los empleados en la tabla al escribir
BUSCADOREMP.addEventListener("keyup", async (event) => {
    PRELOADERM.style.display = "block";
    if (BUSCADOREMP.value != "") {
        let content = "";
        let form = new FormData();
        form.append("limit", 10);
        form.append("input-file", BUSCADOREMP.value);
        try {
            let request = await fetch(ENDPOINT_EMPLEADOS, {
                method: "post",
                body: form,
            });

            if (!request.ok) {
                console.log(request.status + " " + request.statusText);
            } else {
                let response = await request.json();
                if (response.status) {
                    response.dataset.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                            <tr>
                                <td>${
                                    row.nombre_empleado +
                                    " " +
                                    row.apellido_empleado
                                }</td>
                                <td>${row.tipo_empleado}</td>
                                <td><a onclick="anadirEmp(${
                                    row.id_empleado
                                })" class="icons-add-task"><i
                                            class="small material-icons">person_add</i></a></td>
                            </tr>
                        `;
                    });
                    //Los colocamos dentro de la tabla
                    EMPSEARCH.innerHTML = content;
                    PRELOADERM.style.display = "none";
                } else {
                    PRELOADERM.style.display = "none";
                }
            }
        } catch (error) {
            sweetAlert(2, "Ocurrio un error al buscar los empleados", null);
        }
    } else {
        //Los colocamos dentro de la tabla
        EMPSEARCH.innerHTML = "";
    }
});

//Función para añadirEmpleado a la asignación
const anadirEmp = async function (idemp) {
    PRELOADERM.style.display = "block";
    //Añadimos los empleados a la asignación
    let form = new FormData(); //Creamos un formulario
    form.append("idemp", idemp); //Asignamos el id del empleado
    form.append("idtask", IDTASKE.value); //Asignamos el id de la tarea
    try {
        let request = await fetch(API_TAREASEMP + "createASG", {
            method: "post",
            body: form,
        });

        if (!request.ok) {
            console.log(request.status + " " + request.statusText);
        } else {
            let response = await request.json();
            if (response.status) {
                let llenado = await obtenerEmpleadosASG(true, IDTASKE.value);
                PRELOADERM.style.display = "none";
            } else {
                sweetAlert(2, response.exception, null);
                PRELOADERM.style.display = "none";
            }
        }
    } catch (error) {
        sweetAlert(2, "Ocurrio un error al asignar el empleado", null);
    }
};

//Función de eliminar al empleado a la hora de asignar
const eliminarEmp = async function (idemp) {
    PRELOADERM.style.display = "block";
    //Añadimos los empleados a la asignación
    let form = new FormData(); //Creamos un formulario
    form.append("idemp", idemp); //Asignamos el id del empleado
    form.append("idtask", IDTASKE.value); //Asignamos el id de la tarea
    try {
        let request = await fetch(API_TAREASEMP + "deleteASG", {
            method: "post",
            body: form,
        });

        if (!request.ok) {
            console.log(request.status + " " + request.statusText);
        } else {
            let response = await request.json();
            if (response.status) {
                let llenado = await obtenerEmpleadosASG(true, IDTASKE.value);
                PRELOADERM.style.display = "none";
            } else {
                sweetAlert(2, response.exception, null);
                PRELOADERM.style.display = "none";
            }
        }
    } catch (error) {
        sweetAlert(2, "Ocurrio un error al asignar el empleado", null);
    }
};

//Función para obtener el estado
function getEstadoName(clase) {
    switch (clase) {
        case "task-rejected":
            return "Rechazada";
            break;
        case "task-failed":
            return "Expirada";
            break;
        case "":
            return "Pendiente";
            break;
        default:
            break;
    }
}

//Función de llenado de cards
function fillTable(dataset) {
    let content = "";
    let indice = 0;
    PRELOADER.style.display = "block";
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(async function (row) {
        //Validamos que clase será
        let clase;
        row.nombre_estado == "Rechazada"
            ? (clase = "task-rejected")
            : (clase = ""); //Validando que no este rechazada
        validarFechaJS(1, row.fecha_limite) ? clase : (clase = "task-failed"); //Validando que no halla vencido
        let estado = getEstadoName(clase);

        //Link para la redirección
        let link = "";
        if (row.apartado) {
            link = `<span><b>Trabajo en: </b><a class="icons-add-task" onclick="redirigirTask(${row.apartado},${row.fk_id_empresa},${row.fk_id_folder})">Dar click para
            redirigir</a></span>`;
        }
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <div class="col s12 l4 m6">
                <div class="card horizontal center-align card-task ${clase}">
                    <div class="card-stacked">
                        <div class="fixed-action-btn eliminarbtn" onclick="changeOption(${indice});" id="${indice++}">
                            <a class="btn-floating btn-medium floating-task-btn">
                                <i class="medium material-icons">more_horiz</i>
                            </a>
                            <ul>
                                <li><a class="btn-floating red darken-1 tooltipped" data-tooltip="Eliminar"
                                        data-position="left" onclick="eliminarTask(${
                                            row.id_tarea
                                        })"><i class="material-icons">delete</i></a></li>
                                <li><a class="btn-floating blue tooltipped" data-tooltip="Modificar"
                                        data-position="left" onclick="modTask(${
                                            row.id_tarea
                                        })"><i class="material-icons">edit</i></a></li>
                                <li><a class="btn-floating orange tooltipped" data-tooltip="Rechazar"
                                    data-position="left" onclick="rechazarTask(${
                                        row.id_tarea
                                    })"><i class="material-icons">warning</i></a></li>
                            </ul>
                        </div>
                        <span class="card-title">${estado}</span>
                        <div class="card-content">
                            <p><b>Observación:</b></p>
                            <p>
                                ${
                                    row.observacion != null
                                        ? row.observacion
                                        : "Ninguna observación de momento"
                                }
                            </p>
                        </div>
                        <div class="card-tabs">
                            <ul class="tabs tabs-fixed-width">
                                <li class="tab"><a class="active" href="#task-info${indice}">Asignación</a></li>
                                <li class="tab"><a href="#task-empl${indice}">Empleados</a></li>
                            </ul>
                        </div>
                        <div class="card-content grey lighten-4">
                            <div id="task-info${indice}">
                                <div class="task-data">
                                    <div class="card-content">
                                        ${row.asignacion}
                                    </div>
                                    <p><span><b>Finalizar antes de: </b>${
                                        row.fecha_limite
                                    }</span></p>
                                    ${link}
                                </div>
                            </div>
                            <div id="task-empl${indice}">
                                <div class="card-content task-data">
                                    <table class="centered striped table-task-empl">
                                        <thead>
                                            <tr>
                                                <th>Nombre de empleados</th>
                                            </tr>
                                        </thead>

                                        <tbody id="emp-task-card${indice}">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        await obtenerEmpleadosASG(
            false,
            row.id_tarea,
            "emp-task-card" + indice
        );
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    PRELOADER.style.display = "none";
    TAREASCONT.innerHTML = content;
    // Se inicializa el componente Tooltip para que funcionen las sugerencias textuales.
    M.Tooltip.init(document.querySelectorAll(".tooltipped"));
    M.Tabs.init(document.querySelectorAll(".tabs"));
    var elems = document.querySelectorAll(".fixed-action-btn");
    instances = M.FloatingActionButton.init(elems, {
        direction: "bottom",
        hoverEnabled: false,
    });
    comprobarAmin();
    predecirAdelante();
}

//Función para redirigir
const redirigirTask = (apartado, empresa, folder) => {
    let form = new FormData();
    form.append("apartado", apartado);
    form.append("idempresa", empresa);
    form.append("idfolder", folder);
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_GLBVAR + "redirigirFTask", {
        method: "post",
        body: form,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                if (response.status) {
                    location.href = response.status + ".html";
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
};

//Función para rechazar una tarea
const rechazarTask = (id) => {
    let form = new FormData();
    form.append("idtask", id);
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_TAREAS + "rejectTask", {
        method: "post",
        body: form,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                if (response.status) {
                    sweetAlert(1, response.message, "asignaciones.html");
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
};

//Función para eliminar una tarea
const eliminarTask = (id) => {
    let form = new FormData();
    form.append("idtask", id);
    confirmDeleteL(API_TAREAS, form, 0);
};

const BUSCADORINP = document.getElementById("inputbuscar-empresas");
//Función del buscador dinamico
BUSCADORINP.addEventListener("keyup", function (e) {
    //Se muestra el cargador
    PRELOADER.style.display = "block";
    if (BUSCADORINP.value == "") {
        readRowsLimit(API_TAREAS, 0); //Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    } else {
        limitBuscar = 6;
        // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
        dynamicSearcherlimit(API_TAREAS, "buscador-form", limitBuscar);
    }
});

//Función cuando el buscador no encuentra los datos
function noDatos() {
    PRELOADER.style.display = "none";
    let h = document.createElement("h3");
    let text = document.createTextNode("0 resultados");
    h.appendChild(text);
    TAREASCONT.innerHTML = "";
    TAREASCONT.append(h);
}

const modTask = async (id) => {
    let form = new FormData();
    form.append("idtask", id);

    PRELOADER.style.display = "block";
    //Preparando el modal para añdir la tarea
    IDTASK.value = ""; //Reiniciamos el id de la tarea
    // Se restauran los elementos del formulario.
    FORMTAREA.reset();
    try {
        let request = await fetch(API_TAREAS + "getTarea", {
            method: "post",
            body: form,
        });

        if (!request.ok) {
            console.log(request.status + " " + request.statusText);
        } else {
            let response = await request.json();
            if (response.status) {
                IDTASK.value = response.dataset.id_tarea; //Reiniciamos el id de la tarea
                TITULOMOD.innerText = "Moficiar Tarea"; //Añadiendo el titulo al modal
                FASIGN.classList.remove("hide"); //Ocultando la fecha de asignación
                document.getElementById('fecha_asig').value = response.dataset.fecha_asignada;
                FLIMIT.classList.remove("offset-m3");
                document.getElementById('fecha_lmt').value = response.dataset.fecha_limite;
                SELECTEMP.parentNode.parentNode.classList.add("hide"); //Ocultando el select de empresas
                SELECTFOL.parentNode.parentNode.classList.add("hide"); //Ocultando el select de folders
                GUARDARTSK.classList.remove("disabled"); //Removiendo el disabled del botón

                //Añadiendo los datos
                document.getElementById('observacion-empr').value = response.dataset.observacion;
                document.getElementById('asignacion-empr').value = response.dataset.asignacion;

                //Se activan los select
                if (response.dataset.apartado) {
                    SELECTAPA.value = response.dataset.apartado;
                }
                if(response.dataset.fk_id_empresa){
                    fillSelect2(
                        ENDPOINT_EMPRESAS,
                        "empresa_select",
                        "¿Cual empresa?",
                        response.dataset.fk_id_empresa,
                        true
                    );
                    SELECTEMP.parentNode.parentNode.classList.remove("hide"); //Ocultando el select de empresas
                }
                
                if (response.dataset.fk_id_folder) {
                    await cargarFoldSelect();
                    SELECTFOL.value = response.dataset.fk_id_folder;
                    SELECTFOL.parentNode.parentNode.classList.remove("hide"); //Ocultando el select de folders
                }

                // Se actualizan los campos para que las etiquetas (labels) no queden sobre los datos.
                M.updateTextFields();
                MENSAJE.style.display = "none";
                BUSCADOREMP.value = "";
                M.Modal.getInstance(MODATAREAS).open();
                PRELOADER.style.display = "none";
            } else {
                sweetAlert(2, response.exception, null);
                PRELOADER.style.display = "none";
            }
        }
    } catch (error) {
        PRELOADER.style.display = "none";
        sweetAlert(2, "Ocurrio un error al asignar el empleado", null);
    }
};
