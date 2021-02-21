//p5.disableFriendlyErrors = true; // disables FES
let fret_pos=50; //marker to keep track of the fret beginnings and ending
let orig_width=120; //fretwidth of first fret
let button;
let button2;
let chords=[]
let lastchord=0;
let totalchords=0;
let button3;
let button4,button5;
let button_showintervaxls;
let c=0;
let show_intervals=0;
let lerpamount=0 //index for linear interpolation during transition
let amount=0;
let prevc=0;
let t1;
let xoff=50;
let yoff=600;

var radius;
var c_canv;
 ht=window.outerHeight;
  wd=window.outerWidth;
let paintcanvas=[];
let u=0;
let paintmode=0;
 

class  fretclass{                                 
  constructor(x,i,j,f_width,f_pos)
  {   
   this.note_intval=x;
   if (this.note_intval==0)
   this.note='A';
   else if (this.note_intval==1)
   this.note='Bb';
   else if (this.note_intval==2)
   this.note='B';
   else if (this.note_intval==3)
   this.note='C';
   else if (this.note_intval==4)
   this.note='Db';
   else if (this.note_intval==5)
   this.note='D';
   else if (this.note_intval==6)
   this.note='Eb';
   else if (this.note_intval==7)
   this.note='E';
   else if (this.note_intval==8)
   this.note='F';
   else if (this.note_intval==9)
   this.note='Gb';
   else if (this.note_intval==10)
   this.note='G';
   else if (this.note_intval==11)
   this.note='Ab';
   
   
   this.i=i;
   this.j=j;
   this.f_width=f_width;
   this.f_pos=f_pos;
   this.input_chordnote=0;
   this.loc=createVector(this.f_pos+this.f_width/2,300+this.i*50);
   this.present=0;
    this.islerpfrom=0;       //flag to determine whether given ellipse will lerp or not
    this.islerpto=0;
  }
  
  fretline()
  { colorMode(RGB,255,255,255,1);
   stroke(10*this.j,130,130+this.j*2,1);
   //stroke(255,255,255,1);
    //stroke(random(255),random(255),random(255),1);
    strokeWeight(this.i+1);
    line(this.f_pos, 300+this.i*50, this.f_pos+this.f_width,  300+(this.i)*50);
    strokeWeight(1);
    stroke(255,255,255,1)
    ellipse(this.f_pos+this.f_width,300+this.i*50,5,5);
  }
  
  display(x,temploc)
  { 
    let alphaval=0.5;
    colorMode(HSB,1);
    //fill(198/360, 96, 74,alphaval);
    fill(60/360,1,1,alphaval);
    textFont('Georgia');
    textSize(15);
    textStyle(NORMAL);
    strokeWeight(1);
    let textcolor='WHITE';
    let s='0';
      
    noStroke();
    if(show_intervals==1)
    { alphaval=1;
      if(this.note_intval-x==0)
      {fill(0,0,1,alphaval);
        s='R';
        textcolor='BLACK';
      }
     else if((this.note_intval-x)==1||(this.note_intval-x)==-11)
     { //{fill(0,1,1,alphaval);
       s='b2';
       textcolor='BLACK';
      }
    else if((this.note_intval-x)==2||(this.note_intval-x)==-10)
      {//fill(0,1,1,alphaval);
       s='M2';
        textcolor='BLACK';
      }
      
      else if((this.note_intval-x)==3||(this.note_intval-x)==-9)
      {fill(0,1,1,alphaval);
       s='b3';
       textcolor='WHITE';
      }
      else if((this.note_intval-x)==4||(this.note_intval-x)==-8)
      {fill(330/360,1,1,alphaval);
       s='M3';
      
      }
    else if((this.note_intval-x)==5||(this.note_intval-x)==-7)
      {//fill(0,1,1,alphaval);
       s='P4';
        textcolor='BLACK';
      }
    else if((this.note_intval-x)==6||(this.note_intval-x)==-6)
      {//fill(0,1,1,alphaval);
       s='b5';
        textcolor='BLACK';
      }
      else if((this.note_intval-x)==7||(this.note_intval-x)==-5)
      {fill(240/360,1,1,alphaval);
       s='P5';
       textcolor='WHITE';
       
      } 
    else if((this.note_intval-x)==8||(this.note_intval-x)==-4)
      {//fill(0,1,1,alphaval);
       s='b6';
        textcolor='BLACK';
      }
    else if((this.note_intval-x)==9||(this.note_intval-x)==-3)
      {//fill(0,1,1,alphaval);
       s='M6';
        textcolor='BLACK';
      }
    
      else if((this.note_intval-x)==10||(this.note_intval-x)==-2)
      {//fill(240/360,1,1,alphaval);
       s='b7';    
        textcolor='BLACK';
      }
       else if((this.note_intval-x)==11||(this.note_intval-x)==-1)
       {fill(90/360,1,1,alphaval);
        s='M7';
        textcolor='BLACK';
       }
    }
    
    if(this.input_chordnote==1)
    { 
      strokeWeight(3);
      stroke(0,0,1,1);
        
    } else {noStroke();}
    
    ellipse(this.loc.x,this.loc.y,30,30);
    if(show_intervals==1)
    { 
      noStroke();
      fill(textcolor);
    text(s,this.loc.x-10,this.loc.y);
    }
  }
  
