var router = require('express').Router();
var models = require('../db').models;
var SalesPersonRegion = models.SalesPersonRegion;

module.exports = router;

router.delete('/:salesPersonId/:regionId', function(req, res, next){
  SalesPersonRegion.destroy({ where: {
        salesPersonId: req.params.salesPersonId,
        regionId: req.params.regionId
        }
  })
  .then(function(){
    res.redirect(req.query.backTo);
  })
  .catch(next);
});

router.post('/:salesPersonId/:regionId', function(req, res, next){
  SalesPersonRegion.create({
    salesPersonId: req.params.salesPersonId,
    regionId: req.params.regionId
  })
  .then(function(){
    res.redirect(req.query.backTo);
  })
  .catch(next);
});
