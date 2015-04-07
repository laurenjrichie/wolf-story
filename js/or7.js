var map,
    playOR7Interval,
    isPlaying = false,
    index = 0,
    infoLatLongs = {
      one: [45.728322, -117.610243],
      two: [45.474668, -118.016737],
      three: [45.095913, -117.698133],
      four: [42.850894, -121.587294],
      five: [42.268259, -120.873182],
      six: [42.552164, -122.916639],
      seven: [41.598083, -123.378065]
    },
    coordinates = [],
    markers = [];

function initialize() {
  var mapOptions = {
    center: { lat: 43.452016, lng: -123.647230},
    scrollwheel: false,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  map = new google.maps.Map(document.getElementById('or7-map-canvas'), mapOptions);
}

function startPlaying() {
  $('#play-or7').on('click', function() {
    if (isPlaying === false) {
      plotCoordinates();
      isPlaying = true;
    } else {
      clearInterval(playOR7Interval);
      isPlaying = false;
    }
  });
}

queue()
    .defer(d3.csv, "data/or7-data.csv")
    .await(ready);

function ready(error, or7) {
  for (var i = 0; i < or7.length; i++) {
    coordinates.push([or7[i].xcoord, or7[i].ycoord]);
  }
  startPlaying();
}

function plotCoordinates() {
  playOR7Interval = setInterval(function() {
    var image = 'img/paw.png';
    if (index === 0) { removeMarkers(); }
    if (index === 42) {
      index = 0;
      isPlaying = false;
      clearInterval(playOR7Interval);
      return;
    } else { plotInfoNums(index); }
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(coordinates[index][0], coordinates[index][1]),
      map: map,
      icon: image,
    });
    markers.push(marker);
    index += 1;
  }, 250);
}

function removeMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function plotInfoNums() { // refactor this
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

function showHoverInfo(marker, num) {
  google.maps.event.addListener(marker, 'mouseover', function() {
    $(".or7-info-" + num).removeClass("hide");
  });
  google.maps.event.addListener(marker, 'mouseout', function() {
    $(".or7-info-" + num).addClass("hide");
  });
}

google.maps.event.addDomListener(window, 'load', initialize);