var expect = require('chai').expect;
var db = require('../db');
var models = db.models;
var SalesPerson = models.SalesPerson;
var SalesPersonRegion = models.SalesPersonRegion;
var Region = models.Region;
var Promise = require('bluebird');

describe('Models', function(){
  before(function(done){
    db.sync()
      .then(function(){
        done();
      })
      .catch(done);
  });

  beforeEach(function(done){
    db.truncate()
      .then(function(){
        done();
      
      })
      .catch(done);
  });

  describe('Region', function(){
    it('it exists', function(){
      expect(Region).to.be.ok;
    });
    
    describe('#hasSalesPerson', function(){
      var moe, region10025, region10024;
      beforeEach(function(done){
        Promise.all([
          SalesPerson.create({ name: 'moe'}),
          Region.create({ zip: '10025' }),
          Region.create({ zip: '10024' })
        ])
        .spread(function(_moe, _region10025, _region10024){
          moe = _moe;
          region10025 = _region10025;
          region10024 = _region10024;

          return SalesPersonRegion.create({
            regionId: region10025.id,
            salesPersonId: moe.id
          });
        })
        .then(function(){
          return Promise.all([
            Region.findById(region10025.id, { include: [ SalesPersonRegion ]}),
            Region.findById(region10024.id, { include: [ SalesPersonRegion ]}),
          ])
        })
        .spread(function(_region10025, _region10024){
          region10025 = _region10025;
          region10024 = _region10024;
          done();
        })
        .catch(done);
      
      });
      it('region10025 has moe', function(){
        expect(region10025.hasSalesPerson(moe.id)).to.equal(true);
      });

      it('region10024 does not have moe', function(){
        expect(region10024.hasSalesPerson(moe.id)).to.equal(false);
      });
    });

    describe('creation', function(){
      var region10025;
      beforeEach(function(done){
        Region.create({ zip: '10025' })
          .then(function(_region10025){
            region10025 = _region10025;
            done();
          })
          .catch(done);
      });
      it('can be created', function(){
        expect(region10025.zip).to.equal('10025');
      });
    });
  });

  describe('SalesPerson', function(){
    it('it exists', function(){
      expect(SalesPerson).to.be.ok;
    });

    describe('#hasRegion', function(){
      var moe, region10025, region10024;
      beforeEach(function(done){
        Promise.all([
          SalesPerson.create({ name: 'moe'}),
          Region.create({ zip: '10025' }),
          Region.create({ zip: '10024' })
        ])
        .spread(function(_moe, _region10025, _region10024){
          moe = _moe;
          region10025 = _region10025;
          region10024 = _region10024;

          return SalesPersonRegion.create({
            regionId: region10025.id,
            salesPersonId: moe.id
          });
        })
        .then(function(){
          return SalesPerson.findById(moe.id, { include: [ SalesPersonRegion ]});
        })
        .then(function(_moe){
          moe = _moe;
          done();
        })
        .catch(done);
      
      });
      it('moe has region with zip of 10025', function(){
        expect(moe.hasRegion(region10025.id)).to.equal(true);
      });

      it('moe does not have region with zip of 10024', function(){
        expect(moe.hasRegion(region10024.id)).to.equal(false);
      });
    
    });

    describe('creation', function(){
      var moe;
      beforeEach(function(done){
        SalesPerson.create({ name: 'moe' })
          .then(function(_moe){
            moe = _moe;
            done();
          })
          .catch(done);
      });
      it('can be created', function(){
        expect(moe.name).to.equal('moe');
      });
    });
  });
});
