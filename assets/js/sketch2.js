wd=window.outerWidth;
ht=window.outerHeight;
function setup() {
    createCanvas(wd,ht);
   //fullscreen(1);
  }
  
  function draw() {
    background(0);
    fill(255,0,0);
    rect(width/2,height/2,100,100);
    console.log(width);
    
    
  }