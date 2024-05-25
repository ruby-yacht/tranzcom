// GLOBAL VARIABLES
let imgs = []; // CREATE AN EMPTY ARRAY TO STORE VARIABLES
let numImgs = 13;
let numbers = []; // Array to store the numbers

//LOAD IMAGES BEFORE THE PROGRAM RUNS
function preload() {
  //least efficient way, but most straightforward way
  let img1 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/01-eye.png"
  );
  let img2 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/02-life.png"
  );
  let img3 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/03-triangle.png"
  );
  let img4 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/04-sun.png"
  );
  let img5 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/05-mercury.png"
  );
  let img6 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/06-venus.png"
  );
  let img7 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/07-moon.png"
  );
  let img8 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/08-mars.png"
  );
  let img9 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/09-jupiter.png"
  );
  let img10 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/10-saturn.png"
  );
  let img11 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/11-hour.png"
  );
  let img12 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/12-symmetry.png"
  );
    let img13 = loadImage(
    "https://ruby-yacht.github.io/tranzcom/sigil-sm/13-infinity.png"
  );
  
  imgs = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13];

 
}

function setup() {
//  createCanvas(768, 256*5);
  createCanvas(208*5, 256);

  background(250);
  // frameRate(5);
   noLoop(); // We don't need continuous animation
  // Initialize the array with numbers from 1 to 13
  for (let i = 1; i <= numImgs; i++) {
    numbers.push(i);
  }
  // Shuffle the array
  shuffleArray(numbers);  // this is where we would use ml5.js to select the order
  
  for ( let i=0; i < 5; i++) {
        image(imgs[numbers[i]-1], i*208, 0, 182, 256);   
   }
  
 //Display array to verify shuffle
 //    displayArray();
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
        image(imgs[numbers[i]-1], i*210, 0);   
    }*/
        


}

  
