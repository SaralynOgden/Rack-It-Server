'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://heroku_rpc97sd7:88d7q96felsgqgo8rencshrhu0@ds021650.mlab.com:21650/heroku_rpc97sd7', (err, db) => {
  if (err) throw err;
  router.get('/racks/:lat/:lng', (req, res, next) => {
    const { lat, lng } = req.params;
    db.collection('racks').find({
      location: {
        $near: {
          $geometry: { type: "Point",
                       coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 770
        }
      }
    }).limit(20).toArray((err, racks) => {
      if (err) throw err;
      Promise.all(racks.map((rack) => {
        return db.collection('thefts').find({
          location: {
            $near: {
              $geometry: { type: "Point",
                           coordinates: rack.location.coordinates },
              $maxDistance: 100
            }
          }
        }).toArray();
      })).then((thefts) => {
        for (let i = 0; i < racks.length; i++) {
          racks[i]['thefts'] = thefts[i];
        }
        res.send(racks);
      })
    });
  });

  router.post('/racks', (req, res, next) => {
    const { address, color, location, rackCapacity } = req.body;

    db.collection('racks')
        .insertOne({ address, color, location,
                     rackCapacity, inputFrom: 'user' }, (result) => console.log(result));
  });
})

module.exports = router;
