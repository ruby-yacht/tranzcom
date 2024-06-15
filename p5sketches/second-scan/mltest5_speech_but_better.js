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
let data = {};
//document.getElementById("start_stream").addEventListener("Click", run_cam);
let stream_status = false;
let is_quick = false;
let is_sequential = false;
let logged_cards = new Set();
let cards_list = [];
let cards = [
              'eye', 
              'life', 
              'triangle', 
              'sun', 
              'mercury',
              'venus',
              'moon',
              'mars',
              'jupiter',
              'saturn',
              'time',
              'symmetry',
              'infinity'
              ]
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
  console.log('VIDEO WIDTH HEIGHT: ', video.width, video.height);

  // NOTE: because video is 300x150; therefore, the end X_positionxY_position of it is 350x500
  quick_read_button.position(725, 425);
  sequential_read_button.position(725, 450);
  start_button.position(725, 475);
  stop_button.position(725, 500);
  download_button.position(725, 525);

  quick_read_button.mousePressed(run_cam_1);
  describe(
    'A gray button that runs turns on the camera feed for analyzing the first symbol it sees.'
  );
  sequential_read_button.mousePressed(run_cam_3);
  describe(
    'A gray button that runs turns on the camera feed for analyzing the entire deck.'
  );
  start_button.mousePressed(run_cam);
  describe(
    "A gray button that runs turns on the camera feed for analyzing the symbols seen by camera's video feed."
  );
  stop_button.mousePressed(stop_cam);
  describe('A gray button that stops the camera feed and resets the data');
  download_button.mousePressed(saveDataToFile);
  describe(
    'A gray button that downloads a file containing what the camera has seen so far...'
  );
}

function run_cam_1() {
  console.log('STARTED: quick reading');
  is_quick = true;
  run_cam();
}

function run_cam_3() {
  console.log('STARTED: sequential reading');
  is_sequential = true;
  run_cam();
}

function run_cam() {
  stream_status = true;
  data = {};
  console.log('running camera!!!!');
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
  var loopInterval = setInterval(function () {
    if (!stream_status) {
      clearInterval(loopInterval); // Stop the loop
    }
    classifier.classify(gotResult); // Call the function
  }, 100); // Run every 1 second (adjust the interval as needed)
}

// Get a prediction for the current video frame
function classifyVideo() {
  startLoop();
}

function wait(time) {
  start = millis();
  do {
    current = millis();
  } while (current < start + time);
}

