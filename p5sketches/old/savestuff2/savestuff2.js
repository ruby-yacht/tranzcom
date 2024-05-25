let inputField;
let saveButton;

function setup() {
  createCanvas(400, 200);

  // Create an input field
  inputField = createInput();
  inputField.position(20, 20);

  // Create a save button
  saveButton = createButton('Save Text');
  saveButton.position(20, 50);
  saveButton.mousePressed(saveText);
}

function saveText() {
  // Get the text from the input field
  let textToSave = inputField.value();

  // Create a Blob and download it as a file
  let blob = new Blob([textToSave], { type: 'text/plain' });
  saveAs(blob, 'savedText.txt');
}

function draw() {
  background(220);
  // Display instructions
  textAlign(LEFT);
  fill(0);
  text('Type some text and click "Save Text" to save it to a file.', 20, 100);
}
