function getWidth() {
  return Math.max( $(window).width(), window.innerWidth) - 80;
}

function getHeight() {
  return getWidth()/2.048;
}

function PopMap(width, height, container) {
  this.width = width;
  this.height = height;
  this.container = container;
}

PopMap.prototype.setupProjection = function() {
  this.projection = d3
    .geo.albers()
    .scale(this.width)
    .translate([getWidth()/2, getHeight()/2]);
}

PopMap.prototype.setupPath = function() {
  this.path = d3
    .geo.path()
    .projection(this.projection)
    .pointRadius(1.5);
}

PopMap.prototype.loadData = function(done) {
  queue()
    .defer(d3.json, 'data/us.json')
    .await(function() {
      this.loaded.apply(this, arguments);
      if(done) { done(); }
    }.bind(this));
}

PopMap.prototype.loaded = function(err, usJson) {
  this.usJson = usJson;
  this.drawMap();
}

PopMap.prototype.drawMap = function() {
  this.svg = d3
    .select(this.container)
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height);

  this.setupProjection();
  this.setupPath();
  
  this.svg
    .append("path")
    .attr("class", "land")
    .datum(topojson.feature(this.usJson, this.usJson.objects.land))
    .attr("d", this.path);
}

// hand roll part of the data, let code guide how to structure it. 
// determine ideal struture then produce ruby code that takes csv and creates json in that structure
// continue writing jasmine tests until we know what the data should look like
// this is working outside in