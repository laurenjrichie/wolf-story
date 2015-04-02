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

var windowWidth = Math.max( $(window).width(), window.innerWidth);

// console.log(windowWidth);

var width = windowWidth,
    height = 650; // math relationship.

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
    .defer(d3.csv, "data/population_data.csv")
    .await(ready);

function ready(error, us, radii, pop_data) {
  svg.append("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);

  appendData(svg, radii, pop_data);
}

function appendData(svg, radii, pop_data) {
  var year = "y1977";

  radii.forEach(function(datum) {
    switch(datum.region) {
      case 'nRockies':
        var pop_data_row = 0;
        break;
      case 'gLakes':
        var pop_data_row = 1;
        break;
      case 'pacNW':
        var pop_data_row = 2;
        break;
      case 'southwest':
        var pop_data_row = 3;
        break;
    }

    for(k in datum) {
      if(k == 'region' || k == 'xcoord' || k == 'ycoord') {
        continue;
      }

      var pop = pop_data[pop_data_row][k];
      datum[k] = [datum[k], pop];
    };
  });

  var projection2 = d3.geo.albersUsa()
    .scale(windowWidth)
    .translate([600, 350]);

  svg.selectAll("circle")
    .data(radii)
    .enter().append("circle")
    .attr('data-pop', function(row, index) {
      switch(row.region) {
        case 'nRockies':
          var pop_data_row = 0;
          break;
        case 'gLakes':
          var pop_data_row = 1;
          break;
        case 'pacNW':
          var pop_data_row = 2;
          break;
        case 'southwest':
          var pop_data_row = 3;
          break;
      }
      console.log(pop_data[pop_data_row][year]);
      return pop_data[pop_data_row][year];
    })
    .attr("stroke", "white")
    .attr("r", function(rows) {
      return rows[year][0];
    })
    .attr('class', function(rows) {
      return rows.region;
    })
    .attr("transform", function(rows) {
      return "translate(" + projection2([rows.ycoord,rows.xcoord]) + ")";
    })
    .on('mousemove', function(rows) {
      return showTooltip(rows, this);
    })
    .on('mouseout',function(){
      tooltip.style("display", "none");
    })

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
      .attr("r", function(rows) { return rows[year][0]; })
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

function setupSlider() { // fix this with pop data
  var slider = d3.slider().axis(true).min(1977).max(2014).step(2)
    .on("slide", function(event, value){
     year = "y" + value;
     svg.selectAll("circle")
       .attr("r", function(rows) { return rows[year][0];})
       .attr('class', function(rows) {
         return rows.region;
       });
    });
 d3.select('#slider-div').call(slider);
 $('#slider-container').hide();
}

var tooltip = d3.select(".map").append("div")
  .attr("id","tooltip");

function showTooltip(rows, elem) {
  var regionName = "<p>"+ generateTooltipRegion(rows) +"</p>";
  var year = "<p>" + j + "</p>";
  var populationInt = parseInt(rows["y" + j][1]);
  var population = "<p>" + populationInt + "</p>"; // slider not accessing this.

  tooltip.html(regionName + year + population)
    .style({
      "display": "block",
      "top": (d3.event.pageY - 80) + "px",
      "left": (d3.event.pageX + 10) + "px"
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
