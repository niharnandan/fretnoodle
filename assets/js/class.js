
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
let x_scale=1;
let y_scale=1;
let deletenote=0;
let shownote=1;

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
     this.loc=createVector(this.f_pos+this.f_width/2,300*y_scale+this.i*50*y_scale); //location of ellipse
     this.loc_f=createVector(this.f_pos,300*y_scale+this.i*50*y_scale) //location fret beginning
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
      line(this.loc_f.x, this.loc_f.y, this.loc_f.x+this.f_width, this.loc_f.y);
      strokeWeight(1);
      stroke(255,255,255,1);
      ellipse(this.loc_f.x+this.f_width,this.loc_f.y,5,5);
      if(shownote==1){
      push()
      textFont('Georgia');
      textSize(20);
      textStyle(NORMAL);
      colorMode(RGB,1);
      fill(1,1,1,0.3);
      noStroke();
      text(this.note,this.loc_f.x,this.loc_f.y);
      pop();
      }
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
     this.chordname;
     this.ch_formula=[];
     this.bars=1;
      
    }
    create_fretboard(){
    colorMode(RGB);
    
    background(back_col);
    
    for (let i=0;i<6;i++)
    {
      let f_width=orig_width*x_scale;
      let f_pos=50*x_scale;
      this.fretobj[i]=[];
      var j;
      for( j=0;j<18;j++)
      {                                      //making the fret-string objects
         this.fretobj[i].push(new fretclass(assign_noteval(i,j),i,j,f_width,f_pos));
         f_pos=f_pos+f_width;
         f_width=f_width-3*x_scale;       
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
         line(this.fretobj[i][j].f_pos,300*y_scale,this.fretobj[i][j].f_pos,550*y_scale);  //drawing the fret lines
           push();
           textFont('Georgia');
          textSize(25);
           textStyle(NORMAL);
           strokeWeight(1);
         text(j,this.fretobj[i][j].f_pos-this.fretobj[i][j].f_width/2,590*y_scale);
           pop();
           if( j==2||j==4||j==6||j==8||j==11||j==13)
        { colorMode(RGB,255);  
          fill(255,200,100,10);
            noStroke();
            rect(this.fretobj[i][j].f_pos+this.fretobj[i][j].f_width/4,325*y_scale,this.fretobj[i][j].f_width/2,200*y_scale);
          }

        
          
          }
        }
     colorMode(HSB,1);
    }
    
   /* inputChord(){
    if(paintmode==0)
  {
   // this.create_fretboard();
      if (mouseIsPressed)
    { 
      let x=mouseX;
      let y=mouseY;
      if (mouseY>270*y_scale && mouseY<920*y_scale)
      {
      
        for (let i=0;i<6;i++)
        {   for(let j=0;j<=18;j++)
            { 
              if((x-this.fretobj[i][j].f_pos<this.fretobj[i][j].f_width)&&(abs((y-(300*y_scale+i*50*y_scale)))<10) && ((x-this.fretobj[i][j].f_pos)>0))
             
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
           
    */             
      
    
    display_fullchord(){
    //this.create_fretboard();
    for(let i=0;i<6;i++)
      {  for(let j=0;j<=18;j++)
         { for(let k=0;k<this.total_chordnotes;k++)
           { //if(this.inputnotes[k].x==i && this.inputnotes[k].y==j)
             //this.fretobj[i][j].input_pos();
             if(this.fretobj[i][j].note_intval==this.chordnotes[k])
             { //this.fretobj[i][j].present=1;
              //this.fretobj[i][j].input_pos();
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
         { this.fretobj[i][j].present=0;
            for(let k=0;k<this.total_chordnotes;k++)
           { if(this.inputnotes[k].x==i && this.inputnotes[k].y==j)
            { //this.fretobj[i][j].input_pos();
               
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

    rootchange(note_intval_){
     for(let p=0;p<this.chordnotes.length;p++)
     {
       if(this.chordnotes[p]==note_intval_)
       {
         let temp=this.chordnotes[0];
         this.chordnotes[0]=note_intval_;
         this.chordnotes[p]=temp;

       }
     }
    }

    chordanalyze(){
      let found=0; //flag to signal if chord is found in database
      let ch_formula=[] //chord formula
      let interval;
      for(let i=0;i<this.chordnotes.length;i++)
      { if(this.chordnotes[i]-this.chordnotes[0]<0)
        {
          interval=12+this.chordnotes[i]-this.chordnotes[0];
        }
        else
        interval=this.chordnotes[i]-this.chordnotes[0];
        ch_formula.push(int(interval));

      }
      ch_formula.sort((a,b) => a-b);  //to sort integers
      
      console.log(ch_formula)
      for(let i=0;i<ch_formula.length;i++)
      {
        if(ch_formula[i]==ch_formula[i+1])
        {
          ch_formula.splice(i,1); 
          i=i-1;                  //delete repeating notes in input chords
        }
      }

      //console.log(ch_formula)
      loop1:
      for(let c of chordbase)
      {
        if(ch_formula.length==(c.length-1))
        { var i;
          loop2:
          for( i=0;i<c.length-1;i++)
          {
          
            
            if(c[i]!=ch_formula[i])
           { //console.log("breaking  "+i)
              found=0;
              break;
            
           }
          }
          if(i==c.length-1)
          { this.chordname=assign_notename(this.chordnotes[0])+c[c.length-1];
            console.log(" the chord is :"+this.chordname);
            found=1;
            break loop1;
          }
        }
      }

      if(found==0)
      {
        this.chordname="undefined";
      }

     // console.log(ch_formula)


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
  function assign_notename(note_intval)
  {
    if (note_intval==0)
     return 'A';
     else if (note_intval==1)
     return 'Bb';
     else if (note_intval==2)
     return 'B';
     else if (note_intval==3)
     return 'C';
     else if (note_intval==4)
     return 'Db';
     else if (note_intval==5)
     return 'D';
     else if (note_intval==6)
     return 'Eb';
     else if (note_intval==7)
     return 'E';
     else if (note_intval==8)
     return 'F';
     else if (note_intval==9)
     return 'Gb';
     else if (note_intval==10)
     return 'G';
     else if (note_intval==11)
     return 'Ab';

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

  /*
  0-R
  1-m2
  2=M2
  3=m3
  4=M3
  5=P4
  6=#4
  7=P5
  8=m6
  9=M6
  10=m7
  11=M7

  */
let chordbase=[
[0,4,7,'maj'],
[0,3,7,'min'],
[0,3,6,'dim'],
[0,4,8,'aug'],
[0,4,7,11,'maj7'],
[0,3,7,10,'min7'],
[0,3,6,9,'dim7'],
[0,4,7,10,'dom7'],
[0,3,6,10,'min7b5'],
[0,2,4,5,7,9,11,'maj scale']




];
