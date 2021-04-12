let klack;
let pling;
let nextKlack = 0;
let muted = false;
let beats=-4;
let ismetronome=0;
let tempo_chord=0 //flag to ensure the transition function gets called only once during metronome shifting of chords
let inputbars=[];
let timeNow;
let x_barpos;
let y_barpos;
let showbars=0;
let img_add;
let img_next;
let img_prev;
let img_delete;
x_scale=0.85*window.outerWidth/1536;                     //shifted this here from setup
y_scale=x_scale;   // canvas scaling variables 
let xoff=50;
let yoff=600*y_scale;

function preload() {
  klack = loadSound('assets/klack.wav');
  pling=loadSound('assets/pling.wav');
  klack.playMode('restart');
  pling.playMode('restart');
  img_add=loadImage('assets/add.png');
  img_next=loadImage('assets/next.png');
  img_prev=loadImage('assets/prev.png');
  img_delete=loadImage('assets/delete.png');

}

function setup() {
 createCanvas(wd,ht*1.5);
 // fullscreen();
 back_col=color(0,0,0)
 frameRate(60);


 
 
 scale(x_scale,y_scale);
 for(let i=0;i<20;i++)
  {
    chords[i]=new chordclass();
  }
 
  colorMode(HSB,1)
  colorMode(RGB,255);  
  col=color(255,200,100,50)
  button=createButton('+');
  
  button.position(19*x_scale+xoff,19*x_scale+yoff);
  button.size(50*x_scale,50*y_scale);
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
  
  button3=createButton('>');
  button3.size(50*x_scale,50*y_scale);
  button3.style('background-color', col);
  button3.style('font-size','20px');
  button3.style('font-family','lato');
  button3.style('color','white');
  button3.position(120*x_scale+xoff,19+yoff);
  button3.style('border-radius','12px');
   
  button5=createButton('<');
  button5.size(50*x_scale,50*y_scale);
  button5.style('background-color', col);
  button5.style('font-size','20px');
  button5.style('font-family','lato');
  button5.style('color','white');
  button5.position(70*x_scale+xoff,19+yoff);
  button5.style('border-radius','12px');
  
  button_showintervals=createButton('color coded intervals');
  button_showintervals.position(120+xoff,180+yoff);
  button_showintervals.size(100,50);
  button_showintervals.style('background-color',col);
  button_showintervals.style('font-size','15px');
  button_showintervals.style('font-family','lato');
  button_showintervals.style('color','white');
  button_showintervals.style('border-radius','12px');
  
  button4=createButton('Start Again');
  button4.position(xoff+19,yoff+250)
  button4.size(50,70);
  button4.style('background-color',col)
  button4.style('font-size','15px')
  button4.style('font-family','lato')
  button4.style('color','white')
  button4.style('border-radius','12px');

  button6=createButton('Stream Mode');
  button6.position(xoff+19,yoff+180)
  button6.size(100,50);
  button6.style('background-color',col)
  button6.style('font-size','15px')
  button6.style('font-family','lato')
  button6.style('color','white')
  button6.style('border-radius','12px');

  button7=createButton('toggle metronome');
  button7.position(xoff+19,yoff+250)
  button7.size(100,50);
  button7.style('background-color',col)
  button7.style('font-size','15px')
  button7.style('font-family','lato')
  button7.style('color','white')
  button7.style('border-radius','12px');

  

  tempoSlider = createSlider(40, 208, 100);
  tempoSlider.class('slider');
  tempoSlider.position(xoff+150,yoff+260);
  

  //inp.size(200,200);
  
  //PAINT CANVAS
  for(let i=0;i<20;i++)
   { 
     inputbars[i]=createInput(1,float);
    inputbars[i].position(0, 0);
    inputbars[i].size(100);
    inputbars[i].hide();
     
    paintcanvas[i]=createGraphics(wd,ht*1.5);
      paintcanvas[i].slider = createSlider(1, 20, 3);
    paintcanvas[i].slider.position(wd/2,10);
    paintcanvas[i].slider.hide();
  paintcanvas[i].eraser = createButton("clear");
  paintcanvas[i].eraser.mousePressed(changeBG);
  paintcanvas[i].eraser.position(wd/2,40);
  paintcanvas[i].eraser.hide();
  paintcanvas[i].redbutton=createButton("red");
 paintcanvas[i].redbutton.mousePressed(redpaint);
 paintcanvas[i].redbutton.hide();
  paintcanvas[i].redbutton.position(wd/2+150,20);
  paintcanvas[i].bluebutton=createButton("blue");
  
 
  paintcanvas[i].bluebutton.mousePressed(bluepaint);
  paintcanvas[i].bluebutton.position(wd/2+150,40);
  paintcanvas[i].bluebutton.hide();

  paintcanvas[i].whitebutton=createButton("white");
  paintcanvas[i].whitebutton.mousePressed(whitepaint);
  paintcanvas[i].whitebutton.hide();
   paintcanvas[i].whitebutton.position(wd/2+150,0);
  
  paintcanvas[i].checkbox = createCheckbox('Erase', false);
    paintcanvas[i].checkbox.position(wd/2+50,40)
    paintcanvas[i].checkbox.hide();
  /*  paintcanvas[i].checkboxred=createCheckbox('red',false);
    paintcanvas[i].checkboxred.position(wd/2+50,70);
    paintcanvas[i].checkboxred.hide();
    paintcanvas[i].checkboxblue=createCheckbox('blue',false);
    paintcanvas[i].checkboxblue.position(wd/2-50,70);
    paintcanvas[i].checkboxblue.hide();
*/
  //c_canv = color(255,255,255);
    colorMode(RGB);
    
    c_canv=color(255,255,255);
    paintcanvas[i].colorMode(RGB);
    
  paintcanvas[i].background(255,255,255,0);
  
   }
}




