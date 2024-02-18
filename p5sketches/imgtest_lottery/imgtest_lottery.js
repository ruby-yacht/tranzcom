var img=[], img2, img3, img4; //image variable

var choice = '1'; // starting choice, so it is not empty
var screenbg = 250; // off white background
var initials ='jm';


function preload() {
// preload() runs once, it may make you wait
//  img = loadImage('cat.jpg');  // cat.jpg needs to be next to this .js file
// you can link to an image on your github account
  img[0] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/153.png');
  img[1] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/154.png');
  img[2] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/155.png');
  img[3] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/156.png');
  img[4] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/157.png');
  img[5] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/158.png');
  img[6] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/159.png');
  img[7] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/198.png');
  img[8] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/200.png');
  img[9] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/412.png');
  img[10] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/419.png');
  img[11] = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/433.png');

  
  
  
  img2 =loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/157.png');
  img3 = loadImage('https://ruby-yacht.github.io/tranzcom/p5sketches/images/412.png');
}


function setup() {
createCanvas(256*3, 600);  // canvas size
background(screenbg);   // use our background screen color

}

function draw() {
  
   i=int(random(11));
   j=int(random(11));
   k=int(random(11));
  
    image(img[i], 0, 128, 256, 256);
    image(img[j], 256, 128, 256, 256);
    image(img[k], 512, 128, 256, 256);
    
    
  if (keyIsPressed){ 
      choice = key;
 //     clear_print();
     if (choice == 'p' || choice == 'P'){
        saveme();
    }
  }
    
}
  
//  if (keyIsPressed) {
//    choice = key; // set choice to the key that was pressed
//    clear_print(); // check to see if it is clear screen or save image
//  }
//  if (mouseIsPressed){
//    newkeyChoice(choice);  // if the mouse is pressed call newkeyChoice
//  }





function wait(time)
{
  start = millis()
  do
  {
    current = millis();
  }
  while(current < start + time)
}



function newkeyChoice(toolChoice) { 
  
 n=int(random(11));

 if (toolChoice == '1' ) {  
       image(img[n], mouseX-128, mouseY-128, 256, 256);
  } else if (toolChoice == '2') { 
    image(img[01], mouseX-128, mouseY-128, 256, 256);
  } else if (toolChoice == '3') { 
    image(img[02], mouseX-128, mouseY-128, 256, 256);
  } else if (toolChoice == '4') {
    image(img[03], mouseX-128, mouseY-128, 256, 256);
  } else if (key == '5') {
    image(img[04], mouseX-128, mouseY-128, 256, 256);
  } else if (toolChoice == '6') {
    image(img[05], mouseX-128, mouseY-128, 256, 256);
  } else if (toolChoice == '7') {
    image(img[06], mouseX-128, mouseY-128, 256, 256);
  } else if (toolChoice == '8') {
    image(img[07], mouseX-128, mouseY-128, 256, 256);
  } else if (toolChoice == '9') {
    image(img[08], mouseX-128, mouseY-128, 256, 256);
  } else if (toolChoice == '0') {
    image(img[09], mouseX-128, mouseY-128, 256, 256);
  } else if (toolChoice == 'g' || toolChoice == 'G') { // g places the image we pre-loaded
    image(img[010], mouseX-128, mouseY-128, 256, 256);
    
  }  else if (toolChoice == 'e' || toolChoice == 'E') { // e places the image we pre-loaded
    image(img2, mouseX-128, mouseY-128, 256, 256);
    
  }  else if (toolChoice == 'f' || toolChoice == 'F') { // f places the image we pre-loaded
    image(img3, mouseX-128, mouseY-128, 256, 256);
    
  } 
 }
 


function clear_print() {
// this will do one of two things, x clears the screen by resetting the background
// p calls the routine saveme, which saves a copy of the screen
  if (key == 'x' || key == 'X') {
    background(screenbg); // set the screen back to the background color
  } else if (key == 'p' || key == 'P') {
     saveme();  // call saveme which saves an image of the screen
  }
}

function saveme(){
    //this will save the name as the intials, date, time and a millis counting number.
    // it will always be larger in value then the last one.
  filename=initials+day() + hour() + minute() +second();
  if (second()!=lastscreenshot) { // don't take a screenshot if you just took one
    saveCanvas(filename, 'jpg');
    key="";
  }
  lastscreenshot=second(); // set this to the current second so no more than one per second
  
}
