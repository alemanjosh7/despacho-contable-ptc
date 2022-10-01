// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPRESAS = SERVER + 'dashboard/empresas.php?action=';
const API_EMPRESAEMP = SERVER + 'dashboard/empresasEmpleados.php?action=';
const ENDPOINT_EMPRESA = SERVER + 'dashboard/empresasEmpleados.php?action=readAll';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';
const API_EMPLEADOS = SERVER + 'dashboard/empleados.php?action=';
const API_TIPO_EMPLEADO = SERVER + 'dashboard/tipoEmpleado.php?action=obtenerTipoEmpleado'
var instances;
const btnPuntitos = document.getElementById('btn-puntitos');
var instancesButton;
const USUARIO = document.getElementById('usuario-emp');
const TELEFONO = document.getElementById('telefono-emp');
const CONTRA = document.getElementById('contra-emp');
const CONTRAC = document.getElementById('contrac-emp');
const NOMBREE = document.getElementById('nombre-emp');
const APELLIDOE = document.getElementById('apellido-emp');
const DUI = document.getElementById('dui-emp');
const CORREO = document.getElementById('correo-emp');

var limitBuscar = 6;

document.addEventListener('DOMContentLoaded', function () {
  //Ocultamos el boton de atras para la páginación
  BOTONATRAS.style.display = 'none';
  //Inciando el saludo
  PRELOADER.style.display = 'block';
  comprobarAmin();
  readRowsLimit(API_EMPLEADOS, 0);
  //Ejecutamos la función para predecir si habrá un boton de adelante
  predecirAdelante();
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Slider.init(document.querySelectorAll('.slider'));
  M.Carousel.init(document.querySelectorAll('.carousel'));
  M.Tooltip.init(document.querySelectorAll('.tooltipped'));
  M.FormSelect.init(document.querySelectorAll('select'));
  let options = {
    dismissible: false,
    onOpenStart: function () {
      // Se restauran los elementos del formulario.
      document.getElementById('save-form').reset();
      M.updateTextFields();
    }
  }
  // Se inicializa el componente Modal para que funcionen las cajas de diálogo.
  M.Modal.init(document.querySelectorAll('.modal'), options);
});

//Declaramos algunas constantes
const EMPRESASMODAL = document.getElementById('modalAnadirEmpresa');
const EMPRESASCHEKCONT = document.getElementById('contEmpresas');
const PRELOADER = document.getElementById('preloader-cargarJ');//Preloader de carga para los elementos
function changeOption(val) {
  var cnt = 0;
  instances.map(function (elem) {
    if (val != cnt) {
      // console.log(cnt);
      elem.close();
    }
    cnt++;
  });
}

//Colocamos limitación en inputs privados para no copiar
TELEFONO.oncopy = function (e) {
  e.preventDefault();
}

DUI.oncopy = function (e) {
  e.preventDefault();
}

CORREO.oncopy = function (e) {
  e.preventDefault();
}

/*Boton de ir hacia arriba*/

var hastatop = document.getElementById("hasta_arriba");

window.onscroll = function () {
  //Para el boton de hasta arriba
  if (document.documentElement.scrollTop > 200) {
    hastatop.style.display = "block";
  } else {
    hastatop.style.display = "none";
  }

  //Para páginación del servidor
  if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {

    // Se evita recargar la página web después de enviar el formulario.
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    if (document.getElementById('input-file').value.length > 0) {
      limitBuscar *= 6;
      dynamicSearcherlimit(API_EMPLEADOS, 'search-form', limitBuscar);
    }
  }
};

hastatop.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});



// Initialize collapsible (uncomment the lines below if you use the dropdown variation)
// var collapsibleElem = document.querySelector('.collapsible');
// var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

function openCreate() {
  // Se abre la caja de diálogo (modal) que contiene el formulario.
  var id_producto = document.getElementById('input-id');
  id_producto.style.display = 'none';
  id_producto.style.visibility = 'hidden';
  M.FormSelect.init(document.querySelectorAll('select'));
  document.getElementById('modal-title').textContent = 'Crear empleado';
  // Se llama a la función que llena el select del formulario. Se encuentra en el archivo components.js
  fillSelect(API_TIPO_EMPLEADO, 'tipo-de-empleado', null);
  //Ocultamos el estado
  document.getElementById('estado_check').classList.add('hide');
  document.getElementById('texto_guardar').innerText = 'Añadir empleado';
  // Se establece el campo de archivo como opcional.
  document.getElementById('contra-emp').required = true;
  document.getElementById('contrac-emp').required = true;
}

