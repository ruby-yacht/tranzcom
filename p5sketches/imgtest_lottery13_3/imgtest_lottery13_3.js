// GLOBAL VARIABLES
let imgs = []; // CREATE AN EMPTY ARRAY TO STORE VARIABLES
let numImgs = 13;
let numbers = []; // Array to store the numbers

//LOAD IMAGES BEFORE THE PROGRAM RUNS
function preload() {
  //least efficient way, but most straightforward way
  let img1 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/01-eye.jpg"
  );
  let img2 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/02-life.jpg"
  );
  let img3 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/03-triangle.jpg"
  );
  let img4 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/04-sun.jpg"
  );
  let img5 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/05-mercury.jpg"
  );
  let img6 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/06-venus.jpg"
  );
  let img7 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/07-moon.jpg"
  );
  let img8 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/08-mars.jpg"
  );
  let img9 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/09-jupiter.jpg"
  );
  let img10 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/10-saturn.jpg"
  );
  let img11 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/11-hour.jpg"
  );
  let img12 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/12-symmetry.jpg"
  );
    let img13 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/p5sketches/images/13-infinity.jpg"
  );
  
  imgs = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13];

 
}

function setup() {
  createCanvas(768, 256*5);
  background(250);
  // frameRate(5);
   noLoop(); // We don't need continuous animation
  // Initialize the array with numbers from 1 to 13
  for (let i = 1; i <= numImgs; i++) {
    numbers.push(i);
  }
  // Shuffle the array
  shuffleArray(numbers);  
  
    // Create a button
 /* let button = createButton("Show Array");
  button.position(10, height - 40);
  button.mousePressed(displayArray);*/
  
      for ( let i=0; i < 5; i++) {
        image(imgs[numbers[i]-1], 0, i*256, 182, 256);   
    }
  
  //Display array
     displayArray();
  }

function shuffleArray(arr) {
  let currentIndex = arr.length;
  let randomIndex;

  while (currentIndex > 0) {
    randomIndex = floor(random(currentIndex));
    currentIndex--;

    // Swap elements
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
}

function displayArray() {
  textSize(32);
  textAlign(LEFT, CENTER);
  let yPos = 40;

  for (let i = 0; i < numImgs; i++) {
    text(`Card ${i + 1}: ${numbers[i]}`, 300, yPos);
    yPos += 40;
  }
}

function draw(){
  

/*    for ( let i=0; i < 5; i++) {
        image(imgs[numbers[i]-1], 0, i*256);   
    }*/
        


}

  