  get_noteval(){
  return this.note_intval;}
  
  input_pos(){
  this.input_chordnote=1;}
  
  
  
   
}

class chordclass{
  constructor()
  {
   this.chordnotes=[];
   this.total_chordnotes=0;
   this.inputnotes=[];
   this.fretobj=[];
   this.create_fretboard();
    
  }
  create_fretboard(){
  colorMode(RGB);
  background(0,255,0);
  
  for (let i=0;i<6;i++)
  {
    let f_width=orig_width;
    let f_pos=50;
    this.fretobj[i]=[];
    var j;
    for( j=0;j<18;j++)
    {                                      //making the fret-string objects
       this.fretobj[i].push(new fretclass(assign_noteval(i,j),i,j,f_width,f_pos));
       f_pos=f_pos+f_width;
       f_width=f_width-3;       
    }
    if(j==18)    //for open strings
    this.fretobj[i].push(new fretclass(assign_noteval(i,11),i,j,f_width,0));
      
  }
}
  display_fretboard()
  { colorMode(RGB);
    background(0,255,0);
    for(let i=0;i<6;i++)
      {  for(let j=0;j<18;j++)
        {this.fretobj[i][j].fretline();                                 
       stroke(255,255,255,1);
       strokeWeight(1);
       line(this.fretobj[i][j].f_pos,300,this.fretobj[i][j].f_pos,550);  //drawing the fret lines
         push();
         textFont('Georgia');
        textSize(25);
         textStyle(NORMAL);
         strokeWeight(1);
       text(j,this.fretobj[i][j].f_pos-this.fretobj[i][j].f_width/2,590);
         pop();
         if( j==2||j==4||j==6||j==8||j==11||j==13)
      {   fill(10,200,100,0.03);
          noStroke();
          rect(this.fretobj[i][j].f_pos+this.fretobj[i][j].f_width/4,325,this.fretobj[i][j].f_width/2,200);
        }
        
        }
      }
   colorMode(HSB,1);
  }
  
