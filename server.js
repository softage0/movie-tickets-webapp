require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectID;
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


//
// login and session
//
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

            if (!err) {
                if(!docs.length){
                    res.status(404).json({
                        error: 'not found',
                    });
                    return;
                }

                const doc = docs[0];

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


//
// movie management
//
app.get('/movies', function (req, res) {
    const query = req.query;
    const bookerId = req.query['bookerId'];

    MongoClient.connect(mongodbUrl, function(err, db) {
        assert.equal(null, err);

        const queries = [];
        if (query['_id']) queries.push( { '_id': new ObjectId(query['_id'])});
        if (query['movieCd']) queries.push( { 'movieCd': query['movieCd']});
        if (query['theater']) queries.push( { 'theater': query['theater']});
        if (query['showTime']) queries.push( { 'showTime': query['showTime']});

        db.collection('movies').find(queries.length ? { $and: queries } : {})
            .sort([
                ['movieCd', 1],
                ['theater', 1],
                ['showTime', 1],
            ])
            .toArray(function (err, moviesInfo) {
                assert.equal(null, err);

                db.collection('booking').find(queries.length ? { $and: queries } : {})
                    .toArray(function (err, bookingInfo) {
                        assert.equal(null, err);
                        db.close();

                        // reserve booked seats per movies
                        const bookingPerMovies = {};
                        bookingInfo.forEach((booking) => {
                            if (bookingPerMovies[booking['movieScheduleId']]) {
                                bookingPerMovies[booking['movieScheduleId']] = Object
                                    .assign({}, bookingPerMovies[booking['movieScheduleId']], booking['seats']);
                            } else {
                                bookingPerMovies[booking['movieScheduleId']] = {};
                                bookingPerMovies[booking['movieScheduleId']]['bookedSeats'] = booking['seats'];
                            }

                            // if bookerId is given, booker's booked seats will be reserved as `myBookedSeats`
                            if (booking['accountId'] === bookerId) {
                                bookingPerMovies[booking['movieScheduleId']]['myBookedSeats'] = booking['seats'];
                            }
                        });

                        // reserved booked seats are added to each movie info and return
                        const returnData = [];
                        moviesInfo.forEach((movie) => {
                            returnData.push(Object.assign({}, movie, bookingPerMovies[movie['_id']]))
                        });

                        res.json(returnData);

                    });
            });
    });
});

app.get('/movies/:_id/:bookerId', function (req, res) {
    const _id = req.params._id;
    const bookerId = req.params['bookerId'];

    if(!_id){
        res.status(500).json({
            error: 'invalid request',
        });
        return;
    }

    MongoClient.connect(mongodbUrl, function(err, db) {
        assert.equal(null, err);

        // get movie info
        db.collection('movies').findOne({_id: new ObjectId(_id)}, function(err, movieInfo) {
            assert.equal(null, err);

            const bookingCol = db.collection('booking');

            // get booked seats info
            bookingCol.findOne({movieScheduleId: _id}, function(err, bookInfo) {
                assert.equal(null, err);

                const returnData = bookInfo ?
                    Object.assign({}, movieInfo, {
                        bookedSeats: bookInfo['seats'],
                    })
                    :
                    movieInfo;

                // If bookerId is given, myBookedSeats will be added.
                if (bookerId) {
                    bookingCol.findOne({
                        $and: [{
                            movieScheduleId: _id,
                            accountId: bookerId,
                        }],
                    }, function(err, myBookInfo) {
                        assert.equal(null, err);
                        db.close();

                        if (myBookInfo) {
                            returnData['myBookedSeats'] = myBookInfo['seats'];
                        }

                        res.json(returnData);
                    });
                } else {
                    db.close();

                    res.json(returnData);
                }
            });
        });
    });
});

app.post('/movies', function (req, res) {
    const movie = req.body;

    if(!movie['movieCd'] || !movie['theater'] || !movie['showTime']){
        res.status(500).json({
            error: 'invalid request',
        });
        return;
    }

    MongoClient.connect(mongodbUrl, function(err, db) {
        assert.equal(null, err);

        const queries = [];
        if (movie['movieCd']) queries.push( { 'movieCd': movie['movieCd']});
        if (movie['theater']) queries.push( { 'theater': movie['theater']});
        if (movie['showTime']) queries.push( { 'showTime': movie['showTime']});

        findDocument(db, 'movies', { $and: queries }, function(err, docs) {
            if (!err) {
                if(docs.length){
                    res.status(409).json({
                        error: 'conflict',
                    });
                    return;
                }

                insertDocument(db, 'movies', movie, function () {
                    db.close();

                    res.status(201).send('Success: movie schedule added');
                });
            }
        });
    });
});

app.put('/movies/:id', function (req, res) {
    const movie = Object.assign({}, req.body);
    delete movie._id;

    if(!req.params.id){
        res.status(500).json({
            error: 'invalid request',
        });
        return;
    }

    MongoClient.connect(mongodbUrl, function(err, db) {
        assert.equal(null, err);

        const queries = [];
        if (movie['movieCd']) queries.push( { 'movieCd': movie['movieCd']});
        if (movie['theater']) queries.push( { 'theater': movie['theater']});
        if (movie['showTime']) queries.push( { 'showTime': movie['showTime']});

        findDocument(db, 'movies', { $and: queries }, function(err, docs) {
            if (!err) {
                if(docs.length){
                    res.status(409).json({
                        error: 'conflict',
                    });
                    return;
                }

                const col = db.collection('movies');

                col.updateOne({_id: new ObjectId(req.params.id)}, {$set: movie}, function(err, r) {
                    assert.equal(null, err);
                    assert.equal(1, r.matchedCount);
                    assert.equal(1, r.modifiedCount);

                    db.close();

                    res.status(204).send('Success: movie schedule modified');
                });
            }
        });
    });
});

app.delete('/movies/:id', function (req, res) {
    if(!req.params.id){
        res.status(500).json({
            error: 'invalid request',
        });
        return;
    }

    MongoClient.connect(mongodbUrl, function(err, db) {
        assert.equal(null, err);

        const col = db.collection('movies');

        col.deleteOne({_id: new ObjectId(req.params.id)}, function(err, r) {
            assert.equal(null, err);
            assert.equal(1, r.deletedCount);

            db.close();

            res.status(204).send('Success: movie schedule modified');
        });
    });
});


//
// booking management
//
app.get('/booking/:movieScheduleId/:accountId', function (req, res) {
    const movieScheduleId = req.params['movieScheduleId'];
    const accountId = req.params['accountId'];

    MongoClient.connect(mongodbUrl, function(err, db) {
        assert.equal(null, err);

        db.collection('booking').findOne({
            $and: [{
                movieScheduleId: movieScheduleId,
                accountId: accountId,
            }],
        }, function(err, doc) {
            assert.equal(null, err);
            db.close();

            if (!err) {
                res.json(doc);
            }
        });
    });
});

app.post('/booking/:movieScheduleId/:accountId', function (req, res) {
    const movieScheduleId = req.params['movieScheduleId'];
    const accountId = req.params['accountId'];
    const seats = req.body['seats'];
    const bookingSeats = req.body['bookingSeats'];
    const cancelingSeats = req.body['cancelingSeats'];

    if(!movieScheduleId || !accountId){
        res.status(500).json({
            error: 'invalid request',
        });
        return;
    }

    MongoClient.connect(mongodbUrl, function(err, db) {
        assert.equal(null, err);

        const queries = [];
        if (movieScheduleId) queries.push({movieScheduleId: movieScheduleId});
        if (accountId) queries.push({accountId: accountId});

        const data = {
            movieScheduleId,
            accountId,
            seats,
        };

        // upsert booking info
        db.collection('booking').updateOne({$and: queries}, {$set: data}, {
            upsert: true
        }, function(err) {
            assert.equal(null, err);

            // update booking history
            const data = {
                movieScheduleId,
                accountId,
                overallBookedSeats: seats,
                bookedSeats: bookingSeats,
                canceledSeats: cancelingSeats,
                timestamp: new Date(),
            };

            db.collection('bookingHistory').insertOne(data, function(err) {
                assert.equal(null, err);
                db.close();

                res.status(204).send('Success: booking info updated');
            });
        });
    });
});

app.get('/bookingHistory/', function (req, res) {
    const accountId = req.query['accountId'];
    const movieScheduleId = req.query['movieScheduleId'];

    MongoClient.connect(mongodbUrl, function(err, db) {
        assert.equal(null, err);

        const queries = [];
        if (accountId) queries.push( { accountId: accountId});
        if (movieScheduleId) queries.push( { movieScheduleId: movieScheduleId});

        db.collection('bookingHistory').find(queries.length ? { $and: queries } : {}).toArray(function(err, historyData) {
            assert.equal(null, err);

            // added movie info to history
            db.collection('movies').find().toArray(function (err, moviesData) {
                assert.equal(null, err);
                db.close();

                const moviesObjects = {};
                moviesData.forEach((movie) => {
                    moviesObjects[movie['_id']] = {
                        movieCd: movie['movieCd'],
                        movieNm: movie['movieNm'],
                        theater: movie['theater'],
                        showTime: movie['showTime'],
                    }
                });

                const returnData = [];
                historyData.forEach((history) => {
                    returnData.push(Object.assign({}, history, moviesObjects[history['movieScheduleId']]))
                });

                res.json(returnData);
            });
        });
    });
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

const findDocument = function(db, collection, query, callback, sort) {
    let cursor = db.collection(collection).find(query);
    if (sort) {
        cursor = cursor.sort(sort);
    }

    cursor.toArray(function(err, docs) {
        assert.equal(err, null);
        if (docs !== null) {
            callback(err, docs);
        } else {
            callback(err);
        }
    });
};
