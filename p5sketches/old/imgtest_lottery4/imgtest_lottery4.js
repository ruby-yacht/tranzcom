// GLOBAL VARIABLES
let imgs = []; // CREATE AN EMPTY ARRAY TO STORE VARIABLES
let numImgs = 12;

//LOAD IMAGES BEFORE THE PROGRAM RUNS
function preload() {
  //least efficient way, but most straightforward way
  let img0 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/153.png"
  );
  let img1 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/154.png"
  );
  let img2 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/155.png"
  );
  let img3 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/156.png"
  );
  let img4 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/157.png"
  );
  let img5 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/158.png"
  );
  let img6 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/159.png"
  );
  let img7 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/198.png"
  );
  let img8 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/200.png"
  );
  let img9 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/412.png"
  );
  let img10 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/419.png"
  );
  let img11 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/433.png"
  );
  
  imgs = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

 
}

function setup() {
  createCanvas(256, 256*3);
 frameRate(5);
}

function touchStarted() {
  wait(2500);
  
} 

function draw(){
  for(let i=0; i<numImgs; i++){
    for (let j=0; j<numImgs; j++){
      for (let k=0; k<numImgs; k++){
        let randomI = random(imgs);
        let randomJ = random(imgs);
        let randomK = random(imgs);
        image(randomI, 0, 0);
        image(randomJ, 0, 256);
        image(randomK, 0, 512);
      }
    }
  }
/*  if (mouseIsPressed){
    frameRate(1);
  } else {
    frameRate(5);
    
  }*/
}

  
