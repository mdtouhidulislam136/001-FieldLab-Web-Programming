
import request from 'request';

// titleksi title + indx numero
// time on indexnumero per title
// possit 0-100 ja totalenerhy 0-10 000
// random numero 10-1000 jolla määritetään montako mittausta per title

// setting default values
/*
var title = 'title0'
var time = '0'
var totalMotorPower = '0'
var xpos = '0'
var ypos = '0'
var zpos = '0'
var totalMotorEnergy = '0'
*/

function randomTimes(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}


function generateValues(i) {

    totMotP = randomTimes(0, 1000);
    xposV = randomTimes(0, 100);
    yposV = randomTimes(0, 100);
    zposV = randomTimes(0, 100);
    totMotE = randomTimes(0, 10000);
    values = {
        //title: 'titleMuuttujasta',
        time: i.toString(),
        totalMotorPower: totMotP.toString(),
        xpos: xposV.toString(),
        ypos: yposV.toString(),
        zpos: zposV.toString(),
        totalMotorEnergy: totMotE.toString()
    };

    return values;
}

var indx = 1

setInterval(function () {
    // counter for how many datapoints will be under one title
    var counter = randomTimes(0, 1000);
    title = 'title' + indx.toString()
    var i = 0
    while (i < counter) {

        values = generateValues(i);

        const options = {
            url: 'http://localhost:8080/api/robots',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Super-Agent/0.0.1'
            },
            form: {
                'title': title,
                'time': values.time,
                'totalMotorPower': values.totalMotorPower,
                'xpos': values.xpos,
                'ypos': values.ypos,
                'zpos': values.zpos,
                'totalMotorEnergy': values.totalMotorEnergy
            }
        }

        request(options, function (error, responce, body) {
            if (!error && responce.statusCode == 200) {
                console.log(body)
            }
            else {
                console.log(error)
            }

        })
        i++
    }
    indx++;
}, 10000)
