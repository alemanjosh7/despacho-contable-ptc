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