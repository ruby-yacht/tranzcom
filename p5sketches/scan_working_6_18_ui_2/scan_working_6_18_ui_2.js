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
// Reading mode for the current session: 'one_card', 'three_cards', or 'scan'.
// Recorded once at the session level (filename + session.reading_mode); not
// repeated per-event since every event in a file shares the same mode.
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

  renderOverlapAudit();
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

// Live horizontal-bar chart of per-card detection counts. Bars are colored
// by how each card's count compares to the uniform expectation (total / 13),
// but only once we have enough total observations that uniform expectation
// is meaningful — otherwise everything looks "skewed" by random noise.
const MIN_TOTAL_FOR_DEVIATION_COLOR = 13;

// Chi-squared critical values for df = 12 (one less than number of cards).
// Hard-coded so we don't need a stats library to give a verdict. Anything
// above CHI2_CRIT_005 means the distribution differs from uniform at
// 95% confidence; the approximation needs expected count >= 5 per bin
// (i.e. total >= 65) to be reliable.
const CHI2_CRIT_005_DF12 = 21.026;
const CHI2_RELIABLE_MIN_TOTAL = 65;

// Static analysis of CARD_LABELS. hijacker() walks `cards` in priority order
// and returns the first card whose label set contains the ImageNet label —
// so overlapping labels are always claimed by the earlier card. For each
// card we count how many of its labels are "available" (not in any earlier
// card's set) vs "stolen by earlier" (preempted in the priority order).
function analyzeCardLabelOverlap() {
  const labelCardCounts = new Map(); // label -> how many cards' sets contain it
  for (const card of cards) {
    for (const label of CARD_LABELS[card]) {
      labelCardCounts.set(label, (labelCardCounts.get(label) || 0) + 1);
    }
  }

  const claimed = new Set();
  const perCard = cards.map(card => {
    const set = CARD_LABELS[card];
    let stolen = 0;
    for (const label of set) {
      if (claimed.has(label)) stolen++;
    }
    for (const label of set) claimed.add(label);
    return {
      card,
      total: set.size,
      available: set.size - stolen,
      stolen,
    };
  });

  const totalUniqueLabels = labelCardCounts.size;
  let multiCardLabels = 0;
  for (const c of labelCardCounts.values()) if (c > 1) multiCardLabels++;

  return { totalUniqueLabels, multiCardLabels, perCard };
}

function renderOverlapAudit() {
  const panel = document.getElementById('overlap_panel');
  if (!panel) return;

  const stats = analyzeCardLabelOverlap();
  const maxTotal = Math.max(...stats.perCard.map(s => s.total));

  const rows = stats.perCard.map(s => {
    const availPct = (s.available / maxTotal * 100).toFixed(0);
    const stolenPct = (s.stolen / maxTotal * 100).toFixed(0);
    return `<div class="ov-row">
      <span class="ov-name">${s.card}</span>
      <span class="ov-bar">
        <span class="ov-avail" style="width:${availPct}%"></span>
        <span class="ov-stolen" style="width:${stolenPct}%"></span>
      </span>
      <span class="ov-total">${s.available}/${s.total}</span>
    </div>`;
  }).join('');

  panel.innerHTML =
    '<h2>hijacker overlap (priority bias)</h2>' +
    rows +
    `<div class="ov-meta">
      ${stats.totalUniqueLabels} unique labels &middot;
      ${stats.multiCardLabels} appear in 2+ cards<br>
      <span style="color:#5cb85c">available</span> /
      <span style="color:#d9534f">stolen by earlier card</span> &middot;
      counts show <em>available / total</em>
    </div>`;
}

function chiSquaredVsUniform(counts) {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return null;
  const expected = total / counts.length;
  const chi2 = counts.reduce(
    (sum, count) => sum + Math.pow(count - expected, 2) / expected,
    0
  );
  return { chi2, total, df: counts.length - 1 };
}

function deviationColor(count, expected, total) {
  if (total < MIN_TOTAL_FOR_DEVIATION_COLOR) return '#888';
  if (count === 0) return '#3a7bd5';                  // not seen — under
  const ratio = count / expected;
  if (ratio > 2.5) return '#d9534f';                  // strongly over
  if (ratio > 1.5) return '#f0ad4e';                  // mildly over
  if (ratio < 0.5) return '#6cb2eb';                  // mildly under
  return '#888';                                      // ~uniform
}

