$(document).ready(function() {
  startPlaying();
});

var map,
    playInterval = null,
    index = 0;

function initialize() {
  var mapOptions = {
    center: { lat: 43.289231, lng: -120.234386},
    scrollwheel: false,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  map = new google.maps.Map(document.getElementById('or7-map-canvas'), mapOptions);
}

function startPlaying() {
  $('#play-or7').on('click', function() {
    if (playInterval != null) {
      stopPlaying();
    } else {
      getData();
    }
  });
}

queue()
    .defer(d3.csv, "data/or7-data.csv")
    .await(ready);

function ready(error, or7) {
  getData(or7);
}

function getData(data) {
  console.log(data);
  // var data = [];
  // d3.csv('data/or7-data.csv', function(d) {
  //   return {
  //     xcoord: d.xcoord,
  //     ycoord: d.ycoord,
  //   }
  // }, function(error, rows) {
  //   for (var i = 0; i < rows.length; i++) {
  //     data.push([rows[i].xcoord, rows[i].ycoord]);
  //   }
  //   plotCoordinates(data, index); // how to have this function return data and then call plotCoordinates from startPlaying??
  // });
}

var infoLatLongs = {
  one: [45.728322, -117.610243],
  two: [45.474668, -118.016737],
  three: [45.095913, -117.698133],
  four: [42.850894, -121.587294],
  five: [42.268259, -120.873182],
  six: [42.552164, -122.916639],
  seven: [41.598083, -123.378065]
}

function plotCoordinates(data, index) {
  playInterval = setInterval(function() {
    var image = 'img/paw.png';
    if (index == 42) {
      stopPlaying();
      index = 0;
    } else {
      plotInfoNums(index);
    }
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data[index][0], data[index][1]),
      map: map,
      icon: image,
    });
    index++;
    console.log(index);
  }, 300);
}

function plotInfoNums(index) { // refactor this
  if (index == 1) {
    showInfo("one", infoLatLongs);
  } else if (index == 3) {
    showInfo("two", infoLatLongs);
  } else if (index == 5) {
    showInfo("three", infoLatLongs);
  } else if (index == 18) {
    showInfo("four", infoLatLongs);
  } else if (index == 27) {
    showInfo("five", infoLatLongs);
  } else if (index == 40) {
    showInfo("six", infoLatLongs);
  } else if (index == 41) {
    showInfo("seven", infoLatLongs);
  }
}

function stopPlaying() {
  clearInterval(playInterval);
  playInterval = null;
}

function showInfo(num, infoLatLongs) {
  var latLongs = infoLatLongs[num],
      image = 'img/' + num + '.ico',
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(latLongs[0], latLongs[1]),
        map: map,
        icon: image,
      });
  showHoverInfo(marker, num);
}

function generateHtml(num) {
  var source = $("#or7-info-" + num).html(),
      template = Handlebars.compile(source),
      html = template();
  return html;
}

function showHoverInfo(marker, num) {
  var infowindow = new google.maps.InfoWindow({
      content: generateHtml(num),
  });
  google.maps.event.addListener(marker, 'mouseover', function() {
    infowindow.open(map,marker);
  });
  google.maps.event.addListener(marker, 'mouseout', function() {
    infowindow.close(map,marker);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);