const express = require('express');
const app = express();
const drone = require("ar-drone");
const client = drone.createClient();
const fs = require('fs');

const minImageInterval = 2000;

app.use('/', express.static('public'));

app.get('/', function(req, res) {
    res.sendFile('./index.html')
});

app.get('/launch', function(req, res) {
    console.log('Launching drone')
    launchDrone();
});

app.get('/land', function(req, res) {
    console.log('Landing drone')
    landDrone();
});

app.get('/drone-images', function(req, res) {
    var lastImageRetrieval = Date.now()
    console.log("Gonna get me some drone images...");
    startImageStreaming(function(buffer) {
        var lastImageRetrieval = Date.now(); 
        if ((currentRetrieval - lastImageRetrieval) > minImageInterval) {
            console.log("GOT AN IMAGE!!")
            lastImageRetrieval = currentRetrieval;
            fs.writeFile(__dirname + '/public/droneImage.png', buffer, function(err) {
                if (err) {
                    console.error('Image file write error: ' + err.message);
                } else {
                    console.log('New drone image written')
                }
            });
        }   
    });
});

app.listen(3000, function() {
    console.log('Preparing middle out compression...');
    console.log('Ready for drone control on port 3000!')
});

function launchDrone() {
    client.takeoff();
}

function landDrone() {
    client.stop();
    client.land();
}

function startImageStreaming(imageHandler) {
    var imageStream = client.getPngStream();
    imageStream
        .on('error', console.log)
        .on('data', function(imageBuffer) {
            imageHandler(imageBuffer);
        });
}