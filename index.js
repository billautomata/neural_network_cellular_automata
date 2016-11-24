var synaptic = require('synaptic')
var pad = require('./pad.js')
var d3 = require('d3')
var grid = require('./cellauto.js')

console.log(Object.keys(synaptic).join('\t'))

// rule number
// hidden layer size
// grid size [x,y]
// error target
// learning rate



window.rule_number = 22
window.hidden_layer_size = 12
window.error_target = 0.005
window.learning_rate = 0.1
window.done = false
window.grid_x = 32
window.grid_y = 32

if(window.location.hash.length !== 0){
  var path = window.location.hash.split('/')
  console.log('path', path)
  window.rule_number = Number(path[1])
  window.hidden_layer_size = Number(path[2])
  window.error_target = Number(path[3])
  window.learning_rate = Number(path[4])
  window.grid_x = Number(path[5])
  window.grid_y = Number(path[6])
}

var div_grid = d3.select('body').append('div').attr('id', 'grid')
var div_controls = d3.select('body').append('div')
var div_info = d3.select('body').append('div').attr('id', 'info')

var input_rule = div_controls.append('input').attr('type', 'text')
input_rule.property('value', rule_number)

input_rule.on('keydown', function(){
  console.log(d3.event)
  window.rule_number = Number(d3.select(this).property('value'))
  if(d3.event.key === 'Enter'){
    set_hash_and_reload()
  }
})
div_controls.append('span').html(' rule number')
div_controls.append('br')

var div_done = div_controls.append('div').html('').attr('id', 'done')

var input_hidden_layer_size = div_controls.append('input').attr('type', 'text')
input_hidden_layer_size.property('value', window.hidden_layer_size)
input_hidden_layer_size.on('keydown', function(){
  console.log(d3.event)
  window.hidden_layer_size = Number(d3.select(this).property('value'))
  if(d3.event.key === 'Enter'){
    set_hash_and_reload()
  }
})

div_controls.append('span').html(' hidden layer size (brain size)')
div_controls.append('br')

var input_learning_rate = div_controls.append('input').attr('type', 'text')
input_learning_rate.property('value', window.learning_rate)
input_learning_rate.on('keydown', function(){
  console.log(d3.event)
  window.window.learning_rate = Number(d3.select(this).property('value'))
  if(d3.event.key === 'Enter'){
    set_hash_and_reload()
  }
})

div_controls.append('span').html(' training rate (very small values take longer, higher values may not converge)')
div_controls.append('br')


var div_error = div_controls.append('div')

var input_error_rate = div_error.append('input').attr('type', 'text')
  .property('value', window.error_target)

input_error_rate.on('keydown', function(){
    console.log(d3.event)
    window.error_target = Number(d3.select(this).property('value'))
    if(d3.event.key === 'Enter'){
      set_hash_and_reload()
    }
  })

div_error.append('span').html(' target error rate (stop training at this value)')

var div_current_error = div_error.append('div').attr('id', 'current_error')

var input_grid_x = div_controls.append('input').attr('type', 'text')
  .property('value', window.grid_x)

input_grid_x.on('keydown', function(){
    console.log(d3.event)
    window.grid_x = Number(d3.select(this).property('value'))
    if(d3.event.key === 'Enter'){
      set_hash_and_reload()
    }
  })

div_controls.append('span').html(' grid x size')
div_controls.append('br')

var input_grid_y = div_controls.append('input').attr('type', 'text')
  .property('value', window.grid_y)

input_grid_y.on('keydown', function(){
    console.log(d3.event)
    window.grid_y = Number(d3.select(this).property('value'))
    if(d3.event.key === 'Enter'){
      set_hash_and_reload()
    }
  })

div_controls.append('span').html(' grid y size')

/////////////////////////////////////
// net
var net = new synaptic.Architect.Perceptron(3, window.hidden_layer_size, 1);

var training_set = []

var rule = window.rule_number
console.log(pad(rule.toString(2),8))

var rulestring = pad(rule.toString(2),8).split('')

rulestring.forEach(function(output,idx){
  var input_string = pad((7-idx).toString(2),3).split('')
  console.log(input_string.map(function(o){ return Number(o) }), Number(output))
  training_set.push({
    input: input_string.map(function(o){ return Number(o) }),
    output: [ Number(output) ]
  })
})

var trainingOptions = {
  rate: window.learning_rate,
  iterations: 10,
  error: .05,
}

net.trainer.train(training_set, trainingOptions);

training_set.forEach(function(o){
  console.log(o.input, net.activate(o.input))
})

grid(net, trainingOptions, training_set)

require('./info.js')()

function set_hash_and_reload(){
  var path = [
    window.rule_number,
    window.hidden_layer_size,
    window.error_target,
    window.learning_rate,
    window.grid_x,
    window.grid_y
  ].join('/')
  console.log(path)
  window.location.hash = '/' + path
  window.location.reload()
}
