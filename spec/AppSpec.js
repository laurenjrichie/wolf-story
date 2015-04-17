describe('PopMap', function() {
  it('loads the json for the US map', function() {
    var width = '100';
    var height = '100';
    var popMap = new PopMap(width, height, 'body');
    
    var jsonSpy = spyOn(d3, 'json');
    popMap.loadData();
    
    var firstCall = jsonSpy.calls.first();
    
    expect(firstCall.args[0]).toEqual('data/us.json');
    var callback = firstCall.args[1];
    callback(null, { objects: { land: { some: 'topo stuff' }}});

    expect(popMap.usJson).toEqual({ objects: { land: { some: 'topo stuff' }}});
  });
  
  it('shows a us map', function(done) {
    var width = '100';
    var height = '100';
    var popMap = new PopMap(width, height, 'body');
    
    popMap.loadData(function() {
      var container = 'body';
      popMap.drawMap(container);
    
      var svg = $('body svg');
      expect(svg).toExist();
      expect(svg.attr('width')).toEqual('100');
      expect(svg.attr('height')).toEqual('100');
      done();
    });
  });
  
  it('appends the map to the correct div', function(done) {
    var width = '100';
    var height = '100';
    var popMap = new PopMap(width, height, '.map');
    
    popMap.loadData(function() {  
      var map = $('.map svg');
      expect(map).toExist();
      expect(map.attr('width')).toEqual('100');
      expect(map.attr('height')).toEqual('100');
      
      done();
    });
  });
  
  it('appends a path element to the map', function(done) {
    var width = '100';
    var height = '100';
    var popMap = new PopMap(width, height, '.map');
    
    popMap.loadData(function() {
      var path = $('.map path.land');
      expect(path).toExist();
      expect(path.attr('d')).not.toBe(undefined);
      done();
    });
  });  
});
