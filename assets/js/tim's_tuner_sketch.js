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

let basefreq=0;
let currentnote=6; //a number outside the scope of 6 strings initially so that user gets prompted to select a string
let width;
let height;
let tuner_button_size=50;
let isBasefreq_set=0;
let startTime;
let elapsedTime = 0;
let stablefreq=1000.00;
let prev_stablefreq=1000;
let detected_freq;
let newfrequencies=[6];
let tuner_buttons=[6];
let prompt_message;
let freq_record=[60] //keeps a record of the frequencies
let frame_counter=0; // keep track of the frame
let COUNTER_LIMIT=60;
let amplitude_threshold=0.01; //the minimum amplitude below which reading will not show
//color variables
let bgColor;


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
  this.size;
    }

  string_buttonclicked(string_no){
    freq=0;
    prev_stablefreq=1000;
    stablefreq=1000;
    detected_freq=0;
    currentnote=string_no-1;
    this.isclicked=true;
    this.isactive=true;
 }

 resetbasefrequency()
 {
  for(let i=0;i<6;i++)
    {
      newfrequencies[i]=0.00;
    }
    this.isactive=false;
    isBasefreq_set=0;
    currentnote=6; //resetting the note out of the scope 0-5

 }

 setbasefrequency()
 {
   
    if(stablefreq.toFixed(0)<110)
    
    { 
      this.isactive=true;
      basefreq=stablefreq.toFixed(0);
     newfrequencies[5]=basefreq;
     newfrequencies[4]=basefreq*1.5;
     newfrequencies[3]=basefreq*2;
     newfrequencies[2]=basefreq*2;
     newfrequencies[1]=basefreq*3;
     newfrequencies[0]=basefreq*4;
     prompt_message="now select the string you want to tune!";
     for(let i=0;i<6;i++)
     { let tempfreq=parseFloat(newfrequencies[i]);
       newfrequencies[i]=parseFloat(tempfreq.toFixed(0)); //toFixed() converts it inot string, we need to convert it back to float
     }
      console.log(newfrequencies);
      isBasefreq_set=1;
    }
    // this.string_buttonclicked(6);

     console.log(newfrequencies);
     
  
  
 }

 displaybutton(button_ID_,x_pos_,y_pos_,size_)
 {this.x_pos=x_pos_;
  this.y_pos=y_pos_;
  this.button_ID=button_ID_;
  this.size=size_;
  colorMode(RGB,1);
    stroke(strokecolor);
    strokeWeight(2);

    
    if(this.isactive==false)
    fill(btn_color)
    
    else
    fill(btn_active_col)
    this.hover();
  
  
    
    ellipse(x_pos_,y_pos_,this.size,this.size);

    if(button_ID_<6)
    {
    textSize(this.size/4);
    fill(text_col_bright);
    noStroke();
    text(6-button_ID_,this.x_pos,this.y_pos);
    if(newfrequencies[5-button_ID_]!=0)
    text(newfrequencies[5-button_ID_],this.x_pos,this.y_pos-35 )
    }
    else if(button_ID_==6)
    {
      textSize(this.size/8);
    fill(text_col_dark);
    noStroke();
    if(isBasefreq_set==0)
    text("SET BASE \n FREQ",this.x_pos,this.y_pos);
    else if(isBasefreq_set==1)
    text("RESET BASE \n FREQ",this.x_pos,this.y_pos);
    }
 }

 hover()
 {
  let x=mouseX;
   let y=mouseY;
   let vector1=createVector(x,y);
   //console.log(vector1);
   
   for(let i=0;i<6;i++)
   {
  
     let vector2=createVector(this.x_pos,this.y_pos);
    
     if(dist(vector1.x,vector1.y,vector2.x,vector2.y)<this.size/2) //we have to devide by 2 sence the argumnt parameter takes in diameter
     {fill(btn_hover_col);
       console.log("hovering");
    }
  }
 }


}

/*
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
*/






/*
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
*/
/*
function setcurrentnote(string_no)
{
  freq=0;
  currentnote=string_no-1;
  
}
*/
/*
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
*/





