app.controller('adminCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  $scope.item = {
    name: '',
    price: '', //the price we purchase the product for
    image: '',
    description: '',
    tags:'all'
  }

  $scope.carePackagePrice = 0;

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


  function getItems() {
    $http.get('getItems')
    .then(function(res) {
      console.log(res);
      $scope.careItems = [];
      for (var i = 0; i < res.data.length; i++) {
        $scope.careItems.push(JSON.parse(res.data[i].itemData))
        $scope.careItems[i].id = res.data[i].id;
        // if (i == res.data.length -1) {
        //   for (var j = 0; j < $scope.careItems.length; j++) {
        //     console.log($scope.careItems[j].image);
        //     $('#'+j+'CareItemCell').css('background-image','url('+$scope.careItems[j].image+')');
        //   }
        // }
      }
      console.log($scope.careItems);
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

  $('input[type=file]').click(function(){
      $(this).attr("value", "");
      console.log(this);
  })
  $('input[type=file]').change(function(e){

    var files = $('#newImageInput')[0].files;

    // var urls = [];
    //
    // var i = 0;

    function readUrl(file) {

      var reader = new FileReader();

      reader.onload = function(){

        // take dataURL and push onto preview
        var dataURL = reader.result;

        $scope.item.image = dataURL;

        $('#itemImage').remove();

        var html = '<img id="itemImage" src="' + $scope.item.image + '" alt="">';

        angular.element($('#itemImageSpan')).append($compile(html)($scope))

        // urls.push(dataURL);



        // $http.post('uploadImage', {data:dataURL})
        // .then(function(res) {
        //   // console.log(res.data);
        // })
        // .catch(function(err) {
        //   console.log(err);
        // })
        //
        // if (urls.length < files.length) {
        //   i++;
        //   readUrl(files[i])
        // }

      };
      reader.readAsDataURL(file);

    }

    readUrl(files[0])
    // console.log(this);
    // console.log(e.target.files[0]);
    // $scope.item.image = e.target.files[0];
    // console.log($scope.item.image);
    // console.log(JSON.stringify(e.target.files[0]));
    // $('#my-form').ajaxSubmit(options);
})

  var onFileChanged = function(e) {
    var file = e.target.files[0];
    console.log(file);
    $scope.item.image = JSON.stringify(file);
    console.log($scope.item.image);
  }

  function start() {

    $scope.thisAdminPage('carepackage');

    getItems();
    getCarePackagePrice();

  }
  start();

}])
