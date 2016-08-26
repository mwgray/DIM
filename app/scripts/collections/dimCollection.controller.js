(function() {
  'use strict';

  angular.module('dimApp')
    .controller('dimCollectionCtrl', dimCollectionCtrl);

  dimCollectionCtrl.$inject = ['$scope', '$state', '$q', 'dimStoreService', 'dimSettingsService'];

  function dimCollectionCtrl($scope, $state, $q, dimStoreService, dimSettingsService) {
    var vm = this;

    vm.settings = dimSettingsService;

    vm.collectionHashes = [
      '2420628997', // Shader Collection
      '3301500998', // Emblem Collection
      '614738178', // Emote Collection
      '44395194', // Vehicles
      '2244880194', // Ship Collection
      '1460182514', // Exotic Weapon Blueprints
      // '3902439767', // Exotic Armor Blueprints
    ];

    function init(stores) {
      vm.stores = _.reject(stores, (s) => s.isVault);
      vm.collections = _.omit(_.pluck(vm.stores, 'vendors'), function(value) { return !value; });

      if(vm.collections[0]) {
        // look at vendors here, per store, and filter by collection hashes.  from there hsould be able to create a copy that has a combined locked status.

        var combinedItems = {}

        vm.combinedCollections = {}
        $.each(vm.collectionHashes, function (i, collectionHash) {
          var combinedCollections = angular.copy(vm.collections[0][collectionHash]);
          vm.combinedCollections[collectionHash] = combinedCollections

          // get a hash -> item map of all items in combined collection
          // get a hash -> item map of all items across all collections
          // combined ||= isAcquired 1 || 2
          $.each(combinedCollections.saleItemCategories, function (i, saleItemCategory) {
            $.each(saleItemCategory.saleItems, function(i, saleItem) {
              combinedItems[saleItem.item.itemHash] = saleItem;
            })
          })
        })
      }

      if(combinedItems != undefined) {
        combinedItems = combinedItems

        // OR the isAcquired property of other collections
        $.each(vm.collections, function(k, collections) {
          if(collections == vm.collections[0]) {
            return
          }

          $.each(collections, function(k, collection) {

            if($.inArray(k, vm.collectionHashes) < 0) {
              return
            }

            $.each(collection.saleItemCategories, function (i, saleItemCategory) {
              $.each(saleItemCategory.saleItems, function(i, saleItem) {

                var hash = saleItem.item.itemHash
//                console.log("Hash: " + hash)

                if(hash == 855333071) {
                  hash = hash
                }

                var combinedIsAcquired = combinedItems[hash].isAcquired
                var saleItemIsAcquired = saleItem.isAcquired
                if(combinedIsAcquired != saleItemIsAcquired) {

                  console.log("Combining: " + hash)

                  combinedItems[hash].isAcquired = combinedIsAcquired || saleItem.isAcquired;
                }
              })
            })
          })
        })
      }

      // vm.collections[0] = vm.combinedCollections
    }

    init(dimStoreService.getStores());

    $scope.$on('dim-stores-updated', function(e, args) {
      init(args.stores);
    });


    if (_.isEmpty(vm.collections)) {
      $state.go('inventory');
      return;
    }

  }
})();
