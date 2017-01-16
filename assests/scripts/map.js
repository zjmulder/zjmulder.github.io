var initMap = function() {
                
    var style = new google.maps.StyledMapType(
      [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#d66853"
              },
              {
                "visibility": "on"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#d66853"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c9c9c9"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ]
    );

    //zoom was 4
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: {lat:40.23749160782123, lng: -99.0282608032226},
      mapTypeId: 'terrain'
    });

    map.mapTypes.set('styled_map', style);
    map.setMapTypeId('styled_map');

    var defaultDetails = {
        distance:1159034.62,
        time:304568.851,
        maxSpeed:18.6800003051758,
        avgHeartRate:132.508560505394,
        maxHeartRate:208
    };

    var defaultActivity = [
        {
            distance:926012.399999998,
            time:131247.466,
            maxSpeed:18.6800003051758,
            avgHeartRate:144.700623195176,
            maxHeartRate:208
        }, {
            distance:128048.42,
            time:116400.726,
            maxSpeed:5.20699977874756,
            avgHeartRate:115.144990298428,
            maxHeartRate:179
        }, {
            distance:84153.7499999999,
            time:32717.238,
            maxSpeed:4.55299997329712,
            avgHeartRate:168.410996001557,
            maxHeartRate:192
        }, {
            distance:13755.61,
            time:19232.401,
            maxSpeed:6.15799999237061,
            avgHeartRate:101.564293142598,
            maxHeartRate:175
        }
    ]

    //7C9EB2 - light blue - cycling
    //7D4E57 - red - hiking
    //C94277 - yellow - runnin
    //A6D49F - 

    var colors = ['33658A', 'DD5658', '49306B', '499F68'];
    var ends = [''];

    //var flighPlanCoordinates = map.data.loadGeoJson('/assests/data/bikes.json');
    var mapping,
        activities=[],
        workouts=[],
        starts=[],
        ends=[];
    $.getJSON("/assests/data/output.json", function (r) {                
        mapping = r.mapping;

        mapping.forEach(function(d, i){
            d.workouts.forEach(function(e,j){
                var workout = new google.maps.Polyline({
                    path:e.points,
                    geodesic:true,
                    strokeColor: '#' + colors[i],
                    strokeOpacity:1.0,
                    strokeWeight:2,
                    map:map
                })
                workouts.push(workout);
                activities.push(e);

                workout.addListener('mouseover', function(event){
                    mouseover(event,this,e)});

                workout.addListener('mouseout', function(event){
                    mouseout(event,this,e)});

               var start = new google.maps.Marker({
                    icon:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + colors[i],
                    position: e.points[0],
                    map: map,
                    title: 'Start'
                });
                starts.push(start);

                start.addListener('mouseover', function(event){
                   mouseover(event, workout, e);
                });
                start.addListener('mouseout', function(event){
                   mouseout(event, workout, e); 
                });

                var end = new google.maps.Marker({
                    icon:"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + colors[i],
                    position:e.points[e.points.length-1],
                    map:map,
                    title:'End'
                });
                ends.push(end);

                end.addListener('mouseover', function(event){
                   mouseover(event, workout, e); 
                });
                end.addListener('mouseout', function(event){
                   mouseout(event, workout, e); 
                });


            });
        });

        $('.map-icon-cell').on("click", function(e){
           if($(this).hasClass('active')) {
               $(this).removeClass('active');
               var id = $(this).attr('id');
           } else {
               $(this).addClass('active');
           }

           updateMapDetailsSummary();
        });

       function mouseover(e,b,j){
           workouts.forEach(function(f, k){
                if(k!=j.id){
                    f.setOptions({strokeWeight:1,strokeOpacity:.4});
                }
           });
           b.setOptions({strokeWeight:5});

           starts.forEach(function(f,k){
              if(k!=j.id){
                  f.setVisible(false);
              } 
           });

           ends.forEach(function(f,k){
              if(k!=j.id){
                  f.setVisible(false);
              } 
           });

           updateMapDetails(j);
       }

        function mouseout(e,b,j){
            workouts.forEach(function(f, k){
                f.setOptions({strokeWeight:2,strokeOpacity:1.0});
           });
            starts.forEach(function(f,k){
               f.setVisible(true); 
            });
            ends.forEach(function(f,k){
               f.setVisible(true); 
            });

            updateMapDetailsSummary();
       }


        function updateMapDetailsSummary() {

            var out = {
                distance:0,
                time:0,
                avgSpeed:0,
                maxSpeed:0,
                avgHeartRate:0,
                maxHeartRate:0
            }

            var activeActivities=[];
            $('.map-icon-cell').each(function(a,i){
                if($(this).hasClass('active')) {
                    out.distance+=defaultActivity[a].distance;
                    out.time+=defaultActivity[a].time;
                    out.maxSpeed= Math.max(out.maxSpeed, defaultActivity[a].maxSpeed);
                    out.avgHeartRate += defaultActivity[a].time * defaultActivity[a].avgHeartRate;
                    out.maxHeartRate = Math.max(out.maxHeartRate, defaultActivity[a].maxHeartRate);

                    activeActivities.push(a);
                }
            });

            activities.forEach(function(f,i){
               if(activeActivities.indexOf(f.activityID-1)!=-1){
                   workouts[i].setOptions({strokeWeight:2});
                   starts[i].setVisible(true);
                   ends[i].setVisible(true);
               } else {
                   workouts[i].setOptions({strokeWeight:0});
                   starts[i].setVisible(false);
                   ends[i].setVisible(false);
               } 
            });

            out.avgSpeed = (out.distance==0) ? 0 :  out.distance/out.time;
            out.avgHeartRate = (out.avgHeartRate==0) ? 0: out.avgHeartRate/out.time;
            updateMapDetails(out);
        }

        function updateMapDetails(vals){
            $('#detail-distance').text(Math.round(100*vals.distance*0.000621371)/100);
            $('#detail-time').text(Math.round(100*vals.time/60/60)/100);
            
            if(vals.time==0){
                $('#detail-avgSpeed').text(0);
            } else {             
                $('#detail-avgSpeed').text(Math.round(100*(vals.distance*0.000621371)/(vals.time/60/60))/100);
            }
            $('#detail-maxSpeed').text(Math.round(100*vals.maxSpeed*2.23694)/100);
            $('#detail-avgHeartRate').text(Math.round(100*vals.avgHeartRate)/100);
            $('#detail-maxHeartRate').text(Math.round(100*vals.maxHeartRate)/100);

        }

    });
}