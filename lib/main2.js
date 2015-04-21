var d3 = require('d3')
var mc = require('./mc.js')

window.imgpct = 0

window.onload = function() {


  var parms = mc.params()

  // create an ellipse whose width and height are functions of the accuracy
  // of the random number generator

  var svg_w = 768
  var svg_h = 768

  var w = 512
  var h = 512
  var r = w*0.33
  var indicator_width = w*0.5
  var indicator_height = h*0.1

  console.log('started!')

  // d3.select('div#container').style('background-color', 'white')

  var data_x = mc.generate_random_data('js',0,0)
  var data_y = mc.generate_random_data('js',0,0)
  var ratio = mc.determine_ratio(data_x)

  var svg = d3.select('div#container')
    .append('div')
      .style('width', svg_w)
      .style('height', svg_h)
      .style('margin','auto')
    .append('svg')
      .attr('width', svg_w)
      .attr('height', svg_h)

  require('./create_pattern')(svg)

  var scale_x = d3.scale.linear().domain([-1, 1]).range([-w*0.5, w*0.5])
  var scale_y = d3.scale.linear().domain([-1, 1]).range([-h*0.5, h*0.5])

  // indicator
  var g_indicator = svg.append('g').attr('transform', 'translate('+(svg_w*0.5)+','+(svg_h*0.5)+')')

  var g_pts = g_indicator.append('g')

  g_indicator.append('ellipse')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('rx', w*0.5)
    .attr('ry', h*0.5)
    .attr('fill', 'rgba(33,66,255,0.07)')

  var target_ratio_circle = g_indicator.append('ellipse')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('rx', w*0.5)
    .attr('ry', h*0.5)
    .attr('stroke', 'black').attr('stroke-width', 2)
    .attr('stroke-opacity', 0.8)
    .attr('fill', 'none')

  var particles = []
  var n_particles = 1024
  for(var i = 0; i < n_particles; i++){
    var p = g_indicator.append('circle')
      .attr('cx',0)
      .attr('cy',0)
      .attr('r',2)

    p.pos = [0,0]
    p.vel = [0,0]

    particles.push(p)
  }


  tick()
  var count = 0
  var limit = 1000

  svg.on('click', function(){
    limit+=1000
    tick()
  })

  function tick() {

    // if(count > limit){
    //   limit += 1000
    //   // count = 0
    //   d3.selectAll('circle').each(function(d,i){
    //     if(i%2===0){
    //       d3.select(this).remove()
    //       // console.log('.')
    //     }
    //   })
    // }


    count += 1

    if(count >= (svg_w*svg_h)){
      console.log('reset')
      count = 0
    }

    var random_type

    if(parms.method === undefined){
      random_type = 'js'
    } else {
      random_type = parms.method
    }

    var pt_x,pt_y

    var y_pos = Math.floor(count / 768)
    var x_pos = count - (y_pos * svg_w)


    particles.forEach(function(p){

      pt_x = mc.new_random_point(random_type, x_pos, y_pos)
      pt_y = mc.new_random_point(random_type, x_pos, y_pos)

      p.vel[0] += pt_x[0]
      p.vel[1] += pt_y[0]

      var damp = 0.94
      p.vel[0] *= damp
      p.vel[1] *= damp

      p.pos[0] += p.vel[0]
      p.pos[1] += p.vel[1]

      if(p.pos[0] < -svg_w*0.5){
        p.pos[0] = svg_w*0.5
      }
      if(p.pos[0] > svg_w*0.5){
        p.pos[0] = -svg_w*0.5
      }
      if(p.pos[1] < -svg_w*0.5){
        p.pos[1] = svg_w*0.5
      }
      if(p.pos[1] > svg_w*0.5){
        p.pos[1] = -svg_w*0.5
      }


      if(!isNaN(p.pos[0]) && !isNaN(p.pos[1])){
        p.attr('cx', p.pos[0])
        p.attr('cy', p.pos[1])
      }


    })


    data_x.push(pt_x)
    data_y.push(pt_y)

    // plot the point
    // g_pts.append('circle')
    //   .attr('cx', scale_x(pt_x[0]))
    //   .attr('cy', scale_y(pt_x[1]))
    //   .attr('r', 5)
    //   .style('fill-opacity',0.2)
    //   .attr('fill', function() {
    //     if (mc.dist(pt_x) > 1) {
    //       return 'red'
    //     } else {
    //       return 'green'
    //     }
    //   })

    var ratio_x = mc.determine_ratio(data_x)
    var ratio_y = mc.determine_ratio(data_y)
    ratio  = (ratio_x+ratio_y) * 0.5

    // console.log(ratio)

    var correctness = (ratio / (Math.PI*0.25)) *100

    d3.select('h1').html(correctness.toFixed(4) + '<br>' + window.imgpct.toFixed(2))

    // update the target meter
    // var diff = Math.PI - (ratio * 4)

    // var new_radius = indicator_width - diff * indicator_width

    target_ratio_circle.attr('rx', w * (0.5*ratio_x/(Math.PI*0.25)))
    target_ratio_circle.attr('ry', h * (0.5*ratio_y/(Math.PI*0.25)))


    window.requestAnimationFrame(tick)

  }

}