function draw() {
  // background(70);
//x_scale=0.85*window.outerWidth/1536;
 //y_scale=0.85;   // canvas scaling variables 
 //rotate(PI/8);
 //scale(x_scale,y_scale);
 //("window width "+window.outerWidth) ;
 //console.log("paintmode:"+paintmode);
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
      paintcanvas[i].redbutton.hide();
      paintcanvas[i].bluebutton.hide();
      paintcanvas[i].whitebutton.hide();
      inputbars[i].hide();
    }
  inputbars[c].show();
  if (lastchord==0)
  {
   // button3.hide();
    //button5.hide();
    button.show();
    button2.show();
    button7.hide();
  }
  else
  { button.hide();
    //button2.hide();
    button3.show();
    button5.show();
    button7.show();
  }
  
  
  button.mousePressed(inputnextchord);
  button2.mousePressed(lastchord_funct);
  button3.mousePressed(shownextchord);
  button_showintervals.mousePressed(funct_showintervals);
  button4.mousePressed(startover);
  button5.mousePressed(showpreviouschord);
  button6.mousePressed(stream_mode);
  button7.mousePressed(togglemetronome)

  
 timeNow=millis();
  if(lastchord!=1)
  { u=totalchords;
    chords[c].display_fretboard();
    //chords[totalchords].inputChord();

    if(fullchord==1)
    chords[c].display_fullchord();
    else
   chords[c].display_inputchord();
   // console.log(c, totalchords);
   chords[c].chordanalyze(); 
     
  }
  else
    { u=c;
      chords[c].display_fretboard();
      animation();
      chords[c].chordanalyze();   
    }
    chords[c].bars=inputbars[c].value();
   if(paintmode==1)
     {
        paintcanvas[c].slider.show();
   paintcanvas[c].eraser.show();
  paintcanvas[c].checkbox.show();
  paintcanvas[c].redbutton.show();
 paintcanvas[c].bluebutton.show();
 paintcanvas[c].whitebutton.show();
 //paintcanvas[c].checkboxred.show();
 //paintcanvas[c].checkboxblue.show();
  radius = paintcanvas[c].slider.value();
      // tint(255,255,255,255);
  image(paintcanvas[c],0,0);
     }
    

     if(ismetronome==1){
  
     if (timeNow > nextKlack) {
       if(beats%4==0)
       pling.play();
       else
       klack.play();
       prevKlack = timeNow;
       nextKlack = timeNow + 60000/tempoSlider.value();
       beats++;
       if(beats>0)
       tempo_chord=1;
       else
       c=0;                 //fixing the bug of random shifting of chord unexpectedly with metronome is in use
      
  }
  
  
    push();
    textAlign(CENTER);
    textSize(20);
    colorMode(RGB);
    fill(255,255,255);
    text((beats-1)%4+1,200,200);
    text(c,250,200);
  
   pop();
  
  
    if(beats%(4*chords[c].bars)==0 && tempo_chord==1 && timeNow>(prevKlack+30000/tempoSlider.value()))
    {
      amount=0;
      prevc =c;     
      c=(c+1)%(totalchords+1);
      tempo_chord=0;
      console.log(chords[c].bars);

    }
  }
   push();
   textAlign(CENTER);
   textSize(20);
   colorMode(RGB);
   fill(255,255,255);
   text(`${tempoSlider.value()}bpm`, (xoff+200),(yoff+300));
   text(chords[c].chordname,(100)*x_scale,(250)*y_scale)
  pop();

 // console.log(frameRate());
 if(showbars==1)
 showprogression();

 console.log(x_scale,y_scale);

}
  
