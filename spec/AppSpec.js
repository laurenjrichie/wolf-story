describe('App', function() {
  it('loads the json for the US map', function() {
    var app = new App();
    
    var jsonSpy = spyOn(d3, 'json');
    app.loadData();
    
    var firstCall = jsonSpy.calls.first();
    
    expect(firstCall.args[0]).toEqual('data/us.json');
    var callback = firstCall.args[1];
    callback(null, { some: 'object'});

    expect(app.usJson).toEqual({ some: 'object' });
  });
  
  it('shows a us map', function(done) {
    var app = new App();

    app.loadData(function() {
      var width = '100';
      var height = '100';
      var container = 'body'
      app.drawMap(width, height, container);
    
      var svg = $('body svg');
      expect(svg).toExist();
      expect(svg.attr('width')).toEqual('100');
      expect(svg.attr('height')).toEqual('100');
      
      done();
    });
  });
  
  it('appends the map to the correct div', function(done) {
    var app = new App();

    app.loadData(function() {  
      var width = '200';
      var height = '200';
      var container = '.map';
      
      app.drawMap(width, height, container);
      var map = $('.map svg');
      expect(map).toExist();
      expect(map.attr('width')).toEqual('200');
      expect(map.attr('height')).toEqual('200');
      
      done();
    });
  });
  
});
