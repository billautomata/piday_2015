var d3 = require('d3')
var mc = require('./monte_carlo.js')

window.onload = function() {

  var w = window.innerWidth
  var h = window.innerHeight
  var r = w*0.33
  var indicator_width = w*0.5
  var indicator_height = h*0.1

  console.log('started!')


  d3.select('body').style('background-color', 'white')

  var data = mc.generate_random_data(1)
  var ratio = mc.determine_ratio(data)

  console.log(Math.abs(Math.PI - (ratio * 4)))

  // mc.determine_ratio(mc.generate_random_data(10))

  var svg = d3.select('body').append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight)

  var scale_x = d3.scale.linear().domain([-1, 1]).range([0, w])
  var scale_y = d3.scale.linear().domain([-1, 1]).range([0, h])

  var g_indicator = svg.append('g').attr('transform', 'translate('+(w*0.5)+','+(h*0.5)+')')
  var rect_ratio = g_indicator.append('rect')
    .attr('x', indicator_width * 0.5 *-1)
    .attr('y', indicator_height * 0.5 *-1)
    .attr('width', indicator_width)
    .attr('height', indicator_height)
    .attr('fill', '#4b8834')

  var rect_box = g_indicator.append('rect')
    .attr('x', indicator_width * 0.5 *-1)
    .attr('y', indicator_height * 0.5 *-1)
    .attr('width', indicator_width)
    .attr('height', indicator_height)
    .attr('stroke','black')
    .attr('stroke-width', 5)
    .attr('stroke-opacity', 0.33)
    .attr('fill','none')

  var text_current_ratio = g_indicator.append('text')
    .attr('x',0)
    .attr('y',0)
    .attr('dy','0.33em')
    .style('fill','white')
    .style('font-size', indicator_height*0.5)
    .style('font-family','monospace')
    .style('font-weight', 'bold')
    .style('text-anchor','middle')



  var target_ratio_circle = svg.append('ellipse')
    .attr('cx', w * 0.5).attr('cy', h * 0.5)
    .attr('rx', w*0.5)
    .attr('ry', h*0.5)
    .attr('stroke', 'black').attr('stroke-width', 8)
    .attr('stroke-opacity', 0.2)
    .attr('fill', 'none')

  var text_desc = svg.append('text').text('sup')
    .attr('x', w*0.5)
    .attr('y', h*0.25)
    .attr('dy', '0.33em')
    .style('fill', 'black')
    .style('font-size', indicator_height*0.33)
    .style('font-family', 'Helvetica')
    .style('text-anchor', 'middle')

  tick()
  var count = 0
  var limit = 1000

  svg.on('click', function(){
    limit+=1000
    tick()
  })

  function tick() {
    count += 1
    if (count > limit) return;

    var pt = mc.new_random_point()

    // plot the point
    svg.append('circle')
      .attr('cx', scale_x(pt[0]))
      .attr('cy', scale_y(pt[1]))
      .attr('r', 10)
      .style('fill-opacity',0.1)
      .attr('fill', function() {
        if (mc.dist(pt) > 1) {
          return 'red'
        } else {
          return 'green'
        }
      })


    data.push(pt)

    var ratio = mc.determine_ratio(data)

    var msg = (ratio*100).toFixed(2) + '% of the points are in the circle'
    text_desc.text(msg)
      // console.log('ratio',ratio)

    // update the target meter
    var diff = Math.PI - (ratio * 4)

    // console.log('diff',diff)

    var new_radius = indicator_width - diff * indicator_width
      // var new_radius = r - (((Math.PI-ratio)/Math.PI)*r)

    text_current_ratio.text((ratio*4).toFixed(3))

    rect_ratio.attr('x', new_radius*0.5 * -1)
    rect_ratio.attr('width', new_radius)
    // ratio_circle.attr('r', new_radius)

    window.requestAnimationFrame(tick)
  }

}
