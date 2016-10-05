var express = require('express');
var request = require('request-promise');
var app = express();

app.get('/articles/:id', function (req, res) {

  request('https://ci-self-api.aws.conde.io/articles/' + req.params.id, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      const relsPromise = request(body._links.rels.uri, function (error, response, body2) {
        body.rels = JSON.parse(body2);
      });
      const pubPromise = request(body._links.publishHistory.uri, function (error, response, body2) {
        body.publishHistory = JSON.parse(body2);
      });
      Promise.all([pubPromise, relsPromise]).then(() => {
        res.send(body);
      });

    } else {
      res.send(error);
    }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
