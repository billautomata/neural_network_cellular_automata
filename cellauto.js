var d3 = require('d3')
var create_grid = require('./create_grid.js')
var copy_grid = require('./copy_grid.js')

module.exports = function c(net, opts, set){

  var w = window.grid_x
  var h = window.grid_y
  var box_size = 10

  var svg = d3.select('div#grid').append('svg')
    .attr('viewBox', [0,0,w*box_size,h*box_size].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .attr('width', '100%')
    .style('background-color', 'black')

  var source = create_grid(w,h,0)
  var rects = create_grid(w,h,{rect:{}})


  var scale_x = d3.scaleLinear().domain([0,w]).range([0,w*box_size])
  var scale_y = d3.scaleLinear().domain([0,h]).range([0,h*box_size])

  source.forEach(function(row,col_idx){
    row.forEach(function(v,row_idx){
      var color = Math.floor(v*256)
      rects[col_idx][row_idx] = svg.append('rect')
        .attr('x', scale_x(row_idx))
        .attr('y', scale_y(col_idx))
        .attr('width', box_size)
        .attr('height', box_size)
        .attr('fill', d3.rgb(color,color,color))
        .attr('stroke', 'none')
    })
  })

  tick()
  var n_ticks = 0

  var train_results

  function tick(){
    if(window.done){
      return
    }
    // console.log('tick')

    train_results = net.trainer.train(set, opts)

    source.forEach(function(row,col_idx){
      row.forEach(function(v,row_idx){
        source[col_idx][row_idx] = 0
      })
    })

    // source[0][0] = 1
    source[0][Math.floor(w/2)] = 1
    source[0][source[0].length-1] = 1

    // load the inputs row
    source.forEach(function(row,col_idx){
      if(col_idx === source.length-1){
        return
      }
      var next_row = source[col_idx+1]  // target array to copy result
      var input_values = []   // sent to net.activate
      var output_values = []  // got from net.activate
      row.forEach(function(v,row_idx){
        // get 3 input values
        input_values = [ 0, v, 0 ]

        // don't load the edges
        if(row_idx !== 0){
          input_values[0] = row[row_idx-1]
        }
        if(row_idx !== row.length-1){
          input_values[2] = row[row_idx+1]
        }

        output_values = net.activate(input_values)
        next_row[row_idx] = output_values[0]
      })
    })

    source.forEach(function(row,col_idx){
      row.forEach(function(v,row_idx){
        var color = Math.floor(v*256)
        rects[col_idx][row_idx].attr('fill', d3.rgb(color,color,color))
      })
    })

    // if(window.stop === undefined){
      // console.log('tock')
      if(train_results.error > window.error_target){
        // console.log('tick')
        d3.select('div#current_error').text(train_results.error)
        window.requestAnimationFrame(tick)
      } else {
        if(window.done === false){
          window.done = true
          d3.select('div#done').html('training complete.')
        }
      }

    // }

  }


}
