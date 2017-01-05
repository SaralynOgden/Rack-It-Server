const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');

module.exports = {
  start() {
    const now = `${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
    const oneWeekAgo = moment().subtract(1, 'week').format('YYYY-MM-DDTHH:mm:ss');
    const oneYearAgo = moment().subtract(1, 'year');
    const baseURL = 'https://data.seattle.gov/resource/y7pv-r3kh.json';
    const offense = 'offense_type=THEFT-BICYCLE';
    const dateRange = `$where=date_reported between '${oneWeekAgo}' and '${now}'`;

    MongoClient.connect('mongodb://localhost:27017/bike_data', (err, db) => {
      axios.get(`${baseURL}?${offense}&${dateRange}`)
        .then((theftsRaw) => {

            db.collection('thefts').insertMany();
          })
          console.log(thefts);
        }
        .catch((err) => console.log(err));

      // db.collection('thefts').find({date_reported > })
    })
  }
}
