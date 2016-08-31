(function() {
  'use strict';

  angular.module('dimApp')
    .controller('dimCollectionCtrl', dimCollectionCtrl);

  dimCollectionCtrl.$inject = ['$scope', '$state', '$q', 'dimItemDefinitions', 'dimStoreService', 'dimSettingsService'];

  function dimCollectionCtrl($scope, $state, $q, dimItemDefinitions, dimStoreService, dimSettingsService) {
    var vm = this;

    vm.settings = dimSettingsService;

    vm.collectionHashes = [
      // '2420628997', // Shader Collection
      // '3301500998', // Emblem Collection
      // '614738178', // Emote Collection
      // '44395194', // Vehicles
      // '2244880194', // Ship Collection
      // '1460182514', // Exotic Weapon Blueprints
      '3902439767', // Exotic Armor Blueprints
    ];

    function findOrPush(array, itemToPush, findFunction) {
      for(var i = 0; i < array.length; ++i) {
        var item = array[i]
        if(findFunction(item)) {
          return item
        }
      }

      array.push(itemToPush)

      return itemToPush
    }

    function getDefaultCollections(stores, itemDefinitions) {

      var defaultCollectionInfos = [
        {
          hash: '2420628997',
          queryFunction: function(item) { return item.itemTypeName == 'Armor Shader' }
        },
        {
          hash: '3301500998',
          queryFunction: function(item) { return item.itemTypeName == 'Emblem' }
        },
        {
          hash: '614738178',
          queryFunction: function(item) { return item.itemTypeName == 'Emote' }
        },
        {
          hash: '44395194',
          queryFunction: function(item) { return item.itemTypeName == 'Vehicle' }
        },
        {
          hash: '2244880194',
          queryFunction: function(item) { return item.itemTypeName == 'Ship' }
        },
        {
          hash: '1460182514',
          queryFunction: function(item) { return item.itemTypeName == 'Weapon' && item.tierTypeName == "Exotic" }
        },
        {
          hash: '3902439767',
          queryFunction: function(item) { return ['Helmet', 'Gauntlets', 'Chest Armor', 'Leg Armor'].indexOf(item.itemTypeName) >= 0 && item.tierTypeName == "Exotic" }
        },
      ]

      var characterStores = _.reject(stores, (s) => s.isVault);
      var charactersVendors = _.omit(_.pluck(characterStores, 'vendors'), function(value) { return !value; });

      var groups = []
      var alreadyHandledHashesForGroup = {}

      $.each(charactersVendors, function(i, characterVendors) {
        $.each(defaultCollectionInfos, function (i, defaultCollectionInfo) {

          var characterVendor = characterVendors[defaultCollectionInfo.hash]

          var group = findOrPush(groups, { name: characterVendor.vendorName, subgroups: [] }, function(group) {
            return group.name == characterVendor.vendorName
          })

          var groupHashes = alreadyHandledHashesForGroup[group.name] ? alreadyHandledHashesForGroup[group.name] : []
          alreadyHandledHashesForGroup[group.name] = groupHashes

          $.each(characterVendor.saleItemCategories, function (i, saleItemCategory) {

            var subGroup = findOrPush(group.subgroups, { name: saleItemCategory.categoryTitle, items: [] }, function(subGroup) {
              return subGroup.name == saleItemCategory.categoryTitle
            })

            $.each(saleItemCategory.saleItems, function (i, saleItem) {

              var item = findOrPush(subGroup.items, {hash: saleItem.item.itemHash, name: itemDefinitions[saleItem.item.itemHash].itemName}, function(item) {
                return item.hash == saleItem.item.itemHash
              })

              groupHashes.push(item.hash)
            })
          })
        })
      })

      $.each(charactersVendors, function(i, characterVendors) {
        $.each(defaultCollectionInfos, function (i, defaultCollectionInfo) {

          var characterVendor = characterVendors[defaultCollectionInfo.hash]

          var group = findOrPush(groups, { name: characterVendor.vendorName, subgroups: [] }, function(group) {
            return group.name == characterVendor.vendorName
          })

          var groupHashes = alreadyHandledHashesForGroup[group.name]

          // use the queryFunction to find untracked items
          $.each(itemDefinitions, function(itemHash, item) {
            if(defaultCollectionInfo.queryFunction(item)) {
              // passes the test, is it's hash already handled?
              if(groupHashes.indexOf(item.hash) == -1) {
                groupHashes.push(item.hash)

                var unclassifiedSubGroup = findOrPush(group.subgroups, { name: "Unclassified", items: [] }, function(subGroup) {
                  return subGroup.name == "Unclassified"
                })

                findOrPush(unclassifiedSubGroup.items, {hash: item.hash, name: itemDefinitions[item.itemHash].itemName}, function(item) {
                  return item.hash == itemHash
                })

              }
            }
          })
        })
      })

      console.log("Gathered default collections.")
    }

    function init(stores) {

      var itemsToTrack = {}

      dimItemDefinitions.then(function(itemDefs) {
        $.each(itemDefs, function(itemHash, item) {
          var itemTypeName = item.itemTypeName

          if (itemsToTrack[itemTypeName] == null) itemsToTrack[itemTypeName] = []

          switch (itemTypeName) {
            case "Armor Shader":
              //itemsToTrack[itemTypeName].append(item)
            break;

            default:
              //itemsToTrack[itemTypeName].append(item)
        //      console.log("Unhandled type: " + itemTypeName)
          }
        })

        console.log("Parsed")

        vm.stores = _.reject(stores, (s) => s.isVault);
        vm.collections = _.omit(_.pluck(vm.stores, 'vendors'), function(value) { return !value; });

        if(vm.collections[0]) {
          getDefaultCollections(stores, itemDefs)
          var combinedItems = {}

        }

        if(combinedItems != undefined) {

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
      })

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
