


$(document).ready(function(){


    setMarkerOnMap(map, $('#data').text());


});


function setMarkerOnMap(map, mydata){
    data = JSON.parse(mydata);
    for(let i=0; i<data.length; i++){
        L.marker([data[i].latitude, data[i].longitude], {draggable: true,        // Make the icon dragable
            title: 'Hover Text',     // Add a title
            opacity: 0.5}
            ).addTo(map).bindPopup("<b>Monument</b><br>" + data[i].nom)
            .openPopup();
        map.panTo(new L.LatLng(data[i].latitude, data[i].longitude));
        
    }  
    // L.marker([longitude, latitude]).addTo(map);
    L.marker([latitude, longitude]).addTo(map);
    map.panTo(new L.LatLng(latitude, longitude));

    
}