var d3 = require('d3')

module.exports = function info(){
  var p = d3.select('div#info')

  p.append('h2').html('What is this?')
  p.append('p').html('This is a program that trains a neural network to \
    approximate the output of an elementary cellular automata.')

  p.append('p').html('You set the rule number, hidden layer size, and target error rate.')
  p.append('p').html('You can also set the size of the grid being evaluated.')

  p.append('h2').html('Why am I here?')
  p.append('p').html('While the network trains and attemps to mimic the output of the \
   elementary cellular automata, the patterns look cool.  It is fun to watch an AI \
   do it\'s thing.')

  p.append('h2').html('Sharing!')
  p.append('p').html('If you find a good configuration, the path name is modified for your settings, you can share it with the link.')

  p.append('h2').html('Credit')
  p.append('p').html('This is made with synaptic and d3.')


}
