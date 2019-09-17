let t = 0;
const deltaT = .02;
const xMargin = 80;
let pos = 0;
let prePos = 0;
let ypos = 50;
let vel = 10;
let acc = 0;
let posSlider, velSlider, accSlider;
let StartButton, ResetButton;
let playing = false;
let clearGraphs = false;
let posControlled = false;
let velControlled = false;
let accControlled = false;
let moverRad =10;

let posArr = [];
let velArr = [];
let accArr = [];
let arrLen = 7;

let posGraph, velGraph, accGraph;

let average = (array) => array.reduce((a, b) => a + b) / array.length;

let averageSlope = function(array){
    let num = 0;
    let denom = 0;
    for (let i = 0; i<array.length; i++){
      num += (array[i] - average(array))*(deltaT*i-deltaT*(array.length-1)/2);
      denom += (deltaT*i-deltaT*(array.length-1)/2)*(deltaT*i-deltaT*(array.length-1)/2);
    }
    return(num/denom)
}

let averageBend = function(array){
  let b1 = (-2*array[(array.length-1)/2]+array[0]+array[array.length-1])/(array.length*deltaT)
  let b2 = (-2*array[(array.length-1)/2]+array[1]+array[array.length-2])/(array.length*deltaT-2)
  return 10*(b1+b2)
}

