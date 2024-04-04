// Copyright (c) 2019 ml5
//
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

function setup() {
  noCanvas();
  // Create a camera input
  video = createCapture(VIDEO);
  // Initialize the Image Classifier method with MobileNet and the video as the second argument
  classifier = ml5.imageClassifier('MobileNet', video, modelReady);
  const filePath = 'logged_res_labels.txt';
}

function modelReady() {
  // Change the status of the model once its ready
  select('#status').html('Model Loaded');
  // Call the classifyVideo function to start classifying the video
  classifyVideo();
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(gotResult);
}

function saveDataToFile() {
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
  //console.log(results[:]['label'])
  
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
  myVoice.speak(`I see ${results[0].label}`);
  
  //sessionStorage approach
  //sessionStorage.setItem('data', JSON.stringify(data));
  //saveDataToFile();
  
  
  
  classifyVideo();
}

// Call every 30 seconds!
  setInterval(saveDataToFile, 30000);
