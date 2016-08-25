(function() {
  'use strict';

  angular.module('dimApp')
    .controller('dimCollectionCtrl', dimCollectionCtrl);

  dimCollectionCtrl.$inject = ['$scope', '$state', '$q', 'dimStoreService', 'dimSettingsService'];

  function dimCollectionCtrl($scope, $state, $q, dimStoreService, dimSettingsService) {
    var vm = this;

    vm.settings = dimSettingsService;

    function init(stores) {
      vm.stores = _.reject(stores, (s) => s.isVault);
      vm.collections = _.omit(_.pluck(vm.stores, 'vendors'), function(value) { return !value; });
      countCurrencies(stores);
    }

    init(dimStoreService.getStores());

    $scope.$on('dim-stores-updated', function(e, args) {
      init(args.stores);
    });


    if (_.isEmpty(vm.collections)) {
      $state.go('inventory');
      return;
    }

    vm.collectionHashes = [
      '2420628997', // Shader Collection
      '3301500998', // Emblem Collection
      '614738178', // Emote Collection
      '44395194', // Vehicles
      '2244880194', // Ship Collection
      '1460182514', // Exotic Weapon Blueprints
      '3902439767', // Exotic Armor Blueprints
    ];

    function mergeMaps(o, map) {
      _.each(map, function(val, key) {
        if (!o[key]) {
          o[key] = map[key];
        }
      });
      return o;
    }

    function countCurrencies(stores) {
      var currencies = _.chain(vm.collections)
            .values()
            .reduce(function(o, val) { o.push(_.values(val)); return o; }, [])
            .flatten()
            .pluck('costs')
            .reduce(mergeMaps)
            .values()
            .pluck('currency')
            .pluck('itemHash')
            .unique()
            .value();
      vm.totalCoins = {};
      currencies.forEach(function(currencyHash) {
        // Legendary marks and glimmer are special cases
        if (currencyHash === 2534352370) {
          vm.totalCoins[currencyHash] = sum(stores, function(store) {
            return store.legendaryMarks || 0;
          });
        } else if (currencyHash === 3159615086) {
          vm.totalCoins[currencyHash] = sum(stores, function(store) {
            return store.glimmer || 0;
          });
        } else {
          vm.totalCoins[currencyHash] = sum(stores, function(store) {
            return store.amountOfItem({ hash: currencyHash });
          });
        }
      });
    }
  }
})();