function setup() {


  scale_factor=1 ;
  width=380*scale_factor;
  height= 800*scale_factor;
  let canvas=createCanvas(width, height);
  canvas.parent('sketch-holder');

  for(let i=0;i<6;i++)
    {
      newfrequencies[i]=0;
    }


  colorMode(RGB,1);
  bgColor=color(0/255, 66/255, 90/255);
  btn_color=color(31/255,138/255,112/255);
  btn_active_col=color(252/255,115/255,0/255);
  btn_hover_col=color(252/255,115/255,0/255);
  meterbox_col=color(191/255,219/255,56/255);
  meterbox_correct_col=color(252/255,115/255,0/255);
  meter_color=(1,1,1,0.3)
  text_col_bright=(1,1,1,1);
  text_col_dark=color(0,0,0,1);
  strokecolor=color(1,1,1,1);


  background(bgColor);
  //createbuttons();
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(listening);

  button = createButton('Allow Mic');
  button.position(380, 850);
  button.mousePressed(initMic);
 
}

function initMic() {
  // stop the current microphone
  mic.stop();
  
  // initialize a new microphone
  mic = new p5.AudioIn();
  /*
  mic.start(function() {
    // prompt the user to allow microphone permission
    if (mic.enabled) {
      console.log('Mic is enabled.');
    } else {
      console.log('Mic is not enabled.');
    }
  });*/
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
 colorMode(RGB,1);
 console.log(isBasefreq_set);
 frame_counter=(frame_counter+1)%COUNTER_LIMIT;
 
 
  //algorith to ensure fairly stable frequency output
 if(freq!=0 && freq<1.9*stablefreq &&mic.getLevel()>amplitude_threshold) //to prevent jumps in harmocs. comparison with prev_stablefreq is required to prevent the edge case when freq readings got to 0 and then suddenly go to the harmonics value immiditely after 0
  {

    amplitude_threshold=0.006; //intial threshold must be high to prevent jump in harmonics.the pattern of harmonic jump is like this (stablefreq=x->1000->2x).but jump only occurs when amplitude<0.007. when stablefreq resets to 1000, we will reset amplitude threshold to high value 0.01 so that the reading doesnt pick up the higher harmoics at low amplitude.
   // if(stablefreq==1000 && freq>1.9*prev_stablefreq)
    //stablefreq=prev_stablefreq;
   // else
    //{
    //prev_stablefreq=stablefreq;
    stablefreq=freq;   //to ensure the meter is smooth
   // }
    
  } 
 // if(freq==detected_freq)
 // { //stablefreq=freq;
 // }
  
 freq_record[frame_counter]=stablefreq;
 let all_equal=true;
//taking a record of frequency values for more reliable readings. this prevents the edge case scenario where the stable frequency detects a harmony lower than the fundamental frequency and locks on to that value. since freq value are continuously fluctuating, a constant value should indicate error in reading and reset itself
 for(let i=0;i<COUNTER_LIMIT;i++)   
 { if(freq_record[i]!=freq_record[0])
   {all_equal=false;   
    break;
   }
 }
 if(all_equal)
 {
  freq=0;
  amplitude_threshold=0.01;
  stablefreq=1000;

  detected_freq=0;
 }

  let diff;
  if(currentnote<6)
  diff=stablefreq-newfrequencies[currentnote]
  
  
  
  textSize(64);
  



  let alpha = map(abs(diff), 0, 100, 1, 0);
  rectMode(CENTER);
  fill(meterbox_col);
  stroke(strokecolor);
  strokeWeight(2);
  if (abs(diff) < threshold) {
    fill(meterbox_correct_col);
  }
  rect(200, 50, 200, 50); 

//meter midpoint line
  stroke(strokecolor);
  strokeWeight(4);
  line(200, 0, 200, 80);
  
  //stable frequency text
  textAlign(CENTER, CENTER);
  noStroke();
  fill(text_col_dark);
  textSize(32);
  if(stablefreq!=1000)
  text(stablefreq.toFixed(0), 200, 50);
  else
  text("-",200,50)

  
  //moving meter color
  noStroke();
  fill(meter_color);
  if (abs(diff) < threshold) {
    fill(meter_color);
  }
  //color of moving meter set manually since meter color is not showing transparency
  fill(1,1,1,0.5);

  //displaying moving meter
  let meter_xpos=200+diff*5
  if(meter_xpos<10)
  meter_xpos=10;
  else if(meter_xpos>width)
  meter_xpos=width-10;
  if(currentnote<6) //only show the bar when a string is selected
  rect(meter_xpos, 50, 10, 75);


 // fill(0.5,0.5,1,1);
 // ellipse(button[0].x+15,button[0].y+20,50,50)
  tuner_buttons[0].displaybutton(0,40,540,tuner_button_size);
  tuner_buttons[1].displaybutton(1,40,430,tuner_button_size);
  tuner_buttons[2].displaybutton(2,40,320,tuner_button_size);
  tuner_buttons[3].displaybutton(3,345,320,tuner_button_size);
  tuner_buttons[4].displaybutton(4,345,430,tuner_button_size);
  tuner_buttons[5].displaybutton(5,345,540,tuner_button_size);
  set_frequencybutton.displaybutton(6,200,190,tuner_button_size*2);
  let prompt_xpos=200;
  let prompt_ypos=115;
  fill(text_col_bright);
  textSize(18);
  noStroke();
  textAlign(CENTER, CENTER);
  if(isBasefreq_set==0)
  prompt_message="set base frequency on sixth string!"
  else if(isBasefreq_set==1 && currentnote<6)  //to ensure these messages dont occur before a string is pressed
  {
    if (abs(diff) < threshold)
    prompt_message="PERFECT!";
    else if(diff>5)
    prompt_message="GO LOWER";
    else if(diff<5 && diff>0)
    prompt_message="GO A LITTLE LOWER";
    else if(diff<0 && diff>-5)
    prompt_message="GO A LITTLE HIGHER";
    else if(diff<-5)
    prompt_message="GO HIGHER"
 
    if(stablefreq==1000)
    prompt_message="PLAY THE STRING";

  }
  text(prompt_message,prompt_xpos,prompt_ypos);

 
}
  
