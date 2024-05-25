
let imgs = []; // CREATE AN EMPTY ARRAY TO STORE IMAGES
let numImgs = 13;
let numbers = []; // Array to store the numbers
let cWidth=208, cHeight=300; // from https://ruby-yacht.github.io/tranzcom/sigil-sm/

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
}// end preload

function setup() {
//  createCanvas(768, 256*5);
 createCanvas(cWidth*5, cHeight*3); //what is phone size for 3-5-5
 background(250);
 noLoop(); // We don't need continuous animation
// Initialize the numbers array with 1 to 13 -these are card pointers
 for (let i = 1; i <= numImgs; i++) {
    numbers.push(i);
 }
// Shuffle the numbers array
 
shuffleArray(numbers);  // this is where we would use ml5.js to select the order

displayReading355(numbers); //this really should not be in setup

// displayReading3(numbers);  //shows first 3 cards
//displayReading355(numbers); //shows all 13 cards 3 rows 3, 5, 5
//    displayArray(); //Display array to verify shuffle
} //end setup

function shuffleArray(arr) { // this will do a basic shuffle on the array
  let currentIndex = arr.length;
  let randomIndex;

  while (currentIndex > 0) {
    randomIndex = floor(random(currentIndex));
    currentIndex--;
    // Swap elements
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
} // end shuffleArray

function displayArray() { // this will display all 13 cards as text
// make this not rely on numImages but detect it
  textSize(32);
  textAlign(LEFT, CENTER);
  let yPos = 40;
  for (let i = 0; i < numImgs; i++) {
    text(`Card ${i + 1}: ${numbers[i]}`, 300, yPos);
    yPos += 40;
  }
} //end displayArray 

function displayReading3(arr) { //display 
 for ( let i=0; i < 3; i++) {
     image(imgs[arr[i]-1], i*cWidth+cWidth, cHeight, cWidth, cHeight);   
 }
}  // end displayReading3

function displayReading355(arr) { //display 
 for ( let i=0; i < 3; i++) {
     image(imgs[arr[i]-1], i*cWidth+cWidth, 0, cWidth, cHeight);   
 }
  for ( let i=3; i < 8; i++) {
     image(imgs[arr[i]-1], (i-3)*cWidth, cHeight, 0, cHeight);   
 }
   for ( let i=8; i < 13; i++) {
     image(imgs[arr[i]-1], (i-8)*cWidth, cHeight*2, 0, cHeight);   
 }
 
}  // end displayReading355

function draw(){
// nothing to execute at the framerate : )  

}// end draw

  