// Función para preparar el formulario al momento de modificar un registro.
function openUpdate(id) {
  PRELOADER.style.display = 'block';
  // Se abre la caja de diálogo (modal) que contiene el formulario.
  // Se establece el campo de archivo como opcional.
  //Ocultamos el estado
  document.getElementById('estado_check').classList.remove('hide');
  document.getElementById('texto_guardar').innerText = 'Actualizar empleado';
  document.getElementById('modal-title').textContent = 'Editar empleado';
  document.getElementById('contra-emp').required = false;
  document.getElementById('contrac-emp').required = false;
  var id_empleado = document.getElementById('id');
  id_empleado.style.display = 'block';
  id_empleado.style.visibility = 'visible';
  // Se define un objeto con los datos del registro seleccionado.
  const data = new FormData();
  data.append('id', id);
  // Petición para obtener los datos del registro solicitado.
  fetch(API_EMPLEADOS + 'obtenerEmpleado', {
    method: 'post',
    body: data
  }).then(function (request) {
    // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
    if (request.ok) {
      // Se obtiene la respuesta en formato JSON.
      request.json().then(function (response) {
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (response.status) {
          // Se inicializan los campos del formulario con los datos del registro seleccionado.
          document.getElementById('id').value = response.dataset.id_empleado;
          document.getElementById('usuario-emp').value = response.dataset.usuario_empleado;
          // document.getElementById('contra-em').value = response.dataset.id_producto;
          document.getElementById('nombre-emp').value = response.dataset.nombre_empleado;
          document.getElementById('apellido-emp').value = response.dataset.apellido_empleado;
          document.getElementById('dui-emp').value = response.dataset.dui_empleado;
          document.getElementById('correo-emp').value = response.dataset.correo_empleadocontc;
          document.getElementById('telefono-emp').value = response.dataset.telefono_empleadocontc;
          fillSelect(API_TIPO_EMPLEADO, 'tipo-de-empleado', response.dataset.fk_id_tipo_empleado);
          //Analizamos si el estado es Activo o Bloqueado
          if (response.dataset.fk_id_estado == 4) {
            document.getElementById('estadoEmp').checked = true;
          } else {
            document.getElementById('estadoEmp').checked = false;
          }
          // Se actualizan los campos para que las etiquetas (labels) no queden sobre los datos.
          M.updateTextFields();
          PRELOADER.style.display = 'none';
        } else {
          sweetAlert(2, response.exception, null);
        }
      });
    } else {
      console.log(request.status + ' ' + request.statusText);
    }
  });
}

document.getElementById('input-file').addEventListener('keyup', (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
  //Inciando el saludo
  PRELOADER.style.display = 'block';
  if (document.getElementById('input-file').value === "") {
    readRowsLimit(API_EMPLEADOS, 0);
  }
  else {
    limitBuscar = 6;
    dynamicSearcherlimit(API_EMPLEADOS, 'search-form', limitBuscar);
  }
});

//Función cuando el buscador no encuentra los datos
function noDatos() {
  PRELOADER.style.display = 'none';
  let h = document.createElement("h3");
  let text = document.createTextNode("0 resultados");
  h.appendChild(text);
  document.getElementById('employee-form').innerHTML = "";
  document.getElementById('employee-form').append(h);
}

/*Metodo para llenar los checkbox con las empresas*/
function llenarEmpresas(idemp) {
  //Inciando el saludo
  PRELOADER.style.display = 'block';
  let content = '';
  fetch(API_EMPRESAS + 'readAll', {
    method: 'get'
  }).then(function (request) {
    // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
    if (request.ok) {
      // Se obtiene la respuesta en formato JSON.
      request.json().then(function (response) {
        // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
        if (response.status) {
          // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
          response.dataset.map(function (row) {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            content += `
              <p class="col s12 m4 l3 offset-l1">
                <label>
                    <input type="checkbox" class="empr_checkbox" id="${row.id_empresa}"/>
                    <span>${row.nombre_empresa}</span>
                </label>
              </p>
            `;
          });
          // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
          EMPRESASCHEKCONT.innerHTML = content;
          //Se muestra el modal
          M.Modal.getInstance(EMPRESASMODAL).open();
          checarCheckBoxsEmpr(idemp);
          //Función para crear un enlace entre la empresa seleccionada y el cliente al cambiar el estado del checkbox
          document.querySelectorAll('.empr_checkbox').forEach(element => {
            element.addEventListener("change", e => {
              const id = Number(e.target.getAttribute("id"));
              if (element.checked) {
                enlaceEmpresa(id, idemp, 'create');
              } else {
                enlaceEmpresa(id, idemp, 'delete');
              }
            });
          });
        } else {
          sweetAlert(4, response.exception, null);
        }
      });
    } else {
      console.log(request.status + ' ' + request.statusText);
    }
  });
}

