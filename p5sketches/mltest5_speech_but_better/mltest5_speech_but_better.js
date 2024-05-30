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
let is_quick = false;
let is_sequential = false;
let logged_cards = new Set();

function setup() {
  //noCanvas();
  createCanvas(600, 400);

  //background(200);
  
  let quick_read_button = createButton('Button 1');
  let sequential_read_button = createButton('Button 3');
  let start_button = createButton('~ Tap into the spirit ~');
  let stop_button = createButton('~ Sever Divine Connection ~');
  let download_button = createButton('Oh divine mother, tell me what you see!');
  
  // Create a camera input
  video = createCapture(VIDEO);
  video.position(50, 250);
  console.log ("VIDEO WIDTH HEIGHT: ", video.width, video.height);
  
  // NOTE: because video is 300x150; therefore, the end X_positionxY_position of it is 350x500
  quick_read_button.position(725, 425);
  sequential_read_button.position(725, 450);
  start_button.position(725, 475);
  download_button.position(725, 500);
  stop_button.position(725, 525);
  
  quick_read_button.mousePressed(run_cam_1);
  describe("A gray button that runs turns on the camera feed for analyzing the symbols seen by camera's video feed.");
  sequential_read_button.mousePressed(run_cam_3);
  describe("A gray button that runs turns on the camera feed for analyzing the symbols seen by camera's video feed.");  
  start_button.mousePressed(run_cam);
  describe("A gray button that runs turns on the camera feed for analyzing the symbols seen by camera's video feed.");
  download_button.mousePressed(saveDataToFile);
  describe("A gray button that downloads a file containing what the camera has seen so far...");
  stop_button.mousePressed(stop_cam);
  describe("A gray button that stops the camera feed and resets the data");
  
  
  
}

function run_cam_1(){
  is_quick = true;
  run_cam();
}

function run_cam_3(){
  is_sequential = true;
  run_cam();

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

function card_logger(card_val){
  logged_cards.add(card_val)
  console.log("Detected card: ", card_val)
}

function overlap_indicator(cards_list){
  // function to check if any lists have overlapping 
}

function hijacker(results) {
  // must ensure none of these overlap!!!
  let eye_label_nums = [451, 616, 823, 826, 902];
  let life_label_nums = [111, 438, 714, 767, 783, 968];
  let triangle_label_nums = [409, 613, 659, 872, 892, 920];
  let cards_list = [eye_label_nums, life_label_nums, triangle_label_nums]
  
  //overlap_indicator(cards_list)
  
  if (eye_label_nums.includes(results[0].label)){
    return 'eye'
  }
  else if (life_label_nums.includes(results[0].label)){
    return 'life'
  }
  else if (triangle_label_nums.includes(results[0].label)){
    return 'triangle'
  }
  else{
    if (results[0].label < 333){
      return 'eye'
    }
    else if (results[0].label < 666){
      return 'life'
    }
    else{
      return 'triangle'
    }
  }
}

function list_printer(results){
  for (i = 0; i < results.length; i){
    console.log(results[i].label + ' - ' + results[i].confidence + '\n');
  }
}

// When we get a result
function gotResult(err, results) {
  // The results are in an array ordered by confidence.
  let hijack = hijacker(results);
  //select('#result').html(results[0].label);
  select('#result').html(hijack);
  select('#probability').html(nf(results[0].confidence, 0, 2));
  //console.log(results[:]['label'])
  
  //let data = {};
  
  //list_printer(results);
  //console.log('results size: ' + results.length + "\n")
  
  for (let i = 0; i < results.length; i++)  {
    //console.log(results[i]['label'])
    // OLD IF-ELSE
    //if (data.hasOwnProperty(results[i]['label'])){
    //  data[results[i]['label']]++;
    //}
    //else{
    //  data[results[i]['label']] = 1;
    //}
    // NEW IF-ELSE
    if (data.hasOwnProperty(hijack)){
      data[hijack]++;
    }
    else{
      data[hijacker] = 1;
    }
  }
  if (stream_status){
    myVoice.speak(`I see ${hijack}`);
  }
  //sessionStorage approach
  //sessionStorage.setItem('data', JSON.stringify(data));
  //saveDataToFile();
  
  logged_cards.add(hijack);
  console.log('Logged card: ' + hijack + '\n');
  
  mySet.forEach(function(value) {
    console.log('\nLogged cards: ' + value + '\n');
  });
  
  if (is_quick && logged_cards.size > 0){
    stop_cam();
  }
  if (is_sequential && (logged_cards.size == cards_list.length)) {
    stop_cam();
  }
  
  wait(500);
  classifyVideo();
}

function stop_cam() {
  console.log("CAMERA STOPPED!");
  stream_status = false;
  is_quick = false;
  is_sequential = false;
  classifier = undefined;
  myVoice.speak(``);
}