function saveDataToFile() {
  console.log('DOWNLOADING DATA...');
  var dict_as_str = JSON.stringify(data);
  var blob = new Blob([dict_as_str], { type: 'text/plain' });

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

function card_logger(card_val) {
  logged_cards.add(card_val);
  console.log('Detected card: ', card_val);
}

function overlap_indicator(cards_list) {
  // function to check if any lists have overlapping
}

function getKeyByVal(obj, value) {
  return Object.keys(obj).find((key) => obj[key] === value);
}

function hijacker(results) {
  // must ensure none of these overlap!!!
  // let eye_label_nums = [451, 616, 823, 826, 902];
  // let life_label_nums = [111, 438, 714, 767, 783, 968];
  // let triangle_label_nums = [409, 613, 659, 872, 892, 920];
  let eye_label_nums = [
    898, 616, 823, 902, 451, 714, 650, 506, 409, 721, 767, 606, 600, 584, 433,
    826,
  ];
  let life_label_nums = [
    968, 441, 504, 647, 711, 859, 783, 622, 714, 692, 438, 615, 767, 700, 806,
    999, 929, 529, 728, 709, 720, 902, 457, 435, 828, 760, 584, 455, 855, 746,
    722, 836, 419, 433, 906, 512, 941, 310, 617, 872, 794,
  ];
  let triangle_label_nums = [
    409, 892, 494, 859, 438, 828, 659, 920, 464, 613, 605, 674, 813, 761, 754,
    633, 851, 902, 772, 783, 872, 794, 506, 905, 650, 622, 836, 447, 784, 889,
    434, 710, 720, 600, 767, 714, 667, 619, 999,
  ];
  let symmetry_label_nums = [
    75, 77, 438, 73, 811, 902, 676, 714, 584, 767, 746, 794, 455, 615, 647, 430,
    545, 722, 419, 772, 836, 441,
  ];

  let moon_label_nums = [
    438, 647, 844, 441, 622, 711, 504, 700, 999, 968, 772, 828, 720, 673, 836,
    512, 902, 463, 714, 659, 572,
  ];
  let sun_label_nums = [
    504, 968, 438, 499, 844, 859, 647, 836, 714, 889, 622, 828, 633, 464, 635,
    512, 826, 418, 549, 794, 419, 615, 783, 761,
  ];
  let mars_label_nums = [
    577, 823, 650, 902, 541, 451, 754, 662, 818, 589, 633, 882, 673, 616, 75,
    613, 785, 506,
  ];
  let saturn_label_nums = [
    600, 882, 823, 616, 53, 677, 59, 703, 747, 902, 754, 650, 898,
  ];
  let jupiter_label_nums = [
    711, 438, 647, 631, 855, 512, 794, 905, 310, 902, 728, 307, 760, 622, 714,
    419, 898, 486, 455, 836, 720, 889,
  ];

  let time_label_nums = [
    633, 446, 754, 616, 499, 620, 823, 451, 111, 600, 844, 506, 589, 882, 650,
    673, 902, 605, 433, 684, 488,
  ];
  let venus_label_nums = [
    504, 438, 633, 659, 967, 968, 902, 647, 770, 502, 774, 463, 597, 600, 748,
    446, 896, 512, 630, 488, 720, 622, 828, 631, 999, 310, 499, 700,
  ];

  let mercury_label_nums = [
    616, 818, 464, 633, 600, 823, 629, 451, 736, 577, 902, 882, 417, 673, 794,
    421, 512,
  ];
  let infinity_label_nums = [
    438, 647, 504, 441, 999, 902, 463, 600, 616, 906, 464, 968, 714, 572, 828,
    310, 836, 794, 837, 772, 849, 512,
  ];

  cards_list = [
    eye_label_nums, 
    life_label_nums, 
    triangle_label_nums, 
    sun_label_nums, 
    mercury_label_nums, 
    venus_label_nums, 
    moon_label_nums, 
    mars_label_nums,
    jupiter_label_nums,
    saturn_label_nums,
    time_label_nums,
    symmetry_label_nums,
    infinity_label_nums
    ];

  //label_num = getKeyByVal(M, results[0].label)
  //overlap_indicator(cards_list)
  //console.log('LABEL NUM: ' + label_num + '\n');
  //console.log('TYPE OF LABEL_NUM VALUE: ' + typeof label_num + '\n');

  if (eye_label_nums.includes(results[0].label) && !(logged_cards.has('eye'))) {
    return 'eye';
  } else if (life_label_nums.includes(results[0].label) && !(logged_cards.has('life'))) {
    return 'life';
  } else if (triangle_label_nums.includes(results[0].label) && !(logged_cards.has('triangle'))) {
    return 'triangle';
  } else if (sun_label_nums.includes(results[0].label) && !(logged_cards.has('sun'))) {
    return 'sun';
  } else if (mercury_label_nums.includes(results[0].label) && !(logged_cards.has('mercury'))) {
    return 'mercury';
  } else if (venus_label_nums.includes(results[0].label) && !(logged_cards.has('venus'))) {
    return 'venus';
  } else if (moon_label_nums.includes(results[0].label) && !(logged_cards.has('moon'))) {
    return 'moon';
  } else if (mars_label_nums.includes(results[0].label) && !(logged_cards.has('mars'))) {
    return 'mars';
  } else if (jupiter_label_nums.includes(results[0].label) && !(logged_cards.has('jupiter'))) {
    return 'jupiter';
  } else if (saturn_label_nums.includes(results[0].label) && !(logged_cards.has('saturn'))) {
    return 'saturn';
  } else if (time_label_nums.includes(results[0].label) && !(logged_cards.has('time'))) {
    return 'time';
  } else if (symmetry_label_nums.includes(results[0].label) && !(logged_cards.has('symmetry'))) {
    return 'symmetry';
  } else if (infinity_label_nums.includes(results[0].label) && !(logged_cards.has('infinity'))) {
    return 'infinity';
  } else {
    return 'haze';
  }
}

function list_printer(results) {
  for (i = 0; i < results.length; i) {
    console.log(results[i].label + ' - ' + results[i].confidence + '\n');
  }
}

// When we get a result
function gotResult(err, results) {
  // The results are in an array ordered by confidence.
  results = results || [];

  // NOTE: uncomment for checking result array values
  //results.forEach(function(value) {
  //  console.log('\nRESULTS VALUE\n label: ' + value.label + ' - ' + value.confidence + '\n');
  //});

  console.log('results type: ' + typeof results + '\n');
  let hijack = '';
  if (results.length > 0) {
    hijack = hijacker(results);
    //select('#result').html(results[0].label);
    select('#result').html(hijack);
    select('#probability').html(nf(results[0].confidence, 0, 2));
    select('#logged_cards').html(Array.from(logged_cards));
  }
  //console.log(results[:]['label'])

  //let data = {};

  //list_printer(results);
  //console.log('results size: ' + results.length + "\n")

  for (let i = 0; i < results.length; i++) {
    //console.log(results[i]['label'])
    // OLD IF-ELSE
    //if (data.hasOwnProperty(results[i]['label'])){
    //  data[results[i]['label']]++;
    //}
    //else{
    //  data[results[i]['label']] = 1;
    //}
    // NEW IF-ELSE
    if (data.hasOwnProperty(hijack)) {
      data[hijack]++;
    } else {
      data[hijacker] = 1;
    }
  }
  if (stream_status && cards.includes(hijack)) {
//    myVoice.speak(`I see ${hijack}`);
  }
  //sessionStorage approach
  //sessionStorage.setItem('data', JSON.stringify(data));
  //saveDataToFile();
  if (cards.includes(hijack)){
    logged_cards.add(hijack);
  }
  //console.log('Logged card: ' + hijack + '\n');

  logged_cards.forEach(function (value) {
    console.log('\nLogged cards: ' + value + '\n');
  });

  if (is_quick && logged_cards.size == 1) {
    stop_cam();
    return;
  }
  if (is_sequential && logged_cards.size == 3) {
    stop_cam();
    return;
  }

//  wait(500);

  classifyVideo();
}

function stop_cam() {
  console.log('CAMERA STOPPED!');
  stream_status = false;
  is_quick = false;
  is_sequential = false;
  classifier = undefined;
  logged_cards = new Set();
  cards_list = [];
  
  myVoice.speak(``);
  return;
}
