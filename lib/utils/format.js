function format(codes) {
  return codes.replace(/!/g, '! ').replace(/(\.{3})/, '... ')
}


module.exports = format