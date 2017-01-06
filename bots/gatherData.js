const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');

module.exports = {
  start() {
    const now = `${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
    const oneWeekAgo = moment().subtract(1, 'week').format('YYYY-MM-DDTHH:mm:ss');
    const oneYearAgo = moment().subtract(1, 'year').toISOString();
    const baseURL = 'https://data.seattle.gov/resource/y7pv-r3kh.json';
    const offense = 'offense_type=THEFT-BICYCLE';
    const dateRange = `$where=date_reported between '${oneWeekAgo}' and '${now}'`;

    MongoClient.connect('mongodb://localhost:27017/bike_data', (err, db) => {
      axios.get(`${baseURL}?${offense}&${dateRange}`)
        .then((theftsRaw) => {
          for (const theft in theftsRaw.data) {
            delete theft['census_tract_2000'];
            delete theft['district_sector'];
            delete theft['general_offense_number'];
            delete theft['hundred_block_location'];
            delete theft['location'];
            delete theft['month'];
            delete theft['offense_code'];
            delete theft['offense_type'];
            delete theft['offense_code_extension'];
            delete theft['rms_cdw_id'];
            delete theft['summarized_offense_description'];
            delete theft['summary_offense_code'];
            delete theft['year'];
            delete theft['zone_beat'];

            theft['occurred_date_range_start'] =
                                    theft['occurred_date_or_date_range_start'];
            theft['location'] = { type: 'Point',
                                     coordinates: [parseFloat(thefts[i]['longitude']),
                                                  parseFloat(thefts[i]['latitude'])]};

            delete theft['latitude'];
            delete theft['longitude'];
            delete theft['occurred_date_or_date_range_start'];
          }

            db.collection('thefts').insertMany(theftsRaw.data);
          })
        }
        .catch((err) => console.log(err));

      db.collection('thefts').remove({ 'date_reported': { $lt: oneYearAgo}});
    })
  }
}
