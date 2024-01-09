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
