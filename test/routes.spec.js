var client = require('supertest')(require('../app'));
var expect = require('chai').expect;
var db = require('../db');
var SalesPerson = db.models.SalesPerson;
var SalesPersonRegion = db.models.SalesPersonRegion;
var Region = db.models.Region;
var Promise = require('bluebird');

describe('routes', function(){
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

  describe('DELETE /salesPersonRegions', function(){
    it('redirects back to backTo', function(done){
      Promise.all([
          SalesPerson.create({ name: 'Moe' }),
          Region.create({ zip: '10025' }),
      ])
      .spread(function(salesPerson, region){
        return SalesPersonRegion.create({ salesPersonId: salesPerson.id, regionId: region.id });
      })
      .then(function(salesPersonRegion){
        client.delete('/salesPersonRegions/' + salesPersonRegion.salesPersonId + '/' + salesPersonRegion.regionId + '?backTo=/foos')
          .expect(302)
          .end(function(err, result){
            if(err)
              return done(err);
            expect(result.header.location).to.equal('/foos');
            done();
          });
      })
    });
  });

  describe('POST /salesPersonRegions', function(){
    it('redirects back to backTo', function(done){
      Promise.all([
          SalesPerson.create({ name: 'Moe' }),
          Region.create({ zip: '10025' }),
      ])
      .spread(function(salesPerson, region){
        client.post('/salesPersonRegions/' + salesPerson.id + '/' + region.id + '?backTo=/foos')
          .expect(302)
          .end(function(err, result){
            if(err)
              return done(err);
            expect(result.header.location).to.equal('/foos');
            done();
          });
      })
    });
  });

  describe('POST /salesPeople', function(){
    it('redirects back to salesPeople', function(done){
      client.post('/salesPeople')
        .send('name=moe')
        .expect(302)
        .end(function(err, result){
          if(err)
            return done(err);
          expect(result.header.location).to.equal('/salesPeople');
          done();
        });
    });
  });

  describe('POST /regions', function(){
    it('redirects back to regions', function(done){
      client.post('/regions')
        .send('zip=10025')
        .expect(302)
        .end(function(err, result){
          if(err)
            return done(err);
          expect(result.header.location).to.equal('/regions');
          done();
        });
    });
  });
});
