$(document).ready(function() {
  titleScroll();
});

function titleScroll() {
  var lastScrollTop = 0;
  $(window).on('scroll', function() {
    var scrollTop = $(this).scrollTop();
    if (scrollTop > lastScrollTop) {
      changeOpacity("decrease", $('#main-title'));
      changeOpacity("increase", $('#main-subtitle'));
    } else if (scrollTop < lastScrollTop) {
      changeOpacity("increase", $('#main-title'))
      changeOpacity("decrease", $('#main-subtitle'));
    }
    lastScrollTop = scrollTop;

  });
}

function changeOpacity(direction, element) {
  var currentOpacity = parseFloat(element.css('opacity'));
  if (direction == "decrease") {
    var newOpacity = currentOpacity - 0.03;
  } else if (direction == "increase") {
    var newOpacity = currentOpacity + 0.03;
  }
  element.css('opacity', newOpacity)
}

// THE MAP

var width = 960,
    height = 500;

var projection = d3.geo.albers();

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(1.5);

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "data/us.json")
    .defer(d3.csv, "data/wolf-data.csv")
    .await(ready);

function ready(error, us, populations) {
  svg.append("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);
      
  appendData(svg);
}

function appendData(svg) {
  var data = d3.csv("data/wolf-data.csv", function(d) {
    return {
      name: d.name,
      xcoord: d.xcoord,
      ycoord: d.ycoord,
    };
  }, function(error, rows) {    
    console.log(rows);
    var projection2 = d3.geo.albersUsa();
    svg.selectAll("circle")
      .data(rows)
      .enter().append("circle")
      .attr("r",10)
      .attr("transform", function(rows) {
        return "translate(" + projection2([rows.ycoord,rows.xcoord]) + ")";
      });    
  });
};
