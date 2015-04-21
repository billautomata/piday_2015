var d3 = require('d3')
var mc = require('./mc.js')

window.onload = function() {


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

  d3.select('body').style('background-color', 'white')

  var data_x = mc.generate_random_data(1)
  var data_y = mc.generate_random_data(1)
  var ratio = mc.determine_ratio(data_x)

  var svg = d3.select('body')
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

  // var rect_ratio = g_indicator.append('rect')
  //   .attr('x', indicator_width * 0.5 *-1)
  //   .attr('y', indicator_height * 0.5 *-1)
  //   .attr('width', indicator_width)
  //   .attr('height', indicator_height)
  //   .attr('fill', '#4b8834')
  //
  // var rect_box = g_indicator.append('rect')
  //   .attr('x', indicator_width * 0.5 *-1)
  //   .attr('y', indicator_height * 0.5 *-1)
  //   .attr('width', indicator_width)
  //   .attr('height', indicator_height)
  //   .attr('stroke','black')
  //   .attr('stroke-width', 5)
  //   .attr('stroke-opacity', 0.33)
  //   .attr('fill','none')
  //
  // var text_current_ratio = g_indicator.append('text')
  //   .attr('x',0)
  //   .attr('y',0)
  //   .attr('dy','0.33em')
  //   .style('fill','white')
  //   .style('font-size', indicator_height*0.5)
  //   .style('font-family','monospace')
  //   .style('font-weight', 'bold')
  //   .style('text-anchor','middle')

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

  // var text_desc = g_indicator.append('text').text('sup')
  //   .attr('x', 0)
  //   .attr('y', -h*0.25)
  //   .attr('dy', '0.33em')
  //   .style('fill', 'black')
  //   .style('font-size', indicator_height*0.33)
  //   .style('font-family', 'Helvetica')
  //   .style('text-anchor', 'middle')

  tick()
  var count = 0
  var limit = 1000

  svg.on('click', function(){
    limit+=1000
    tick()
  })

  function tick() {

    var nn = 100
    while(nn--){

      count += 10

      if(count >= (svg_w*svg_h)){
        count = 0
      }

      var random_type = 'js'
      // random_type = 'normal'
      random_type = 'lognormal'
      // random_type = 'perlin'
      // random_type = 'simplex'
      random_type = 'image'

      var pt_x,pt_y

      var y_pos = Math.floor(count / 768)
      var x_pos = count - (y_pos * svg_w)

      // console.log(x_pos,y_pos)

      pt_x = mc.new_random_point(random_type, x_pos, y_pos)
      pt_y = mc.new_random_point(random_type, x_pos, y_pos)

      data_x.push(pt_x)
      data_y.push(pt_y)

      // plot the point
      g_pts.append('circle')
        .attr('cx', scale_x(pt_x[0]))
        .attr('cy', scale_y(pt_x[1]))
        .attr('r', 2)
        .style('fill-opacity',0.5)
        .attr('fill', function() {
          if (mc.dist(pt_x) > 1) {
            return 'red'
          } else {
            return 'green'
          }
        })

      var ratio_x = mc.determine_ratio(data_x)
      var ratio_y = mc.determine_ratio(data_y)
      ratio  = (ratio_x+ratio_y) * 0.5

      // update the target meter
      // var diff = Math.PI - (ratio * 4)

      // var new_radius = indicator_width - diff * indicator_width

      target_ratio_circle.attr('rx', w * (0.5*ratio_x/(Math.PI*0.25)))
      target_ratio_circle.attr('ry', h * (0.5*ratio_y/(Math.PI*0.25)))

    }
    window.requestAnimationFrame(tick)

  }

}
