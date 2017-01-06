const fs = require('fs');

fs.readFile('./raw-seattle-bike-thefts.json', 'utf8', (err, data) => {
  if (err) throw err;

  const thefts = JSON.parse(data);
  for (let i = thefts.length - 1; i >= 0; i--) {
    if (new Date(thefts[i]['occurred_date_or_date_range_start']) <
        new Date('2016-05-01T00:00:00.000')) {
      thefts.splice(i, 1);
    } else {
      delete thefts[i]['census_tract_2000'];
      delete thefts[i]['district_sector'];
      delete thefts[i]['general_offense_number'];
      delete thefts[i]['hundred_block_location'];
      delete thefts[i]['location'];
      delete thefts[i]['month'];
      delete thefts[i]['offense_code'];
      delete thefts[i]['offense_type'];
      delete thefts[i]['offense_code_extension'];
      delete thefts[i]['rms_cdw_id'];
      delete thefts[i]['summarized_offense_description'];
      delete thefts[i]['summary_offense_code'];
      delete thefts[i]['year'];
      delete thefts[i]['zone_beat'];

      thefts[i]['occurred_date_range_start'] =
                              thefts[i]['occurred_date_or_date_range_start'];
      thefts[i]['location'] = { type: 'Point',
                               coordinates: [parseFloat(thefts[i]['longitude']),
                                            parseFloat(thefts[i]['latitude'])]};

      delete thefts[i]['latitude'];
      delete thefts[i]['longitude'];
      delete thefts[i]['occurred_date_or_date_range_start'];
    }
  }
  fs.writeFile('./seattle-bike-thefts.json', JSON.stringify(thefts), (err) => {
    if (err) throw err;
  })
})
