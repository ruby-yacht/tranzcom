let mobilenet;
let video;
let lab = '';

function modelReady() {
  console.log('Zee Mode-el iz ready, Boss');
  mobilenet.classify(gotResults);
  
}

function gotResults(error,results) {
if (error) {
console.error(error);
}
else {
//console.log(results);
lab = results[0].label;
mobilenet.classify(gotResults);
}
}

function setup() {
createCanvas(1200, 800);
video = createCapture(VIDEO);
frameRate(45);
video.hide();



//create the image classifier object
mobilenet = ml5.imageClassifier('MobileNet', video, modelReady); 
}


function draw() {
  background(255, 20);
  image(video, width/2, height/2);
  fill(random(255),random(255),random(255));
  textSize(random(32));
  text(lab,random(1000), random(800));
}
