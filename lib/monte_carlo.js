module.exports = {
  determine_ratio: determine_ratio,
  generate_random_data: generate_random_data,
  new_random_point: new_random_point,
  dist: dist
}

// accepts some input
// normalizes and appends to array
// plots data
// determine if coordinate is in circle
// if so mark in tally
// add one to count

// ratio of tally:count should be (π/4)

function determine_ratio(data){

  var tally = 0
  data.forEach(function(elements){

    var distance = dist(elements)
    if(distance <= 1.0){
      tally += 1
    }

  })

  // console.log(tally/data.length)
  // console.log(4*tally/data.length)

  return parseFloat(tally/data.length);

}

function dist(elements){
  return Math.sqrt((elements[0] * elements[0]) + (elements[1] * elements[1]))
}

function generate_random_data(n){
  var data = []
  for(var i = 0; i < n; i++){
    data.push(new_random_point())
  }
  return data;
}

function new_random_point(){
  return ([Math.random()*2.0-1, Math.random()*2.0-1]);
}
