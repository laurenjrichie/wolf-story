function getWidth() {
  return Math.max( $(window).width(), window.innerWidth) - 80;
}

function getHeight() {
  return getWidth()/2.048;
}

function PopMap(width, height) {
  this.width = width;
  this.height = height;
}

PopMap.prototype.loadData = function(done) {
  queue()
    .defer(d3.json, 'data/us.json')
    .await(function() {
      this.loaded.apply(arguments);
      if(done) { done(); }
    }.bind(this));
}

PopMap.prototype.loaded = function(err, usJson) {
  this.usJson = usJson;
}

PopMap.prototype.drawMap = function(width, height, container) {
  this.svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);
}