/*Metodo para cambiar el estado de los componentes a checados si están dentro de*/
function checarCheckBoxsEmpr(idemp) {
  let arreglo = [];
  let formJ = new FormData();
  formJ.append('idemp', idemp);
  // Petición para obtener las empresas relacionadas con el usuario
  fetch(API_EMPRESAS + 'readEmprAsg', {
    method: 'post',
    body: formJ
  }).then(function (request) {
    // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
    if (request.ok) {
      // Se obtiene la respuesta en formato JSON.
      request.json().then(function (response) {
        // Se agrega los resultados a un arreglo
        for (let index = 0; index < response.dataset.length; index++) {
          arreglo[index] = response.dataset[index].id_empresa;
        }
        //Se compara el id de los checkbox con el arreglo para ver si se encuentra una similitud, si la hay. Entonces se cambia su estado a checado
        document.querySelectorAll('.empr_checkbox').forEach(element => {
          if (arreglo.includes(Number(element.getAttribute("id")))) {
            //Como encontro similitud agregamos el atributo checked en estado checked, para cambiar su estado
            element.setAttribute("checked", "checked");
          }
        });
        PRELOADER.style.display = 'none';
      });
    } else {
      console.log(request.status + ' ' + request.statusText);
    }
  });
}

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
        if (response.cambioCtr) {
          location.href = 'index.html';
        } else if (!response.status) {
          location.href = 'inicio.html';
        }
      });
    } else {
      console.log(request.status + ' ' + request.statusText);
    }
  });
}

