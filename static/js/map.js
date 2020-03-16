var map = null;
var map_markers = [];
var map_rectangles = [];
var map_circles = [];
var map_polygons = [];
var map_polylines = [];
var prev_infowindow_map = null;

function initialize_map() {
  console.log("initializing map!");
  document.getElementById("view-side").style.display = "block";
  map = new google.maps.Map(document.getElementById("view-side"), {
    center: new google.maps.LatLng(32.0851, -98.342),
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    scrollwheel: true,
    fullscreenControl: true,
  });

  //center map location on user location
  for (i = 0; i < 9; i++) {
    map_markers[i] = new google.maps.Marker({
      position: new google.maps.LatLng(raw_markers[i].lat, raw_markers[i].lng),
      map: map,
      icon: raw_markers[i].icon,
      title: raw_markers[i].title ? raw_markers[i].title : null,
    });

    if (raw_markers[i].infobox) {
      google.maps.event.addListener(
        map_markers[i],
        "click",
        getInfoCallback(map, raw_markers[i].infobox)
      );
    }
  }

  // add rectangles
  var raw_rectangles = [];
  for (i = 0; i < 0; i++) {
    map_rectangles[i] = new google.maps.Rectangle({
      strokeColor: raw_rectangles[i].stroke_color,
      strokeOpacity: raw_rectangles[i].stroke_opacity,
      strokeWeight: raw_rectangles[i].stroke_weight,
      fillColor: raw_rectangles[i].fill_color,
      fillOpacity: raw_rectangles[i].fill_opacity,
      map: map,
      bounds: {
        north: raw_rectangles[i].bounds.north,
        east: raw_rectangles[i].bounds.east,
        south: raw_rectangles[i].bounds.south,
        west: raw_rectangles[i].bounds.west,
      },
    });

    if (raw_rectangles[i].infobox) {
      google.maps.event.addListener(
        map_rectangles[i],
        "click",
        getInfoCallback(map, raw_rectangles[i].infobox)
      );
    }
  }

  // add circles
  var raw_circles = [];
  for (i = 0; i < 0; i++) {
    map_circles[i] = new google.maps.Circle({
      strokeColor: raw_circles[i].stroke_color,
      strokeOpacity: raw_circles[i].stroke_opacity,
      strokeWeight: raw_circles[i].stroke_weight,
      fillColor: raw_circles[i].fill_color,
      fillOpacity: raw_circles[i].fill_opacity,
      map: map,
      center: {
        lat: raw_circles[i].center.lat,
        lng: raw_circles[i].center.lng,
      },
      radius: raw_circles[i].radius,
    });

    if (raw_circles[i].infobox) {
      google.maps.event.addListener(
        map_circles[i],
        "click",
        getInfoCallback(map, raw_circles[i].infobox)
      );
    }
  }

  // add polygons
  var raw_polygons = [];
  for (i = 0; i < 0; i++) {
    map_polygons[i] = new google.maps.Polygon({
      strokeColor: raw_polygons[i].stroke_color,
      strokeOpacity: raw_polygons[i].stroke_opacity,
      strokeWeight: raw_polygons[i].stroke_weight,
      fillOpacity: raw_polygons[i].fill_opacity,
      fillColor: raw_polygons[i].fill_color,
      path: raw_polygons[i].path,
      map: map,
      geodesic: true,
    });

    if (raw_polygons[i].infobox) {
      google.maps.event.addListener(
        map_polygons[i],
        "click",
        getInfoCallback(map, raw_polygons[i].infobox)
      );
    }
  }

  // add polylines
  var raw_polylines = [];
  for (i = 0; i < 0; i++) {
    map_polylines[i] = new google.maps.Polyline({
      strokeColor: raw_polylines[i].stroke_color,
      strokeOpacity: raw_polylines[i].stroke_opacity,
      strokeWeight: raw_polylines[i].stroke_weight,
      path: raw_polylines[i].path,
      map: map,
      geodesic: true,
    });

    if (raw_polylines[i].infobox) {
      google.maps.event.addListener(
        map_polylines[i],
        "click",
        getInfoCallback(map, raw_polylines[i].infobox)
      );
    }
  }
}

function getInfoCallback(map, content) {
  var infowindow = new google.maps.InfoWindow({ content: content });
  return function(ev) {
    if (prev_infowindow_map) {
      prev_infowindow_map.close();
    }
    prev_infowindow_map = infowindow;
    infowindow.setPosition(ev.latLng);
    infowindow.setContent(content);
    infowindow.open(map, this);
  };
}

function clickposCallback(uri, latLng) {
  xhttp = new XMLHttpRequest();
  xhttp.open("POST", uri);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("lat=" + latLng.lat() + "&lng=" + latLng.lng());
}

google.maps.event.addDomListener(window, "load", initialize_map);

console.log("loaded map.js");
