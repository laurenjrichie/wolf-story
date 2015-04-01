$(document).ready(function() {
  startPlaying();
});

var map;

function initialize() {
  var mapOptions = {
    center: { lat: 43.289231, lng: -120.234386},
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  map = new google.maps.Map(document.getElementById('or7-map-canvas'), mapOptions);
  
}

var playInterval = null;

function startPlaying() {
  $('#play-or7').on('click', function() {
    getData();
  });
}

function getData() {
  var data = [];
  d3.csv('data/or7-data.csv', function(d) {
    return {
      xcoord: d.xcoord,
      ycoord: d.ycoord,
    }
  }, function(error, rows) {
    for (var i = 0; i < rows.length; i++) {
      data.push([rows[i].xcoord, rows[i].ycoord]);
    }
    plotCoordinates(data); // how to have this function return data and then call plotCoordinates from startPlaying??
  });
}

function plotCoordinates(data) {
  var i = 0;
  playInterval = setInterval(function() {
    var image = 'img/paw.png';
    if (i == 103) {
      clearInterval(playInterval);
      i = 0;
    }
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data[i][0], data[i][1]),
      map: map,
      icon: image,
    });
    i++;
  }, 150);
}


google.maps.event.addDomListener(window, 'load', initialize);