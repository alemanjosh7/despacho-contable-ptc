let mX, mY, distance;
let t1 = gsap.timeline();
let t2 = gsap.timeline();
let t3 = gsap.timeline();

const cupcakeCanvas = document.getElementById('cupcake-canvas');
const cupcakeBox = document.getElementById('cupcake-box');
const cupcakeSVG = document.getElementById('cupcake-svg');
const cupcakeCupcakeCupcake = document.getElementById('cupcake-cupcake-cupcake');


t1.fromTo(".intro__subhead",
{
  opacity:0
},
{
  opacity:1,
  duration:3,
  stagger:{
    repeat:-1,
    yoyo:true
  }
});

t2.fromTo(".RegresarFx",
{
  opacity:0
},
{
  opacity:1,
  duration:7,
  stagger:{
    repeat:0,
    yoyo:true
  }
});

t3.to(".cog1",
{
  transformOrigin:"50% 50%",
  rotation:"+=360",
  repeat:-1,
  ease:Linear.easeNone,
  duration:30
});



// Set rotation origin.
TweenMax.set(cupcakeBox, {
  transformOrigin: '0 100%',
});

// Meh, need to do something else for mobile. Concept doesn't quite work with mobile as-is.
document.addEventListener('mousemove', (e) => {
  mX = e.pageX;
  mY = e.pageY;
  distance = calculateDistance(cupcakeSVG, mX, mY);
  
  // Update box rotation depending on mouse position.
  // This is done in a not so great way. Slow probs, bad probs.
  if (distance > 180) {
    TweenMax.set(cupcakeBox, {
      rotation: '-90'
    });
  } else {
    TweenMax.set(cupcakeBox, {
      rotation: `-${Math.max(distance - 90, 0)}`
    });
  }
});

// Hey wait, no.
cupcakeCupcakeCupcake.addEventListener('click', () => {
  document.body.classList.add('oh-no');
  cupcakeCupcakeCupcake.parentNode.removeChild(cupcakeCupcakeCupcake);
});

// Calculate mouse distance relative to given element.
function calculateDistance(elem, mouseX, mouseY) {
  const rect = elem.getBoundingClientRect();
  const rectTop = rect.top + document.body.scrollTop;
  const rectLeft = rect.left + document.body.scrollLeft;

  return Math.floor(Math.sqrt(Math.pow(mouseX - (rectLeft + (rect.width / 2)), 2) + Math.pow(mouseY - (rectTop + (rect.height / 2)), 2)));
}