
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
let yoff=700;
let stream_mode_var=0;
let fullchord=0; //varible to flag whether you want to display full chord during input stage


var radius;
var c_canv;
 ht=window.outerHeight;
  wd=window.outerWidth;
let paintcanvas=[];
let u=0;
let paintmode=0;



wd=window.outerWidth;
ht=window.outerHeight;

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
      let alphaval=0.8;
      colorMode(HSB,1);
      //fill(198/360, 96, 74,alphaval);
      fill(60/360,1,1,alphaval);
      textFont('Georgia');
      textSize(15);
      textStyle(BOLD);
      strokeWeight(1);
      let textcolor='WHITE';
      let s='0';
        
      noStroke();
      
       alphaval=1;
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
      
      
      if(this.input_chordnote==1)
      { 
        strokeWeight(3);
        stroke(0,0,1,1);
          
      } else {noStroke();}

      if(show_intervals==0)
      {fill(60/360,1,1,alphaval);
      }

      ellipse(this.loc.x,this.loc.y,30,30);
      if(show_intervals==1)
      { 
        noStroke();
        fill(textcolor);
        text(s,this.loc.x-10,this.loc.y);
      }
      else{
          noStroke();
          if(stream_mode_var==1)
          fill('BLACK');
          else 
          fill('BLACK');
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
    
    background(back_col);
    
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
      background(back_col);
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
        {   fill(255,200,100,0.03);
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

  function assign_col(note_intval,x)
  { let alphaval=0.5;
      let col_=color(0,1,1,alphaval);
    if(show_intervals==1)
    { alphaval=1;
      if(this.note_intval-x==0)
      { col_=color(0,0,1,alphaval);
        
      }
     else if((note_intval-x)==1||(note_intval-x)==-11)
     { col_=color(0,1,1,alphaval);
       
      }
    else if((note_intval-x)==2||(note_intval-x)==-10)
      {col_=color(0,1,1,alphaval);
       
      }
      
      else if((note_intval-x)==3||(note_intval-x)==-9)
      {col_=color(0,1,1,alphaval);
  
      }
      else if((note_intval-x)==4||(note_intval-x)==-8)
      {col_=color(330/360,1,1,alphaval);
       s='M3';
      
      }
    else if((note_intval-x)==5||(note_intval-x)==-7)
      {col_=color(0,1,1,alphaval);
       
      }
    else if((note_intval-x)==6||(note_intval-x)==-6)
      {col_=color(0,1,1,alphaval);
      
      }
      else if((note_intval-x)==7||(note_intval-x)==-5)
      {col_=color(240/360,1,1,alphaval);
       
       
      } 
    else if((note_intval-x)==8||(note_intval-x)==-4)
      {col_=color(0,1,1,alphaval);
      
      }
    else if((note_intval-x)==9||(note_intval-x)==-3)
      {col_=color(0,1,1,alphaval);
      
      }
    
      else if((note_intval-x)==10||(note_intval-x)==-2)
      {col_=color(240/360,1,1,alphaval);
      
      }
       else if((note_intval-x)==11||(note_intval-x)==-1)
       {col_=color(90/360,1,1,alphaval);
       
       }
    }
     col_vector=createVector(hue(col_),saturation(col_),brightness(col_));
     return col_vector
  }