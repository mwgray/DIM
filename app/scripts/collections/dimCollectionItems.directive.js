(function() {
  'use strict';

  var CollectionItem = {
    bindings: {
      saleItem: '<',
      itemData: '<'
    },
    template: [
      '<div class="collection-item">',
      '  <dim-simple-item id="vendor-{{::$ctrl.saleItem.item.itemHash}}" item-data="$ctrl.itemData" ng-class="{ \'search-hidden\': $ctrl.saleItem.isAcquired }"></dim-simple-item>',
      '</div>',
    ].join('')
  };

  var CollectionCategory = {
    bindings: {
      saleItemCategory: '<',
      itemMap: '<',
    },
    template: [
      '<h3>{{$ctrl.saleItemCategory.categoryTitle}}</h3>',
      '         <div class="collection-armor">',

      '<dim-collection-item ng-repeat="saleItem in $ctrl.saleItemCategory.saleItems" sale-item="saleItem" item-data="$ctrl.itemMap[saleItem.item.itemHash]"></dim-collection-item>',
      '         </div>',
    ].join('')
  };

  var CollectionItems = {
    controller: CollectionItemsCtrl,
    controllerAs: 'vm',
    bindings: {
      stores: '<storesData',
      collections: '<collectionsData',
      collectionHashes: '<collectionHashes',
      totalCoins: '<totalCoins'
    },
    template: [
      '<div class="collection-char-items" ng-repeat="(idx, collectionHash) in vm.collectionHashes" ng-init="firstCollection = vm.collections[0][collectionHash]">',
      ' <div ng-if="firstCollection">',
      '   <div class="collection-header">',
      '     <div class="title">',
      '     {{firstCollection.vendorName}}',
      '     <img class="collection-icon" ng-src="{{firstCollection.vendorIcon}}" />',
      '     <timer class="collection-timer" ng-if="firstCollection.nextRefreshDate[0] !== \'9\'" end-time="firstCollection.nextRefreshDate" max-time-unit="\'day\'" interval="1000">{{days}} day{{daysS}} {{hhours}}:{{mminutes}}:{{sseconds}}</timer>',
      '     </div>',
      '   </div>',
      '   <div class="collection-row">',
      '     <div class="char-cols store-cell" ng-repeat="store in vm.stores | sortStores:vm.settings.characterOrder track by store.id">',

      '     <dim-collection-category ng-repeat="saleItemCategory in store.vendors[collectionHash].saleItemCategories" sale-item-category="saleItemCategory" item-map="store.vendors[collectionHash].itemMap"</dim-collection-category>',

      '       <div ng-if="store.vendors[collectionHash].items.armor.length">',
      '         <h3 ng-if="store.vendors[collectionHash].items.armor.length && store.vendors[collectionHash].items.weapons.length">Armor</h3>',
      '         <div class="collection-armor">',
      '           <dim-collection-item ng-repeat="saleItem in store.vendors[collectionHash].items.armor" sale-item="saleItem" cost="store.vendors[collectionHash].costs[saleItem.hash]" total-coins="vm.totalCoins" item-clicked="vm.itemClicked(saleItem, $event)"></dim-collection-item>',
      '         </div>',
      '       </div>',

      '       <div ng-if="store.vendors[collectionHash].items.shaders.length">',
      '         <h3 ng-if="true">Shaders</h3>',
      '         <div class="collection-armor">',
      '           <dim-collection-item ng-repeat="saleItem in store.vendors[collectionHash].items.shaders" sale-item="saleItem" cost="store.vendors[collectionHash].costs[saleItem.hash]" total-coins="vm.totalCoins" item-clicked="vm.itemClicked(saleItem, $event)"></dim-collection-item>',
      '         </div>',
      '       </div>',

      '       <div ng-if="store.vendors[collectionHash].items.emotes.length">',
      '         <h3 ng-if="true">Emotes</h3>',
      '         <div class="collection-armor">',
      '           <dim-collection-item ng-repeat="saleItem in store.vendors[collectionHash].items.emotes" sale-item="saleItem" cost="store.vendors[collectionHash].costs[saleItem.hash]" total-coins="vm.totalCoins" item-clicked="vm.itemClicked(saleItem, $event)"></dim-collection-item>',
      '         </div>',
      '       </div>',

      '       <div ng-if="store.vendors[collectionHash].items.emblems.length">',
      '         <h3 ng-if="true">Emblems</h3>',
      '         <div class="collection-armor">',
      '           <dim-collection-item ng-repeat="saleItem in store.vendors[collectionHash].items.emblems" sale-item="saleItem" cost="store.vendors[collectionHash].costs[saleItem.hash]" total-coins="vm.totalCoins" item-clicked="vm.itemClicked(saleItem, $event)"></dim-collection-item>',
      '         </div>',
      '       </div>',

      '       <div ng-if="store.vendors[collectionHash].items.ships.length">',
      '         <h3 ng-if="true">Ships</h3>',
      '         <div class="collection-armor">',
      '           <dim-collection-item ng-repeat="saleItem in store.vendors[collectionHash].items.ships" sale-item="saleItem" cost="store.vendors[collectionHash].costs[saleItem.hash]" total-coins="vm.totalCoins" item-clicked="vm.itemClicked(saleItem, $event)"></dim-collection-item>',
      '         </div>',
      '       </div>',

      '       <div ng-if="store.vendors[collectionHash].items.vehicles.length">',
      '         <h3 ng-if="true">Vehicles</h3>',
      '         <div class="collection-armor">',
      '           <dim-collection-item ng-repeat="saleItem in store.vendors[collectionHash].items.vehicles" sale-item="saleItem" cost="store.vendors[collectionHash].costs[saleItem.hash]" total-coins="vm.totalCoins" item-clicked="vm.itemClicked(saleItem, $event)"></dim-collection-item>',
      '         </div>',
      '       </div>',

      '       <div ng-if="store.vendors[collectionHash].items.weapons.length">',
      '         <h3 ng-if="store.vendors[collectionHash].items.armor.length && store.vendors[collectionHash].items.weapons.length">Weapons</h3>',
      '         <div class="collection-weaps">',
      '           <dim-collection-item ng-repeat="saleItem in store.vendors[collectionHash].items.weapons" sale-item="saleItem" cost="store.vendors[collectionHash].costs[saleItem.hash]" total-coins="vm.totalCoins" item-clicked="vm.itemClicked(saleItem, $event)"></dim-collection-item>',
      '         </div>',
      '       </div>',

      '     </div>',
      '   </div>',
      ' </div>',
      '</div>'
    ].join('')
  };

  var CollectionItemsCombined = {
    controller: CollectionItemsCtrl,
    controllerAs: 'vm',
    bindings: {
      stores: '<storesData',
      collections: '<collectionsData',
      collectionHashes: '<collectionHashes',
      totalCoins: '<totalCoins'
    },
    template: [
      '<div class="collection-char-items" ng-init="firstCollection = vm.collections[0][vm.collectionHashes[0]]">',
      '  <div ng-if="firstCollection">',
      '    <div class="collection-header">',
      '      <div class="title">',
      '        Vanguard',
      '        <img class="collection-icon" ng-src="{{firstCollection.collectionIcon}}" />',
      '        <timer class="collection-timer" ng-if="firstCollection.nextRefreshDate[0] !== \'9\'" end-time="firstCollection.nextRefreshDate" max-time-unit="\'day\'" interval="1000">{{days}} day{{daysS}} {{hhours}}:{{mminutes}}:{{sseconds}}</timer>',
      '      </div>',
      '    </div>',
      '    <div class="collection-row">',
      '      <div class="char-cols store-cell" ng-repeat="store in vm.stores | sortStores:vm.settings.characterOrder track by store.id">',
      '        <div ng-repeat="(idx, collectionHash) in vm.collectionHashes">',
      '          <h3 ng-if="store.vendors[collectionHash].items.armor.length && store.vendors[collectionHash].items.weapons.length">Armor</h3>',
      '          <div class="collection-armor">',
      '            <dim-collection-item ng-repeat="saleItem in store.vendors[collectionHash].items.armor" sale-item="saleItem" cost="store.vendors[collectionHash].costs[saleItem.hash]" total-coins="vm.totalCoins" item-clicked="vm.itemClicked(saleItem, $event)"></dim-collection-item>',
      '          </div>',
      '          <h3 ng-if="store.vendors[collectionHash].items.armor.length && store.vendors[collectionHash].items.weapons.length">Weapons</h3>',
      '          <div class="collection-weaps">',
      '            <dim-collection-item ng-repeat="saleItem in store.vendors[collectionHash].items.weapons" sale-item="saleItem" cost="store.vendors[collectionHash].costs[saleItem.hash]" total-coins="vm.totalCoins" item-clicked="vm.itemClicked(saleItem, $event)"></dim-collection-item>',
      '          </div>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('')
  };

  angular.module('dimApp')
    .component('dimCollectionItem', CollectionItem)
    .component('dimCollectionCategory', CollectionCategory)
    .component('dimCollectionItems', CollectionItems)
    .component('dimCollectionItemsCombined', CollectionItemsCombined)
    .filter('sortStores', function() {
      return function sortStores(stores, order) {
        if (order === 'mostRecent') {
          return _.sortBy(stores, 'lastPlayed').reverse();
        } else if (order === 'mostRecentReverse') {
          return _.sortBy(stores, function(store) {
            if (store.isVault) {
              return Infinity;
            } else {
              return store.lastPlayed;
            }
          });
        } else {
          return _.sortBy(stores, 'id');
        }
      };
    });

  CollectionItemsCtrl.$inject = ['$scope', 'ngDialog', 'dimStoreService', 'dimSettingsService'];

  function CollectionItemsCtrl($scope, ngDialog, dimStoreService, dimSettingsService) {
    var vm = this;
    var dialogResult = null;
    var detailItem = null;
    var detailItemElement = null;

    vm.settings = dimSettingsService;

    $scope.$on('ngDialog.opened', function(event, $dialog) {
      if (dialogResult && $dialog[0].id === dialogResult.id) {
        $dialog.position({
          my: 'left top',
          at: 'left bottom+2',
          of: detailItemElement,
          collision: 'flip flip'
        });
      }
    });

    angular.extend(vm, {
      itemClicked: function(item, e) {
        e.stopPropagation();
        if (dialogResult) {
          dialogResult.close();
        }

        if (detailItem === item) {
          detailItem = null;
          dialogResult = null;
          detailItemElement = null;
        } else {
          detailItem = item;
          detailItemElement = angular.element(e.currentTarget);

          var compareItems = _.flatten(dimStoreService.getStores().map(function(store) {
            return _.filter(store.items, { hash: item.hash });
          }));

          var compareItemCount = sum(compareItems, 'amount');

          dialogResult = ngDialog.open({
            template: [
              '<div class="move-popup" dim-click-anywhere-but-here="closeThisDialog()">',
              '  <div dim-move-item-properties="vm.item" dim-compare-item="vm.compareItem"></div>',
              '  <div class="item-details more-item-details" ng-if="vm.item.equipment && vm.compareItems.length">',
              '    <div>Compare with what you already have:</div>',
              '    <div class="compare-items">',
              '      <dim-simple-item ng-repeat="ownedItem in vm.compareItems track by ownedItem.index" item-data="ownedItem" ng-click="vm.setCompareItem(ownedItem)" ng-class="{ selected: (ownedItem.index === vm.compareItem.index) }"></dim-simple-item>',
              '    </div>',
              '  </div>',
              '  <div class="item-description" ng-if="!vm.item.equipment">You have {{vm.compareItemCount}} of these.</div>',
              '</div>'].join(''),
            plain: true,
            overlay: false,
            className: 'move-popup collection-move-popup',
            showClose: false,
            scope: angular.extend($scope.$new(true), {
            }),
            controllerAs: 'vm',
            controller: [function() {
              var vm = this;
              angular.extend(vm, {
                item: item,
                compareItems: compareItems,
                compareItem: _.first(compareItems),
                compareItemCount: compareItemCount,
                setCompareItem: function(item) {
                  this.compareItem = item;
                }
              });
            }],
            // Setting these focus options prevents the page from
            // jumping as dialogs are shown/hidden
            trapFocus: false,
            preserveFocus: false
          });
        }
      },
      close: function() {
        if (dialogResult) {
          dialogResult.close();
        }
        $scope.closeThisDialog();
      }
    });
  }
})();
