const btnPuntitos = document.getElementById('btn-puntitos');
var instancesButton;
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances_sidenav = M.Sidenav.init(elems);
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'bottom',
    hoverEnabled: false,
  });
  instancesButton = instances;
});

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

