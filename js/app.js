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


var width = 960,
    height = 600;

var path = d3.geo.path()
    .projection(null);

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("us.json", function(error, us) {
  if (error) return console.error(error);

  svg.append("path")
    .datum(topojson.feature(us, us.objects.nation))
    .attr("class", "land")
    .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    .attr("class", "border border--state")
    .attr("d", path);
});
