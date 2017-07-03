// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var client = require('node-rest-client').Client, 
    jimp = require('jimp'),
    chroma = require('chroma-js'),
    random = require('random-js');


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

var engine = random.engines.mt19937().autoSeed();

app.get("/stretch", function (request, response) {
  // query params:
  //  url: link to image (jpg)
  //  stretch: left || right (which way to go)
  //
  // open image
  // select an x pixel start (offset some distance based on left/right)
  // go one over, and write over the row left||right
  // add a black pixel at the X? two pixels? insert the pixels?
  // return image
  
  var side = request.query.stretch || 'left';
  
  var Client = new client();
  var req = Client.get(request.query.url, undefined, function(data, res) {
    jimp.read(data)
    .then(function(image) {
      var width = image.bitmap.width;
      var height = image.bitmap.height;
      
      var range = [Math.floor(width/10), width];
      if (side === 'right') {
        range = [0, Math.floor(width/10)];
      } 
      
      var distribution = random.integer(range[0], range[1]);
      var offset = distribution(engine);
      
      console.log(range, offset);
      
/*

           +----------+---------------------+
           |          |                     |
           |          |                     |
           |  STRETCH |       KEEP          |
           |          |                     |
           |          |                     |
           |          |                     |
           +--------------------------------+
+--------------------------------+
|                     |          |
|                     |          |
|                     |          |
|      KEEP           | STRETCH  |
|                     |          |
|                     |          |
+--------------------------------+
                      ^
                      OFFSET

*/
      // get the colors at the offset, (x, 0-height)
      var pixels = Array.from({length:height}, (v, i) => i).map(y => {
        console.log(offset, y);
        return image.getPixelColor(offset, y);
      });

      console.log(pixels.slice(0, 10));
      console.log(pixels.length);
      
      var s = side === 'left' ? 0 : offset;
      var e = side === 'left' ? offset : width;
      
      // work off a copy to return
      // from start...end, 0 to height...
      var copy = image.clone();
      for (var i = s; i < e; i++) {
        for (var j = 0; j < height; j++) {
          var pixel = i === offset-1  ? jimp.rgbaToInt(0, 0, 0, 1) : pixels[j];
          copy.setPixelColor(pixel, i, j);
        }
      }
      
      // return the modded copy as a jpeg
      copy.getBuffer(jimp.MIME_PNG, (err, buffer) => {
        response.set('Content-Type', jimp.MIME_PNG);
        response.set('Content-Disposition', 'inline; filename="generated.png"');
        response.send(buffer);
      });
    }).catch(function(err) {
      response.send('jimp error');
    });
  }).on('error', function(err) {
    response.send('request error');
  });
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
