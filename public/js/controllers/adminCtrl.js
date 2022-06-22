app.controller('adminCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  $scope.item = {
    name: '',
    price: '', //the price we purchase the product for
    image: '',
    description: '',
    tags:'all'
  };

  $scope.newShippingRates = [];
  $scope.newShippingRatesName = '';

  $scope.shippingRates = [];

  $scope.tierShippingRates = [];

  $scope.packageDimensions = {};
  $scope.shippingTier = 0;

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

  $scope.donations = [];

  $scope.newRibbon = {
    name:'',
    colors:[],
    build: {}
    // image:''
  };

  $scope.ribbonToEdit = {
    name:'',
    image:''
  };

  $scope.editRibbon = false;
  $scope.ribbons = [];

  $scope.editItemId;

  $scope.mode = 'view';

  $scope.careItems = [];

  $scope.itemImageInput = '';

  $scope.testimonialSettings = {
    inputs:{
      name:'Anonymous',
      testimonial:'',
      ribbons:[]
    },
    toEdit:{}, //Selected Testimonial
    mode:'new'
  }

  function buildDisplays() {

    var svg = '<svg ng-repeat="ribbon in ribbons" height="" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 1024 1024" width="3em" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:vectornator="http://vectornator.io" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><clipPath id="TextBounds"><rect height="861.588" transform="matrix(0.614981 -0.788542 0.788542 0.614981 -275.584 92.8005)" width="683.244" x="213.828" y="160.239"/></clipPath></defs><clipPath id="ArtboardFrame"><rect height="1024" width="1024" x="0" y="0"/></clipPath><g clip-path="url(#ArtboardFrame)" id="Layer-1" vectornator:layerName="Layer 1"><path d="M337.357 56.1719C337.357 56.1719 364.349 2.38001 499.309 2.38001C634.27 2.38001 661.262 56.1719 661.262 56.1719C661.262 56.1719 688.254 190.652 634.27 217.548C634.27 217.548 602.689 190.652 499.309 190.652C395.93 190.652 364.349 217.548 364.349 217.548C312.902 203.266 337.357 56.1719 337.357 56.1719Z" fill="{{ribbon.ribbonData.colors.dark}}" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M599.531 277.526C641.962 214.643 665.149 146.542 665.149 115.128C665.149 83.6596 661.262 56.1719 661.262 56.1719C661.262 56.1719 738.405 226.45 761.537 281.452C784.67 336.508 753.818 411.198 722.966 458.347C692.114 505.549 279.459 1024.43 279.459 1024.43L121.42 890.753C121.42 890.753 557.126 340.408 599.531 277.526Z" fill="{{ribbon.ribbonData.colors.secondary}}" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M877.198 890.753L719.16 1024.43C719.16 1024.43 306.532 505.549 275.653 458.347C244.801 411.198 213.949 336.508 237.081 281.452C260.213 226.45 337.357 56.1719 337.357 56.1719C337.357 56.1719 333.47 83.6596 333.47 115.128C333.47 146.542 356.629 214.643 399.088 277.526C441.492 340.408 877.198 890.753 877.198 890.753Z" fill="{{ribbon.ribbonData.colors.primary}}" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M499.309 746.86C452.694 687.769 406.106 628.464 367.318 578.733C355.846 593.338 344.402 607.915 333.011 622.412C372.527 673.057 418.981 732.094 464.921 790.351C476.312 775.988 487.784 761.438 499.309 746.86ZM499.309 409.719C538.421 460.149 584.658 519.293 631.301 578.733C643.555 562.999 654.973 548.287 665.392 534.839C616.941 473.086 571 414.238 533.373 365.664C522.819 379.354 511.429 394.066 499.309 409.719Z" fill="{{ribbon.ribbonData.colors.shadow}}" fill-rule="evenodd" opacity="1" stroke="none"/></g><g id="Name" vectornator:layerName="Name"><text class="ribbonTexts" clip-path="url(#TextBounds)" fill="#efe9f0" font-family="Helvetica-Bold" font-size="{{ribbon.ribbonData.fontSize}}" opacity="1" stroke="none" text-anchor="middle" transform="matrix(0.614981 0.788542 -0.788542 0.614981 242.656 160.239)" vectornator:text="Multiple&#x20;Myeloma" vectornator:width="100%" x="0" y="0"><tspan x="532.062" y="97">{{ribbon.ribbonData.name}}</tspan></text></g></svg>';
    angular.element($('#ribbonsSpan')).append($compile(svg)($scope))

    html = '<div class="careItemCells" id="{{$index}}CareItemCell" ng-repeat="item in careItems track by $index"><img src="{{item.image}}" alt=""><div class="careItemCellInfoDivs"><p>{{item.name}}</p><p>${{item.price}}</p></div><div class="careItemCellHeaders"><a href="" ng-click="removeCareItem(item, $index)">Remove</a><p>|</p><a href="" ng-click="editCareItem(item, $index)">Edit</a></div></div>'
    angular.element($('#carePackageItemsDiv')).append($compile(html)($scope))

  }

  function buildOrderCSV() {
    var orders = $scope.orders;
    var rows = [
        ["Name", "Address", "City", "State","Zipcode","Country","Weight","Length","width","Height","Diagnosies","Diagnosies2","Diagnosies3"]
    ];

    for (var i = 0; i < orders.length; i++) {
      var shipping = orders[i].orderData.shipping;
      var recipient = orders[i].orderData.recipient;
      rows.push([recipient.name,shipping.address,shipping.city,shipping.state,"47374","US","12","15","10","20",recipient.diagnosies]);
      if (i == orders.length - 1) {
        let csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(",")).join("\n");

        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);

      }
    }

  }

  function getDonations() {
    $http.get('getDonations')
    .then(function(res) {
      for (var i = 0; i < res.data.length; i++) {
        $scope.donations.push(JSON.parse(res.data[i].donation_data));
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function getOrders() {
    $http.get('getOrders')
    .then(function(res) {
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].orderData = JSON.parse(res.data[i].orderData);
        $scope.orders.push(res.data[i]);

      }
      console.log($scope.orders);
    })
    .catch(function(err) {
      console.log(err);
    })
  }


  function getItems() {
    $http.get('getItems')
    .then(function(res) {
      $scope.careItems = [];
      for (var i = 0; i < res.data.length; i++) {
        var data = JSON.parse(res.data[i].itemData)
        $scope.careItems.push(data);
        $scope.careItems[i].id = res.data[i].id;

        if (data.tags.split(',')[0] == 'all') {

          $scope.packageCosts.tags[0].cost += data.price;
        }
        if (i == res.data.length -1) {
          for (var j = 0; j < $scope.careItems.length; j++) {
            var item = $scope.careItems[j];
            var tags = item.tags.split(',');
            if (tags[0] != 'all') {

              for (var k = 0; k < tags.length; k++) {

                var tag = tags[k]
                for (var l = 0; l < $scope.packageCosts.tags.length; l++) {
                  if ($scope.packageCosts.tags[l].tag == tag) {

                    $scope.packageCosts.tags[l].cost += item.price;
                    l = $scope.packageCosts.tags.length;
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
                  }
                }
              }

            } else if(j == $scope.careItems.length-1) {
              for (var k = 0; k < $scope.packageCosts.tags.length; k++) {
                $scope.packageCosts.tags[k].cost = $scope.packageCosts.tags[k].cost.toFixed(2);
              }
              buildDisplays();
            }

          }
        }
      }
    })
  }

  function getCarePackagePrice() {
    $http.get('getCarePackagePrice')
    .then(function(res) {
      $scope.carePackagePrice = Number(res.data[0].settingsData);
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  function getRibbons() {
    $http.get('getRibbons')
    .then(function(res) {
      for (var i = 0; i < res.data.length; i++) {
        $scope.ribbons.push({id:res.data[i].id, ribbonData:JSON.parse(res.data[i].ribbonData)})
      }
      console.log($scope.ribbons);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function findShippingTier() {
    for (var i = 0; i < $scope.shippingRates.length; i++) {
      console.log($scope.shippingRates[i].rates);
      $scope.tierShippingRates.push([$scope.shippingRates[i].rates[Math.floor($scope.shippingTier)+1]]);
    }
    console.log($scope.tierShippingRates);
  }

  function getPackageDimensions() {
    $http.get('getPackageDimensions').then(function(res) {
      console.log(res.data);
      $scope.packageDimensions = res.data[res.data.length - 1];
      $scope.packageDimensions = JSON.parse($scope.packageDimensions.package_dimensions_data);
      var dim = $scope.packageDimensions;
      if(dim.length * dim.width * dim.height / 166 > dim.weight) {
        $scope.shippingTier = dim.length * dim.width * dim.height / 166;
      } else {
        $scope.shippingTier = dim.weight;
      }
      console.log($scope.shippingTier);
      console.log($scope.packageDimensions);
      findShippingTier();
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function getShippingRates() {
    $http.get('getShippingRates').then(function(res) {
      console.log(res.data);
      for (var i = 0; i < res.data.length; i++) {

        $scope.shippingRates.push(JSON.parse(res.data[i].shippingRate_data));
      }
      console.log($scope.shippingRates);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.thisAdminPage = function(p) {
    $('.adminPages').css('display','none');
    $('#'+p+'AdminPage').css('display','flex');

    $('#adminNav a').css('background','none');
    $('#adminNav a').css('color','#C4B0FF');

    $('#'+p+'NavAnc').css('background','#C4B0FF');
    $('#'+p+'NavAnc').css('color','#ffff63');

  }

  $scope.saveDimensionChanges = function() {
    $http.post('savePackageDimensions', JSON.stringify({length:$scope.boxSize.length,width:$scope.boxSize.width,height:$scope.boxSize.height,weight:$scope.boxSize.weight}))
    .then(function(res) {
      console.log(res.data);
    })
  }

  $scope.uploadShippingRates = function() {

    const myForm = document.getElementById("shippingRatesForm");
    const csvFile = document.getElementById("shippingCsvInput");

    var parsedRates = [];
    var seperatedRates = [];

    // let valuesRegExp = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g;

    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      console.log(event.target.result); // the CSV content as string
      parsedRates = event.target.result.split(',');
      var rateRow = [];
      var counter = 0;
      var rowCounter = 0;
      for (var i = 121; i < parsedRates.length; i++) {
        rateRow.push(parsedRates[i].split('\\')[0]);
        if (counter < 8) {
          counter ++;
        } else {
          seperatedRates.push(rateRow);
          rateRow = [];
          counter = 0;
          // var html = '<div class="shippingRateRows"><div class="shippingRateCells" ng-repeat="rate in newShippingRates['+rowCounter+']"><p>{{rate}}</p></div></div>';
          //
          // angular.element($('#shippingRatesDisplay')).append($compile(html)($scope))

          rowCounter ++;
          if (i == parsedRates.length - 1) {
            // $scope.newShippingRates = seperatedRates;
            $http.post('uploadShippingRates',JSON.stringify({name:$scope.newShippingRatesName,rates:seperatedRates}))
            .then(function (res) {
              console.log(res.data);
            })
            .catch(function (err) {
              console.log(err);
            })
          }
        }
      }
      console.log(parsedRates);
      console.log(seperatedRates);
    };
    reader.readAsText(input);

  }


  $scope.editCarePackagePrice = function() {
    $('#saveCPPriceBtn, #cancelCPEditBtn').css('display','flex');
    $('#editCPPriceBtn').css('display','none');
    $('#carePackagePriceInput').css('display','flex');
    $('#carePackagePriceText').css('display','none');
  }
  $scope.cancelEditCarePackagePrice = function() {
    $('#saveCPPriceBtn, #cancelCPEditBtn').css('display','none');
    $('#editCPPriceBtn').css('display','flex');
    $('#carePackagePriceInput').css('display','none');
    $('#carePackagePriceText').css('display','flex');
  }
  $scope.saveCarePackagePrice = function() {
    $http.post('saveCarePackagePrice', {price:$scope.carePackagePrice})
    .then(function(res) {
      // console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    })
  }


  $('#newRibbonImageInput').click(function(){
      $(this).attr("value", "");
  })
  $('#newRibbonImageInput').change(function(e){

    var files = $('#newRibbonImageInput')[0].files;

    function readUrl(file) {
      var reader = new FileReader();

      reader.onload = function(){

        // take dataURL and push onto preview
        var dataURL = reader.result;

        $scope.newRibbon.image = dataURL;

        $('#newRibbonImage').remove();

        var html = '<img id="newRibbonImage" src="' + $scope.newRibbon.image + '" alt="">';

        angular.element($('#newRibbonImageDiv')).append($compile(html)($scope))


      };
      reader.readAsDataURL(file);

    }

    readUrl(files[0])

  })

  $('#editRibbonImageInput').click(function(){
      $(this).attr("value", "");
  })
  $('#editRibbonImageInput').change(function(e){

    var files = $('#editRibbonImageInput')[0].files;

    function readUrl(file) {
      var reader = new FileReader();

      reader.onload = function(){

        // take dataURL and push onto preview
        var dataURL = reader.result;

        $scope.ribbonToEdit.ribbonData.image = dataURL;
        $('#editRibbonImage').remove();

        var html = '<img id="editRibbonImage" src="' + $scope.ribbonToEdit.image + '" alt="">';

        angular.element($('#editRibbonImageDiv')).append($compile(html)($scope))


      };
      reader.readAsDataURL(file);

    }

    readUrl(files[0])

  })


  $scope.addTestimonial = function() {
    var t = $scope.testimonialSettings.inputs;

    $http.post('addTestimonial', {testimonial_data:JSON.stringify(t)})
    .then(function(res) {
      console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.thisTestimonial = function(t) {
    console.log(t);
    var hold = {
      id:t.id,
      index:t.index,
      name:t.testimonial_data.name,
      testimonial:t.testimonial_data.testimonial
    };
    $scope.testimonialSettings.toEdit = hold;
    $scope.testimonialSettings.inputs = t.testimonial_data;
    $scope.testimonialSettings.mode = 'edit';
  }

  $scope.cancelTestimonialEdit = function() {
    $scope.testimonials[$scope.testimonialSettings.toEdit.index] = {testimonial_data:$scope.testimonialSettings.toEdit};
    $scope.testimonialSettings.toEdit = {};
    $scope.testimonialSettings.inputs = {
      name:'Annonymous',
      testimonial:''
    };
    $scope.testimonialSettings.mode = 'new';
    console.log($scope.testimonials)
  }

  $scope.editTestimonial = function() {
    var t = {
      id: $scope.testimonialSettings.toEdit.id,
      testimonial_data: JSON.stringify($scope.testimonialSettings.inputs)
    }
    $http.post('editTestimonial', t)
    .then(function(res) {
      console.log(res);
      $scope.testimonialSettings.mode = 'new';
      $scope.testimonialSettings.inputs = {
        name:'Annonymous',
        testimonial:''
      };
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.removeTestimonial = function() {
    $http.post('removeTestimonial', {id:$scope.testimonialSettings.toEdit.id})
    .then(function(res) {
      console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  $scope.newRibbonPreview = function() {
      // colors to add:     all #B395D6, brain #C0C0C0, breast #FF69B4, Childhood #FFD700, colon #06008B, esophageal #B29CD9, head #810020 #FFFFEF, kidney #32CD32, leiomysarcoma #690BD3, leukemia #FFA500, liver #04A86B, lung #E9E0C8, lymphoma #8F00FF, melanoma #151516, multiple myeloma #810020, overian #008080, pancreatic #800080, prostate #AED8E6, sarcoma #E2E130, stomach #C2CCFF, testicular #DA70D6, thyroid #FEC0CA #1500FF #008080, uterine #FFBFA3, rectal #45B7FE, gynecological #800080, bladder #002266 #690BD3 #D8D722, cervical #008080 #F8F8FE
    var ribbon = {
      colors: {
        primary:'#BA68C8',
        secondary:'#AB46BB',
        dark:'#6A1B99',
        shadow:'#883795'
      },
      name:$scope.newRibbon.name,
      fontSize:100
    }

    if (ribbon.name.length <= 9) {
      ribbon.fontSize = 130;
    }
    if (ribbon.name.length >= 12) {
      ribbon.fontSize = 90;
    }
    // if ($scope.ribbons.colors[1].length = 0 && $scope.ribbons.colors[2].length = 0) {
    //
    // } else {
    //   result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec($scope.newRibbon.colors[1]);
    // }
    var i = 0;
    var secondHandled = false;
    function handleShader() {
      console.log($scope.newRibbon.colors);
      var result;
      if($scope.newRibbon.colors[1] && $scope.newRibbon.colors[2] && $scope.newRibbon.colors[1].length > 0 && $scope.newRibbon.colors[2].length > 0) {
        // THREE colors
        console.log('three colors');
        ribbon.colors.primary = '#' + $scope.newRibbon.colors[0];
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec($scope.newRibbon.colors[i+1]);
      } else if ($scope.newRibbon.colors[1] && $scope.newRibbon.colors[1].length > 0) {
        //TWO colors
        console.log('two colors');
        ribbon.colors.primary = '#'
        + $scope.newRibbon.colors[0];
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec($scope.newRibbon.colors[i+1]);
      } else {
        console.log('one color');
          result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec($scope.newRibbon.colors[i]);
      }
      if (result != null) {
        console.log('hit this');
        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min){
          h = s = 0; // achromatic
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }

        s = s*100;
        s = Math.round(s);
        l = l*100;
        l = Math.round(l);
        h = Math.round(360*h);



        if ($scope.newRibbon.colors[1] && $scope.newRibbon.colors[2] && $scope.newRibbon.colors[1].length > 0 && $scope.newRibbon.colors[2].length > 0) {

          console.log('hit three');

          ribbon.colors.primary = '#' + $scope.newRibbon.colors[0];
          console.log(l);

          if (secondHandled == false) {
            ribbon.colors.secondary = 'hsl(' + h + ', ' + s + '%, ' + (l-10) + '%)'
            ribbon.colors.shadow = 'hsl(' + h + ', ' + s + '%, ' + (l-15) + '%)';
            console.log(l-15);
          }


          if (l-25 <= 0) {
            l = l - ((l-15) * -1) + 5;
          }
          console.log(l);
          ribbon.colors.dark = 'hsl(' + h + ', ' + s + '%, ' + (l-15) + '%)';

          i++;
          if (secondHandled == false) {
            secondHandled = true;
            handleShader()
          }

        } else if ($scope.newRibbon.colors[1] && $scope.newRibbon.colors[1].length > 0) {

          console.log('hit two');

          ribbon.colors.primary = '#' + $scope.newRibbon.colors[0];
          console.log(l);

          ribbon.colors.secondary = 'hsl(' + h + ', ' + s + '%, ' + (l-10) + '%)';
          console.log(l-10);

          ribbon.colors.shadow = 'hsl(' + h + ', ' + s + '%, ' + (l-15) + '%)';
          console.log(l-15);

          if (l-25 <= 0) {
            l = l - ((l-25) * -1) + 5;
          }
          console.log(l);
          ribbon.colors.dark = 'hsl(' + h + ', ' + s + '%, ' + (l-25) + '%)';

        } else {

          console.log('hit one');

          ribbon.colors.primary = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
          console.log(l);

          ribbon.colors.secondary = 'hsl(' + h + ', ' + s + '%, ' + (l-10) + '%)';
          console.log(l-10);

          ribbon.colors.shadow = 'hsl(' + h + ', ' + s + '%, ' + (l-15) + '%)';
          console.log(l-15);

          if (l-25 <= 0) {
            l = l - ((l-25) * -1) + 5;
          }
          console.log(l);
          ribbon.colors.dark = 'hsl(' + h + ', ' + s + '%, ' + (l-25) + '%)';

        }
      }
    }
    handleShader();

    $scope.newRibbon.build = ribbon;
    // $rootScope.$emit('colorChanged', {colorInHSL});
    $('#ribbonPreviewContainer svg').remove();

    var svg = '<svg height="" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 1024 1024" width="3em" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:vectornator="http://vectornator.io" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><clipPath id="TextBounds"><rect height="861.588" transform="matrix(0.614981 -0.788542 0.788542 0.614981 -275.584 92.8005)" width="683.244" x="213.828" y="160.239"/></clipPath></defs><clipPath id="ArtboardFrame"><rect height="1024" width="1024" x="0" y="0"/></clipPath><g clip-path="url(#ArtboardFrame)" id="Layer-1" vectornator:layerName="Layer 1"><path d="M337.357 56.1719C337.357 56.1719 364.349 2.38001 499.309 2.38001C634.27 2.38001 661.262 56.1719 661.262 56.1719C661.262 56.1719 688.254 190.652 634.27 217.548C634.27 217.548 602.689 190.652 499.309 190.652C395.93 190.652 364.349 217.548 364.349 217.548C312.902 203.266 337.357 56.1719 337.357 56.1719Z" fill="' + ribbon.colors.dark + '" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M599.531 277.526C641.962 214.643 665.149 146.542 665.149 115.128C665.149 83.6596 661.262 56.1719 661.262 56.1719C661.262 56.1719 738.405 226.45 761.537 281.452C784.67 336.508 753.818 411.198 722.966 458.347C692.114 505.549 279.459 1024.43 279.459 1024.43L121.42 890.753C121.42 890.753 557.126 340.408 599.531 277.526Z" fill="' + ribbon.colors.secondary + '" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M877.198 890.753L719.16 1024.43C719.16 1024.43 306.532 505.549 275.653 458.347C244.801 411.198 213.949 336.508 237.081 281.452C260.213 226.45 337.357 56.1719 337.357 56.1719C337.357 56.1719 333.47 83.6596 333.47 115.128C333.47 146.542 356.629 214.643 399.088 277.526C441.492 340.408 877.198 890.753 877.198 890.753Z" fill="' + ribbon.colors.primary + '" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M499.309 746.86C452.694 687.769 406.106 628.464 367.318 578.733C355.846 593.338 344.402 607.915 333.011 622.412C372.527 673.057 418.981 732.094 464.921 790.351C476.312 775.988 487.784 761.438 499.309 746.86ZM499.309 409.719C538.421 460.149 584.658 519.293 631.301 578.733C643.555 562.999 654.973 548.287 665.392 534.839C616.941 473.086 571 414.238 533.373 365.664C522.819 379.354 511.429 394.066 499.309 409.719Z" fill="' + ribbon.colors.shadow + '" fill-rule="evenodd" opacity="1" stroke="none"/></g><g id="Name" vectornator:layerName="Name"><text class="ribbonTexts" clip-path="url(#TextBounds)" fill="#efe9f0" font-family="Helvetica-Bold" font-size="' + ribbon.fontSize + '" opacity="1" stroke="none" text-anchor="middle" transform="matrix(0.614981 0.788542 -0.788542 0.614981 242.656 160.239)" vectornator:text="Multiple&#x20;Myeloma" vectornator:width="100%" x="0" y="0"><tspan x="532.062" y="97">' + ribbon.name + '</tspan></text></g></svg>';

    angular.element($('#ribbonPreviewContainer')).append($compile(svg)($scope));

    if ($scope.newRibbon.colors) {

    }

  }
  $scope.newRibbonColor = function() {
    console.log('hit');
  }
  $scope.addNewRibbon = function() {
    $http.post('addNewRibbon', {ribbon:$scope.newRibbon.build})
    .then(function(res) {
      // $scope.ribbons = res.data;
      $scope.ribbons = [];
      getRibbons();
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.selectRibbon = function(r) {
    $scope.ribbonToEdit = r;
    $scope.editRibbon = true;

    $('#editRibbonImage').remove();

    var html = '<img id="editRibbonImage" src="' + r.ribbonData.image + '" alt="">';

    angular.element($('#editRibbonImageDiv')).append($compile(html)($scope));

  }

  $scope.saveRibbonEdit = function() {
    // console.log(r);
    $http.post('saveRibbonEdit', {ribbon:$scope.ribbonToEdit})
    .then(function(res) {
      // console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    })

  }

  $scope.cancelRibbonEdit = function() {
    $scope.editRibbon = false;
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
      $('.validationPrompts').css('display','none');

      if ($scope.mode == 'new') {
        $http.post('addNewItem', {item:$scope.item})
        .then(function(res) {
          getItems();
        })
        .catch(function(err) {
          console.log(err);
        })
      } else {
        $http.post('editItem', {item:$scope.item})
        .then(function(res) {
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
    $scope.item.image = JSON.stringify(file);
  }

  $scope.buildOrderCSV = function() {
    buildOrderCSV();
  }

  function start() {

    if ($scope.user && $scope.user != null && $scope.user != 'undefined') {
      $http.post('checkPermission', {user: $scope.user})
      .then(function(res) {
        if (res.data == 'allow') {

              $scope.thisAdminPage('carepackage');

              getRibbons();
              getItems();
              getCarePackagePrice();
              getOrders();
              getDonations();
              getShippingRates();
              getPackageDimensions();
              if ($scope.careItems.length > 0) {
              }

              $scope.changePage('admin',true);

        } else {
          window.location.href = '#!/signin';
          $window.location.reload();
        }
      })
    } else {
      window.location.href = '#!/signin';
      $window.location.reload();
    }

  }
  start();

}])
