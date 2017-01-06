const fs = require('fs');

return fs.readFile('./raw-seattle-bike-racks.json', 'utf8', (err, data) => {
  if (err) throw err;

  const racks = JSON.parse(data);
  for (let i = racks.length - 1; i >= 0; i--) {
    delete racks[i][':@computed_region_kuhn_3gp2'];
    delete racks[i][':@computed_region_q256_3sug'];
    delete racks[i]['asset_cond'];
    delete racks[i]['bike_facil'];
    delete racks[i]['compkey'];
    delete racks[i]['comptype'];
    delete racks[i]['condition'];
    delete racks[i]['_condition'];
    delete racks[i]['condition_'];
    delete racks[i]['delineator'];
    delete racks[i]['distance'];
    delete racks[i]['finish_typ']
    delete racks[i]['manufactur'];
    delete racks[i]['model_type'];
    delete racks[i]['mount_type'];
    delete racks[i]['objectid'];
    delete racks[i]['rack_location'];
    delete racks[i]['segkey'];
    delete racks[i]['surface_ty'];
    delete racks[i]['unitid'];
    delete racks[i]['unittype'];
    delete racks[i]['width'];

    racks[i]['address'] = racks[i]['unitdesc'].replace(/ *\([^)]*\) */, "")
                                              .replace(/\d{4}[A-z ]+SIDE/, "")
                                              .toLowerCase();
    racks[i]['location'] = { type: 'Point',
                             coordinates: [parseFloat(racks[i]['longitude']),
                                           parseFloat(racks[i]['latitude'])] };
    racks[i]['rack_capacity'] = parseInt(racks[i]['rack_capac']);
    if (racks[i].hasOwnProperty('color')) {
      racks[i]['color'] = racks[i]['color'].toLowerCase();
    }

    delete racks[i]['latitude'];
    delete racks[i]['longitude'];
    delete racks[i]['rack_capac'];
    delete racks[i]['unitdesc'];
  }
  fs.writeFile('./seattle-bike-racks.json', JSON.stringify(racks), (err) => {
    if (err) throw err;
  })
})
