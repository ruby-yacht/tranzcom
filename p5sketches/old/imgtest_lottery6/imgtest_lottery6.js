// GLOBAL VARIABLES
let imgs = []; // CREATE AN EMPTY ARRAY TO STORE VARIABLES
let numImgs = 12;
let numbers = []; // Array to store the numbers

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
  
  imgs = [img0, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

 
}

function setup() {
  createCanvas(768, 256*5);
  background(250);
  // frameRate(5);
   noLoop(); // We don't need continuous animation
  // Initialize the array with numbers from 1 to 12
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
        image(imgs[numbers[i]-1], 0, i*256);   
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

  for (let i = 0; i < 12; i++) {
    text(`Card ${i + 1}: ${numbers[i]}`, 300, yPos);
    yPos += 40;
  }
}

function draw(){
  

/*    for ( let i=0; i < 5; i++) {
        image(imgs[numbers[i]-1], 0, i*256);   
    }*/
        


}

  
