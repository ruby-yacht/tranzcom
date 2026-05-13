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

// Accessibility: speech is OFF by default. Toggled via the page checkbox.
// When turned off mid-reading, any pending or in-flight utterance is silenced.
let speechEnabled = false;

// Detections often arrive in clusters (multiple cards inside a few hundred
// ms during a 3-card reading). Speaking each card immediately leads to
// queued utterances getting cancelled by the auto-stop's cancel() call, so
// the user only hears the last one — or none. Instead we buffer detections
// and flush them as a single phrase like "I see eye, infinity, venus".
// The flush timer is reset on every new detection (debounce); if detections
// pause for > SPEECH_FLUSH_DELAY_MS, the buffer is spoken.
const SPEECH_FLUSH_DELAY_MS = 450;
let pendingSpeechBuffer = [];
let speechFlushTimer = null;

function queueSpeech(card) {
  pendingSpeechBuffer.push(card);
  if (speechFlushTimer) clearTimeout(speechFlushTimer);
  speechFlushTimer = setTimeout(flushSpeech, SPEECH_FLUSH_DELAY_MS);
}

function flushSpeech() {
  if (speechFlushTimer) {
    clearTimeout(speechFlushTimer);
    speechFlushTimer = null;
  }
  if (pendingSpeechBuffer.length === 0) return;
  const phrase = `I see ${pendingSpeechBuffer.join(', ')}`;
  pendingSpeechBuffer = [];
  myVoice.speak(phrase);
}

