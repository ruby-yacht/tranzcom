let mobilenet;
let turbine;

function modelReady() {
  console.log('Zee Mode-el iz ready, Boss');
  mobilenet.classify(turbine, gotResults);
}

function gotResults(error,results) {
if (error) {
console.error(error);
}
else {
console.log(results);
let lab = results[0].label;
let prob =results[0].confidence;
fill(255.75);
textSize(50);
text(lab,10, height-100);
text(prob,10, height-150);
createP(lab);
createP(prob);
}
}

function imageReady() {
   image(turbine, 0, 0, width, height);
}





function setup() {
createCanvas(600, 480);
turbine = createImg('images/turbine.jpeg', imageReady);
turbine.hide();
background(35);


//create the image classifier object
mobilenet = ml5.imageClassifier('MobileNet', modelReady); 
}


function draw() {

}