  inputChord(){
  if(paintmode==0)
{
 // this.create_fretboard();
    if (mouseIsPressed)
  { 
    let x=mouseX;
    let y=mouseY;
    if (mouseY>270 && mouseY<920)
    {
    
      for (let i=0;i<6;i++)
      {   for(let j=0;j<=18;j++)
          { 
            if((x-this.fretobj[i][j].f_pos<this.fretobj[i][j].f_width)&&(abs((y-(300+i*50)))<10) && ((x-this.fretobj[i][j].f_pos)>0))
           
           {  if(this.fretobj[i][j].input_chordnote==0)
              {
             let v= createVector(i,j);
             this.inputnotes[this.total_chordnotes]= v;
             this.fretobj[i][j].input_pos();
             //this.fretobj[i][j].display(this.chordnotes[0]);
             this.chordnotes.push(this.fretobj[i][j].note_intval);
             this.total_chordnotes++;            
             //break;
              }
            
           }
             console.log(this.total_chordnotes,this.fretobj[i][j].input_chordnote);
          } //j loop
      } // i loop
    } // within fretboardcanvas 
  } //closing brackett for mosePressed
  }//closing bracket for paintmode
  
}      
         
               
    
  
  display_fullchord(){
  //this.create_fretboard();
  for(let i=0;i<6;i++)
    {  for(let j=0;j<=18;j++)
       { for(let k=0;k<this.total_chordnotes;k++)
         { //if(this.inputnotes[k].x==i && this.inputnotes[k].y==j)
           //this.fretobj[i][j].input_pos();
           if(this.fretobj[i][j].note_intval==this.chordnotes[k])
           { //is.fretobj[i][j].present=1;
             this.fretobj[i][j].display(this.chordnotes[0],this.fretobj[i][j].loc);
           } 
         }
        
       }
    }
    
  }
  
  display_inputchord(){
  //this.create_fretboard;
  for(let i=0;i<6;i++)
    {  for(let j=0;j<=18;j++)
       { for(let k=0;k<this.total_chordnotes;k++)
         { if(this.inputnotes[k].x==i && this.inputnotes[k].y==j)
          { this.fretobj[i][j].input_pos();
             
            this.fretobj[i][j].display(this.chordnotes[0],this.fretobj[i][j].loc);
          } 
          if(this.fretobj[i][j].note_intval==this.chordnotes[k])
            this.fretobj[i][j].present=1;
          
         }
        
       }
    }
  }
  
  reset_lerp()
  {
    for(let i=0;i<6;i++)
      {
        for(let j=0;j<18;j++)
          {
            this.fretobj[i][j].islerpto=0;
          }
      }
  }
  
}

 

function assign_noteval(i_temp,j_temp)
{
 if (i_temp==0)
   noteval_temp=(8+j_temp)%12;
  
  else if (i_temp==1)
  noteval_temp=(3+j_temp)%12;
  
   else if (i_temp==2)
  noteval_temp=(11+j_temp)%12;
  
   else if (i_temp==3)
  noteval_temp=(6+j_temp)%12;
  
   else if (i_temp==4)
  noteval_temp=(1+j_temp)%12;
  
   else if (i_temp==5)
  noteval_temp=(8+j_temp)%12;
  
  return noteval_temp;
  
}
wd=window.outerWidth;
ht=window.outerHeight;
function setup() {
 createCanvas(wd,ht);
 // fullscreen();
 // background(70);
 frameRate(60);
 for(let i=0;i<15;i++)
  {
    chords[i]=new chordclass();
  }
 
  colorMode(HSB,1)
  col=color(10/360,0.8,0.5,0.7)
  button=createButton('Input New Chord');
  button.position(19+xoff,19+yoff);
  button.size(150,70);
  button.style('background-color', col);
  button.style('font-size','20px');
  button.style('font-family','lato');
  button.style('color','white');
  button.style('border-radius','12px');

 
  button2=createButton('Start Animation');
  button2.position(19+xoff,100+yoff);
  button2.style('font-family','lato');
  button2.size(150,70);
  button2.style('background-color', col);
  button2.style('font-size','20px');
  button2.style('color','white');
  button2.style('border-radius','12px');
  
  button3=createButton('Next Chord');
  button3.size(100,80);
  button3.style('background-color', col);
  button3.style('font-size','20px');
  button3.style('font-family','lato');
  button3.style('color','white');
  button3.position(360+xoff,19+yoff);
  button3.style('border-radius','12px');
   
  button5=createButton('Previous Chord');
  button5.size(100,80);
  button5.style('background-color', col);
  button5.style('font-size','20px');
  button5.style('font-family','lato');
  button5.style('color','white');
  button5.position(250+xoff,19+yoff);
  button5.style('border-radius','12px');
  
  button_showintervals=createButton('Show Intervals');
  button_showintervals.position(250+xoff,125+yoff);
  button_showintervals.size(200,50);
  button_showintervals.style('background-color',col);
  button_showintervals.style('font-size','20px');
  button_showintervals.style('font-family','lato');
  button_showintervals.style('color','white');
  button_showintervals.style('border-radius','12px');
  
  button4=createButton('Start Again');
  button4.position(xoff,yoff-500)
  button4.size(200,100)
  button4.style('background-color',col)
  button4.style('font-size','27px')
  button4.style('font-family','lato')
  button4.style('color','white')
  button4.style('border-radius','12px')
  //inp.size(200,200);
  
  //PAINT CANVAS
  for(let i=0;i<10;i++)
   { paintcanvas[i]=createGraphics(1920,1000);
      paintcanvas[i].slider = createSlider(1, 20, 3);
    paintcanvas[i].slider.position(wd/2,10);
    paintcanvas[i].slider.hide();
  paintcanvas[i].eraser = createButton("clear");
  paintcanvas[i].eraser.mousePressed(changeBG);
    paintcanvas[i].eraser.position(wd/2,40);
    paintcanvas[i].eraser.hide();
  paintcanvas[i].checkbox = createCheckbox('Erase', false);
    paintcanvas[i].checkbox.position(wd/2+50,40)
    paintcanvas[i].checkbox.hide();
  //c_canv = color(255,255,255);
    colorMode(RGB);
    c_canv=color(255,255,255);
  paintcanvas[i].background(255,255,255,0);
  paintcanvas[i].colorMode(RGB);
   }
}




