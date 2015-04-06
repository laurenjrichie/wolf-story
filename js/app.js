$(document).ready(function() {
  titleScroll();
  hideEvents();
  showPreColStuff();
  setupSlider();
  // playPostcolMap();
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
    height = windowWidth/2.048

var projection = d3.geo.albers()
    .scale(windowWidth)
    .translate([width/2, height/2]);

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

  // appendPostcolData(svg, radii, pop_data);
  appendPrecolData(svg, precol);
  chooseMap(svg, radii, pop_data, precol);
}

var playInterval;
var playingPostCol = false;

function chooseMap(svg, radii, pop_data, precol) {
  $('#play-postcol-button').on('click', function() {
    // clearInterval(playInterval);
    // playInterval = null;
    console.log("inside click event");

    if(playingPostCol === false) {
      appendPostcolData(svg, radii, pop_data);
      playingPostCol = true;
    }
  });
  $('#play-precol-button').on('click', function() {
    clearInterval(playInterval);
    svg.selectAll("circle")
      .remove()
    appendPrecolData(svg, precol);
    animatePrecolMap(svg);
  });
}

function appendPrecolData(svg, precol) {
  var projection2 = d3.geo.albersUsa()
    .scale(windowWidth)
    .translate([width/2, height/2]);

  svg.selectAll("circle") // make so clicking while animation is present doesn't overlay more circles
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
      return "translate(" + projection2([rows.ycoord,rows.xcoord]) + ")";
    })
    // .on('mousemove', function(rows) { // maybe?
    //   return showTooltip(rows, this);
    // })
    // .on('mouseout',function(){
    //   tooltip.style("display", "none");
    // })

}

function animatePrecolMap(svg) {
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

var  j = 1977;

function appendPostcolData(svg, radii, pop_data) {
  clearInterval(playInterval);
  svg.selectAll("circle")
    .remove()
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
    .translate([width/2, height/2]);
  
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
      return pop_data[pop_data_row][year];
    })
    .attr("stroke", "white")
    .attr("r", function(rows) {
      return rows[year][0];
    })
    .attr('class', function(rows) {
      return "postcol " + rows.region;
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
    
    playInterval = setInterval(function() {
      // $('.glyphicon.glyphicon-pause').addClass('hide');
      // $('.glyphicon.glyphicon-play').removeClass('hide');
      if (j == 2015) {
        j = 1977;
        playingPostCol = false;
        clearInterval(playInterval);
      }

      year = "y" + j++;        
      svg.selectAll("circle")
        .attr("r", function(row) { return row[year][0]; })
        .attr('class', function(row) {
          return "postcol " + row.region;
        });
      console.log("still playing");
      console.log(j);
    }, 300);
    
    drawLegend(svg);
    showPostcolStuff();
};

function showPostcolStuff() {
  var preColStuff = $(".precol-event-buttons, .1950s-content, .historical-content, .eradication-content, #precol-map-header");
  $(".postcol-event-buttons").removeClass("hide");
  $("#postcol-map-header").removeClass("hide");
  preColStuff.addClass("hide");
  $('#slider-container').fadeIn('slow');
  drawLegend(svg);
}

// function stopPlaying() {
//   clearInterval(playInterval);
//   playInterval = null;
//   $('.glyphicon.glyphicon-play').addClass('hide');
//   $('.glyphicon.glyphicon-pause').removeClass('hide');
// }

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
  var regionName = "<p><strong>"+ generateTooltipRegion(rows) +"</strong></p>";
  var year = "<p>" + "Year: " + j + "</p>";
  var populationInt = parseInt(rows["y" + j][1]);
  var population = "<p>" + "Population: " + populationInt + "</p>"; // slider not accessing this.

  tooltip.html(regionName + year + population)
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
    $("#precol-map-header").removeClass("hide");
    var postColStuff = $(".1973-content, .1995-content, .today-content, #postcol-map-header, .postcol-event-buttons");
    postColStuff.addClass("hide");
    $(".precol-event-buttons").removeClass("hide");
    clickMapEvents();
    svg.selectAll('.legend').remove();
    $('#slider-container').hide();
  });
}

function drawLegend(svg) {
  var legendRectSize = 18;
  var legendSpacing = 4;
  var color = d3.scale.ordinal()
      .range(['#FFFFFF', '#B2273A', '#796E24', '#337ab7', '#432F21']);
  
  var legend = svg.selectAll('.legend')
    .data(["Wolf management regions:", "Northern Rockies", "Great Lakes", "Pacific Northwest", "Southwest"])
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
