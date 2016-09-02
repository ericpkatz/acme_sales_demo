var router = require('express').Router();
var Promise = require('bluebird');
var models = require('../db').models;
var Region = models.Region;
var SalesPerson = models.SalesPerson;
var SalesPersonRegion = models.SalesPersonRegion;

module.exports = router;

router.get('/', function(req, res, next){
  //what do we need here??
  //regions.. with the salesPeople
  //plus all salesPeople
  Promise.all([
      Region.findAll({ include: [ SalesPersonRegion ] }),
      SalesPerson.findAll()
  ])
  .spread(function(regions, salesPeople){
    res.render('regions', {
      regions: regions,
      salesPeople: salesPeople,
      mode: 'regions'
    });
  
  });
});

router.post('/', function(req, res, next){
  Region.create({
    zip: req.body.zip
  })
  .then(function(region){
    res.redirect('/regions');
  })
  .catch(next);
});
