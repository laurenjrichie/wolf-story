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

var width = 1400,
    height = 800;

var projection = d3.geo.albers()
    .scale(1500)
    .translate([720, 375]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(1.5);

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "data/us.json")
    .defer(d3.csv, "data/output.csv")
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
  var data = d3.csv("data/output.csv", function(d) {
    return {
      region: d.region,
      xcoord: d.xcoord,
      ycoord: d.ycoord,
      y1977: d.y1977,
      y1978: d.y1978,
      y1979: d.y1979,
      y1980: d.y1980,
      y1981: d.y1981,
      y1982: d.y1982,
      y1983: d.y1983,
      y1984: d.y1984,
      y1985: d.y1985,
      y1986: d.y1986,
      y1987: d.y1987,
      y1988: d.y1988,
      y1989: d.y1989,
      y1990: d.y1990,
      y1991: d.y1991,
      y1992: d.y1992,
      y1993: d.y1993,
      y1994: d.y1994,
      y1995: d.y1995,
      y1996: d.y1996,
      y1997: d.y1997,
      y1998: d.y1998,
      y1999: d.y1999,
      y2000: d.y2000,
      y2001: d.y2001,
      y2002: d.y2002,
      y2003: d.y2003,
      y2004: d.y2004,
      y2005: d.y2005,
      y2006: d.y2006,
      y2007: d.y2007,
      y2008: d.y2008,
      y2009: d.y2009,
      y2010: d.y2010,
      y2011: d.y2011,
      y2012: d.y2012,
      y2013: d.y2013,
      y2014: d.y2014,
    };
  }, function(error, rows) {
    var year = "y1977";
    var j = 1977;

    var projection2 = d3.geo.albersUsa()
      .scale(1500)
      .translate([720, 375]);

    svg.selectAll("circle")
      .data(rows)
      .enter().append("circle")
      .attr("r", function(rows) {
        return rows[year];
      })
      .attr('class', function(rows) {
        return rows.region;
      })
      .attr("transform", function(rows) {
        return "translate(" + projection2([rows.ycoord,rows.xcoord]) + ")";
      });

      var playMap = null;

      $('#play-postcol-button').on('click', function(rows) {
        if(playMap !== null) {
          clearInterval(playMap);
          playMap = null;
        }

        $('#slider-div').empty();
        var slider = d3.slider().axis(true).min(1977).max(2014).step(2)

       .on("slide",function(event,value){
         year = "y" + value;
         svg.selectAll("circle")
           .attr("r", function(rows) { return rows[year];})
           .attr('class', function(rows) {
             return rows.region;
           });
       });

       d3.select('#slider-div').call(slider);

        playMap = setInterval(function() {
          if (j == 2015) {
            j = 1977;
            clearInterval(playMap);
            playMap = null;
            return;
          }

          year = "y" + j++;
          svg.selectAll("circle")
            .attr("r", function(rows) { return rows[year]; })
            .attr('class', function(rows) {
              return rows.region;
            });
        }, 200);
      });
  });
};
