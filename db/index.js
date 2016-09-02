var Sequelize = require('sequelize');
var db = new Sequelize(process.env.DATABASE_URL, {
  logging: false
});

var SalesPerson = db.define('sales_person', {
  name: Sequelize.STRING
}, {
  instanceMethods: {
    hasRegion: function(regionId){
      return this.sales_person_regions.filter(function(salesPersonRegion){
        return salesPersonRegion.regionId === regionId;
      }).length > 0;

    }
  }
});

var Region = db.define('region', {
  zip: Sequelize.STRING
}, {
  instanceMethods: {
    hasSalesPerson: function(salesPersonId){
      return this.sales_person_regions.filter(function(salesPersonRegion){
        return salesPersonRegion.salesPersonId === salesPersonId;
      }).length > 0;
    }
  }

});

var SalesPersonRegion = db.define('sales_person_region', {});

SalesPersonRegion.belongsTo(Region);
SalesPersonRegion.belongsTo(SalesPerson);

SalesPerson.hasMany(SalesPersonRegion);
Region.hasMany(SalesPersonRegion);

module.exports = {
  models: {
    SalesPerson: SalesPerson,
    Region: Region,
    SalesPersonRegion: SalesPersonRegion
  },
  sync: function(){
    return db.sync({force: true });
  },
  truncate: function(){
    //perhaps put some restrictions - only if CONN is test**
    return SalesPersonRegion.destroy({ where: {} })
      .then(function(){
        return Promise.all([
            SalesPerson.destroy( { where: {} }),
            Region.destroy( { where: {} })
        ]);
      })
  }
};
