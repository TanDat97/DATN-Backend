function getDistanceFromLatLongInKm(lat1, long1, lat2, long2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLong = deg2rad(long2 - long1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function distanceListPlace(listProject, radius, lat, long) {
    var result = [];
    listProject.forEach(project => {
        const temp = getDistanceFromLatLongInKm(lat, long, project.lat, project.long);
        console.log(temp);
        if (radius > temp) {
            result.push(project);
        }
    })
    return result;
}

function findProjectByOwner(listProject, id) {
    var result = [];
    listProject.forEach(project => {
        console.log(project.ownerid + ' ' + id)
        if (project.ownerid == id) {
            result.push(project);
        }
    })
    return result;
}

function convertData(inStr) {
    var result = {
        start: 0,
        end: 9999999999,
    }
    if (inStr == 0) {
        return result;
    }
    var temp = inStr.split('-');
    result.start = parseInt(temp[0]);
    result.end = parseInt(temp[1]);
    return result;
}

function hashString(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function randomPassword(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function createCodeList(a) {
    var temp = a.map(element => {
        return {
            code: element,
            sold: false,
        }
    })
    return temp
}

module.exports.distanceListPlace = distanceListPlace
module.exports.findProjectByOwner = findProjectByOwner
module.exports.convertData = convertData
module.exports.hashString = hashString
module.exports.randomPassword = randomPassword
module.exports.createCodeList = createCodeList
