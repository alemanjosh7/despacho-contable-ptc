// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPRESAS = SERVER + 'dashboard/empresas.php?action=';
const API_EMPRESAEMP = SERVER + 'dashboard/empresasEmpleados.php?action=';
const API_GLBVAR = SERVER + 'variablesgb.php?action=';

const btnPuntitos = document.getElementById('btn-puntitos');
var instancesButton;
document.addEventListener('DOMContentLoaded', function () {
  M.Tooltip.init(document.querySelectorAll('.tooltipped'));
  M.Modal.init(document.querySelectorAll('.modal'));
  M.FormSelect.init(document.querySelectorAll('select'));
  var elems = document.querySelectorAll('.sidenav');
  var instances_sidenav = M.Sidenav.init(elems);
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'bottom',
    hoverEnabled: false,
  });
  instancesButton = instances;
  comprobarAmin();
});

//Declaramos algunas constantes
const EMPRESASMODAL = document.getElementById('modalAnadirEmpresa');
const EMPRESASCHEKCONT = document.getElementById('contEmpresas');
function changeOption(id) {
  for (let i = 0; i < instancesButton.length; i++) {
    if (id == i) continue;
    instancesButton[i].close();
  }
}


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



// Initialize collapsible (uncomment the lines below if you use the dropdown variation)
// var collapsibleElem = document.querySelector('.collapsible');
// var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);


/*Metodo para llenar los checkbox con las empresas*/
function llenarEmpresas(idemp) {
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
                enlaceEmpresa(id,idemp,'create');
              }else{
                enlaceEmpresa(id,idemp,'delete');
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
  formJ.append('idemp',idemp);
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
        if (!response.status) {
          location.href = 'inicio.html';
        }
      });
    } else {
      console.log(request.status + ' ' + request.statusText);
    }
  });
}

//Función para crear el enlace de empresa y empleado
function enlaceEmpresa(id,idemp,action) {
  let formJ = new FormData();
  formJ.append('idemp',idemp);//Id de la empresa
  formJ.append('id',id);//id del empleado
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