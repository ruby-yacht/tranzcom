let img ;
let detector;

function preload(){
img = loadImage('images/livingroom2.jpeg');
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
    noStroke();
    fill(255,0,0);
    textSize(36);
    text(object.label, object.x + 10, object.y+45);
    
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
