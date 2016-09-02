var router = require('express').Router();
var models = require('../db').models;
var Promise = require('bluebird');
var SalesPerson = models.SalesPerson;
var Region = models.Region;
var SalesPersonRegion = models.SalesPersonRegion;

module.exports = router;

router.get('/', function(req, res, next){
  Promise.all([
      SalesPerson.findAll({ include: [ SalesPersonRegion ] }),
      Region.findAll()
  ])
  .spread(function(salesPeople, regions){
    res.render('salesPeople', {
      mode: 'salesPeople',
      salesPeople: salesPeople,
      regions: regions
    });
  })
  .catch(next);
});

router.post('/', function(req, res, next){
  SalesPerson.create({
    name: req.body.name
  })
  .then(function(salesPerson){
    res.redirect('/salesPeople');
  })
  .catch(next);
});
