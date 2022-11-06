var hastatop = document.getElementById("hasta_arriba");

window.onscroll = function () {
    if (document.documentElement.scrollTop > 200) {
        hastatop.style.display = "block";
    } else {
        hastatop.style.display = "none";
    }
}

hastatop.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});
const regresarbtn = document.getElementById('regresarbtn-perfil');


//src="http://localhost/despEsquivel/api/reports/resumenAccesoEmpresas.php"
//Evento para que regrese a la página anterior
regresarbtn.addEventListener('click', function () {
    history.go(-1)
});

//Función para guardar una tarea
GUARDARTSK.addEventListener("click", async function () {
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
            let request = await fetch(API_TAREAS + "create", {
                method: "post",
                body: form
            });
            if (!request.ok) {
                console.log(request.status + " " + request.statusText);
            } else {
                let response = await request.json();
                console.log(response);
                if (response.status && response.dataset) {
                    console.log(response.dataset);
                    PRELOADER.style.display = "none";
                    M.Modal.getInstance(MODATAREAS).close();
                    M.Modal.getInstance(MODEMP).open();
                } else {
                    sweetAlert(2, response.exception, null);
                    console.log(response.status);
                }
            }
        } catch (error) {
            GUARDARTSK.classList.remove("disabled");
            sweetAlert(
                2,
                "Ha habido un error con la creación de la asignación",
                null
            );
            console.log(error);
        }
    } else {
        MENSAJE.innerText =
            "Asegurese de llenar almenos la asignación y la fecha limite";
        MENSAJE.style.display = "block";
    }
});


//Función para guardar una tarea
GUARDARTSK.addEventListener("click", async function () {
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
        fetch(API_TAREAS + "create", {
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
                        sweetAlert(1,response.message,null);
                        PRELOADER.style.display = "none";
                        M.Modal.getInstance(MODATAREAS).close();
                        M.Modal.getInstance(MODEMP).open();
                    } else {
                        GUARDARTSK.classList.remove("disabled");
                        sweetAlert(2,response.exception,null);
                    }
                });
            } else {
                console.log(request.status + " " + request.statusText);
            }
        });
    } else {
        MENSAJE.innerText =
            "Asegurese de llenar almenos la asignación y la fecha limite";
        MENSAJE.style.display = "block";
    }
});