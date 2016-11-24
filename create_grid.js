module.exports = function create_grid (x, y, random) {
  var a = []
  while(y > 0){
    var b = []
    for (var i = 0; i < x; i++) {
      if (typeof random === 'object') {
        b.push(random.value)
      } else if (random === true) {
        b.push(Math.floor(Math.random() * 256))
      } else {
        b.push(0)
      }
    }
    a.push(b)
    y--
  }
  return a
}