function mouseClicked() {
 if(paintmode==1)
 {
  
   
    if (paintcanvas[c].checkbox.checked())
     { 
       paintcanvas[c].erase();
      stampRectangle(255);
      paintcanvas[c].noErase();
     }
      else 
    stampRectangle(c_canv);
   
  }
  else{
    if(lastchord==0){
    let x=mouseX;
      let y=mouseY;
      if (mouseY>270*y_scale && mouseY<920*y_scale)
      {
       loop1:
        for (let i=0;i<6;i++)
        {   loop2: 
            for(let j=0;j<=18;j++)
            { 
              if((x-chords[c].fretobj[i][j].f_pos<chords[c].fretobj[i][j].f_width)&&(abs((y-(300*y_scale+i*50*y_scale)))<10) && ((x-chords[c].fretobj[i][j].f_pos)>0))
             { //console.log("test passed:"+x,y,i,j) ;
              // console.log("this.input_chord="+ chords[u].fretobj[i][j].input_chordnote);
            
               if(!keyIsDown(SHIFT)) //to avoid multiple entries of the same note
                {
               let v= createVector(i,j);
               loop3:
               for( let q in chords[c].inputnotes)
              {
                 if(chords[c].inputnotes[q].x==v.x && chords[c].inputnotes[q].y==v.y)
                { chords[c].fretobj[i][j].input_chordnote=0;
                  chords[c].inputnotes.splice(q,1); 
                      chords[c].total_chordnotes--; 

                      for(let r in chords[c].chordnotes)
                      {  
                        if(chords[c].chordnotes[chords[c].chordnotes.length-r-1]==chords[c].fretobj[i][j].note_intval)
                        {
                          chords[c].chordnotes.splice(chords[c].chordnotes.length-r-1,1); 
                          break;                    
                        }
                    
                      }
                      break loop2;    
                }
               }
               chords[c].inputnotes[chords[c].total_chordnotes]= v;
               
               chords[c].fretobj[i][j].input_chordnote=1;
               //this.fretobj[i][j].display(this.chordnotes[0]);
               chords[c].chordnotes.push(chords[c].fretobj[i][j].note_intval);
               chords[c].total_chordnotes++;            
               //break;
               
               //console.log("note inputed"+this.total_chordnotes,this.inputnotes);
                }//condition for left mouse click
                else if(keyIsDown(SHIFT)){
                chords[c].rootchange(chords[c].fretobj[i][j].note_intval);
                //console.log("right mouse clicked");
                }
         
   
                
              
             }
            } //j loop
        } // i loop
      } // within fretboardcanvas 
  
} //condition for lastchord
} //condition for paintmode
}





function mouseDragged() {
if(paintmode==1)
{

  if(!keyIsDown(SHIFT)){
  if (paintcanvas[c].checkbox.checked()){
    paintcanvas[c].erase();
     paintcanvas[c].rect(mouseX,mouseY,paintcanvas[c].slider.value(),paintcanvas[c].slider.value());
  paintcanvas[c].noErase();
  }else{
    paintcanvas[c].stroke(c_canv)
  }
 // if (mouseX < 390) {
    paintcanvas[c].strokeWeight(paintcanvas[c].slider.value());
    paintcanvas[c].line(mouseX, mouseY, pmouseX, pmouseY);
 // }
   }

   else if(keyIsDown(SHIFT)){
     for(let p=0;p<=20;p++)
     {
      if (paintcanvas[p].checkbox.checked()){
        paintcanvas[p].erase();
         paintcanvas[p].rect(mouseX,mouseY,paintcanvas[p].slider.value(),paintcanvas[p].slider.value());
        paintcanvas[p].noErase();
      }else{
        paintcanvas[p].stroke(c_canv)
      }
     // if (mouseX < 390) {
        paintcanvas[p].strokeWeight(paintcanvas[p].slider.value());
        paintcanvas[p].line(mouseX, mouseY, pmouseX, pmouseY);
     // }
     }
   }

}
}


function changeBG() {
  //paintcanv.background(255);
  paintcanvas[c].clear();
  //ColorPicker()
}



function stampRectangle(c_canv,c_=c){
  paintcanvas[c_].fill(c_canv)
  paintcanvas[c_].noStroke();

  paintcanvas[c_].rect(mouseX,mouseY,paintcanvas[c_].slider.value(),paintcanvas[c_].slider.value())
}




function animation(){
  
 // background(0);
  
  if(ismetronome==1)
  amount=amount+1/(frameRate()*30/tempoSlider.value());   //incrementing amount in order to fit perfectly between transition from end of last bar to to start of next
  else 
  amount=amount+0.025;
  if(amount>1)
  chords[c].display_fullchord();
  else
  { //chords[c].display_fullchord();
    if(beats>0 && ismetronome==1)             //to ensure that transition animation does not happen during count in
    transition(amount);
    else if(ismetronome==0)
    transition(amount);
  }
 
  
}

