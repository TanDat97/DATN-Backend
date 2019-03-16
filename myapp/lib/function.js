const distance = require('google-distance');



function distanceListPlace(listProject, radius, lat, long){
    var result = [];
    listProject.forEach(project=>{
        var temp = Math.sqrt(Math.pow((lat - project.lat), 2.0) + Math.pow((long - project.long), 2.0))
        console.log(temp)
        if (radius > temp) {
            result.push(project);
        }
    })
    return result;
}

module.exports.distanceListPlace = distanceListPlace