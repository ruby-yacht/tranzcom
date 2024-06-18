// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using MobileNet and p5.js
This example uses a callback pattern to create the classifier
=== */
let classifier;
let video;
const myVoice = new p5.Speech();
let data = {};
let stream_status = false;
let is_quick = false;
let is_sequential = false;
let logged_cards = new Set();
let cards_list = [];
let cards = [
  'eye', 'life', 'triangle', 'sun', 'mercury', 'venus', 'moon',
  'mars', 'jupiter', 'saturn', 'time', 'symmetry', 'infinity'
];

function setup() {
  createCanvas(600, 400);
// , { facingMode:"environment" }

  video = createCapture(VIDEO);
  video.position(50, 250);

  let buttonConfigs = [
    { label: '1 card', handler: run_cam_1, posY: 400 },
    { label: '3 cards', handler: run_cam_3, posY: 450 },
    { label: 'scan', handler: run_cam, posY: 500 },
    { label: 'stop', handler: stop_cam, posY: 550 },
    { label: 'save', handler: saveDataToFile, posY: 600 },
    { label: 'camera', handler: switchCamera, posY: 650 }
  ];

  buttonConfigs.forEach((btn, index) => {
    let button = createButton(btn.label);
    button.position(600, btn.posY);
    button.size(100, 40);
    button.mousePressed(btn.handler);
  });

  describeButtons();
}

function describeButtons() {
  let descriptions = [
    'A gray button that runs turns on the camera feed for analyzing the first symbol it sees.',
    'A gray button that runs turns on the camera feed for analyzing the entire deck.',
    "A gray button that runs turns on the camera feed for analyzing the symbols seen by camera's video feed.",
    'A gray button that stops the camera feed and resets the data',
    'A gray button that downloads a file containing what the camera has seen so far...'
  ];

  descriptions.forEach(desc => describe(desc));
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
  classifier = ml5.imageClassifier('MobileNet', video, modelReady);
}

function modelReady() {
  select('#status').html('Model Loaded');
  classifyVideo();
}

function startLoop() {
  const loopInterval = setInterval(() => {
    if (!stream_status) {
      clearInterval(loopInterval);
    } else {
      classifier.classify(gotResult);
    }
  }, 100); // Run every 100 ms (adjust the interval as needed)
}

function classifyVideo() {
  startLoop();
}

function wait(time) {
  const start = millis();
  let current;
  do {
    current = millis();
  } while (current < start + time);
}

function saveDataToFile() {
  console.log('DOWNLOADING DATA...');
  const dictAsStr = JSON.stringify(data);
  const blob = new Blob([dictAsStr], { type: 'text/plain' });

  const a = document.createElement('a');
  a.download = 'sessionStorageData.txt';
  a.href = window.URL.createObjectURL(blob);
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();
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

function gotResult(err, results = []) {
  if (err) {
    console.error(err);
    return;
  }

  console.log('results type:', typeof results);

  let hijack = '';
  if (results.length > 0) {
    hijack = hijacker(results);
    select('#result').html(hijack);
    select('#probability').html(nf(results[0].confidence, 0, 2));

    if (is_quick && logged_cards.size === 1) {
      select('#logged_cards').html(Array.from(logged_cards).slice(0, 2));
      return;
    } else if (is_sequential && logged_cards.size === 3) {
      select('#logged_cards').html(Array.from(logged_cards).slice(0, 4));
      return;
    } else {
      select('#logged_cards').html(Array.from(logged_cards));
    }
  }

  if (results.length > 0) {
    if (data.hasOwnProperty(hijack)) {
      data[hijack]++;
    } else {
      data[hijack] = 1;
    }
  }

  if (stream_status && cards.includes(hijack)) {
  //  myVoice.speak(`I see ${hijack}`);
  }

  if (cards.includes(hijack)) {
    logged_cards.add(hijack);
  }

  logged_cards.forEach(value => {
    console.log('Logged cards:', value);
  });

  if (is_quick && logged_cards.size === 1) {
    select('#logged_cards').html(Array.from(logged_cards).slice(0, 2));
    stop_cam();
    return;
  }
  if (is_sequential && logged_cards.size === 3) {
    select('#logged_cards').html(Array.from(logged_cards).slice(0, 4));
    stop_cam();
    return;
  }

  classifyVideo();
}

function stop_cam() {
  console.log('CAMERA STOPPED!');
  stream_status = false;
  is_quick = false;
  is_sequential = false;
  logged_cards.clear();
  cards_list = [];
  myVoice.speak('');
}

function classifyVideo() {
  if (stream_status) {
    classifier.classify(gotResult);
  }
}