//Función para crear el enlace de empresa y empleado
function enlaceEmpresa(id, idemp, action) {
  let formJ = new FormData();
  formJ.append('idemp', idemp);//Id de la empresa
  formJ.append('id', id);//id del empleado
  fetch(API_EMPRESAEMP + action, {
    method: 'post',
    body: formJ
  }).then(function (request) {
    // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
    if (request.ok) {
      // Se obtiene la respuesta en formato JSON.
      request.json().then(function (response) {
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (response.status) {
          // Se cierra la caja de dialogo (modal) del formulario.
          M.Modal.getInstance(EMPRESASMODAL).close();
          // Se cargan nuevamente las filas en la tabla de la vista después de guardar un registro y se muestra un mensaje de éxito.
          llenarEmpresas(idemp);
        } else {
          sweetAlert(2, response.exception, null);
        }
      });
    } else {
      console.log(request.status + ' ' + request.statusText);
    }
  });
}
//Llenado de tabla
function fillTable(dataset) {
  let content = '';
  let indice = 0;
  // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
  dataset.map(function (row) {
    // Se crean y concatenan las filas de la tabla con los datos de cada registro.
    content += `
            <div class="col l4 m6 s12">
                <!--Card para el empleado-->
                <div class="card">
                    <!--Fixed Button para que el usuario pueda escoger las diferentes opciones tales como eliminar y editar en cada uno de los empleados-->
                    <div class="fixed-action-btn" onclick="changeOption(${indice});" id="${indice++}" >
                        <a class="btn-floating btn-large">
                            <i class="large material-icons">more_horiz</i>
                        </a>
                        <ul>
                            <li><a class="btn-floating red" onclick="openDelete(${row.id_empleado})"><i
                                        class="material-icons">delete</i></a></li>
                            <li><a class="btn-floating blue modal-trigger" href="#modal-template" onclick="openUpdate(${row.id_empleado})"><i
                                        class="material-icons">edit</i></a></li>
                            <li><a class="btn-floating green tooltipped eliminarbtn" data-position="right"
                                    data-tooltip="Accesos a empresas" onclick="llenarEmpresas(${row.id_empleado});"><i
                                        class="material-icons">business</i></a></li>`
    if (row.secret_auth) {
      content += `
                              <li><a class="btn-floating black tooltipped" data-tooltip="Eliminar factor 3P" data-position="right"
                                onclick="deleteGAuth(${row.id_empleado})"><i
                              class="material-icons">enhanced_encryption</i></a></li>`
    }
    content += `
                          </ul>
                    </div>
                    <!--Imagen de la Card donde muestra la foto del empleado-->
                    <div class="card-image">
                        <img src="../resources/img/employeeIcon.png">
                    </div>
                    <!--Contenedor de la informacion del empleado-->
                    <div class="card-content center">
                        <!--Nombre del empleado-->
                        <div class="name-employee">
                            <p>${row.nombre_empleado} ${row.apellido_empleado}</p>
                        </div>
                        <!--Contenedor de la informacion extra del empleado-->
                        <div class="employee-information">
                            <!--Tiempo completo-->
                            <div class="info">
                                <img src="../resources/icons/role.png" alt="">
                                <p>${row.tipo_empleado}</p>
                            </div>
                            <!--Correo del empleado-->
                            <div class="info">
                                <img src="../resources/icons/email.png" alt="">
                                <p>${row.correo_empleadocontc}</p>
                            </div>
                            <!--Telefono del empleado-->
                            <div class="info">
                                <img src="../resources/icons/telephone.png" alt="">
                                <p>(+503) ${row.telefono_empleadocontc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });
  document.getElementById('employee-form').innerHTML = content;
  M.Tooltip.init(document.querySelectorAll('.tooltipped'));
  let options = {
    dismissible: false,
    onOpenStart: function () {
      // Se restauran los elementos del formulario.
      document.getElementById('save-form').reset();
    }
  }
  M.Modal.init(document.querySelectorAll('.modal'), options);
  M.FormSelect.init(document.querySelectorAll('select'));
  var elems = document.querySelectorAll('.sidenav');
  var instances_sidenav = M.Sidenav.init(elems);
  var elems = document.querySelectorAll('.fixed-action-btn');
  instances = M.FloatingActionButton.init(elems, {
    direction: 'bottom',
    hoverEnabled: false,
  });
  // Se inicializa el componente Material Box para que funcione el efecto Lightbox.
  M.Materialbox.init(document.querySelectorAll('.materialboxed'));
  // Se inicializa el componente Tooltip para que funcionen las sugerencias textuales.
  M.Tooltip.init(document.querySelectorAll('.tooltipped'));
  //Inciando el saludo
  PRELOADER.style.display = 'none';
}

//Declaramos algunos componentes
const HASTATOP = document.getElementById('hasta_arriba');//Boton de hasta arriba
const BOTONATRAS = document.getElementById("pagnavg-atr");//Boton de navegacion de atras
const BOTONNUMEROPAGI = document.getElementById("pagnumeroi");//Boton de navegacion paginai
const BOTONNUMEROPAGF = document.getElementById("pagnumerof");//Boton de navegacion paginaf
const BOTONADELANTE = document.getElementById("pagnavg-adl");//Boton de navegacion de adelante



function ocultarMostrarAdl(result) {
  if (result != true) {
    console.log('Se oculta el boton');
    BOTONADELANTE.style.display = 'none';
  } else {
    //Colocamos el boton con un display block para futuras operaciones
    console.log('Se muestra el boton');
    BOTONADELANTE.style.display = 'block';
  }
}

//Boton de atras
BOTONATRAS.addEventListener('click', function () {
  BOTONNUMEROPAGF.parentNode.parentNode.classList.remove('hide');
  document.getElementById('pagpoints').parentNode.classList.remove('hide');
  //Volvemos a mostrár el boton de página adelante
  BOTONADELANTE.style.display = 'block';
  //Obtenemos el número de la página inicial
  let paginaActual = Number(BOTONNUMEROPAGI.textContent);
  //Comprobamos que el número de página no sea igual a 1
  if (paginaActual != 1) {
    //Restamos la cantidad de páginas que queramos que se retroceda en este caso decidi 2 para el botoni y 1 para el botonf
    BOTONNUMEROPAGI.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) - 2;
    BOTONNUMEROPAGF.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) + 1;
    //Verificamos si el número del boton ahora es 1, en caso lo sea se ocultará el boton
    if ((Number(BOTONNUMEROPAGI.innerHTML) - 1) == 0) {
      BOTONATRAS.style.display = 'none';
    }
  }
});

//Boton de adelante
BOTONADELANTE.addEventListener('click', function () {
  //Volvemos a mostrár el boton de página anterior
  BOTONATRAS.style.display = 'block';
  //Ejecutamos la función para predecir si hay más páginas
  //Sumamos la cantidad de página que queramos que avance, en este caso decidi 2 para el botoni y 3 para el botonf
  BOTONNUMEROPAGI.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) + 2;
  predecirAdelante();
  //Luego verificamos si el boton de adelante aun continua mostrandose
  if (BOTONADELANTE.style.display = 'block') {
    //Sumamos la cantidad de página que queramos que avance, en este caso decidi 2 para el botoni y 3 para el botonf
    BOTONNUMEROPAGF.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) + 1;
  } else {
    BOTONNUMEROPAGI.innerHTML = Number(BOTONNUMEROPAGI.innerHTML) - 2;
  }
});

function predecirAdelante() {
  //Colocamos el boton con un display block para futuras operaciones
  BOTONADELANTE.style.display = 'block';
  //Obtenemos el número de página que seguiría al actual
  let paginaFinal = (Number(BOTONNUMEROPAGI.innerHTML)) + 2;
  console.log("pagina maxima " + paginaFinal);
  //Calculamos el limite que tendria el filtro de la consulta dependiendo de la cantidad de Clientes a mostrar
  let limit = (paginaFinal * 6) - 6;
  console.log("El limite sería: " + limit);
  //Ejecutamos el metodo de la API para saber si hay productos y esta ejecutará una función que oculte o muestre el boton de adelante
  predictLImit(API_EMPLEADOS, limit);
  let limit2 = ((Number(BOTONNUMEROPAGI.innerHTML) + 1) * 6) - 6;
  predictButton(API_EMPLEADOS, limit2);
}

function ocultarButton2(cases) {
  switch (cases) {
    case 1:
      BOTONNUMEROPAGF.parentNode.parentNode.classList.add('hide');
      document.getElementById('pagpoints').parentNode.classList.add('hide');
      break;
    case 2:
      document.getElementById('contenedor_pags').classList.add('hide');
      let h = document.createElement("h3");
      let text = document.createTextNode("No hay empleados registrados");
      h.appendChild(text);
      document.getElementById('employee-form').innerHTML = "";
      document.getElementById('employee-form').append(h);
    default:
      break;
  }
}

document.querySelectorAll(".contnpag").forEach(el => {
  el.addEventListener("click", e => {
    PRELOADER.style.display = 'block';
    //Se obtiene el numero dentro del span
    let number = Number(el.lastElementChild.textContent);
    console.log('numero seleccionado ' + number);
    //Se hace la operación para calcular cuanto será el top de elementos a no mostrarse en la consulta en este caso seran 8
    let limit = (number * 6) - 6;
    //Se ejecuta la recarga de datos enviando la variable de topAct
    //Ejecutamos la función para predecir si habrá un boton de adelante
    readRowsLimit(API_EMPLEADOS, limit);//Enviamos el metodo a buscar los datos y como limite 0 por ser el inicio
    document.getElementById('numbe_paginc').innerText = number;
  });
});

document.getElementById('save-form').addEventListener('submit', function (event) {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  PRELOADER.style.display = 'block';
  // Se define una variable para establecer la acción a realizar en la API.
  let action = '';
  // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
  (document.getElementById('id').value) ? action = 'update' : action = 'create';
  console.log(action);
  fetch(API_EMPLEADOS + action, {
    method: 'post',
    body: new FormData(document.getElementById('save-form'))
  }).then(function (request) {
    // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
    if (request.ok) {
      // Se obtiene la respuesta en formato JSON.
      request.json().then(function (response) {
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (response.status) {
          Swal.fire({
            title: 'Éxito',
            text: response.message,
            icon: 'success',
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: 'Aceptar',
            background: '#F7F0E9',
            confirmButtonColor: 'green',
          }).then(function (value) {
            // Se comprueba si fue cliqueado el botón Sí para hacer la petición de borrado, de lo contrario no se hace nada.
            if (value.isConfirmed) {
              // Se cierra la caja de dialogo (modal) del formulario.
              M.Modal.getInstance(document.getElementById('modal-template')).close();
              //Se cargan nuevamente las filas en la tabla de la vista después de guardar un registro y se muestra un mensaje de éxito.
              readRowsLimit(API_EMPLEADOS, 0);
            }
          });

        } else {
          Swal.fire({
            title: 'Error',
            text: response.exception,
            icon: 'error',
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: 'Aceptar',
            background: '#F7F0E9',
            confirmButtonColor: 'green',
          });
        }
      });
    } else {
      console.log(request.status + ' ' + request.statusText);
    }
  });
  // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
  //saveRowL(API_EMPLEADOS, action, 'save-form', 'modal-template', 0);
});

function openDelete(id) {
  // Se define un objeto con los datos del registro seleccionado.
  const data = new FormData();
  data.append('id', id);
  // Se llama a la función que elimina un registro. Se encuentra en el archivo components.js
  confirmDeleteL(API_EMPLEADOS, data, 0);
}

//Función para comprobar si las contraseñas son iguales
function contrasenasIguales() {
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
document.getElementById('contra-emp').addEventListener('keyup', function () {
  contrasenasIguales();
});
document.getElementById('contrac-emp').addEventListener('keyup', function () {
  contrasenasIguales();
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

/*Función para eliminar el codigo de Google Authenticator*/
function deleteGAuth(id) {
  Swal.fire({
    title: 'Advertencia',
    text: '¿Desea eliminar el tercer paso de verificación de este empleado?',
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
      let form = new FormData();
      form.append('id', id);
      fetch(API_EMPLEADOS + 'eliminarQRAUTH', {
        method: 'post',
        body: form
      }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
          // Se obtiene la respuesta en formato JSON.
          request.json().then(function (response) {
            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (response.status) {
              //Se obtiene la respuesta y reinicia los empleado
              // cargan nuevamente las filas en la tabla de la vista después de guardar un registro y se muestra un mensaje de éxito.
              readRowsLimit(API_EMPLEADOS, 0);
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
}

//Función para los reportes
function abrirReporte(tipo) {
  var rpm = false
  if (navigator.userAgent.match(/Android/i)) {
    rpm = true;
  }
  switch (tipo) {
    case 1:
      if (!rpm) {
        window.open('../api/reports/accesoEmpleadosEmp.php');
      } else {
        PRELOADER.style.display = 'block';
        document.getElementById('reporteNA').classList.toggle('disabled');
        document.getElementById('reporteFM').classList.toggle('disabled');
        fetch(SERVER + 'reports/accesoEmpleadosEmpM.php', {
          method: 'get'
        }).then(function (request) {
          // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
          if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
              // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
              if (response.status) {
                sweetAlert(1, response.message, null);
              } else {
                sweetAlert(2, response.exception, null);
              }
              PRELOADER.style.display = 'none';
              document.getElementById('reporteNA').classList.toggle('disabled');
              document.getElementById('reporteFM').classList.toggle('disabled');
            });
          } else {
            console.log(request.status + ' ' + request.statusText);
          }
        });
      }
      break;
    case 2:
      if (!rpm) {
        window.open('../api/reports/accesoEmpleadosEmpF.php');
      } else {
        PRELOADER.style.display = 'block';
        document.getElementById('reporteNA').classList.toggle('disabled');
        document.getElementById('reporteFM').classList.toggle('disabled');
        fetch(SERVER + 'reports/accesoEmpleadosFM.php', {
          method: 'get'
        }).then(function (request) {
          // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
          if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
              // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
              if (response.status) {
                sweetAlert(1, response.message, null);
              } else {
                sweetAlert(2, response.exception, null);
              }
              PRELOADER.style.display = 'none';
              document.getElementById('reporteNA').classList.toggle('disabled');
              document.getElementById('reporteFM').classList.toggle('disabled');
            });
          } else {
            console.log(request.status + ' ' + request.statusText);
          }
        });
      }
      break;
    default:
      window.open('../api/reports/accesoEmpleadosEmp.php');
      sweetAlert(2, 'Se redirigio a un pdf, pero no se reconocio el dispositivo. Si no lo ve esque no se reconce que esta en smarthPone');
      break;
  }
}

//href="../api/reports/accesoEmpleadosEmpF.php"
//href="../api/reports/accesoEmpleadosEmp.php" target="_blank"
document.getElementById('ocultarmostrar_contraseñas').addEventListener("click", function () {
  if (CONTRA.type == "password") {
    CONTRA.type = "text"
    CONTRAC.type = "text"
    document.getElementById('ocultarmostrar_contraseñas').innerText = "visibility_off"
  } else {
    CONTRA.type = "text".type = "password"
    CONTRAC.type = "text".type = "password"
    document.getElementById('ocultarmostrar_contraseñas').innerText = "visibility"
  }
});