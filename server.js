// Require express and create an instance of it
var express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const router = express.Router()
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
// on the request to root (localhost:3000/)
app.get('/', function (req, res) {
	var dir_name = "/Users/ziqiliu/dev/search_engine_ui/"
    res.sendFile(dir_name + 'index.html');
});


function getCdm(address) {
  var splits = address.split('/');
  var names = splits[splits.length-1];
  var cdm = names.split('.')[0];
  return cdm;
}

function getTable(json){
	console.log("response = " +  json);
	var html = '<html><link rel="stylesheet" href="/styles.css">\
	<body><div class="wrap_bar"><form class="search" action ="/query" enctype="application/x-www-form-urlencoded"  \
	method="post"><input type="text" name="keyword" class="searchTerm" placeholder="What are you looking for?">\
      <button type="submit" class="searchButton">\
        <i class="fa fa-search"></>\
     </button>\
   </form>\
</div>';
	var table = '<table class="table_class" id="results"> <tbody>';
        for (var i = 0; i < json.length; i++) {
            var tr =('<tr>');
            var cdm = getCdm(json[i].id);
            var link = "https://rubrik.atlassian.net/browse/" + cdm;
            tr +="<td><a href=" +link + ">" + cdm + "</td>";
            //tr +="<td>" + json[i].title + "</td>";
            //tr +="<td>" + json[i].completed + "</td>";
            tr += "</tr>"
            table += tr;
        }

        table += "</tbody></table>";
        html += table + "</body></html>";
        return html;
}

app.post('/query', function(req, res) {
	res.set('Content-Type', 'text/html');
console.log(req.body.keyword);
  request.get('http://10.1.14.95:8001/solr/fileset/query?q=' + req.body.keyword, (error, response, body) => {
     var html = getTable(JSON.parse(body).response.docs);
    res.send(html);
  });
});

// start the server in the port 3000 !
app.listen(3000, function () {
    console.log('Example app listening on port 3000.');
});