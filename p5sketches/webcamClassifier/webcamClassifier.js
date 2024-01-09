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
createCanvas(600, 540);
video = createCapture(VIDEO);
frameRate(3);
video.hide();
background(35);


//create the image classifier object
mobilenet = ml5.imageClassifier('MobileNet', video, modelReady); 
}


function draw() {
  background(0);
  image(video, 0, 0);
  fill(255);
textSize(32);
text(lab,10, height-20);
}
