let img ;
let detector;

function preload(){
img = loadImage('images/cat-dog3.jpeg');
detector = ml5.objectDetector('');
}

function gotDetections(error, results) {
  if(error){
    console.error(error);
  }
  console.log(results);
  for(let i=0; i < results.length; i++) {
    let object = results[i];
    stroke (255, 0, 0);
      strokeWeight(5);
      noFill();
    rect(object.x, object.y, object.width, object.height);
    }
}

function setup() {
createCanvas(640,480);
//console.log(detector);
image(img,0, 0);
detector.detect(img,gotDetections);
}


function draw() {

}