function cancelPendingSpeech() {
  if (speechFlushTimer) {
    clearTimeout(speechFlushTimer);
    speechFlushTimer = null;
  }
  pendingSpeechBuffer = [];
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function setSpeechEnabled(on) {
  speechEnabled = !!on;
  if (!speechEnabled) {
    cancelPendingSpeech();
  }
}

// Minimum gap between classifications. Caps inference rate on fast machines
// so frequency stats are comparable across devices. Slow machines naturally
// run slower (next classify only fires after the previous gotResult returns).
const MIN_CLASSIFY_INTERVAL_MS = 100;
let lastClassifyMs = 0;

// Ordered priority of cards — also drives the if/else fallthrough in hijacker().
// First match wins, so cards earlier in this list are favored when MobileNet
// label lists overlap. This is a known bias source; see todo.md Phase 1.
const cards = [
  'eye', 'life', 'triangle', 'sun', 'mercury', 'venus', 'moon',
  'mars', 'jupiter', 'saturn', 'time', 'symmetry', 'infinity'
];

// Per-card ImageNet class indices (from the imgtest_lottery* sketches).
// Sets give O(1) .has() and the literals are hoisted to module scope so they
// aren't rebuilt on every classification.
const CARD_LABELS = {
  eye: new Set([
    898, 616, 823, 902, 451, 714, 650, 506, 409, 721, 767, 606, 600, 584, 433,
    826,
  ]),
  life: new Set([
    968, 441, 504, 647, 711, 859, 783, 622, 714, 692, 438, 615, 767, 700, 806,
    999, 929, 529, 728, 709, 720, 902, 457, 435, 828, 760, 584, 455, 855, 746,
    722, 836, 419, 433, 906, 512, 941, 310, 617, 872, 794,
  ]),
  triangle: new Set([
    409, 892, 494, 859, 438, 828, 659, 920, 464, 613, 605, 674, 813, 761, 754,
    633, 851, 902, 772, 783, 872, 794, 506, 905, 650, 622, 836, 447, 784, 889,
    434, 710, 720, 600, 767, 714, 667, 619, 999,
  ]),
  sun: new Set([
    504, 968, 438, 499, 844, 859, 647, 836, 714, 889, 622, 828, 633, 464, 635,
    512, 826, 418, 549, 794, 419, 615, 783, 761,
  ]),
  mercury: new Set([
    616, 818, 464, 633, 600, 823, 629, 451, 736, 577, 902, 882, 417, 673, 794,
    421, 512,
  ]),
  venus: new Set([
    504, 438, 633, 659, 967, 968, 902, 647, 770, 502, 774, 463, 597, 600, 748,
    446, 896, 512, 630, 488, 720, 622, 828, 631, 999, 310, 499, 700,
  ]),
  moon: new Set([
    438, 647, 844, 441, 622, 711, 504, 700, 999, 968, 772, 828, 720, 673, 836,
    512, 902, 463, 714, 659, 572,
  ]),
  mars: new Set([
    577, 823, 650, 902, 541, 451, 754, 662, 818, 589, 633, 882, 673, 616, 75,
    613, 785, 506,
  ]),
  jupiter: new Set([
    711, 438, 647, 631, 855, 512, 794, 905, 310, 902, 728, 307, 760, 622, 714,
    419, 898, 486, 455, 836, 720, 889,
  ]),
  saturn: new Set([
    600, 882, 823, 616, 53, 677, 59, 703, 747, 902, 754, 650, 898,
  ]),
  time: new Set([
    633, 446, 754, 616, 499, 620, 823, 451, 111, 600, 844, 506, 589, 882, 650,
    673, 902, 605, 433, 684, 488,
  ]),
  symmetry: new Set([
    75, 77, 438, 73, 811, 902, 676, 714, 584, 767, 746, 794, 455, 615, 647, 430,
    545, 722, 419, 772, 836, 441,
  ]),
  infinity: new Set([
    438, 647, 504, 441, 999, 902, 463, 600, 616, 906, 464, 968, 714, 572, 828,
    310, 836, 794, 837, 772, 849, 512,
  ]),
};

// Ordered sequence of cards detected this session. Phase 2 (bias audit + SJSU
// upload) needs sequence, not just counts; logged_cards is a Set and loses order.
let ordered_cards = [];

// Per-session event log. One entry per classification frame (regardless of
// whether hijacker matched a card or returned 'haze'). Designed for batch
// compilation across many session files. See sessionPayload() for schema.
let sessionEvents = [];
let sessionStartMs = 0;     // millis() when run_cam fired (event t_ms is relative)
let sessionStartIso = '';   // ISO 8601 UTC timestamp for filename + metadata
// 'card_type' uses the user's terminology: one of 'one_card', 'three_cards', 'scan'.
let readingMode = 'scan';

function setup() {
  createCanvas(600, 400);

  video = createCapture(VIDEO);
  video.position(50, 250);

  let buttonConfigs = [
    { label: '1 card', handler: run_cam_1, posY: 400 },
    { label: '3 cards', handler: run_cam_3, posY: 450 },
    { label: 'scan', handler: run_cam, posY: 500 },
    { label: 'stop', handler: stop_cam, posY: 550 },
    { label: 'save', handler: saveDataToFile, posY: 600 }
  ];

  buttonConfigs.forEach((btn, index) => {
    let button = createButton(btn.label);
    button.position(600, btn.posY);
    button.size(100, 40);
    button.mousePressed(btn.handler);
  });

  let speechButton = createButton('Speech: off');
  speechButton.position(600, 350);
  speechButton.size(100, 40);
  speechButton.mousePressed(() => {
    setSpeechEnabled(!speechEnabled);
    speechButton.html(`Speech: ${speechEnabled ? 'on' : 'off'}`);
  });

  describeButtons();
}

function describeButtons() {
  let descriptions = [
    'A gray button that runs turns on the camera feed for analyzing the first symbol it sees.',
    'A gray button that runs turns on the camera feed for analyzing the entire deck.',
    "A gray button that runs turns on the camera feed for analyzing the symbols seen by camera's video feed.", 
    'A gray button that stops the camera feed and resets the data',
    'A gray button that downloads a file containing what the camera has seen so far...',
  ];

  descriptions.forEach(desc => describe(desc));
}

function run_cam_1() {
  console.log('STARTED: quick reading');
  is_quick = true;
  readingMode = 'one_card';
  run_cam();
}

function run_cam_3() {
  console.log('STARTED: sequential reading');
  is_sequential = true;
  readingMode = 'three_cards';
  run_cam();
}

function run_cam() {
  // Default reading mode for the bare scan button. run_cam_1 / run_cam_3
  // set readingMode before calling us, so we only fall back to 'scan'
  // when neither one-card nor three-card mode was requested.
  if (!is_quick && !is_sequential) {
    readingMode = 'scan';
  }
  stream_status = true;
  sessionStartMs = millis();
  sessionStartIso = new Date().toISOString();
  data = {};
  ordered_cards = [];
  sessionEvents = [];
  logged_cards.clear();
  renderFrequencyChart();
  console.log('running camera!!!!');
  classifier = ml5.imageClassifier('MobileNet', video, modelReady);
}

function modelReady() {
  select('#status').html('Model Loaded');
  classifyVideo();
}

// Live horizontal-bar chart of per-card detection counts. Reads from `data`
// (the per-frame hijacker() output tally) and renders into #frequency_chart.
// Foundation for Phase 1's under-/over-representation work; we keep the
// presentation neutral for now and let the user eyeball distribution.
function renderFrequencyChart() {
  const chart = document.getElementById('frequency_chart');
  if (!chart) return;

  const counts = cards.map(c => data[c] || 0);
  const total = counts.reduce((a, b) => a + b, 0);
  const haze = data['haze'] || 0;
  const maxCount = Math.max(1, ...counts);

  const rows = cards.map((card, i) => {
    const count = counts[i];
    const pct = total > 0 ? (count / total * 100).toFixed(1) : '0.0';
    const barWidth = (count / maxCount * 100).toFixed(0);
    return `<div class="freq-row">
      <span class="freq-name">${card}</span>
      <span class="freq-bar"><span style="width:${barWidth}%"></span></span>
      <span class="freq-count">${count} (${pct}%)</span>
    </div>`;
  }).join('');

  chart.innerHTML =
    '<h2>frequency (this reading)</h2>' +
    rows +
    `<div class="freq-row freq-meta">total: ${total} &middot; haze: ${haze}</div>`;
}

// Session file schema, versioned so batch-compilation scripts can detect
// format changes. The geolocation + consent fields are placeholders today
// (Phase 2 wires the actual consent flow and geolocation capture).
function sessionPayload() {
  return {
    schema_version: 1,
    session: {
      started_at: sessionStartIso,
      reading_mode: readingMode,
      consent: {
        geolocation: false,
      },
      geolocation: null,
    },
    events: sessionEvents,
    summary: {
      counts: data,
      sequence: ordered_cards,
    },
  };
}

function saveDataToFile() {
  if (!sessionStartIso) {
    console.warn('No session data to save — start a reading first.');
    return;
  }
  console.log('DOWNLOADING DATA...');

  // Filesystem-safe ISO timestamp: replace `:` and `.` with `-`.
  const safeTimestamp = sessionStartIso.replace(/:/g, '-').replace(/\./g, '-');
  const filename = `${readingMode}_${safeTimestamp}.json`;

  const blob = new Blob(
    [JSON.stringify(sessionPayload(), null, 2)],
    { type: 'application/json' }
  );
  const a = document.createElement('a');
  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function hijacker(results) {
  const label = results[0].label;
  for (const card of cards) {
    if (CARD_LABELS[card].has(label) && !logged_cards.has(card)) {
      return card;
    }
  }
  return 'haze';
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
    sessionEvents.push({
      t_ms: Math.round(millis() - sessionStartMs),
      card_type: readingMode,
      imagenet_label: results[0].label,
      imagenet_confidence: results[0].confidence,
      hijacker_label: hijack,
    });
    renderFrequencyChart();
  }

  // hijacker() returns a real card name only on first detection of that card
  // this session (already-logged cards are guarded inside hijacker), so this
  // branch fires exactly when a new card is about to be added to the reading.
  // queueSpeech buffers rather than speaking immediately — see comments at
  // the SPEECH_FLUSH_DELAY_MS definition for why.
  if (stream_status && speechEnabled && cards.includes(hijack)) {
    queueSpeech(hijack);
  }

  // logged_cards is the dedup Set; ordered_cards is the history list.
  // hijacker() already dedupes, so this branch only fires on first-detection,
  // but we guard explicitly so ordered_cards never gets a duplicate.
  if (cards.includes(hijack) && !logged_cards.has(hijack)) {
    ordered_cards.push(hijack);
    logged_cards.add(hijack);
  }

  logged_cards.forEach(value => {
    console.log('Logged cards:', value);
  });

  if (is_quick && logged_cards.size === 1) {
    select('#logged_cards').html(Array.from(logged_cards).slice(0, 2));
    stop_cam(false);
    return;
  }
  if (is_sequential && logged_cards.size === 3) {
    select('#logged_cards').html(Array.from(logged_cards).slice(0, 4));
    stop_cam(false);
    return;
  }

  classifyVideo();
}

// silent=true (manual stop button): cancel any pending or in-flight speech.
// silent=false (auto-stop after a 1-/3-card reading completes): flush the
// pending speech buffer immediately so the reading is spoken out loud even
// though the camera is shutting down.
// We deliberately do NOT clear `data`, `ordered_cards`, or `sessionEvents`
// here — those are reading outputs and the user might still want to save
// them. run_cam() resets them at the start of the next session.
function stop_cam(silent = true) {
  console.log('CAMERA STOPPED!');
  stream_status = false;
  is_quick = false;
  is_sequential = false;
  logged_cards.clear();
  if (silent) {
    cancelPendingSpeech();
  } else if (pendingSpeechBuffer.length > 0) {
    flushSpeech();
  }
}

function classifyVideo() {
  if (!stream_status) return;
  const now = millis();
  const elapsed = now - lastClassifyMs;
  if (elapsed >= MIN_CLASSIFY_INTERVAL_MS) {
    lastClassifyMs = now;
    classifier.classify(gotResult);
  } else {
    setTimeout(classifyVideo, MIN_CLASSIFY_INTERVAL_MS - elapsed);
  }
}
