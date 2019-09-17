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
  let num = S(squared(deltaTArr),posArr)*S(deltaTArr,deltaTArr) - S(deltaTArr,posArr)*S(deltaTArr,squared(deltaTArr))
  let denom = 
}

let S = function(a1, a2){
  let sum = 0;
  for (let i = 0; i<a1.length; i++){
    sum = sum + (a1[i]-average(a1))*(a2[i]-average(a2));
  }
return sum/a1.length
}

let squared = function(array){
  return array.map(x => x*x)
}
