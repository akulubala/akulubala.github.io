const got = require('got');
var fs = require('fs');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);
let path = require('path');




function pDownload(url, dest){
  var file = fs.createWriteStream(dest);
  got(url)
      .then(response => {
        file.on('finish', () =>{
          file.close(() => {
            resolve();
        });
      })
      .catch(error => {
        eject(error);
        //=> 'Internal server error ...'
      });
}

    $.ajax({
      method: "GET",
      url: "https://unsplash.it/list",
  }).done(function(response) {
     var unsplashID = [];
     _.each(response, function(item) {
        unsplashID.push(item.id);
     });
    var count = unsplashID.length;
    
    
    for (let i = 0; i < 100; i++) {
      var imgID = _.random(1, count);
      let fileLocation = path.resolve(__dirname, 'assets/images/upsplash/pic_' + i + '.jpeg');
      pDownload('http://unsplash.it/800/300?image=' + unsplashID[imgID], fileLocation)
          .then( ()=> console.log('downloaded file no issues...'))
          .catch( e => console.error('error while downloading', e));
    } 
  });