function renderFrequencyChart() {
  const chart = document.getElementById('frequency_chart');
  if (!chart) return;

  const counts = cards.map(c => data[c] || 0);
  const total = counts.reduce((a, b) => a + b, 0);
  const haze = data['haze'] || 0;
  const maxCount = Math.max(1, ...counts);
  const expected = total / cards.length;

  const rows = cards.map((card, i) => {
    const count = counts[i];
    const pct = total > 0 ? (count / total * 100).toFixed(1) : '0.0';
    const barWidth = (count / maxCount * 100).toFixed(0);
    const color = deviationColor(count, expected, total);
    return `<div class="freq-row">
      <span class="freq-name">${card}</span>
      <span class="freq-bar"><span style="width:${barWidth}%;background:${color}"></span></span>
      <span class="freq-count">${count} (${pct}%)</span>
    </div>`;
  }).join('');

  // Legend + chi-squared block only appear once coloring is active.
  let extras = '';
  if (total >= MIN_TOTAL_FOR_DEVIATION_COLOR) {
    const stat = chiSquaredVsUniform(counts);
    const verdict = stat.chi2 > CHI2_CRIT_005_DF12
      ? '<span style="color:#d9534f">significantly non-uniform</span> (p &lt; 0.05)'
      : '<span style="color:#5cb85c">consistent with uniform</span> (p &gt; 0.05)';
    const lowN = total < CHI2_RELIABLE_MIN_TOTAL
      ? ` &middot; <em>low N, preliminary</em>`
      : '';
    extras = `
      <div class="freq-meta">expected per card: ${expected.toFixed(1)}<br>
        <span style="color:#d9534f">over &gt;2.5&times;</span> &middot;
        <span style="color:#f0ad4e">over &gt;1.5&times;</span> &middot;
        <span style="color:#6cb2eb">under &lt;0.5&times;</span> &middot;
        <span style="color:#3a7bd5">unseen</span>
      </div>
      <div class="freq-meta">χ² = ${stat.chi2.toFixed(2)} (df=${stat.df})${lowN}<br>
        ${verdict}
      </div>`;
  }

  chart.innerHTML =
    '<h2>frequency (this reading)</h2>' +
    rows +
    `<div class="freq-meta">total: ${total} &middot; haze: ${haze}</div>` +
    extras;
}

// CSV schema, versioned via the schema_version column so batch-compilation
// scripts can detect format changes. Session metadata is denormalized onto
// every row so files can be concatenated without joining. The geolocation +
// consent columns are placeholders today (Phase 2 wires the consent flow).
const CSV_SCHEMA_VERSION = 1;
const CSV_HEADER = [
  'schema_version',
  'session_started_at',
  'reading_mode',
  't_ms',
  'imagenet_label',
  'imagenet_confidence',
  'hijacker_label',
  'consent_geolocation',
  'geo_lat',
  'geo_lon',
].join(',');

function saveDataToFile() {
  if (!sessionStartIso) {
    console.warn('No session data to save — start a reading first.');
    return;
  }
  console.log('DOWNLOADING DATA...');

  // Filesystem-safe ISO timestamp: replace `:` and `.` with `-`.
  const safeTimestamp = sessionStartIso.replace(/:/g, '-').replace(/\./g, '-');
  const filename = `${readingMode}_${safeTimestamp}.csv`;

  // None of our values contain commas, quotes, or newlines, so plain
  // unquoted CSV is safe. If hijacker_label ever gains multi-word values
  // this will need RFC 4180 quoting.
  const rows = sessionEvents.map(e => [
    CSV_SCHEMA_VERSION,
    sessionStartIso,
    readingMode,
    e.t_ms,
    e.imagenet_label,
    e.imagenet_confidence.toFixed(6),
    e.hijacker_label,
    'false', // consent_geolocation — false until Phase 2 consent flow lands
    '',      // geo_lat
    '',      // geo_lon
  ].join(','));

  const csv = [CSV_HEADER, ...rows].join('\n') + '\n';
  const blob = new Blob([csv], { type: 'text/csv' });
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
