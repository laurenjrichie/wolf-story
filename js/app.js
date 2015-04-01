$(document).ready(function() {
  titleScroll();
  hideEvents();
  playPreColMap();
  setupSlider();
  playPostcolMap();
  clickMapEvents();
});

function titleScroll() {
  var lastScrollTop = 0;
  $(window).on('scroll', function() {
    var scrollTop = $(this).scrollTop(),
        proportion = (scrollTop + 1) / 250;
    $('#main-title').css('opacity', (1-proportion));
    $('#main-subtitle').css('opacity', proportion);
  });
}

// THE MAP

var windowWidth = Math.max( $(window).width(), window.innerWidth) - 80;

var width = windowWidth,
    height = 620;

var projection = d3.geo.albers()
    .scale(windowWidth)
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
      .scale(windowWidth)
      .translate([600, 350]);

    svg.selectAll("circle")
      .data(rows)
      .enter().append("circle")
      .property('year', function(d, index) {
        // return index; // not right - this is index of row in relation to other rows; need column index
      })
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
        var circle = this,
            year = 2 + d3.select(this).property('index');
        // console.log(d3.select(this).headers); // how to get key/header/year of currently plotted point?
        console.log(d3.keys(this));
        return showTooltip(rows, year);
      })
      .on('mouseout',function(){
        tooltip.style("display", "none");
      })
  });

};

var playInterval = null,
    j = 1977;

function playPostcolMap() {
  $('#play-postcol-button').on('click', function() {
    var preColStuff = $(".precol-event-buttons, .1950s-content, .historical-content, .eradication-content, #precol-map-header");
    $(".postcol-event-buttons").removeClass("hide");
    $("#postcol-map-header").removeClass("hide");
    preColStuff.addClass("hide");
    if(playInterval != null) {
      stopPlaying();
    } else {
      startPlaying();
    }
    $('#slider-container').fadeIn('slow');
  });
}

function startPlaying() {
  playInterval = setInterval(function() {
    $('.glyphicon.glyphicon-pause').addClass('hide');
    $('.glyphicon.glyphicon-play').removeClass('hide');
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
  $('.glyphicon.glyphicon-play').addClass('hide');
  $('.glyphicon.glyphicon-pause').removeClass('hide');
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

var tooltip = d3.select(".map").append("div")
  .attr("id","tooltip");

function showTooltip(rows, year) {
  var regionName = "<p>"+ generateTooltipRegion(rows) +"</p>"
      // population = getPopulationData(rows.region, rows.)
  tooltip.html(regionName)
    .style({
      "display": "block",
      "top": (d3.event.pageY - 80) + "px",
      "left": (d3.event.pageX + 10) + "px"
  });
  // console.log(year);
  // console.log(d3.keys(rows));
}

getPopulationData();

function getPopulationData(region, year) {
  var data = d3.csv("data/population_data.csv", function(d) {
    return returnPopData(d);
  }, function(error, rows) {
    // console.log(rows);
    // 0 = nRockies, 1 = gLakes, 2 = pacNW, 3 = southwest

  });
}

function generateTooltipRegion(data) {
  var region = "";
  if(data.region === "nRockies") {
    region = "Northern Rockies"
  } else if(data.region === "gLakes") {
    region = "Great Lakes"
  } else if(data.region === "southwest") {
    region = "Southwest"
  } else if(data.region === "pacNW") {
    region = "Pacific Northwest"
  }
  return region;
}

function clickMapEvents() {
  $(".event-button").on('click', function() {
    var eventId = $(this).attr("data"),
        allEvents = $(this).parents(".key-events").siblings('.map').find(".map-event");
        eventContent = $(this).parents(".key-events").siblings('.map').find("[data=" + eventId + "]");
    allEvents.addClass('hide');
    eventContent.removeClass('hide');
  })
}

function hideEvents() {
  $(".close-event-content").on('click', function() {
    $(this).parent('.map-event').addClass("hide");
  });
}

function playPreColMap() {
  $("#play-precol-button").on('click', function() {
    $("#precol-map-header").removeClass("hide");
    var postColStuff = $(".1973-content, .1995-content, .today-content, #postcol-map-header, .postcol-event-buttons");
    postColStuff.addClass("hide");
    $(".precol-event-buttons").removeClass("hide");
    clickMapEvents();
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

function returnPopData(d) {
  return {
    region: d.region,
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
