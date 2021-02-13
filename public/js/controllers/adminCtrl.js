app.controller('adminCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  $scope.newItem = {
    name: '',
    price: '',
    image: '',
    description: ''
  }

  $scope.careItems = [];

  $scope.newItemImageInput = '';


  function getItems() {
    $http.get('getItems')
    .then(function(res) {
      console.log(res);
      $scope.careItems = [];
      for (var i = 0; i < res.data.length; i++) {
        $scope.careItems.push(JSON.parse(res.data[i].itemData));
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

  $scope.thisAdminPage = function(p) {
    $('.adminPages').css('display','none');
    $('#'+p+'AdminPage').css('display','flex');
    console.log('hit');
  }

  $scope.addCareItem = function() {

    $('.validationPrompts').css('display','none');

    var validates = true;

    if ($scope.newItem.name == '') {
      $('#nameValidationPrompt').css('display','flex');
      validates = false;
    }
    if ($scope.newItem.price == '') {
      $('#priceValidationPrompt').css('display','flex');
      validates = false;
    }
    if ($scope.newItem.image == '') {
      $('#imageValidationPrompt').css('display','flex');
      validates = false;
    }
    if ($scope.newItem.description == '') {
      $('#descriptionValidationPrompt').css('display','flex');
      validates = false;
    }

    if (validates == true) {
      console.log($scope.newItem);
      $('.validationPrompts').css('display','none');

      $http.post('addNewItem', {item:$scope.newItem})
      .then(function(res) {
        console.log(res);
        getItems();
      })
      .catch(function(err) {
        console.log(err);
      })

    }

  }

  $scope.showImage = function() {
    // console.log($scope.newItemImageInput);
    // $scope.newItem.image = $scope.newItemImageInput;

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

        $scope.newItem.image = dataURL;

        var html = '<img src="' + $scope.newItem.image + '" alt="">';

        angular.element($('#newItemImageSpan')).append($compile(html)($scope))

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
    // $scope.newItem.image = e.target.files[0];
    // console.log($scope.newItem.image);
    // console.log(JSON.stringify(e.target.files[0]));
    // $('#my-form').ajaxSubmit(options);
})

  var onFileChanged = function(e) {
    var file = e.target.files[0];
    console.log(file);
    $scope.newItem.image = JSON.stringify(file);
    console.log($scope.newItem.image);
  }

  function start() {

    $scope.thisAdminPage('carepackage');

    getItems();

  }
  start();

}])