function shownextchord(){
 
  //if(lastchord==1){
     amount=0;
      prevc =c;     
      c=(c+1)%(totalchords+1);
   // }  
}

function showpreviouschord()
{
  // if(lastchord==1){
     amount=0;
         prevc=c;
         c=c-1;
         if(c<0)
         {c=totalchords;}
   // }  
}


function transition(tempamount){
  //tempamount=tempamount;
  //.chords[c].create_fretboard();
  
  colorMode(HSB,1);
  fill(60/360, 96, 74);
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
              //pop();
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


       if((chords[temp2].fretobj[i][j].present==1)&&(chords[temp2].fretobj[i][j].islerpto==0))
           {
             let loneradii=map(amount,0,1,0,radii);
               let lonex=chords[temp2].fretobj[i][j].loc.x;
               let loney=chords[temp2].fretobj[i][j].loc.y;
               ellipse(lonex,loney,loneradii,loneradii)
           }
      }
    }
  

}

function keyPressed() {
    if(key=='f')
    fullscreen(1);
  
  //if (lastchord==1)
   // {
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
      
      //}
    else
    { if(key=='d')
      {
        if(deletenote==0)
        deletenote=1;
        else
        deletenote=0;
      }

    }
   if(key=='p')
     {
       if(paintmode==0)
        paintmode=1;
      else 
        paintmode=0;
     }
   
  
     if (key=='c')
     {
       fullchord=(fullchord+1)%2;
       
     }  

     if(key=='n')
     {
       shownote=(shownote+1)%2;
     }

     if(key=='m')
     {
      
       togglemetronome();
     }

     if (key=='b')
     showbars=(showbars+1)%2;



   
     

  

}

function doubleClicked()
{
  if(paintmode==0)
        paintmode=1;
      else 
        paintmode=0;
}


function inputnextchord()
{ 
  
 
 totalchords++;
 c=totalchords;
  
}

  function lastchord_funct()
  {
    lastchord=(lastchord+1)%2;
    beats=-4;
 
   c=0;
   prevc=0;
    button.hide()
   // button.show();
  }

function funct_showintervals(){
  show_intervals=(show_intervals+1)%2;
}

function myInputEvent() {
  //console.log('you are typing: ', this.value());
}

function startover()
{
  for(let i=0;i<10;i++)
    {
      paintcanvas[i].clear();
      inputbars[i].value(1);
    }
  lastchord=0;
  chords.length=0;
  totalchords=0;
  beats=-4;
  c=0;
  prevc=0;
  for(let i=0;i<15;i++)
  {
    chords[i]=new chordclass();
  }
  button.show();

  ismetronome=0; 
}



function stream_mode()
{
  stream_mode_var=(stream_mode_var+1)%2;
  colorMode(RGB);
  if(stream_mode_var==1)
  {
    back_col=color(0,255,0);

  }
  else 
  back_col=color(0,0,0);
}


function togglemetronome()
{ 
  nextKlack = timeNow + 60000/tempoSlider.value();
  ismetronome=(ismetronome+1)%2;
}

function redpaint()
{
  push()
  colorMode(RGB);
 c_canv=color(255,140,0);
  pop();
}

function bluepaint()
{
  push();
  colorMode(RGB);
  c_canv=color(255,0,255);
  pop();

}

function whitepaint()
{
  push();
  colorMode(RGB);
  c_canv=color(255,255,255);
  pop();
}

function showprogression(){
  //location coordinated of of bars
  x_barpos=500*x_scale;
  y_barpos=650*y_scale;
  let barlength=130*x_scale;
  for(let i=0;i<=totalchords;i++)
  {
    if(x_barpos>=500*x_scale+130*x_scale*4)
    { x_barpos=500*x_scale;
      y_barpos=y_barpos+60*y_scale;
    }
      push();
      colorMode(HSB,1)
      fill(120/360,300/360,300/360,0.3);
      if(i==c)
      {
        strokeWeight(3);
        stroke(0,0,1);
      }
      else
      noStroke();
      barlength=130*chords[i].bars*x_scale;
      rect(x_barpos,y_barpos,barlength,50,20,20,20,20);
      textAlign(CENTER);
      textSize(15*x_scale);
   
   fill(0,0,1);
   noStroke();
   
   text(chords[i].chordname,x_barpos+50*x_scale,y_barpos+20*y_scale)

      x_barpos=x_barpos+130*chords[i].bars*x_scale;
      pop();
      console.log(x_barpos);
  }
}
