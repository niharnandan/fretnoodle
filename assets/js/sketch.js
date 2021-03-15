
function setup() {
 createCanvas(wd,ht*1.5);
 // fullscreen();
 back_col=color(0,0,0)
 frameRate(30);
 x_scale=0.85*window.outerWidth/1536;
 y_scale=x_scale;   // canvas scaling variables 
 
 
 scale(x_scale,y_scale);
 for(let i=0;i<20;i++)
  {
    chords[i]=new chordclass();
  }
 
  colorMode(HSB,1)
  col=color(10/360,0.8,0.5,0.2)
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
  button3.position(19+xoff,19+yoff);
  button3.style('border-radius','12px');
   
  button5=createButton('Previous Chord');
  button5.size(100,80);
  button5.style('background-color', col);
  button5.style('font-size','20px');
  button5.style('font-family','lato');
  button5.style('color','white');
  button5.position(130+xoff,19+yoff);
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
  button4.position(xoff+250,yoff+50)
  button4.size(200,180);
  button4.style('background-color',col)
  button4.style('font-size','27px')
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

  //inp.size(200,200);
  
  //PAINT CANVAS
  for(let i=0;i<20;i++)
   { paintcanvas[i]=createGraphics(wd,ht*1.5);
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
    paintcanvas[i].checkboxred=createCheckbox('red',false);
    paintcanvas[i].checkboxred.position(wd/2+50,70);
    paintcanvas[i].checkboxred.hide();
    paintcanvas[i].checkboxblue=createCheckbox('blue',false);
    paintcanvas[i].checkboxblue.position(wd/2-50,70);
    paintcanvas[i].checkboxblue.hide();

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
 //console.log("window width "+window.outerWidth) ;
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
    }
  
  if (lastchord==0)
  {
    button3.hide();
    button5.hide();
    button.show();
    button2.show();
  }
  else
  { button.hide();
    button2.hide();
    button3.show();
    button5.show();
  }
  
  
  button.mousePressed(inputnextchord);
  button2.mousePressed(lastchord_funct);
  button3.mousePressed(shownextchord);
  button_showintervals.mousePressed(funct_showintervals);
  button4.mousePressed(startover);
  button5.mousePressed(showpreviouschord);
  button6.mousePressed(stream_mode);
  //metronome_draw();
  
 
   //textAlign(CENTER);
 
  

  
  
  
  if(lastchord!=1)
  { u=totalchords;
    chords[c].display_fretboard();
    //chords[totalchords].inputChord();

    if(fullchord==1)
    chords[c].display_fullchord();
    else
   chords[c].display_inputchord();
    console.log(c, totalchords);
     
  }
  else
    { u=c;
      chords[c].display_fretboard();
      animation();   
    }
    
   if(paintmode==1)
     {
        paintcanvas[c].slider.show();
   paintcanvas[c].eraser.show();
  paintcanvas[c].checkbox.show();
  radius = paintcanvas[c].slider.value();
      // tint(255,255,255,255);
  image(paintcanvas[c],0,0);
     }
 
  }
  
function mouseClicked() {
 if(paintmode==1)
 {
  
   
    if (paintcanvas[c].checkbox.checked())
     { paintcanvas[c].erase();
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
                console.log("right mouse clicked");
                }
         
                /*else if(deletenote==1)
                {   //chords[u].fretobj[i][j].input_chordnote==0;
                  for(let q in chords[u].inputnotes)
                  {if(chords[u].inputnotes[q].x==i && chords[u].inputnotes[q].y==j)
                    {
                      chords[u].inputnotes.splice(q,1); 
                      chords[u].total_chordnotes--;                    
                    }
                   // console.log("values of of inputnotes:"+chords[u].inputnotes)

                  }
                  for(let q in chords[u].chordnotes)
                  {
                    if(chords[u].chordnotes[q]==chords[u].fretobj[i][j].note_intval)
                    {
                      chords[u].chordnotes.splice(q,1);                     
                    }
                
                  }
                  //chords[u].total_chordnotes--;
                  chords[u].fretobj[i][j].input_chordnote==0;
                
                  
                    
                      //console.log("values of of chordnotes:"+chords[u].chordnotes)

                      
               //console.log("note deleted"+this.total_chordnotes,this.inputnotes);
                }*/
                
              
             }
            } //j loop
        } // i loop
      } // within fretboardcanvas 
  
} //condition for lastchord
} //condition for paintmode
}

/*function doubleClicked()
 { if (paintmode==0)
  {
    if(lastchord==0)
    {
  let x=mouseX;
  let y=mouseY;
  if (mouseY>270*y_scale && mouseY<920*y_scale)
  {
  
    for (let i=0;i<6;i++)
    {   for(let j=0;j<=18;j++)
        { 
          if((x-chords[u].fretobj[i][j].f_pos<chords[u].fretobj[i][j].f_width)&&(abs((y-(300*y_scale+i*50*y_scale)))<10) && ((x-chords[u].fretobj[i][j].f_pos)>0))
         
         { 
           if(chords[u].fretobj[i][j].input_chordnote==1)
          {
            for(let q in chords[u].inputnotes)
            {if(chords[u].inputnotes[q].x==i && chords[u].inputnotes[q].y==j)
              {
                chords[u].inputnotes.splice(q,1);
                
              }
              //console.log("values of q:"+q)

            }
            for(let r in chords[u].chordnotes)
            {
              if(chords[u].chordnotes[r]==chords[u].fretobj[i][j].note_intval)
              {
                chords[u].chordnotes.splice(r,1);
              }
            }
            chords[u].total_chordnotes--;
                chords[u].fretobj[i][j].input_chordnote==0;
                chords[u].fretobj[i][j].present=0;
                
         //console.log("note deleted"+this.total_chordnotes,this.inputnotes);
          }
          
        
       } //if statement checking which fret
       console.log("delete this.input_chord="+ chords[u].fretobj[i][j].input_chordnote);
      } //j loop
  } // i loop
} //if statement for checking proximity
    } //lastchord
 } //paintmode condition
} //function end
*/



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
  paintcanvas[c_].noStroke()
  paintcanvas[c_].rect(mouseX,mouseY,paintcanvas[0].slider.value(),paintcanvas[c_].slider.value())
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
 
  //if(lastchord==1){
     amount=0;
      prevc =c;     
      c=(c+1)%(totalchords+1);
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
              //push();
              //let col1=assign_col(assign_noteval(i,j),chords[temp1].chordnotes[0]);  
              //let col2=assign_col(assign_noteval(i,j),chords[temp2].chordnotes[0]);
              //let col3=p5.Vector.lerp(col1,col2,tempamount);
              //fill(col3.x,col3.y,col3.z);


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
    lastchord=1;
   // button,style(curser,'not-allowed')
   // button.style(opacity,0.4)
   c=0;
   prevc=0;
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
  // if(lastchord==1){
     amount=0;
         prevc=c;
         c=c-1;
         if(c<0)
         {c=totalchords;}
   // }  
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
