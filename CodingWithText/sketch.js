var textfield;
var output;
var submit;

function setup() {
  noCanvas();
  textfield = select("#textfield");
  //textfield.changed(newText);
  textfield.input(newTyping);
  output = select('#output');
  submit = select('#submit');
  submit.mousePressed(newText);
}

function newTyping(){
  output.html(textfield.value());
}

function newText(){
  var outputString = textfield.value().split("").reverse().join("");
  createP(outputString);
}
