function App() {
}

App.prototype.loadData = function(done) {
  queue()
    .defer(d3.json, 'data/us.json')
    .await(function() {
      this.loaded.apply(arguments);
      if(done) { done(); }
    }.bind(this));
}

App.prototype.loaded = function(err, usJson) {
  this.usJson = usJson;
}

App.prototype.drawMap = function(width, height, container) {
  this.svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);
}