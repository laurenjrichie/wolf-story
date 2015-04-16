function App() {

}

App.prototype.loadData = function() {
  // queue()
  //   .defer(d3.json, 'data/us.json')
  //   .await(this.loaded.bind(this))
  
  d3.json('data/us.json', this.loaded.bind(this));
}

App.prototype.loaded = function(err, usJson) {
  this.usJson = usJson;
}