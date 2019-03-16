function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
  
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function distanceListPlace(listProject, radius, lat, long){
    var result = [];
    listProject.forEach(project=>{
        const temp = getDistanceFromLatLonInKm(lat, long, project.lat, project.long);
        console.log(temp);
        if(radius > temp){
            result.push(project);
        }
    })
    return result;
}

function findProjectByOwner(listProject, id){
    var result = [];
    listProject.forEach(project=>{
        console.log(project.ownerid + ' ' + id)
        if(project.ownerid == id){
            result.push(project);
        }
    })
    return result;
}

module.exports.distanceListPlace = distanceListPlace
module.exports.findProjectByOwner = findProjectByOwner
