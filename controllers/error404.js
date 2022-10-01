let t1 = gsap.timeline();
let t2 = gsap.timeline();
let t3 = gsap.timeline();
let t4 = gsap.timeline();
let t5 = gsap.timeline();

t1.to(".cog1",
{
  transformOrigin:"50% 50%",
  rotation:"+=360",
  repeat:-1,
  ease:Linear.easeNone,
  duration:20
});

t2.to(".cog2",
{
  transformOrigin:"50% 50%",
  rotation:"-=360",
  repeat:-1,
  ease:Linear.easeNone,
  duration:20
});

t3.fromTo(".wrong-para",
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

t4.fromTo(".wrong-para2",
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


t5.fromTo(".RegresarFx",
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