function draw() {
  // background(70);
  
  
//  if(window.innerWidth<768)
  //{translate(900,00,0)
   //rotate(PI/2);
  //}
  //translate(400,-1000,0)
  //translate(width/2,height/2);
  
   for(let i=0;i<10;i++)
    {
      paintcanvas[i].slider.hide();
      paintcanvas[i].eraser.hide();
      paintcanvas[i].checkbox.hide();
    }
  
  
  button.mousePressed(inputnextchord);
  button2.mousePressed(lastchord_funct);
  button3.mousePressed(shownextchord);
  button_showintervals.mousePressed(funct_showintervals);
  button4.mousePressed(startover);
  button5.mousePressed(showpreviouschord);
  t1=millis();
  //metronome_draw();
  
 
   //textAlign(CENTER);
 
  

  
  
  
  if(lastchord!=1)
  { u=totalchords;
    chords[totalchords].display_fretboard();
    chords[totalchords].inputChord();
   chords[totalchords].display_inputchord();
    //console.log(chords[totalchords].chordnotes);
     
  }
  else
    { u=c;
      chords[c].display_fretboard();
      animation();   
    }
    
   if(paintmode==1)
     {
        paintcanvas[u].slider.show();
   paintcanvas[u].eraser.show();
  paintcanvas[u].checkbox.show();
  
  radius = paintcanvas[u].slider.value();
       tint(255,255,255,255);
  image(paintcanvas[u],0,0);
     }
 
  }
  
function mouseClicked() {
 if(paintmode==1)
 {
    if (paintcanvas[u].checkbox.checked())
     { paintcanvas[u].erase();
      stampRectangle(255);
      paintcanvas[u].noErase();
     }
      else 
    stampRectangle(c_canv);
  }
}

function mouseDragged() {
if(paintmode==1)
{
  if (paintcanvas[u].checkbox.checked()){
    paintcanvas[u].erase();
     paintcanvas[u].rect(mouseX,mouseY,paintcanvas[u].slider.value(),paintcanvas[u].slider.value());
    paintcanvas[u].noErase();
  }else{
    paintcanvas[u].stroke(c_canv)
  }
 // if (mouseX < 390) {
    paintcanvas[u].strokeWeight(paintcanvas[u].slider.value());
    paintcanvas[u].line(mouseX, mouseY, pmouseX, pmouseY);
 // }
}
}

