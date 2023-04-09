// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/151-ukulele-tuner.html
// https://youtu.be/F1OkDTUkKFo
// https://editor.p5js.org/codingtrain/sketches/8io2zvT03

const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let mic;
let freq = 0;
let threshold = 1;
let img;
let button=[8];
let bgColor;
let basefreq=0;
let currentnote;
let width;
let height;

class button_class{
    constructor()
    {
  this.isclicked=false;
  this.ishover=false;
  this.isactive=false;
  this.x_pos;
  this.y_pos;
  this.type;
  this.button_ID;
    }

  string_buttonclicked(string_no){
    currentnote=string_no-1;
 }

 setbasefrequency()
 {
    
    if(freq.toFixed(2)<100)
    { basefreq=freq.toFixed(2);
     newfrequencies[5]=basefreq;
     newfrequencies[4]=basefreq*1.5;
     newfrequencies[3]=basefreq*2;
     newfrequencies[2]=basefreq*2;
     newfrequencies[1]=basefreq*3;
     newfrequencies[0]=basefreq*4;
    }
     console.log(newfrequencies);

 }

 displaybutton(button_ID_,x_pos_,y_pos_)
 {this.x_pos=x_pos_;
  this.y_pos=y_pos_;
  this.button_ID=button_ID_;
  colorMode(RGB,1);
    stroke(1,1,1,1);
    strokeWeight(2);
    fill(0.2,0.4,0.5,1);
  if(this.button_ID<6)
  {
    
    ellipse(x_pos_,y_pos_,50,50);
    
  }
  else
  {
      rect(x_pos_,y_pos_,200,100);
  }
 }


}

let tuner_buttons=[4];
let set_frequencybutton;
let notes = [{
    note: 'A',
    freq: 440
  },
  {
    note: 'E',
    freq: 329.6276
  },
  {
    note: 'C',
    freq: 261.6256
  },
  {
    note: 'G',
    freq: 391.9954
  }
];

let newfrequencies=[6];

function preload() {
  //mg = loadImage('download.png');
}



function createbuttons(){
  for(i=0;i<8;i++)
    {
      switch(i)
        {
                    case 0: button[i] =  createButton('6');
                                         button[i].position(150, 480);
                                         button[i].mousePressed(function(){setcurrentnote(6)});    
                                         break;
          
                    case 1: button[i] = createButton('5');
                                        button[i].position(150, 420);
             button[i].mousePressed(function(){setcurrentnote(5)});  
                                        break;
                    
                    case 2: button[i] = createButton('4');
                                        button[i].position(150, 350);
                   button[i].mousePressed(function(){setcurrentnote(4)});
                                        break;
                    
                    case 3: button[i] = createButton('3');
                                        button[i].position(420, 350);
                       button[i].mousePressed(function(){setcurrentnote(3)});
                                        break;
                    
                    case 4: button[i] = createButton('2');
                                        button[i].position(420, 420);
                       button[i].mousePressed(function(){setcurrentnote(2)}); 
                                        break;
                    
                    case 5: button[i] = createButton('1');
                                        button[i].position(420, 490);
                      button[i].mousePressed(function(){setcurrentnote(1)}); 
                                        break;
                    
                    case 6: button[i] = createButton('FINALIZE BASE FREQUENCY');
                                        button[i].position(20*i, 220);
                 button[i].mousePressed(finalize_basefreq);  
                                        break;
                    
                    case 7: button[i] = createButton('random');
                                        button[i].position(20*i, 10);
                                        break;
                               
                    
        }
      
       
 
 
  button[i].style('background-color', '#4CAF50');
  button[i].style('color', 'white');
  button[i].style('font-size', '23px');
  button[i].style('padding', '8px');
  button[i].style('border-radius', '50%'); 
    }
}

function setcurrentnote(string_no)
{
  currentnote=string_no-1;
  
}


function changeBackgroundColor() {
  
  bgColor=color(random(255), random(255), random(255));
  console.log(bgColor);
  
}

function finalize_basefreq()
{
  if(freq.toFixed(2)<100)
 { basefreq=freq.toFixed(2);
  newfrequencies[5]=basefreq;
  newfrequencies[4]=basefreq*1.5;
  newfrequencies[3]=basefreq*2;
  newfrequencies[2]=basefreq*2;
  newfrequencies[1]=basefreq*3;
  newfrequencies[0]=basefreq*4;
 }
  console.log(newfrequencies);
}

function setup() {
  scale_factor=1 ;
  width=600*scale_factor;
  height= 800*scale_factor;
  createCanvas(width, height);

  colorMode(RGB,1);
  bgColor=color( 0.19,0.37, 0.44);
  background(bgColor);
  createbuttons();
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(listening);
 
}
//creating the buttons
for(i=0;i<6;i++)
{
 tuner_buttons[i]=new button_class();
}
set_frequencybutton=new button_class();

function listening() {
  console.log('listening');
  pitch = ml5.pitchDetection(
    model_url,
    audioContext,
    mic.stream,
    modelLoaded
  );
}

function draw() {
 background(bgColor);
 
  //image(img,-80,120);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);
  text(freq.toFixed(2), width / 2, height/2);
  
/*
  let closestNote = -1;
  let recordDiff = Infinity;
  for (let i = 0;i < notes.length; i++) {
    let diff = freq-notes[i].freq;
    if (abs(diff) < abs(recordDiff)) {
      
      closestNote = notes[i];      
      recordDiff = diff;
      
    }
  }
  */
  
  let diff=freq-newfrequencies[currentnote]
  
  console.log(freq.toFixed(2));
  textSize(64);
  //text(closestNote.note, width / 2, height - 50);


  //let diff = recordDiff;
  // let amt = map(diff, -100, 100, 0, 1);
  // let r = color(255, 0, 0);
  // let g = color(0, 255, 0);
  // let col = lerpColor(g, r, amt);


  let alpha = map(abs(diff), 0, 100, 255, 0);
  rectMode(CENTER);
  fill(255, alpha);
  stroke(255);
  strokeWeight(1);
  if (abs(diff) < threshold) {
    fill(0, 255, 0);
  }
  rect(200, 100, 200, 50);

  stroke(255);
  strokeWeight(4);
  line(200, 0, 200, 200);

  noStroke();
  fill(255, 0, 0);
  if (abs(diff) < threshold) {
    fill(0, 255, 0);
  }
  rect(200 + diff / 2, 100, 10, 75);
  fill(0.5,0.5,1,1);
  ellipse(button[0].x+15,button[0].y+20,50,50)
  tuner_buttons[0].displaybutton(0,200,600);
  tuner_buttons[1].displaybutton(1,200,450);
  tuner_buttons[2].displaybutton(2,200,300);
  tuner_buttons[3].displaybutton(3,500,600);
  tuner_buttons[4].displaybutton(4,500,450);
  tuner_buttons[5].displaybutton(5,500,300);

 
}

function modelLoaded() {
  console.log('model loaded');
  pitch.getPitch(gotPitch);
}

function gotPitch(error, frequency) {
  if (error) {
    console.error(error);
  } else {
    //console.log(frequency);
    if (frequency) {

      freq = frequency;
    }
    pitch.getPitch(gotPitch);
  }
}