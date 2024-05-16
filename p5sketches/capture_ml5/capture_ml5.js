// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using MobileNet and p5.js
This example uses a callback pattern to create the classifier
=== */

let classifier;
let video;
// Create a new p5.speech object
// You can also control the Language, Rate, Pitch and Volumn of the voice
// Read more at http://ability.nyu.edu/p5.js-speech/
const myVoice = new p5.Speech();
// defined as global to get ALL data in a session
let data = {}
//document.getElementById("start_stream").addEventListener("Click", run_cam);
let stream_status = false;

function setup() {
  //noCanvas();
  createCanvas(600, 400);

  //background(200);
  let start_button = createButton('~ START ~');
  let download_button = createButton('Download');
  let stop_button = createButton('~ STOP ~');
  
  // Create a camera input
  video = createCapture(VIDEO);
  video.position(50, 250);
  console.log ("VIDEO WIDTH HEIGHT: ", video.width, video.height);
  
  // NOTE: because video is 300x150; therefore, the end X_positionxY_position of it is 350x500
  start_button.position(725, 425);
  download_button.position(725, 450);
  stop_button.position(725, 475);
  
  
  start_button.mousePressed(run_cam);
  describe("A gray button that runs turns on the camera feed for analyzing the symbols seen by camera's video feed.");
  download_button.mousePressed(saveDataToFile);
  describe("A gray button that downloads a file containing what the camera has seen so far...");
  stop_button.mousePressed(stop_cam);
  describe("A gray button that stops the camera feed and resets the data");
  
  
  
}

function run_cam(){
  stream_status = true;
  data = {}
  console.log("running camera!!!!")
  // Initialize the Image Classifier method with MobileNet and the video as the second argument
  classifier = ml5.imageClassifier('MobileNet', video, modelReady);
  const filePath = 'logged_res_labels.txt';
//  frameRate(1);

}

function modelReady() {
  // Change the status of the model once its ready
  select('#status').html('Model Loaded');
  // Call the classifyVideo function to start classifying the video
  //startLoop()
  //while (stream_status){
  classifyVideo();
    
  //}
  
 
}

// Function to start the loop
function startLoop() {
    // Run the loop until the stream status is true
    var loopInterval = setInterval(function() {
        if (!stream_status) {
            clearInterval(loopInterval); // Stop the loop
        }
        classifier.classify(gotResult) // Call the function
    }, 100); // Run every 1 second (adjust the interval as needed)
}

// Get a prediction for the current video frame
function classifyVideo() {
  startLoop();
}

function wait(time)
{
  start = millis()
  do
  {
    current = millis();
  }
  while(current < start + time)
}

function saveDataToFile() {
  console.log ("DOWNLOADING DATA...")
  var dict_as_str = JSON.stringify(data);
  var blob = new Blob ([dict_as_str], {type: 'text/plain'});
  
  // Create a temporary anchor element and set its attributes
  var a = document.createElement('a');
  a.download = 'sessionStorageData.txt';
  a.href = window.URL.createObjectURL(blob);
  a.style.display = 'none';
  
  // Append the anchor to the body and trigger a click event to start download
  document.body.appendChild(a);
  a.click();
  
  // Clean up by removing the temporary anchor
  document.body.removeChild(a);
  
}

// When we get a result
function gotResult(err, results) {
  // The results are in an array ordered by confidence.
  select('#result').html(results[0].label);
  select('#probability').html(nf(results[0].confidence, 0, 2));

  
  //let data = {};
  
  
  for (let i = 0; i < results.length; i++)  {
    //console.log(results[i]['label'])
    if (data.hasOwnProperty(results[i]['label'])){
      data[results[i]['label']]++;
    }
    else{
      data[results[i]['label']] = 1;
    }
  }
  if (stream_status){
    myVoice.speak(`I see ${results[0].label}`);
  }
  
  
   wait(100);
  classifyVideo();
}

function stop_cam() {
  console.log("CAMERA STOPPED!");
  stream_status = false;
  classifier = undefined;
  myVoice.speak(``);
  
}
