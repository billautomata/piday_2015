module.exports = {
  determine_ratio: determine_ratio,
  generate_random_data: generate_random_data,
  new_random_point: new_random_point,
  dist: dist,
  params: get_params
}

// accepts some input
// normalizes and appends to array
// plots data
// determine if coordinate is in circle
// if so mark in tally
// add one to count

// ratio of tally:count should be (π/4)

var perlin_noise = require('perlin-noise')
var pn = perlin_noise.generatePerlinNoise(768, 768, {
  octaves: 4
})
var pn2 = perlin_noise.generatePerlinNoise(768, 768, {
    octaves: 4
  })
  // console.log(pn.length)

var image_idx = 0
var pixel_buffer

var urlparams = get_params()
if(urlparams.imagename !== undefined){
  getBase64FromImageUrl('img/'+urlparams['imagename'])
} else {
  getBase64FromImageUrl('img/screenshot.jpg')
}


var Noise = require('noisejs')
var noise = new Noise.Noise()
var noise2 = new Noise.Noise()
noise.seed(Math.random())
noise2.seed(Math.random())

var normal = d3.random.normal(0.0, 0.57)
var lognormal = d3.random.logNormal(0,1)

function determine_ratio(data) {

  var tally = 0
  data.forEach(function (elements) {

    var distance = dist(elements)
    if (distance <= 1.0) {
      tally += 1
    }

  })

  // console.log(tally/data.length)
  // console.log(4*tally/data.length)

  return parseFloat(tally / data.length);

}

function dist(elements) {
  return Math.sqrt((elements[0] * elements[0]) + (elements[1] * elements[1]))
}

function generate_random_data(n) {
  var data = []
  for (var i = 0; i < n; i++) {
    data.push(new_random_point())
  }
  return data;
}

function new_random_point(type, x, y) {



  var perlin_idx = (y * 768) + x

  x = x / 768
  y = y / 768
  y += x

  // console.log(perlin_idx,x,y)

  var ret = []

  switch (type) {
  case "normal":
    ret = [normal(), normal()]
    break;
  case "lognormal":
    ret = [lognormal()-2, lognormal()-2]
    break;
  case "simplex":
    ret = [noise.simplex2(x, y), noise2.simplex2(x, y)]
    break;
  case "perlin":
    ret = [pn[perlin_idx] * 2.0 - 1, pn2[perlin_idx] * 2.0 - 1]
    break;
  case "image":
    if (pixel_buffer.length === 0) {
      console.log('too soon')
      ret = [0, 0]
    } else {
      var x = ((pixel_buffer[image_idx] - 127) / 127.0)
      var y = ((pixel_buffer[image_idx + 1] - 127) / 127.0)
      image_idx += 2
      window.imgpct = image_idx / pixel_buffer.length
        // console.log(image_idx/pixel_buffer.length)
      if (image_idx > pixel_buffer.length) {
        image_idx = 0
        console.log('here')
      }

      ret = [x, y]
    }

    break;

  default:
    ret = [Math.random() * 2.0 - 1, Math.random() * 2.0 - 1]
  }

  // console.log(ret)

  return ret;

}

function getBase64FromImageUrl(URL) {
  var img = new Image();
  img.src = URL;


  var params = get_params()
  if(params.imagename !== undefined){
    d3.selectAll('img').attr('src',URL)
  }

  img.onload = function () {


    var canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(this, 0, 0);


    var dataURL = canvas.toDataURL("image/png");
    var base64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "")

    var params = get_params()
    if(params.compressed !== undefined){
      console.log('using compressed')
      pixel_buffer = _base64ToArrayBuffer(base64); return;
    }

    //
    // console.log(base64)

    var d = ctx.getImageData(0,0,canvas.width,canvas.height)
    console.log(Object.keys(d))
    console.log(d.data.length)



    // pixel_buffer = d.data

    var byte_idx = 0
    var bytes = new Uint8Array(canvas.width*canvas.height*3)

    for(var i = 0; i < d.data.length; i+=4){
      bytes[byte_idx] = d.data[i]
      bytes[byte_idx+1] = d.data[i+1]
      bytes[byte_idx+2] = d.data[i+2]
      byte_idx += 3
    }

    pixel_buffer = bytes



    // return d.data
    // console.log(Object.keys(d))



  }
}

function _base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  // console.log(binary_string)
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}


function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function get_params() {

  var match,
    pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) {
      return decodeURIComponent(s.replace(pl, ' '))
    },
    query = window.location.search.substring(1)

  var urlParams = {};
  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2])
  }
  return urlParams
}
