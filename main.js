var fs = require('fs');
var layer = require('cloud/layer-parse-module/layer-module.js');

var layerProviderID = 'layer:///providers/735de9e4-2f3b-11e5-bae4-f60e000000fb';
var layerKeyID = 'layer:///keys/347cc7ea-3003-11e5-a15d-f60e9900403a';
var privateKey = fs.readFileSync('cloud/layer-parse-module/keys/layer-key.js');
layer.initialize(layerProviderID, layerKeyID, privateKey);

Parse.Cloud.define("generateToken", function(request, response) {
    var userID = request.params.userID;
    var nonce = request.params.nonce;
    saveToDatabase(userID);
    if (!userID) throw new Error('Missing userID parameter');
    if (!nonce) throw new Error('Missing nonce parameter');
        response.success(layer.layerIdentityToken(userID, nonce));
});


function saveToDatabase(userID) {
  var userInformation = { 'id': userID };
  var userJSON = JSON.stringify(userInformation);

  Parse.Cloud.httpRequest({
    url: 'https://filip-temp.herokuapp.com/saveUserToDatabase',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: userJSON,
    success: function (httpResponse) {
      console.log(httpResponse.text);
      response.success(httpResponse);
    },
    error:function (httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      response.error(httpResponse.status);
    }
  });
}
