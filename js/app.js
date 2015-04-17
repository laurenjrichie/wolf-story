$(document).ready(function() {
  titleScroll();
  hideEvents();
  showPreColStuff();
  drawLegend(precolColors, precolLegend);
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

var windowWidth = Math.max( $(window).width(), window.innerWidth) - 80; //

var width = windowWidth, //
    height = windowWidth/2.048 //

var projection = d3.geo.albers()
    .scale(windowWidth)
    .translate([width/2, height/2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(1.5);

var svg = d3.select(".map").append("svg") //
    .attr("width", width) //
    .attr("height", height); //

var slider;

var postcolColors = ['#FFFFFF', '#B2273A', '#796E24', '#337ab7', '#432F21'],
    postcolLegend = ["Wolf management regions:", "Northern Rockies", "Great Lakes", "Pacific Northwest", "Southwest"],
    precolColors = ['#FFFFFF', '#796E24'],
    precolLegend = ["Pre-European colonization population:", "est. 400,000"];

queue()
    .defer(d3.json, "data/us.json")
    .defer(d3.csv, "data/output.csv")
    .defer(d3.csv, "data/population_data.csv")
    .defer(d3.csv, "data/final-precol.csv")
    .await(ready);

function ready(error, us, radii, pop_data, precol) {
  window.radii = radii;
  window.pop_data = pop_data;

  svg.append("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);

  appendPrecolData(precol);
  chooseMap(radii, pop_data, precol);
}

var playPostcolInterval,
    playPrecolInterval,
    j = 1977;
var playingPostCol = false;

function chooseMap(radii, pop_data, precol) {
  $('#play-precol-button').on('click', function() {
    clearInterval(playPrecolInterval);
    clearInterval(playPostcolInterval);
    appendPrecolData(precol);
    animatePrecolMap();
  });
  $('#play-postcol-button').on('click', function() {
    j = 1977;
    drawLegend(postcolColors, postcolLegend);
    showPostcolStuff();
    clearInterval(playPrecolInterval);
    clearInterval(playPostcolInterval);
    appendPostcolData(radii, pop_data);
    animatePostcolMap(pop_data);
  });
}

function appendPrecolData(precol) {
  svg.selectAll("circle").remove();
  svg.selectAll("circle")
    .data(precol)
    .enter().append("circle")
    .attr("stroke", "white")
    .attr("fill", "rgba(121,110,36,0.6)")
    .attr("r", function(rows) {
      return Math.floor(Math.random() * (14 - 2) + 2);
    })
    .attr('class', function(rows) {
      return 'precol';
    })
    .attr("transform", function(rows) {
      return "translate(" + projection([rows.ycoord,rows.xcoord]) + ")";
    })
}

function animatePrecolMap() {
  var k = 1;
  playPrecolInterval = setInterval(function() {
    if (k === 11) {
      clearInterval(playPrecolInterval);
      k = 1;
    }
    svg.selectAll("circle")
      .filter(function(d) {
        if (d.frame == k) {
          return d.frame;
        }
      })
      .remove();
    k ++;
  }, 1000);
}

function appendPostcolData(radii, pop_data) {
  var year = "y" + j;
  svg.selectAll('circle.precol').remove();
  svg.selectAll('circle')
    .data(radii)
    .enter().append("circle")
    .attr('data-pop', function(rows) {
      return returnRegionPop(rows, pop_data, year);
    })
    .attr("r", function(rows) {
      return rows[year];
    })
    .attr("stroke", "white")
    .attr('class', function(rows) {
      return "postcol " + rows.region;
    })
    .attr("transform", function(rows) {
      return "translate(" + projection([rows.ycoord,rows.xcoord]) + ")";
    })
    .on('mousemove', function(rows) {
      var elem = $(this);
      return showTooltip(rows, elem, j);
    })
    .on('mouseout',function(){
      tooltip.style("display", "none");
    });
  setupSlider(pop_data);
};

function returnRegionPop(rows, pop_data, year) {
  var pop_data_row;
  switch(rows.region) {
    case 'nRockies':
      pop_data_row = 0;
      break;
    case 'gLakes':
      pop_data_row = 1;
      break;
    case 'pacNW':
      pop_data_row = 2;
      break;
    case 'southwest':
      pop_data_row = 3;
      break;
  }
  return pop_data[pop_data_row][year];
}

function animatePostcolMap(pop_data) {
  playPostcolInterval = setInterval(function() {
    if (j == 2015) {
      j = 1977;
      clearInterval(playPostcolInterval);
      return;
    }
    animateSlider(pop_data);
    year = "y" + j++;
    svg.selectAll('circle')
      .transition()
      .attr('data-pop', function(rows, index) {
        return returnRegionPop(rows, pop_data, year);
      })
      .attr("r", function(rows) {
        return rows[year];
      })
  }, 300);
}

function showPostcolStuff() {
  var preColStuff = $(".precol-event-buttons, .1950s-content, .historical-content, .eradication-content");
  $(".postcol-event-buttons").removeClass("hide");
  preColStuff.addClass("hide");
  $('#slider-container').fadeIn('slow');
  svg.selectAll('.legend').remove();
  drawLegend(postcolColors, postcolLegend);
}

// function stopPlaying() {
//   clearInterval(playInterval);
//   playInterval = null;
//   $('.glyphicon.glyphicon-play').addClass('hide');
//   $('.glyphicon.glyphicon-pause').removeClass('hide');
// }

function setupSlider(pop_data) {
  $('#slider-div').empty();
  slider = d3.slider().axis(true).min(1977).max(2014).step(2).value(j);
  slider.on("slide", function(event, value){
    year = "y" + value;
    svg.selectAll("circle")
      .attr("r", function(rows) {
        return rows[year];
      })
      .attr('data-pop', function(rows, index) {
        return returnRegionPop(rows, pop_data, year);
      })
      .on('mousemove', function(rows) {
        var elem = $(this);
        return showTooltip(rows, elem, year);
      })
      .on('mouseout', function(){
        tooltip.style("display", "none");
      });
    });
  d3.select('#slider-div').call(slider);
}

function animateSlider(pop_data) {
  $('#slider-div').empty();
  slider = d3.slider().axis(true).min(1977).max(2014).step(2).value(j);
  d3.select('#slider-div').call(slider);
  setupSlider(pop_data);
}

var tooltip = d3.select(".map").append("div")
  .attr("id","tooltip");

function showTooltip(rows, elem, year) {
  var regionName = "<p><strong>"+ generateTooltipRegion(rows) +"</strong></p>";
  var tooltipYear;
  var yearString = year.toString();
  if (yearString.substr(0, 1) === "y") {
    tooltipYear = yearString.substr(1, 5);
  } else { tooltipYear = yearString }
  var tooltipYearText = "<p>" + "Year: " + tooltipYear + "</p>";
  var populationInt = parseInt(elem.attr('data-pop'));
  var population = "<p>" + "Population: " + populationInt + "</p>";

  tooltip.html(regionName + tooltipYearText + population)
    .style({
      "display": "block",
      "top": (d3.event.pageY - 80) + "px",
      "left": (d3.event.pageX + 10) + "px",
      "font-size": "14px"
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

function showPreColStuff() {
  $("#play-precol-button").on('click', function() {
    var postColStuff = $(".1973-content, .1995-content, .today-content, .postcol-event-buttons");
    postColStuff.addClass("hide");
    $(".precol-event-buttons").removeClass("hide");
    clickMapEvents();
    svg.selectAll('.legend').remove();
    $('#slider-container').hide();
    drawLegend(precolColors, precolLegend);
  });
}

function drawLegend(colorArray, dataArray) {
  var legendRectSize = 18;
  var legendSpacing = 4;
  var color = d3.scale.ordinal()
      .range(colorArray);

  var legend = svg.selectAll('.legend')
    .data(dataArray)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * color.domain().length / 2;
      var horz = 2 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });

  svg.select('.legend')
    .attr('transform', function(d, i) {
      var horz = legendRectSize;
      return 'translate(' + horz + ',' + 0 + ')';
    })
    .style('font-weight', 'bold')
    .style('font-size', '14px');
}
