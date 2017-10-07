require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;
const mongodbUrl = process.env.MONGOLAB_URI;
const assert = require('assert');

const session = require('express-session');
app.use(session({
    secret: process.env.MONGOLAB_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/build'));

MongoClient.connect(mongodbUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.close();
});


app.get('/', function(req, res) {
    res.send('API Server root - It\'s working.');
});

app.get('/session', function(req, res) {
    res.json(req.session);
});

app.post('/signUp', function (req, res) {
    const account = req.body;

    if(!account['id'] || !account['password'] || !account['name']){
        res.status(500).json({
            error: 'invalid request',
        });
        return;
    }

    MongoClient.connect(mongodbUrl, function(err, db) {
        assert.equal(null, err);

        findDocument(db, 'accounts', { id: account['id'] }, function(err, docs) {
            db.close();

            if (!err) {
                if(docs.length){
                    res.status(409).json({
                        error: 'conflict',
                    });
                    return;
                }

                insertDocument(db, 'accounts', account, function () {
                    db.close();

                    res.status(201).send('Success: account added');
                });
            }
        });
    });
});

app.post('/login', function (req, res) {
    const account = req.body;

    if(!account['id'] || !account['password']){
        res.status(500).json({
            error: 'invalid request',
        });
        return;
    }

    MongoClient.connect(mongodbUrl, function(err, db) {
        assert.equal(null, err);

        findDocument(db, 'accounts', { id: account['id'] }, function(err, docs) {
            db.close();

            if (!err && docs.length) {
                const doc = docs[0];

                if(!doc['id']){
                    res.status(404).json({
                        error: 'not found',
                    });
                    return;
                }

                if(doc['password'] !== account['password']){
                    res.status(412).json({
                        error: 'incorrect',
                    });
                    return;
                }

                const session = req.session;
                session.account = doc;

                res.json(doc);
            }
        });
    });
});

app.get('/logout', function(req, res){
    const session = req.session;
    console.log(session);
    if(session.account){
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            }else{
                res.send('Success: account logged out');
            }
        })
    }else{
        res.send('Success: account already logged out');
    }
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


const insertDocument = function(db, collection, data, callback) {
    db.collection(collection).insertOne(data, function(err, result) {
        assert.equal(err, null);
        console.log(err);
        console.log("Inserted a document into the " + collection + " collection.");
        callback(result);
    });
};

const findDocument = function(db, collection, query, callback) {
    const cursor = db.collection(collection).find(query);
    cursor.toArray(function(err, docs) {
        assert.equal(err, null);
        if (docs !== null) {
            callback(err, docs);
        } else {
            callback(err);
        }
    });
};
