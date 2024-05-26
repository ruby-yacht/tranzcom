
let imgs = []; // CREATE AN EMPTY ARRAY TO STORE IMAGES
let numImgs = 13;
let numbers = []; // Array to store the indicies to images, we'll shuffle this one
let cWidth=208, cHeight=300; // from https://ruby-yacht.github.io/tranzcom/sigil-sm/
let cnt=0;

function preload() {
  //least efficient, but most straightforward way
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
// createCanvas(cWidth*5, cHeight*3); 
 createCanvas(windowWidth, windowHeight); // set up a scaling variable to get 5 across and 3 verticle
 
 background(250);
 frameRate(5);
// Initialize the numbers array with 1 to 13 -these are card pointers
 for (let i = 1; i <= numImgs; i++) {
    numbers.push(i);
 }
} //end setup

function shuffleArray(arr) { // this will do a basic shuffle on the array
  let currentIndex = arr.length;
  let randomIndex;
  while (currentIndex > 0) {
    randomIndex = floor(random(currentIndex));
    currentIndex--;
    // Swap elements
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
//       displayReading355(arr); 
//      wait(10);
  }
} // end shuffleArray

function shuffleOne(arr,index) { // this will do a basic shuffle on the array
  let currentSize = arr.length;
//  print(currentSize);
  let randomIndex;
    randomIndex = floor(random(currentSize));
    print(randomIndex);
    currentSize--;
    // Swap elements
    [arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
} // end shuffleArray

function wait(time) {
  start = millis()
  do
  {
    current = millis();
  }
  while(current < start + time)
} // end wait

function displayArray(arr) { // this will display all 13 cards as numerical values
  let currentLength = arr.length;
  textSize(32);
  textAlign(LEFT, CENTER);
  let yPos = 40;
  for (let i = 0; i < currentLength; i++) {
    text(`Card ${i + 1}: ${numbers[i]}`, 850, yPos);
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
//shuffleArray(numbers);  
displayReading355(numbers); 
//displayArray(numbers);
//shuffleArray(numbers);

if (cnt>11){
  cnt=0;
}else {
  print(cnt);
  cnt++;
}
  
shuffleOne(numbers,cnt);
wait(100);

}// end draw

  
