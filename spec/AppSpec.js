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
      app.drawMap();
      
      var svg = $('body svg');
      expect(svg).toExist();
      done();
    });
  });
});
