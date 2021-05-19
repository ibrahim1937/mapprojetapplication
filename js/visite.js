
var myposition = {
    latitude : "",
    longitude : ""
};
var map = L.map('mapid').setView([34.0132500, -6.8325500], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// var marker = L.marker([33.24065269431005, -8.494309198558144]).addTo(map);



$(document).ready(function(){

    $('table').dataTable({
        "order": [],
        "aaSorting": []
    });
    getLocation();
    $('#selectmonument').on('change', function(e){
        if($(this).val()){
            let monument = getmonumentlocation($(this).val());
            setMarkerOnMap(monument.longitude, monument.latitude,monument.nom, map);
        }
        
    });
    //getLocation();
    // getmonumentlocation();

    $('#visits').click(function(e){
        e.preventDefault();

        if($('#selectmonument').val()){
            let monument = getmonumentlocation($('#selectmonument').val());
            let validation = checkdistance(monument.latitude, monument.longitude);
            if(validation){
                $.ajax({
                    url : 'http://localhost:3000/visite/add',
                    type: 'get',
                    data: {
                        id_monument : $('#selectmonument').val(),
                       latitude : myposition.latitude,
                       longitude : myposition.longitude,
                       visited : 'valide'

                    },
                    success: function(data){
						window.location.reload(true);
                        console.log('success');
                    },
                    error: function(error){
                        console.log(error);
                    }
                });
            } else {
                $.ajax({
                    url : 'http://localhost:3000/visite/add',
                    type: 'get',
                    data: {
                        id_monument : $('#selectmonument').val(),
                       latitude : myposition.latitude,
                       longitude : myposition.longitude,
                       visited : 'non valide'

                    },
                    success: function(data){
						window.location.reload(true);
                        console.log('success');
                    },
                    error: function(error){
                        console.log(error);
                    }
                });
            }
        }
    });


    $('#myposition').click(function(e){
        e.preventDefault();
        setMarkerOnMap(parseFloat(myposition.longitude), parseFloat(myposition.latitude), "localisation", map);
    });
});









function getmonumentlocation(id){
    data = JSON.parse(monuments);
    for(let i=0; i<data.length; i++){
        if(data[i].id == id){
            return data[i];
        }
        
    }   
}

function setMarkerOnMap(longitude, latitude, nom,  map){
    // L.marker([longitude, latitude]).addTo(map);
    L.marker([latitude, longitude],{draggable: true,        // Make the icon dragable
        title: 'Hover Text',     // Add a title
        opacity: 0.5}).addTo(map).bindPopup("<b>Monument:</b><br>" + nom)
    .openPopup();
    map.panTo(new L.LatLng(latitude, longitude));

    
}



function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
    // myposition =  {
    //     latitude : position.coords.latitude,
    //     longitude : position.coords.longitude
    // };
    myposition.latitude = position.coords.latitude;
    myposition.longitude = position.coords.longitude;

    return;

}

function checkdistance(latitude, longitude){
    loc1 = new L.LatLng(myposition.latitude, myposition.longitude);
    loc2 = new L.LatLng(latitude, longitude);
    
    if ((loc1.distanceTo(loc2).toFixed(0)/1000) < 100) {
        return true;
    } else {
        return false;
    }

    // length = L.GeometryUtil.length(map, new L.LatLng(myposition.latitude, myposition.longitude), new L.LatLng(latitude,longitude));
    // console.log(length);
    
}

/*


function refreshDistanceAndLength() {
  _distance = L.GeometryUtil.distance(_map, _firstLatLng, _secondLatLng);
  _length = L.GeometryUtil.length([_firstPoint, _secondPoint]);
  document.getElementById('distance').innerHTML = _distance;
  document.getElementById('length').innerHTML = _length;
}

*/