function reset(){
  posGraph.data.length = 0;
  velGraph.data.length = 0;
  accGraph.data.length = 0;
  t = 0;
  pos = 0;
  vel = 0;
  acc = 0;
  playing = false;
  clearGraphs = true;
  StartButton.html('Go');
  posSlider.value(100);
  velSlider.value(100);
  accSlider.value(100);
  posControlled = false;
  velControlled = false;
  accControlled = false;
  for (let i =0; i<arrLen; i++){
    posArr.push(pos);
    velArr.push(0);
    accArr.push(0);
  }
  drawMover()
}
function Graph(xPlacement=80, yPlacement=10, data, yScale=-4, xScale=160, xSize=1100, ySize=50, col){
  this.xPlacement = xPlacement;
  this.yPlacement = yPlacement;
  this.data = data;
  this.yScale = yScale;
  this.xScale = xScale;
  this.xSize = xSize;
  this.ySize = ySize;
  this.col = col;

  Graph.prototype.drawAxes = function(){
      stroke(0);
      strokeWeight(1);
      push();
      translate(xMargin, this.yPlacement+this.ySize/2);
      line(0, this.ySize/2, 0, -this.ySize/2);
      line(0,0,this.xSize- xMargin,0)
      pop();
    }

  Graph.prototype.plotPoints = function(){
      noFill();
      strokeJoin(ROUND);
      beginShape();
      stroke(this.col);
      strokeWeight(2);
      for (let i = 0; i < this.data.length-arrLen/2; i++){
        vertex(this.xScale*deltaT*i + xMargin, this.yScale*this.data[i] + this.yPlacement+this.ySize/2);

      }
      endShape();
      stroke(0);
      strokeWeight(.2);
      line(this.xScale*deltaT*(this.data.length-arrLen/2) + xMargin, 150,  this.xScale*deltaT*(this.data.length-arrLen/2) + xMargin, 600);
     }
}
function drawNumberLine() {
  stroke(0);
  strokeWeight(1);
  fill(250,250,50);
  rect(50,.05*height,1100,20);
  fill(0);
  textAlign(CENTER);
  text("meters", width/2+25, 103);
  for (let i = -10; i < 11; i++){

    text(i, 600+i*50+1,.05*height+18);
    line(600+i*50, .05*height, 600+i*50, .05*height+5);
  }
}
function togglePlaying(){
  if (!playing){
    StartButton.html('Pause');

    posArr.push(pos);
    posArr.shift();
    posGraph.data.push(pos);

    velArr.push(vel);
    velArr.shift();
    velGraph.data.push(averageSlope(posArr));

    accArr.push(acc);
    accArr.shift();
    accGraph.data.push(averageSlope(velArr));
    playing = true;
  }
  else{
    playing = false;
    StartButton.html('Go');
  }
}
function drawMover(){
  let stageScale = 50;
  ellipseMode(RADIUS);
  fill(0)
  push();
  translate(stageScale*pos+width/2, ypos);
  ellipse(0, 0, moverRad, moverRad);
  pop();
}
function setup(){
  var cnv= createCanvas(1200, 1200);
  cnv.parent("stage");
  frameRate(24);
  posGraph = new Graph(xPlacement=80, yPlacement=125, data=[pos], yScale=-4, xScale=160, xSize=1100, ySize=150, col=color(0,0,250))
  velGraph = new Graph(xPlacement=80, yPlacement=305, data=[pos], yScale=-4, xScale=160, xSize=1100, ySize=150, col=color(250,0,0))
  accGraph = new Graph(xPlacement=80, yPlacement=485, data=[pos], yScale=-.4, xScale=160, xSize=1100, ySize=150, col=color(0,150,0))
  StartButton = createButton('Go');
  StartButton.position(29, 30);
  StartButton.mousePressed(togglePlaying);
  ResetButton = createButton('Reset');
  ResetButton.position(29, 59);
  ResetButton.mousePressed(reset);
  posSlider= createSlider(0, 200, 100);
  velSlider= createSlider(0, 200, 100);
  accSlider= createSlider(0, 200, 100);
  posSlider.position(-10, 200);
  velSlider.position(-10, 380);
  accSlider.position(-10, 560);
  posSlider.input(setPosValue);
  velSlider.input(setVelValue);
  accSlider.input(setAccValue);
  posSlider.style('rotate', 270);
  velSlider.style('rotate', 270);
  accSlider.style('rotate', 270);
  for (let i =0; i<arrLen; i++){
    posArr.push(pos);
    velArr.push(vel);
    accArr.push(acc);
  }
  posSlider.changed(function(){
    vel= 0;
    acc=0;
    posArr.length=0;
    velArr.length=0;
    accArr.length=0;
    for (let i =0; i<arrLen; i++){
      posArr.push(pos);
      velArr.push(0);
      accArr.push(0);
    }
    velControlled=false;
    accControlled=false;
    playing = true;
  });

  velSlider.changed(function(){
    acc=0;
    accArr.length=0;
    velArr.length=0;
    for (let i =0; i<arrLen; i++){
      velArr.push(vel);
      accArr.push(0);
    }
    posControlled=false;
    accControlled=false;
    playing = true;
  });

  accSlider.changed(function(){
    for (let i =0; i<arrLen; i++){
      accArr.push(acc);
    }
    velControlled=false;
    posControlled=false;
    playing = true;
  });
}
function draw() {
  background(250);
  noStroke();
  fill(80,180,80);
  rect(0,0, width, .1*height);
  fill(0,210,255);
  rect(0,0, width, .05*height);
  drawNumberLine();
  if (playing ){
    updateMotion();
  }

  drawMover();
  posGraph.drawAxes();
  posGraph.plotPoints();
  velGraph.drawAxes();
  velGraph.plotPoints();
  accGraph.drawAxes();
  accGraph.plotPoints();
}
function updateMotion(){
  if (!posControlled || !velControlled || !accControlled){
      vel = vel + deltaT*acc;
      pos = pos + deltaT*vel;
      posArr.push(pos);
      posArr.shift();
      velArr.push(vel);
      velArr.shift();
      accArr.push(acc);
      accArr.shift();
      if (posGraph.data.length < 400){
        posGraph.data.push(average(posArr));
        velGraph.data.push(average(velArr));
        accGraph.data.push(average(accArr));
      }
      t = t+deltaT;
  }
  if (posControlled){
    setPosValue();
  }

  if (velControlled){
    setVelValue();
  }

  if (accControlled){
    setAccValue();
  }
};
function setPosValue(){
  posControlled = true;
  velControlled = false;
  accControlled = false;
  pos = (posSlider.value()-100)/10;
  posArr.push(pos);
  posArr.shift();
  vel = averageSlope(posArr);
  velArr.push(vel);
  velArr.shift();
  velArr.push(vel);
  velArr.shift();
  acc = averageSlope(posArr);
  accArr.push(acc);
  accArr.shift();

  drawMover();
}
function setVelValue(){
  velControlled = true;
  posControlled = false;
  accControlled = false;
  vel = (velSlider.value()-100)/10;
  velArr.push(vel);
  velArr.shift();
  pos = pos + average(velArr)*deltaT;
  posArr.push(pos);
  posArr.shift();

  acc = averageSlope(velArr);
  accArr.push(acc);
  accArr.shift();
  drawMover();
}
function setAccValue(){
     accControlled = true;
     velControlled = false;
     posControlled = false;
     acc = (accSlider.value()-100)/10;
     accArr.push(acc);
     accArr.shift();
     vel = vel + deltaT*acc;
     pos = pos + deltaT*vel;
     posArr.push(pos);
     posArr.shift();
     velArr.push(vel);
     velArr.shift();
     accArr.push(acc);
     accArr.shift();

     drawMover();
   }