function changeBG() {
  //paintcanv.background(255);
  paintcanvas[u].clear();
  //ColorPicker()
}



function stampRectangle(c_canv){
  paintcanvas[u].fill(c_canv)
  paintcanvas[u].noStroke()
  paintcanvas[u].rect(mouseX,mouseY,paintcanvas[0].slider.value(),paintcanvas[u].slider.value())
}




function animation(){
  
 // background(0);
  
  
  amount=amount+0.05;
  if(amount>1)
  chords[c].display_fullchord();
  else
  { //chords[c].display_fullchord();
    transition(amount);
  }
 
  
}

function shownextchord(){
 
  if(lastchord==1)
    { amount=0;
      prevc =c;     
      c=(c+1)%(totalchords+1);
    }  
}

function transition(tempamount){
  //tempamount=tempamount;
  //.chords[c].create_fretboard();
  
  colorMode(HSB,1);
  fill(60/360, 96, 74,0.5);
  let radii=30;
  let temp1=prevc;
  let temp2=c;
  if(tempamount<0.1)
  {chords[temp1].reset_lerp();//prevent arising bubbles during backward lerp (left motion)
  chords[temp2].reset_lerp();
  }
  for(let i=0;i<6;i++)
    { for(let j=0;j<18;j++)
      {  if(chords[temp1].fretobj[i][j].present==1)               
          { if(chords[temp1].fretobj[i][j].present==1&&chords[temp2].fretobj[i][j].present==1)
          { //constant bubbles
              let x1=chords[temp2].fretobj[i][j].loc.x;       
              let x2=chords[temp2].fretobj[i][j].loc.y;       
              ellipse(x1,x2,30,30);
              continue;
          }
           
            let v1=createVector(chords[temp1].fretobj[i][j].loc.x,chords[temp1].fretobj[i][j].loc.y);
            let priority1,priority2,priority3,priority4;//records fret no(k) 
            let prionum=[]; 
           prionum.push(5);
            
           
           for (let k=0;k<18;k++)
              {
                if (k==j){continue;}
                if(chords[temp2].fretobj[i][k].present==1)
                { 
              
                    
                  if(k-j==1)
                  {priority1=k;               
                   prionum.push(1);      
                  }
                 else if(k-j==-1)
                 {
                   priority2=k;                 
                   prionum.push(2);                   
                 }
                 else if(k-j==2)
                  { priority3=k;               
                   prionum.push(3)                 
                  }
                 else if(k-j==-2)
                  { priority4=k;                
                   prionum.push(4);              
                  }
                  
                }
              }
           
           let highpri=min(prionum);  //highest priority
           
           if(highpri==1)
             {
               let v2=createVector(chords[temp1].fretobj[i][priority1].loc.x,chords[temp1].fretobj[i][priority1].loc.y);
               let v3 = p5.Vector.lerp(v1, v2, tempamount);
               ellipse(v3.x,v3.y,radii,radii);
               chords[temp2].fretobj[i][priority1].islerpto=1;
             }
           else if(highpri==2)
             {
               let v2=createVector(chords[temp1].fretobj[i][priority2].loc.x,chords[temp1].fretobj[i][priority2].loc.y);
               let v3 = p5.Vector.lerp(v1, v2, tempamount);
               ellipse(v3.x,v3.y,radii,radii);
               chords[temp2].fretobj[i][priority2].islerpto=1;
             }
           else if(highpri==3)
             {
               let v2=createVector(chords[temp1].fretobj[i][priority3].loc.x,chords[temp1].fretobj[i][priority3].loc.y);
               let v3 = p5.Vector.lerp(v1, v2, tempamount);
               ellipse(v3.x,v3.y,radii,radii);
               chords[temp2].fretobj[i][priority3].islerpto=1;
             }
            else if(highpri==4)
              {
                let v2=createVector(chords[temp1].fretobj[i][priority4].loc.x,chords[temp1].fretobj[i][priority4].loc.y);
               let v3 = p5.Vector.lerp(v1, v2,tempamount);
               ellipse(v3.x,v3.y,radii,radii);
               chords[temp2].fretobj[i][priority4].islerpto=1;
              }
           else
             {
               let loneradii=map(amount,0,1,radii,0);
               let lonex=chords[temp1].fretobj[i][j].loc.x;
               let loney=chords[temp1].fretobj[i][j].loc.y;
               ellipse(lonex,loney,loneradii,loneradii);
             chords[temp2].fretobj[i][j].islerpto=0;
             }
          // console.log("    "+prionumarray)
           prionum.length=0;
          }

      
     
    /* if(chords[temp2].fretobj[i][j].present==1)
       { let flag=0;
         for(let k=0;k<18;k++)
           { 
             if(chords[temp1].fretobj[i][k].present==1)
               {
                 if(chords[temp1].fretobj[i][k].islerp==1)
                   {
                     flag=1
                   }
               }
           }
         if(flag==0)
           {
              let loneradii=map(amount,0,1,0,radii);
               let lonex=chords[temp2].fretobj[i][j].loc.x;
               let loney=chords[temp2].fretobj[i][j].loc.y;
               ellipse(lonex,loney,loneradii,loneradii);
           }
       }*/
       if((chords[temp2].fretobj[i][j].present==1)&&(chords[temp2].fretobj[i][j].islerpto==0))
           {
             let loneradii=map(amount,0,1,0,radii);
               let lonex=chords[temp2].fretobj[i][j].loc.x;
               let loney=chords[temp2].fretobj[i][j].loc.y;
               ellipse(lonex,loney,loneradii,loneradii)
           }
      }
    }
  
 /* for(let i=0;i<6;i++)
     { for(let j=0;j<18;j++)
       {
         if((chords[temp2].fretobj[i][j].present==1)&&(chords[temp2].fretobj[i][j].islerpto==0))
           {
             let loneradii=map(amount,0,1,0,radii);
               let lonex=chords[temp2].fretobj[i][j].loc.x;
               let loney=chords[temp2].fretobj[i][j].loc.y;
               ellipse(lonex,loney,loneradii,loneradii)
           }
           
       }
     
     }*/ 
}

