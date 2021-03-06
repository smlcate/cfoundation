app.controller('adminCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  $scope.item = {
    name: '',
    price: '', //the price we purchase the product for
    image: '',
    description: '',
    tags:'all'
  };

  $scope.carePackagePrice = 0;

  $scope.packageCosts = {
    tags:[
      {
        tag:'all',
        cost:0
      }
    ]
  };

  $scope.orders = [];

  $scope.newRibbon = {
    name:'',
    image:''
  };

  $scope.ribbons = [];

  $scope.editItemId;

  $scope.mode = 'view';
  // $scope.editItem = {
  //   name: '',
  //   price: '', //the price we purchase the product for
  //   image: '',
  //   description: '',
  //   tags:'all'
  // }

  $scope.careItems = [];

  $scope.itemImageInput = '';

  function buildDisplays() {

    console.log('HIIIIIT');

    var html = '<img src="{{ribbon.image}}" alt="" ng-repeat="ribbon in ribbons">';
    angular.element($('#ribbonsSpan')).append($compile(html)($scope))

    html = '<div class="careItemCells" id="{{$index}}CareItemCell" ng-repeat="item in careItems track by $index"><img src="{{item.image}}" alt=""><div class="careItemCellInfoDivs"><p>{{item.name}}</p><p>${{item.price}}</p></div><div class="careItemCellHeaders"><a href="" ng-click="removeCareItem(item, $index)">Remove</a><p>|</p><a href="" ng-click="editCareItem(item, $index)">Edit</a></div></div>'
    angular.element($('#carePackageItemsDiv')).append($compile(html)($scope))

  }

  function buildOrderCSV() {
    console.log('hit 2');
    var orders = $scope.orders;
    var rows = [
        ["Name", "Address", "City", "State","Zipcode","Country","Weight","Length","width","Height"]
    ];

    for (var i = 0; i < orders.length; i++) {
      var shipping = orders[i].orderData.shipping;
      var recipient = orders[i].orderData.recipient;
      rows.push([recipient.name,shipping.address,shipping.city,shipping.state,"47374","US","12","15","10","20"]);
      if (i == orders.length - 1) {
        let csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(",")).join("\n");

        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);

      }
    }

  }

  function getOrders() {
    $http.get('getOrders')
    .then(function(res) {
      console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].orderData = JSON.parse(res.data[i].orderData);
        $scope.orders.push(res.data[i]);
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  }


  function getItems() {
    $http.get('getItems')
    .then(function(res) {
      // console.log(res);
      $scope.careItems = [];
      for (var i = 0; i < res.data.length; i++) {
        var data = JSON.parse(res.data[i].itemData)
        $scope.careItems.push(data);
        $scope.careItems[i].id = res.data[i].id;

        if (data.tags.split(',')[0] == 'all') {

          $scope.packageCosts.tags[0].cost += data.price;
        }
        // console.log($scope.packageCosts.tags[0].cost);
        if (i == res.data.length -1) {
          // console.log($scope.packageCosts);
          for (var j = 0; j < $scope.careItems.length; j++) {
            var item = $scope.careItems[j];
            var tags = item.tags.split(',');
            if (tags[0] != 'all') {

              for (var k = 0; k < tags.length; k++) {

                var tag = tags[k]
                // var exists = false;
                for (var l = 0; l < $scope.packageCosts.tags.length; l++) {
                  // console.log(item.name,tag);
                  if ($scope.packageCosts.tags[l].tag == tag) {

                    $scope.packageCosts.tags[l].cost += item.price;
                    // console.log($scope.packageCosts.tags[l].cost);
                    l = $scope.packageCosts.tags.length;
                    // exists = true;
                  } else {
                    if (l == $scope.packageCosts.tags.length-1) {
                      $scope.packageCosts.tags.push({
                        tag:tag,
                        cost:$scope.packageCosts.tags[0].cost + item.price

                      })
                      if (j == $scope.careItems.length-1 && k == tags.length-1) {
                        buildDisplays();
                      }
                      l = $scope.packageCosts.tags.length;
                    }
                    // console.log($scope.packageCosts.tags);
                  }
                }
              }

              // console.log(tags);
            }

          }
        }
      }
      // console.log($scope.careItems);
      // console.log($scope.packageCosts);
    })
  }

  function getCarePackagePrice() {
    $http.get('getCarePackagePrice')
    .then(function(res) {
      console.log(res);
      $scope.carePackagePrice = Number(res.data[0].settingsData);
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  function getRibbons() {
    $http.get('getRibbons')
    .then(function(res) {
      console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {
        $scope.ribbons.push(JSON.parse(res.data[i].ribbonData))
      }
      // $scope.ribbons = res.data;
      console.log($scope.ribbons);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.thisAdminPage = function(p) {
    $('.adminPages').css('display','none');
    $('#'+p+'AdminPage').css('display','flex');
    console.log('hit');
  }

  $scope.saveCarePackagePrice = function() {
    $http.post('saveCarePackagePrice', {price:$scope.carePackagePrice})
    .then(function(res) {
      console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $('#newRibbonImageInput').click(function(){
      $(this).attr("value", "");
      console.log(this);
  })
  $('#newRibbonImageInput').change(function(e){

    var files = $('#newRibbonImageInput')[0].files;

    function readUrl(file) {
      console.log(file);
      var reader = new FileReader();

      reader.onload = function(){

        // take dataURL and push onto preview
        var dataURL = reader.result;

        $scope.newRibbon.image = dataURL;
        console.log($scope.newRibbon);
        $('#newRibbonImage').remove();

        var html = '<img id="newRibbonImage" src="' + $scope.newRibbon.image + '" alt="">';

        angular.element($('#newRibbonImageDiv')).append($compile(html)($scope))


      };
      reader.readAsDataURL(file);

    }

    readUrl(files[0])

  })

  $scope.addNewRibbon = function() {
    $http.post('addNewRibbon', {ribbon:$scope.newRibbon})
    .then(function(res) {
      // $scope.ribbons = res.data;
      $scope.ribbons = [];
      getRibbons();
      console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.newCareItem = function() {
    $('.careItemMangementDivs').css('display','none');
    $('#carePackageItemDiv').css('display','flex');
    $('#newItemBtn').css('display','none');
    $('#cancelBtn').css('display','flex');
    $scope.mode = 'new';
    $('.careItemTitles').css('display','none');
    $('#newCareItemTitle').css('display','flex');

    $('.submitButtons').css('display','none');
    $('#newCareItemButton').css('display','flex');
  }

  $scope.editCareItem = function(item, index) {
    $('.careItemMangementDivs').css('display','none');
    $('#carePackageItemDiv').css('display','flex');
    $('#cancelBtn').css('display','flex');
    $('#newItemBtn').css('display','none');

    $scope.mode = 'edit';

    $('.careItemTitles').css('display','none');
    $('#editCareItemTitle').css('display','flex');

    $scope.item = item;
    $scope.editItemId = index;

    $('.submitButtons').css('display','none');
    $('#editCareItemButton').css('display','flex');

    var html = '<img id="itemImage" src="' + $scope.item.image + '" alt="">';
    $('#itemImage').remove();
    angular.element($('#itemImageSpan')).append($compile(html)($scope))
  }
  $scope.cancel = function() {
    $('#newItemBtn').css('display','flex');
    $('#carePackageItemDiv').css('display','flex');
    $('.careItemMangementDivs').css('display','none');
    $('#cancelBtn').css('display','none');

    $('#itemImage').remove();

    $('.careItemTitles').css('display','none');
    $('#careItemTitle').css('display','flex');

    $scope.item = {
      name: '',
      price: '', //the price we purchase the product for
      image: '',
      description: '',
      tags:'all'
    };

    $scope.mode = 'view';
  }
  $scope.removeCareItem = function(item, index) {
    // $scope.mode = 'remove';

    $http.post('removeItem',{item:item})
    .then(function(res) {
      getItems();
    })
    .catch(function(err) {
      console.log(err);
    })

  }
  $scope.sendCareItem = function(mode) {

    $('.validationPrompts').css('display','none');

    var validates = true;

    if ($scope.item.name == '') {
      $('#nameValidationPrompt').css('display','flex');
      validates = false;
    }
    if ($scope.item.price == '') {
      $('#priceValidationPrompt').css('display','flex');
      validates = false;
    }
    if ($scope.item.image == '') {
      $('#imageValidationPrompt').css('display','flex');
      validates = false;
    }
    if ($scope.item.description == '') {
      $('#descriptionValidationPrompt').css('display','flex');
      validates = false;
    }

    if (validates == true) {
      console.log($scope.item);
      $('.validationPrompts').css('display','none');

      if ($scope.mode == 'new') {
        $http.post('addNewItem', {item:$scope.item})
        .then(function(res) {
          console.log(res);
          getItems();
        })
        .catch(function(err) {
          console.log(err);
        })
      } else {
        $http.post('editItem', {item:$scope.item})
        .then(function(res) {
          console.log(res);
          getItems();
        })
        .catch(function(err) {
          console.log(err);
        })
      }

    }

  }

  $scope.showImage = function() {
    // console.log($scope.itemImageInput);
    // $scope.item.image = $scope.itemImageInput;

  }

  $('#newImageInput').click(function(){
      $(this).attr("value", "");
      console.log(this);
  })
  $('#newImageInput').change(function(e){

    var files = $('#newImageInput')[0].files;

    function readUrl(file) {

      var reader = new FileReader();

      reader.onload = function(){

        // take dataURL and push onto preview
        var dataURL = reader.result;

        $scope.item.image = dataURL;

        $('#itemImage').remove();

        var html = '<img id="itemImage" src="' + $scope.item.image + '" alt="">';

        angular.element($('#itemImageSpan')).append($compile(html)($scope))


      };
      reader.readAsDataURL(file);

    }

    readUrl(files[0])

  })

  var onFileChanged = function(e) {
    var file = e.target.files[0];
    console.log(file);
    $scope.item.image = JSON.stringify(file);
    console.log($scope.item.image);
  }

  $scope.buildOrderCSV = function() {
    console.log('hit');
    buildOrderCSV();
  }

  function start() {

    $scope.thisAdminPage('carepackage');

    getItems();
    getCarePackagePrice();
    getRibbons();
    getOrders();
    if ($scope.careItems.length > 0) {
    }
  }
  start();

}])
