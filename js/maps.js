var map, mapPopIn, userMarker, popInMarker;
var markersBigMap = [];
var markersResto = [];
var userMarkerPopIn = [];
var markersPopIn = [];
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var image = {
  url: "/avis-resto/img/map-pin.svg"
};


// ********************************** INITIALISATION DES MAPS ************************************ //

function initialize() {
    var bigMapProp = {
        center: new google.maps.LatLng(45.7686017, 4.8271047000000635),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-container'), bigMapProp);


    var mapPopInProp = {
        center: new google.maps.LatLng(45.7686017, 4.8271047000000635),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    mapPopIn = new google.maps.Map(document.getElementById('map-pop-in'), mapPopInProp);

    mapPopIn.addListener('click', function(event) {


        if (markersPopIn == 0) {
            addMarker(event.latLng);
        } else {
            deleteMarkers();
            addMarker(event.latLng);
        }
    });
};

// ***************************** GEOLOCALISATION DE L'UTILISATEUR ************************************** //

// LANCEMENT GEOLOCALISATION VIA BOUTON "LANCER LA RECHERCHE" EN HOME
document.getElementById("launch-research-button").onclick = function() {
  deleteMarkersBigMap();
  launchGeoloc();
};

function launchGeoloc() {

  navigator.geolocation.getCurrentPosition(function(position) {

    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    addUserMarkerBigMap(pos);
    addUserMarkerPopInMap(pos);

    map.setCenter(pos);
    mapPopIn.setCenter(pos);

    // ************************ APPEL FONCTION NEARBY SEARCH AVEC GEOLOCALISATION ************************ //

    getNearbySearchWithRequest(pos);

  });
}


// ************************ FONCTION NEARBY SEARCH - GOOGLE PLACES ************************ //

function getNearbySearchWithRequest(position) {

  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: position,
    radius: 500,
    type: ['restaurant']
  }, callback);

  function callback(results, status) {

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        getPlacesDetails(results, service, i);
      }
    }
  }
}

function getPlacesDetails(results, service, item) {
  var request = {
    placeId: results[item].place_id,
    fields: ['id', 'name', 'address_components', 'geometry', 'reviews']
  };

  service.getDetails(request, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      var idPlace = place.id;
      var namePlace = place.name;
      var adressPlace = place.address_components[0].long_name + " " + place.address_components[1].long_name;
      var cityPlace = place.address_components[6].long_name + " " + place.address_components[2].long_name;
      var latPlace = place.geometry.location.lat();
      var lngPlace = place.geometry.location.lng();

            // Récupération des avis (tableau)
            var ratings = [];

            if (place.reviews !== undefined) {
              for (var i = 0; i < place.reviews.length; i++) {
                var starsRate = place.reviews[i].rating;
                var textRate = place.reviews[i].text;
                ratings.push({ "stars": starsRate, "comment": textRate });
              };
            }

            // Création fiche Resto
            const resto = new FicheResto(
              idPlace,
              namePlace,
              adressPlace,
              cityPlace,
              ratings,
              latPlace,
              lngPlace)

            tableauFiches.push(resto);
            resto.creationFicheResto();
            $(".nbr-resto").html(tableauFiches.length + " restaurants");
          } else {
            // SET TIMEOUT POUR EVITER LE "OVER QUERY LIMIT" DE GOOGLE PLACES BLOQUANT LES REQUETES A 9 RESULTATS (SI LES REQUETES SONT ENVOYEES "A LA CHAINE")
            setTimeout(function() {
              getPlacesDetails(results, service, item);
            }, 25);
          }
        });
}

// ********************* GESTION DES MARKERS SUR LES MAPS (BIG MAP + MAP POP-IN) ********************* //

function addMarkerForBigMap(idResto, latitude, longitude, name) {

    var markerResto = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        label: labels[labelIndex++ % labels.length],
    });

    markersResto.push(markerResto);


    // MISE EN PLACE INFOWINDOW POUR LES MARKERS DE RESTO
    var infowindow = new google.maps.InfoWindow({
        content: name
    });

    // OUVERTURE INFOWINDOW AU SURVOL DU MARKER RESTO
    google.maps.event.addListener(markerResto, 'mouseover', function() {
        infowindow.open(map, markerResto);
    });

    // SCROLL AUTOMATIQUE DE LA LISTE RESTO AU CLIC SUR UN MARKER RESTO
    google.maps.event.addListener(markerResto, 'click', function() {
      console.log($("#fiche-resto" + idResto), $("#fiche-resto" + idResto).position());
      $("#scroll-list-resto").animate({
        scrollTop: $("#scroll-list-resto").scrollTop()+$("#fiche-resto" + idResto).position().top }, 1000);
      });

    // FERMETURE INFOWINDOW AU SURVOL DU MARKER RESTO
    google.maps.event.addListener(markerResto, 'mouseout', function() {
        infowindow.close(map, markerResto);
    });

    // AU SURVOL DU FICHE RESTO, OUVERTURE DE L'INFOWINDOW DU MARKER RESTO CORRESPONDANT
    if (window.innerWidth > 1024) {
        $("div#fiche-resto" + idResto)
            .mouseenter(function() {
                infowindow.open(map, markerResto);
            })
            .mouseleave(function() {
                infowindow.close(map, markerResto);
            });
    };

    markerResto.setTitle(name)

}

function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: mapPopIn
    });
    markersPopIn.push(marker);
}

function addUserMarkerBigMap(location) {

  userMarker = new google.maps.Marker({
    position: location,
    map: map,
    animation: google.maps.Animation.DROP,
    icon: image
  });
  markersBigMap.push(userMarker);
}

function addUserMarkerPopInMap(location) {

  userMarker = new google.maps.Marker({
    position: location,
    map: mapPopIn,
    animation: google.maps.Animation.DROP,
    icon: image
  });
  userMarkerPopIn.push(userMarker);
}

function setUserMarkerBigMap(map) {
  for (var i = 0; i < markersBigMap.length; i++) {
      markersBigMap[i].setMap(map);
  }
}

function setUserMarkerPopInMap(mapPopIn) {
  for (var i = 0; i < userMarkerPopIn.length; i++) {
      userMarkerPopIn[i].setMap(mapPopIn);
  }
}

function setMarkerRestoBigMap(map) {
    for (var i = 0; i < markersResto.length; i++) {
        markersResto[i].setMap(map);
    }
}

function setMapOnAll(mapPopIn) {
    for (var i = 0; i < markersPopIn.length; i++) {
        markersPopIn[i].setMap(mapPopIn);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function clearMarkersBigMap() {
    setMarkerRestoBigMap(null);
    setUserMarkerPopInMap(null);
    setUserMarkerBigMap(null);
}

function clearMarkersBigMapforFilter() {
    setMarkerRestoBigMap(null);
}

function deleteMarkers() {
    clearMarkers();
    markersPopIn = [];
}

function deleteMarkersBigMap() {
    clearMarkersBigMap(null);
    markersBigMap = [];
    tableauFiches = [];
    document.getElementById('scroll-list-resto').innerHTML = "";
    markersResto = [];
    labelIndex = 0;
}
