//Inicializando componentes de Materialize
document.addEventListener('DOMContentLoaded', function () {
    M.Modal.init(document.querySelectorAll('#cerrarSesionModal'));
});
const regresarbtn = document.getElementById('regresarbtn-perfil');
//Evento para que regrese a la página anterior
regresarbtn.addEventListener('click',function(){
    history.go(-1)
});