function keyPressed() {
    if(key=='f')
    fullscreen(1);
  
  if (lastchord==1)
    {
      if(key=='z')
      {  amount=0;
         prevc=c;
         c=c-1;
         if(c<0)
         {c=totalchords;}
        
    
      } 
      if(key=='x')
        { amount=0;
          prevc=c;
          c=(c+1)%(totalchords+1);
        }
      
    }
   if(key=='p')
     {
       if(paintmode==0)
        paintmode=1;
      else 
        paintmode=0;
     }
 /*  if (key=='h')
    u++;
  if(key=='g')
  u--;
 */ 

}

function inputnextchord()
{ 
  
 
 totalchords++;
  
}

  function lastchord_funct()
  {
    lastchord=1;
   // button,style(curser,'not-allowed')
   // button.style(opacity,0.4)
    button.hide()
   // button.show();
  }

function funct_showintervals(){
  show_intervals=(show_intervals+1)%2;
}

function myInputEvent() {
  console.log('you are typing: ', this.value());
}

function startover()
{
  for(let i=0;i<10;i++)
    {
      paintcanvas[i].clear();
    }
  lastchord=0;
  chords.length=0;
  totalchords=0;
  c=0;
  prevc=0;
  for(let i=0;i<15;i++)
  {
    chords[i]=new chordclass();
  }
  button.show();
}

function showpreviouschord()
{
   if(lastchord==1)
    { amount=0;
         prevc=c;
         c=c-1;
         if(c<0)
         {c=totalchords;}
    }  
}