function modelLoaded() {
  console.log('model loaded');
  pitch.getPitch(gotPitch);
}

function gotPitch(error, frequency) {
  if (error) {
    console.error(error);
  } else {
    detected_freq=frequency;
    if (frequency) {
      if(frequency>freq*7.8 && freq!=0)  //to prevent displaying the jump in harmonics, freq is reset to 0 everytime we change strings, we calculating up to 8 harmonics
      freq = frequency/8;
      if(frequency>freq*6.8 && freq!=0)
      freq = frequency/7;
      if(frequency>freq*5.8 && freq!=0)
      freq = frequency/6;
      if(frequency>freq*4.8 && freq!=0)
      freq = frequency/5;
      if(frequency>freq*3.8 && freq!=0)
      freq = frequency/4;  
      else if(frequency>freq*2.8 && freq!=0)
      freq=frequency/3;
      else if(frequency>freq*1.8 && freq!=0)
      freq=frequency/2;
      else 
      freq=frequency;
     // console.log(freq);
    }
    else if(frequency==null)
    freq=0;
    pitch.getPitch(gotPitch);

    //if(keyIsDown(SHIFT))
    console.log("act f:"+frequency+"   "+"fr:"+freq+"   "+"stablefr:"+stablefreq+"amplitude: "+mic.getLevel());
  }
}

function mouseClicked()
{
   let x=mouseX;
   let y=mouseY;
   let vector1=createVector(x,y);
   //console.log(vector1);
   if(isBasefreq_set==1)
   {
   for(let i=0;i<6;i++)
   {
    //console.l
    tuner_buttons[i].isactive=false; //resets the buttons
     let vector2=createVector(tuner_buttons[i].x_pos,tuner_buttons[i].y_pos);
    
     if(dist(vector1.x,vector1.y,vector2.x,vector2.y)<tuner_buttons[i].size/2)
     { 
       
      console.log("button pressed");
      tuner_buttons[i].string_buttonclicked(6-i);
     }
   
   }
  }
   let vector2=createVector(set_frequencybutton.x_pos,set_frequencybutton.y_pos);
   if(dist(vector1.x,vector1.y,vector2.x,vector2.y)<set_frequencybutton.size/2)
   {
     set_frequencybutton.isclicked=true; 
       set_frequencybutton.isactive=true;
       //isBasefreq_set=(isBasefreq_set+1)%2;
       if(isBasefreq_set==0)
       set_frequencybutton.setbasefrequency();
       else
       set_frequencybutton.resetbasefrequency();
   }
    

}