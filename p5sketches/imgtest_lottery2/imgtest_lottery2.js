var img=[], img2, img3, img4; //image variable

var choice = '1'; // starting choice, so it is not empty
var screenbg = 250; // off white background
var initials ='jm';

function preload() {
// preload() runs once, it may make you wait

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

}


function setup() {
createCanvas(256, 256*3);  // canvas size
background(screenbg);   // use our background screen color

}

function touchStarted() {
  wait(1000);
  
}

function draw() {
  
   i=int(random(11));
   j=int(random(11));
   k=int(random(11));
  
    image(img[i], 0, 0, 256, 256);
    image(img[j], 0, 256, 256, 256);
    image(img[k], 0, 512, 256, 256);
    
  if (mouseIsPressed === true) {
    frameRate(1);
  } else {
    frameRate(5);
  }
    
    
  if (keyIsPressed){ 
      choice = key;
     if (choice == 'p' || choice == 'P'){
        saveme();
    } else {
      if (choice == ' ') {
        while (keyPressed()){ }
      } else {
      if (choice == 'q' || choice == 'Q') {
        remove();
        window.close();
          } // end q
      }
     }
   } // end if keypressed
   
} //end draw
  

function wait(time)
{
  start = millis()
  do
  {
    current = millis();
  }
  while(current < start + time)
}


function saveme(){
    filename=initials+day() + hour() + minute() +second();
    saveCanvas(filename, 'jpg');
    key="";
}
