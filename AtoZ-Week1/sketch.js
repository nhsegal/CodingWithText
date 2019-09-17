var txt;
var output;
var submit;

function preload(){
  txt = loadStrings("Rainbow.txt");

}

function setup() {
  noCanvas();
  console.log(txt);
  createP(txt);
}
