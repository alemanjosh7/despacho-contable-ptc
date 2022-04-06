//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
});
//Inputs
const contraInput = document.getElementById('contraseña');
const mostrarOcultarIconPass = document.getElementById('ocultarmostrar_contraseña');
///*Boton de ir hacia arrina*/
var hastatop = document.getElementById('hasta_arriba');
window.onscroll = function(){
    if(document.documentElement.scrollTop >100){
        hastatop.style.display = "block";
    }else{
        hastatop.style.display = "none";
    }
};

hastatop.addEventListener('click', function(){
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
});
//Visualizar u ocultar contraseña
mostrarOcultarIconPass.addEventListener('click',function(){
    if (contraInput.type == "password") {
        contraInput.type = "text"
        mostrarOcultarIconPass.innerText = "visibility_off"
    } else {
        contraInput.type = "password"
        mostrarOcultarIconPass.innerText = "visibility"
    }
});