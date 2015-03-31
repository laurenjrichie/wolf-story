$(document).ready(function() {
  titleScroll();
  showPostColEvents();
  hidePostColEvents();
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

var windowWidth = Math.max( $(window).width(), window.innerWidth) - 80;
console.log(windowWidth);

var width = windowWidth,
    height = 700;

var projection = d3.geo.albers()
    .scale(windowWidth)
    // .translate([720, 375]);
    .translate([600, 350]);

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
    return returnRadiusData(d);
  }, function(error, rows) {
    var year = "y1977";

    var projection2 = d3.geo.albersUsa()
      .scale(width)
      // .translate([720, 375]);
      .translate([600, 350]);

    svg.selectAll("circle")
      .data(rows)
      .enter().append("circle")
      .attr("stroke", "white")
      .attr("r", function(rows) {
        return rows[year];
      })
      .attr('class', function(rows) {
        return rows.region;
      })
      .attr("transform", function(rows) {
        return "translate(" + projection2([rows.ycoord,rows.xcoord]) + ")";
      })
      .on('mousemove', function(rows) {
        return showTooltip(rows);
      })
      .on('mouseout',function(){
        tooltip.style("display", "none");
      })
  });

};

var playInterval = null,
    j = 1977;

setupSlider();
playPostcolMap();

function playPostcolMap() {
  $('#play-postcol-button').on('click', function() {
    $('#precol-map-header').hide();
    $('#postcol-map-header').show();
    if(playInterval != null) {
      stopPlaying();
    } else {
      startPlaying();
    }
    $('#slider-container').show();
  });
}

function startPlaying() {
  playInterval = setInterval(function() {
    if (j == 2015) {
      j = 1977;
      stopPlaying();
    }

    year = "y" + j++;
    svg.selectAll("circle")
      .attr("r", function(rows) { return rows[year]; })
      .attr('class', function(rows) {
        return rows.region;
      });
  }, 300);
}

function stopPlaying() {
  clearInterval(playInterval);
  playInterval = null;
}

function setupSlider() {
  var slider = d3.slider().axis(true).min(1977).max(2014).step(2)
    .on("slide", function(event, value){
     year = "y" + value;
     svg.selectAll("circle")
       .attr("r", function(rows) { return rows[year];})
       .attr('class', function(rows) {
         return rows.region;
       });
    });
 d3.select('#slider-div').call(slider);
 $('#slider-container').hide();
}

function showTooltip(rows) {
  tooltip.html("<p>"+ generateRegionTooltip(rows) +"</p>")
    .style({
      "display": "block",
      "top": (d3.event.pageY - 80) + "px",
      "left": (d3.event.pageX + 10) + "px"
  });
}

var tooltip = d3.select(".map").append("div")
  .attr("id","tooltip");

function bubbleTooltip(data) {
  var html = "<p>Hello</p>";
  return html;
}

function generateRegionTooltip(data) {
  var region = "";
  if(data.region === "nRockies") {
    region = "Northern Rockies"
  }
  else if(data.region === "gLakes") {
    region = "Great Lakes"
  }
  else if(data.region === "southwest") {
    region = "Southwest"
  }
  else if(data.region === "pacNW") {
    region = "Pacific Northwest"
  }

  return region;
}

function showPostColEvents() {
  $("#1976-event").hover(function() {
    $(".1976-content").removeClass("hide");
    $(".1995-content").addClass("hide");
    $(".today-content").addClass("hide");
  });
  $("#1995-event").hover(function() {
    $(".1995-content").removeClass("hide");
    $(".1976-content").addClass("hide");
    $(".today-content").addClass("hide");
  });
  $("#today-event").hover(function() {
    $(".today-content").removeClass("hide");
    $(".1995-content").addClass("hide");
    $(".1976-content").addClass("hide");
  });
}

function hidePostColEvents() {
  $(".close-event-content").on('click', function() {
    $(this).parent('.map-event').hide();
  });
}

function returnRadiusData(d) {
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
  }
}
