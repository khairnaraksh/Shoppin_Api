// var express = require('express');
// var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
const express = require('express')
const app = express()

var url = 'mongodb://192.168.0.101:27017';
const dbName = 'test';
var bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype, Cache-Control');
    next();
  });

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/customers', function(req, res, next) {
   
    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        // Get the documents collection
        const collection = db.collection('customer');

        // Find some documents
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs);
            res.send(docs);
            client.close();
        });
      });
});

app.post('/customers', function(req, res) {
    var product_id = req.body.id;
    var customer_id = req.body.c_id;

    mongo.connect(url, function(err, client) {
        const db = client.db(dbName);
        const collection = db.collection('shpping');

        var myquery = { _id: objectId(customer_id) };
        var newvalues = {
            "$push":{
                "order": {
                    "prod_name":objectId(product_id)
                }
            }
        };

        collection.updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log(newvalues);
            console.log("1 document updated");
        });
        res.send(product_id);
    });
});

app.get('/products', function(req, res, next) {
    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
      
        const db = client.db(dbName);

        // Get the documents collection
        const collection = db.collection('products');

        // Find some documents
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs);
            res.send(docs);
            client.close();
        });
      });
});

app.listen(3131, () => console.log('Example app listening on port 3000!'))