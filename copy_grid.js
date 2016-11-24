module.exports = function copy_grid (a, b) {
  a.forEach(function (row, row_idx) {
    row.forEach(function (element, element_idx) {
      b[row_idx][element_idx] = element
    })
  })
}
