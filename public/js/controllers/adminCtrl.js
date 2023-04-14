app.controller('adminCtrl', ['$scope', '$http', '$window', '$compile', function($scope, $http, $window, $compile) {

  var jsPDF;

  $scope.item = {
    name: '',
    price: '', //the price we purchase the product for
    image: '',
    description: '',
    tags:'all',
    category:{
      category_data: {
        name: 'None',
      },
    },
    quantity:0
  };

  $scope.categories = [];
  $scope.uncategorized = [];
  $scope.newItemCategory = {
    name:''
  }

  $scope.careItemsByCategory = [];

  $scope.bags = [];
  $scope.fulfillmentDisplay = {
    byPreset:[],
    availableCount:0,
    requestedOrders:[],
    filledOrders:[],
    fulfillOrders:false,
    worthOfBags:0
  }
  $scope.bagPresets = [];

  $scope.presetMode = 'none';
  $scope.presetEditID;
  $scope.bagPreset = {
    name:'',
    categories:[{
      category_data: {
        name: 'None',
      },
      selectableItems:[],
      selectedItems:[{
        name:'Any Category Item',
      }],
    }],
    items:[]
  }

  $scope.buildingBags = false;
  $scope.building = {
    preset:{},
    categories:[],
    items:[],
    individualCost:0,
    totalCost:0,
    quantity:0,
    maxSelectedQuantity:0,
    maxTotalQuantity:0,
    displayTotals: false
  }

  $scope.fulfillments = [];

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

  $scope.itemImageInput = '';

  $scope.testimonialSettings = {
    inputs:{
      name:'Anonymous',
      testimonial:'',
      favorite:false,
      ribbons:['']
    },
    toEdit:{}, //Selected Testimonial
    mode:'new'
  }

  $scope.displayBuilt = false;




  function buildDisplays() {

    if($scope.ribbons.length > 0) {
      var svg = '<svg ng-repeat="ribbon in ribbons" height="" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 1024 1024" width="3em" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:vectornator="http://vectornator.io" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><clipPath id="TextBounds"><rect height="861.588" transform="matrix(0.614981 -0.788542 0.788542 0.614981 -275.584 92.8005)" width="683.244" x="213.828" y="160.239"/></clipPath></defs><clipPath id="ArtboardFrame"><rect height="1024" width="1024" x="0" y="0"/></clipPath><g clip-path="url(#ArtboardFrame)" id="Layer-1" vectornator:layerName="Layer 1"><path d="M337.357 56.1719C337.357 56.1719 364.349 2.38001 499.309 2.38001C634.27 2.38001 661.262 56.1719 661.262 56.1719C661.262 56.1719 688.254 190.652 634.27 217.548C634.27 217.548 602.689 190.652 499.309 190.652C395.93 190.652 364.349 217.548 364.349 217.548C312.902 203.266 337.357 56.1719 337.357 56.1719Z" fill="{{ribbon.ribbonData.colors.dark}}" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M599.531 277.526C641.962 214.643 665.149 146.542 665.149 115.128C665.149 83.6596 661.262 56.1719 661.262 56.1719C661.262 56.1719 738.405 226.45 761.537 281.452C784.67 336.508 753.818 411.198 722.966 458.347C692.114 505.549 279.459 1024.43 279.459 1024.43L121.42 890.753C121.42 890.753 557.126 340.408 599.531 277.526Z" fill="{{ribbon.ribbonData.colors.secondary}}" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M877.198 890.753L719.16 1024.43C719.16 1024.43 306.532 505.549 275.653 458.347C244.801 411.198 213.949 336.508 237.081 281.452C260.213 226.45 337.357 56.1719 337.357 56.1719C337.357 56.1719 333.47 83.6596 333.47 115.128C333.47 146.542 356.629 214.643 399.088 277.526C441.492 340.408 877.198 890.753 877.198 890.753Z" fill="{{ribbon.ribbonData.colors.primary}}" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M499.309 746.86C452.694 687.769 406.106 628.464 367.318 578.733C355.846 593.338 344.402 607.915 333.011 622.412C372.527 673.057 418.981 732.094 464.921 790.351C476.312 775.988 487.784 761.438 499.309 746.86ZM499.309 409.719C538.421 460.149 584.658 519.293 631.301 578.733C643.555 562.999 654.973 548.287 665.392 534.839C616.941 473.086 571 414.238 533.373 365.664C522.819 379.354 511.429 394.066 499.309 409.719Z" fill="{{ribbon.ribbonData.colors.shadow}}" fill-rule="evenodd" opacity="1" stroke="none"/></g><g id="Name" vectornator:layerName="Name"><text class="ribbonTexts" clip-path="url(#TextBounds)" fill="#efe9f0" font-family="Helvetica-Bold" font-size="{{ribbon.ribbonData.fontSize}}" opacity="1" stroke="none" text-anchor="middle" transform="matrix(0.614981 0.788542 -0.788542 0.614981 242.656 160.239)" vectornator:text="Multiple&#x20;Myeloma" vectornator:width="100%" x="0" y="0"><tspan x="532.062" y="97">{{ribbon.ribbonData.name}}</tspan></text></g></svg>';
      angular.element($('#ribbonsSpan')).append($compile(svg)($scope))
    }
    // if ($scope.careItems.length > 0) {
    //   html = '<div class="careItemCells" id="{{$index}}CareItemCell" ng-repeat="item in careItems track by $index"><img src="{{item.image}}" alt=""><div class="careItemCellInfoDivs"><p>{{item.name}}</p><p>${{item.price}}</p></div><div class="careItemCellHeaders"><a href="" ng-click="removeCareItem(item, $index)">Remove</a><p>|</p><a href="" ng-click="editCareItem(item, $index)">Edit</a></div></div>'
    //   angular.element($('#carePackageItemsDiv')).append($compile(html)($scope))
    // }
    $scope.displayBuilt = true
  }

  async function buildOrderCSV(orders) {

    var rows = [
        ["Name", "Address", "City", "State","Zipcode","Country","Weight","Length","width","Height","Diagnosies","Diagnosies2","Diagnosies3"]
    ];

    for (var i = 0; i < orders.length; i++) {
      var shipping = orders[i].orderData.shipping;
      var recipient = orders[i].orderData.recipient;
      rows.push([recipient.name,shipping.address,shipping.city,shipping.state,"47374","US","12","15","10","20",recipient.diagnosies]);
      if (i == orders.length - 1) {
        let csvContent = rows.map(e => e.join(",")).join("\n");

        return csvContent;
        // window.open(encodedUri);

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
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };
    $http.get('getOrders')
    .then(function(res) {
      for (var i = 0; i < res.data.length; i++) {
        res.data[i].orderData = JSON.parse(res.data[i].orderData);

        res.data[i].orderData.prettyTime = new Date(res.data[i].orderData.timestamp);
        res.data[i].orderData.prettyTime = res.data[i].orderData.prettyTime.toLocaleString('en-US', options);
        $scope.orders.push(res.data[i]);
        if (res.data[i].orderData.status != 'batched' && res.data[i].orderData.status != 'sent') {
          $scope.fulfillmentDisplay.requestedOrders.push(res.data[i]);
        } else {
          $scope.fulfillmentDisplay.filledOrders.push(res.data[i]);
        }

      }
      console.log($scope.fulfillmentDisplay.requestedOrders);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function getBags() {
    $http.get('getBags')
    .then(function(res) {
      $scope.bags = res.data;
      $scope.fulfillmentDisplay.byPreset = [];
      $scope.fulfillmentDisplay.availableCount = 0;
      for (var i = 0; i < $scope.bags.length; i++) {
        $scope.bags[i].bag_data = JSON.parse(res.data[i].bag_data);
        if ($scope.bags[i].bag_data.status != 'built') {

        } else {

          var matchFound = false;
          if ($scope.fulfillmentDisplay.byPreset.length > 0) {
            for (var j = 0; j < $scope.fulfillmentDisplay.byPreset.length; j++) {
              if ($scope.bags[i].bag_data.preset.id == $scope.fulfillmentDisplay.byPreset[j].id) {
                // console.log('pre hit 1');
                if (JSON.stringify($scope.bags[i].bag_data.items) == JSON.stringify($scope.fulfillmentDisplay.byPreset[j].items)) {
                  // console.log('hit 1');
                  $scope.fulfillmentDisplay.byPreset[j].bags.push($scope.bags[i]);
                  matchFound = true;
                  $scope.fulfillmentDisplay.availableCount ++;
                  j = $scope.fulfillmentDisplay.byPreset.length;

                } else if (j == $scope.fulfillmentDisplay.byPreset.length-1 && !matchFound) {
                  // console.log('hit 2');
                  $scope.fulfillmentDisplay.byPreset.push({
                    id:$scope.bags[i].bag_data.preset.id,
                    name:$scope.fulfillmentDisplay.byPreset.length<1?$scope.bags[i].bag_data.preset.bag_preset_data.name:$scope.bags[i].bag_data.preset.bag_preset_data.name + '_' + $scope.fulfillmentDisplay.byPreset.length,
                    items:$scope.bags[i].bag_data.items,
                    bags:[$scope.bags[i]],
                    qty:0
                  })
                  $scope.fulfillmentDisplay.availableCount ++;
                  j = $scope.fulfillmentDisplay.byPreset.length;
                }
              } else if (j == $scope.fulfillmentDisplay.byPreset.length-1 && !matchFound) {
                // console.log('hit 2');
                $scope.fulfillmentDisplay.byPreset.push({
                  id:$scope.bags[i].bag_data.preset.id,
                  name:$scope.fulfillmentDisplay.byPreset.length<1?$scope.bags[i].bag_data.preset.bag_preset_data.name:$scope.bags[i].bag_data.preset.bag_preset_data.name + '_' + $scope.fulfillmentDisplay.byPreset.length,
                  items:$scope.bags[i].bag_data.items,
                  bags:[$scope.bags[i]],
                  qty:0
                })
                $scope.fulfillmentDisplay.availableCount ++;
                j = $scope.fulfillmentDisplay.byPreset.length;
              }
            }
          } else {
            // console.log('hit 3');
            $scope.fulfillmentDisplay.byPreset.push({
              id:$scope.bags[i].bag_data.preset.id,
              name:$scope.fulfillmentDisplay.byPreset.length<1?$scope.bags[i].bag_data.preset.bag_preset_data.name:$scope.bags[i].bag_data.preset.bag_preset_data.name + '_' + $scope.fulfillmentDisplay.byPreset.length,
              items:$scope.bags[i].bag_data.items,
              bags:[$scope.bags[i]],
              qty:0
            })
            $scope.fulfillmentDisplay.availableCount ++;
          }
        }
      }
      // console.log($scope.bags);
      // console.log($scope.fulfillmentDisplay);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function getFulfillments() {
    $http.get('getFulfillments')
    .then(function(res) {
      $scope.fulfillments = res.data;
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      };

      for (var i = 0; i < $scope.fulfillments.length; i++) {
        $scope.fulfillments[i].fulfillment_data = JSON.parse($scope.fulfillments[i].fulfillment_data);
        if ($scope.fulfillments[i].fulfillment_data.fulfilled_timestamp == null) {
          $scope.fulfillments[i].fulfillment_data.prettyTime = new Date($scope.fulfillments[i].fulfillment_data.batched_timestamp)
          $scope.fulfillments[i].fulfillment_data.prettyTime = $scope.fulfillments[i].fulfillment_data.prettyTime.toLocaleString('en-US', options);
        } else {
          $scope.fulfillments[i].fulfillment_data.prettyTime = new Date($scope.fulfillments[i].fulfillment_data.fulfilled_timestamp)
          $scope.fulfillments[i].fulfillment_data.prettyTime = $scope.fulfillments[i].fulfillment_data.prettyTime.toLocaleString('en-US', options);
        }
        $scope.fulfillments[i].showBags = false;
        // console.log($scope.fulfillments[i].fulfillment_data);
      }
      console.log($scope.fulfillments);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function getBagPresets() {
    $http.get('getBagPresets')
    .then(function(res) {
      $scope.bagPresets = res.data;
      // console.log(res.data);
      for (var i = 0; i < $scope.bagPresets.length; i++) {
        $scope.bagPresets[i].bag_preset_data = JSON.parse($scope.bagPresets[i].bag_preset_data);
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function getCategories() {
    $http.get('getCategories')
    .then(function(res) {
      $scope.categories = res.data;
      for (var i = 0; i < $scope.categories.length; i++) {
        $scope.categories[i].category_data = JSON.parse($scope.categories[i].category_data);
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function getItems() {
    $http.get('getItems')
    .then(function(res) {
      console.log(res.data);
      $scope.careItems = [];
      for (var i = 0; i < res.data.length; i++) {
        var data = JSON.parse(res.data[i].itemData)
        console.log(data);
        // if (data.category && !data.category.id && data.category.name != 'None') data.category = JSON.parse(data.category);
        if (data.category) {
          if (i == 0) {
            $scope.careItemsByCategory = [];
          }
          if(typeof data.category == 'string') data.category = JSON.parse(data.category);
          if (data.category.category_data.name == 'None') {
            $scope.uncategorized.push(data);
          } else {

            for (var j = 0; j < $scope.categories.length; j++) {
              if (data.category.category_data.name == $scope.categories[j].category_data.name) {
                if ($scope.careItemsByCategory[j]) {
                  $scope.careItemsByCategory[j].push(data);
                } else {
                  $scope.careItemsByCategory[j] = [data];
                }
              } else {
                if (!$scope.careItemsByCategory[j]) {
                  $scope.careItemsByCategory[j] = [];
                }
              }
            }
          }
        }
        // console.log($scope.careItemsByCategory);
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
                        if($scope.displayBuilt == false) buildDisplays();
                      }
                      l = $scope.packageCosts.tags.length;
                    }
                  }
                }
              }

            } else if(j == $scope.careItems.length-1) {
              for (var k = 0; k < $scope.packageCosts.tags.length; k++) {
                $scope.packageCosts.tags[k].cost = Number($scope.packageCosts.tags[k].cost).toFixed(2);
              }
              if($scope.displayBuilt == false) buildDisplays();
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
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function findShippingTier() {
    for (var i = 0; i < $scope.shippingRates.length; i++) {
      $scope.tierShippingRates.push([$scope.shippingRates[i].rates[Math.floor($scope.shippingTier)+1]]);
    }
  }

  function getPackageDimensions() {
    $http.get('getPackageDimensions').then(function(res) {
      $scope.packageDimensions = res.data[res.data.length - 1];
      $scope.packageDimensions = JSON.parse($scope.packageDimensions.package_dimensions_data);
      var dim = $scope.packageDimensions;
      if(dim.length * dim.width * dim.height / 166 > dim.weight) {
        $scope.shippingTier = dim.length * dim.width * dim.height / 166;
      } else {
        $scope.shippingTier = dim.weight;
      }
      findShippingTier();
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function getShippingRates() {
    $http.get('getShippingRates')
    .then(function(res) {
      for (var i = 0; i < res.data.length; i++) {
        $scope.shippingRates.push(JSON.parse(res.data[i].shippingRate_data));
      }
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
      // console.log(res.data);
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
      // console.log(event.target.result); // the CSV content as string
      parsedRates = event.target.result.split(',');
      var rateRow = [];
      var counter = 0;
      var rowCounter = 0;
      for (var i = 134; i < parsedRates.length; i++) {
        rateRow.push(parsedRates[i].split('\\')[0]);
        if (counter < 9) {
          counter ++;
        } else {
          seperatedRates.push(rateRow);
          rateRow = [];
          counter = 0;
          rowCounter ++;
          if (i == parsedRates.length - 1) {
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
      if (t.favorite) {
        $http.post('addFavTestimony', {id:res.data.id})
        .then(function(res) {
          // console.log(res);
        })
        .catch(function(err) {
          console.log(err);
        })
      }
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.selectDiagnosis = function(i) {
    thisRibbon = $scope.testimonialSettings.inputs.ribbons[i];
    if (
      thisRibbon !== '' &&
      thisRibbon !== null &&
      $scope.testimonialSettings.inputs.ribbons.length === i + 1
    ) {
      $scope.testimonialSettings.inputs.ribbons.push('');
    }
  }

  $scope.thisTestimonial = function(t) {
    var hold = {
      id:t.id,
      index:t.index,
      name:t.testimonial_data.name,
      testimonial:t.testimonial_data.testimonial,
      type:t.testimonial_data.type,
      permissions:t.testimonial_data.permission,
      ribbons:t.testimonial_data.ribbons
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
      testimonial:'',
      favorite:false
    };
    $scope.testimonialSettings.mode = 'new';
  }

  $scope.favTestimony = function(b) {
    $scope.testimonialSettings.inputs.favorite = b;
    $scope.testimonialSettings.toEdit.favorite = b;

    if ($scope.testimonialSettings.mode == 'edit') {
      if (b == true) {

          $http.post('addFavTestimony', {id:$scope.testimonialSettings.toEdit.id})
          .then(function(res) {
            $http.post('editTestimonial', {testimonial_data:$scope.testimonialSettings.toEdit,id:$scope.testimonialSettings.toEdit.id})
            .then(function(res) {
              // console.log(res);
            })
            .catch(function(err) {
              console.log(err);
            })
          })
          .catch(function(err) {
            console.log(err);
          })


      } else {
        $http.post('removeFavTestimony', {id:$scope.testimonialSettings.toEdit.id})
        .then(function(res) {
          $http.post('editTestimonial', {testimonial_data:$scope.testimonialSettings.toEdit,id:$scope.testimonialSettings.toEdit.id})
          .then(function(res) {
            // console.log(res);
          })
          .catch(function(err) {
            console.log(err);
          })
        })
        .catch(function(err) {
          console.log(err);
        })
      }
    }
  }

  $scope.editTestimonial = function() {
    var t = {
      id: $scope.testimonialSettings.toEdit.id,
      testimonial_data: JSON.stringify($scope.testimonialSettings.inputs)
    }

    $http.post('editTestimonial', t)
    .then(function(res) {
      $scope.testimonialSettings.mode = 'new';
      $scope.testimonialSettings.inputs = {
        name:'Annonymous',
        testimonial:'',
        favorite:false
      };
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.removeTestimonial = function() {
    $http.post('removeTestimonial', {id:$scope.testimonialSettings.toEdit.id})
    .then(function(res) {
      // console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.favReview = function(b, r) {
    if (b) {
      $http.post('addFavReview', {id:r.id})
      .then(function(res) {
        // console.log(res.data);
      })
      .catch(function(err) {
        console.log(err);
      })
    } else {
      $http.post('removeFavReview', {id:r.id})
      .then(function(res) {
        // console.log(res.data);
      })
      .catch(function(err) {
        console.log(err);
      })
    }
  }


  $scope.addCategory = function() {
    console.log('hit');
    $http.post('addCategory', JSON.stringify($scope.newItemCategory))
    .then(function(res) {
      getCategories();
      $scope.newItemCategory.name = '';
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  $scope.removeCategory = function(cat) {
    console.log('hit');
    $http.post('removeCategory', {id:cat.id})
    .then(function(res) {
      getCategories();
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  $scope.generateQR = function() {
    console.log(QRCode);
    const qrCodeContainer = document.getElementById('qr-code-container');

  // Create a new QRCode object and render the QR code in the container element
    new QRCode(qrCodeContainer, {
      text: 'www.yellowbagofhumanity.com',
      width: 128,
      height: 128,
      colorDark : '#000000',
      colorLight : '#ffffff',
      correctLevel : QRCode.CorrectLevel.H
    });
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

    var i = 0;
    var secondHandled = false;
    function handleShader() {

      var result;
      if($scope.newRibbon.colors[1] && $scope.newRibbon.colors[2] && $scope.newRibbon.colors[1].length > 0 && $scope.newRibbon.colors[2].length > 0) {
        // THREE colors
        ribbon.colors.primary = '#' + $scope.newRibbon.colors[0];
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec($scope.newRibbon.colors[i+1]);
      } else if ($scope.newRibbon.colors[1] && $scope.newRibbon.colors[1].length > 0) {
        //TWO colors
        ribbon.colors.primary = '#'
        + $scope.newRibbon.colors[0];
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec($scope.newRibbon.colors[i+1]);
      } else {
          result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec($scope.newRibbon.colors[i]);
      }
      if (result != null) {
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

          ribbon.colors.primary = '#' + $scope.newRibbon.colors[0];

          if (secondHandled == false) {
            ribbon.colors.secondary = 'hsl(' + h + ', ' + s + '%, ' + (l-10) + '%)'
            ribbon.colors.shadow = 'hsl(' + h + ', ' + s + '%, ' + (l-15) + '%)';
          }

          if (l-25 <= 0) {
            l = l - ((l-15) * -1) + 5;
          }

          ribbon.colors.dark = 'hsl(' + h + ', ' + s + '%, ' + (l-15) + '%)';

          i++;
          if (secondHandled == false) {
            secondHandled = true;
            handleShader()
          }

        } else if ($scope.newRibbon.colors[1] && $scope.newRibbon.colors[1].length > 0) {

          ribbon.colors.primary = '#' + $scope.newRibbon.colors[0];

          ribbon.colors.secondary = 'hsl(' + h + ', ' + s + '%, ' + (l-10) + '%)';

          ribbon.colors.shadow = 'hsl(' + h + ', ' + s + '%, ' + (l-15) + '%)';

          if (l-25 <= 0) {
            l = l - ((l-25) * -1) + 5;
          }

          ribbon.colors.dark = 'hsl(' + h + ', ' + s + '%, ' + (l-25) + '%)';

        } else {


          ribbon.colors.primary = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';

          ribbon.colors.secondary = 'hsl(' + h + ', ' + s + '%, ' + (l-10) + '%)';

          ribbon.colors.shadow = 'hsl(' + h + ', ' + s + '%, ' + (l-15) + '%)';

          if (l-25 <= 0) {
            l = l - ((l-25) * -1) + 5;
          }

          ribbon.colors.dark = 'hsl(' + h + ', ' + s + '%, ' + (l-25) + '%)';

        }
      }
    }
    handleShader();

    $scope.newRibbon.build = ribbon;

    $('#ribbonPreviewContainer svg').remove();

    var svg = '<svg height="" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 1024 1024" width="3em" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:vectornator="http://vectornator.io" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><clipPath id="TextBounds"><rect height="861.588" transform="matrix(0.614981 -0.788542 0.788542 0.614981 -275.584 92.8005)" width="683.244" x="213.828" y="160.239"/></clipPath></defs><clipPath id="ArtboardFrame"><rect height="1024" width="1024" x="0" y="0"/></clipPath><g clip-path="url(#ArtboardFrame)" id="Layer-1" vectornator:layerName="Layer 1"><path d="M337.357 56.1719C337.357 56.1719 364.349 2.38001 499.309 2.38001C634.27 2.38001 661.262 56.1719 661.262 56.1719C661.262 56.1719 688.254 190.652 634.27 217.548C634.27 217.548 602.689 190.652 499.309 190.652C395.93 190.652 364.349 217.548 364.349 217.548C312.902 203.266 337.357 56.1719 337.357 56.1719Z" fill="' + ribbon.colors.dark + '" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M599.531 277.526C641.962 214.643 665.149 146.542 665.149 115.128C665.149 83.6596 661.262 56.1719 661.262 56.1719C661.262 56.1719 738.405 226.45 761.537 281.452C784.67 336.508 753.818 411.198 722.966 458.347C692.114 505.549 279.459 1024.43 279.459 1024.43L121.42 890.753C121.42 890.753 557.126 340.408 599.531 277.526Z" fill="' + ribbon.colors.secondary + '" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M877.198 890.753L719.16 1024.43C719.16 1024.43 306.532 505.549 275.653 458.347C244.801 411.198 213.949 336.508 237.081 281.452C260.213 226.45 337.357 56.1719 337.357 56.1719C337.357 56.1719 333.47 83.6596 333.47 115.128C333.47 146.542 356.629 214.643 399.088 277.526C441.492 340.408 877.198 890.753 877.198 890.753Z" fill="' + ribbon.colors.primary + '" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M499.309 746.86C452.694 687.769 406.106 628.464 367.318 578.733C355.846 593.338 344.402 607.915 333.011 622.412C372.527 673.057 418.981 732.094 464.921 790.351C476.312 775.988 487.784 761.438 499.309 746.86ZM499.309 409.719C538.421 460.149 584.658 519.293 631.301 578.733C643.555 562.999 654.973 548.287 665.392 534.839C616.941 473.086 571 414.238 533.373 365.664C522.819 379.354 511.429 394.066 499.309 409.719Z" fill="' + ribbon.colors.shadow + '" fill-rule="evenodd" opacity="1" stroke="none"/></g><g id="Name" vectornator:layerName="Name"><text class="ribbonTexts" clip-path="url(#TextBounds)" fill="#efe9f0" font-family="Helvetica-Bold" font-size="' + ribbon.fontSize + '" opacity="1" stroke="none" text-anchor="middle" transform="matrix(0.614981 0.788542 -0.788542 0.614981 242.656 160.239)" vectornator:text="Multiple&#x20;Myeloma" vectornator:width="100%" x="0" y="0"><tspan x="532.062" y="97">' + ribbon.name + '</tspan></text></g></svg>';

    angular.element($('#ribbonPreviewContainer')).append($compile(svg)($scope));

  }

  $scope.addNewRibbon = function() {
    $http.post('addNewRibbon', {ribbon:$scope.newRibbon.build})
    .then(function(res) {
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

  $scope.editCareItem = function(item) {
    $('.careItemMangementDivs').css('display','none');
    $('#carePackageItemDiv').css('display','flex');
    $('#cancelBtn').css('display','flex');
    $('#newItemBtn').css('display','none');

    $scope.mode = 'edit';

    $('.careItemTitles').css('display','none');
    $('#editCareItemTitle').css('display','flex');

    $scope.item = item;
    // $scope.editItemId = index;

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
      tags:'all',
      category: 'None',
    };

    $scope.mode = 'view';
  }
  $scope.removeCareItem = function(item, index) {

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
          console.log(res.data);
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
      $scope.cancel();
    }

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

  $scope.selectBagPreset = function(preset) {
    console.log(preset);
    $scope.presetEditID = preset.id;
    for (var k = 0; k < preset.bag_preset_data.categories.length; k++) {

      var count = 0;
      preset.bag_preset_data.categories[k].selectableItems = [];
      for (var i = 0; i < $scope.careItems.length; i++) {
        if ($scope.careItems[i].category) {
          if ($scope.careItems[i].category.category_data.name == preset.bag_preset_data.categories[k].category_data.name) {
            // console.log($scope.careItems[i].category.category_data.name, preset.bag_preset_data.categories[k].category_data.name);
            let item = {
              line_id: count,
              cat_id: k,
              name: $scope.careItems[i].name,
            }
            preset.bag_preset_data.categories[k].selectableItems.push(item)
            count ++;
          }
        }
      }

    }
    $scope.bagPreset = preset.bag_preset_data;
    $scope.presetMode = 'edit';
  }
  $scope.newBagPreset = function() {
    $scope.presetMode = 'new';
    $scope.bagPreset = {
      name:'',
      categories:[{
        category_data: {
          name: 'None',
        },
        selectableItems:[{
          name:'Any Category Item',
          line_id:0,
          cat_id:0
        }],
        selectedItems:[],
      }],
      items:[]
    }
  }
  $scope.selectPresetCategory = function(cat, index) {

    $scope.bagPreset.categories[index].selectableItems = [];
    $scope.bagPreset.categories[index].category_data = cat.category_data;

    var count = 0;
    for (var i = 0; i < $scope.careItems.length; i++) {
      if ($scope.careItems[i].category) {
        if ($scope.careItems[i].category.category_data.name == cat.category_data.name) {
          let item = {
            line_id: count,
            cat_id: index,
            name: $scope.careItems[i].name,
          }
          $scope.bagPreset.categories[index].selectableItems.push(item)
          count ++;
        }
      }
    }
    $scope.bagPreset.categories[index].selectedItems.push({
      name:'Any Category Item',
      line_id:0,
      cat_id:index
    });
    if (index == $scope.bagPreset.categories.length - 1) {
      $scope.bagPreset.categories.push({
        category_data: {
          name: 'None',
        },
        selectableItems:[{
          name:'Any Category Item',
          line_id:0,
          cat_id:index+1
        }],
        selectedItems:[],
      })
    }

  }
  $scope.selectPresetItem = function(item) {
    let selectedPresetItem = JSON.parse(item.name);
    $scope.bagPreset.categories[selectedPresetItem.cat_id].selectedItems.push({
      name:'Add Category',
      line_id:$scope.bagPreset.categories[selectedPresetItem.cat_id].selectedItems.length,
      cat_id:selectedPresetItem.cat_id
    })
  }
  $scope.saveBagPreset = function() {
    if ($scope.presetMode == 'new') {
      $http.post('addBagPreset',$scope.bagPreset)
      .then(function(res) {
        getBagPresets();
      })
      .catch(function(err) {
        console.log(err);
      })
    } else if($scope.presetMode = 'edit') {
      $http.post('editBagPreset',{preset:$scope.bagPreset,id:$scope.presetEditID})
      .then(function(res) {
        getBagPresets();
      })
      .catch(function(err) {
        console.log(err);
      })
    }
    $scope.presetMode = 'none';
  }
  $scope.openBuildBags = function() {
    $scope.buildingBags = $scope.buildingBags? false : true;
    if ($scope.buildingBags == false) {
      $scope.building = {
        preset:{},
        categories:[],
        items:[],
        individualCost:0,
        totalCost:0,
        quantity:0,
        maxSelectedQuantity:0,
        maxTotalQuantity:0,
        displayTotals: false
      }
    }
  }
  $scope.selectBuildPreset = function(preset) {
    $scope.building = {
      preset:preset,
      categories:[],
      items:[],
      individualCost:0,
      totalCost:0,
      quantity:0,
      maxSelectedQuantity:0,
      maxTotalQuantity:0,
      displayTotals: false
    }
    for (var i = 0; i < preset.bag_preset_data.categories.length; i++) {
      if (i < preset.bag_preset_data.categories.length - 1) {
        $scope.building.categories[i] = [];

        for (var j = 0; j < preset.bag_preset_data.categories[i].selectedItems.length; j++) {

          if (preset.bag_preset_data.categories[i].selectedItems[j].name[0] != 'A') {
            var item = JSON.parse(preset.bag_preset_data.categories[i].selectedItems[j].name);
            $scope.building.categories[i].push(item);
            if (preset.bag_preset_data.categories[i].selectedItems.length == 2) {
              $scope.building.items[i] = item;
              $scope.selectBuildBagItem(i, item);
            }
          }
        }
      } else {
        i = preset.bag_preset_data.categories.length;
      }
    }
  }

  function figureBagQuantities(arr) {
    var minQuantity = null;
    for (var i = 0; i < arr.length; i++) {
      if (minQuantity == null) {
        if (arr[i]) {
          minQuantity = arr[i].quantity? arr[i].quantity: 0;
        } else if(arr[i] == null || arr[i] == undefined || !arr[i]) {
          var multChoiceMinQuantity = 0;
          for (var j = 0; j < $scope.building.categories[i].length; j++) {
            multChoiceMinQuantity += $scope.building.categories[i][j].quantity;
            if (j == $scope.building.categories[i].length - 1) {
              if (minQuantity > multChoiceMinQuantity) {
                minQuantity = multChoiceMinQuantity;
              }
            }
          }
        }
      } else if(arr[i] == null || arr[i] == undefined || !arr[i]) {
        var multChoiceMinQuantity = 0;
        for (var j = 0; j < $scope.building.categories[i].length; j++) {
          multChoiceMinQuantity += $scope.building.categories[i][j].quantity;
          if (j == $scope.building.categories[i].length - 1) {
            if (minQuantity > multChoiceMinQuantity) {
              minQuantity = multChoiceMinQuantity;
            }
          }
        }
      } else if(arr[i] && arr[i].quantity == undefined && arr[i].quantity < minQuantity) {
        minQuantity = arr[i].quantity;
      } else if(!arr[i].quantity) {
        minQuantity = 0;
      } else if(arr[i].quantity < minQuantity) {
        minQuantity = arr[i].quantity;
      }
      if (arr.length-1 == i) {
        if (i < $scope.building.categories.length-1) {
          $scope.building.displayTotals = false;
        } else {
          $scope.building.displayTotals = true;
        }
        return minQuantity;
      }
    }
  }
  $scope.selectBuildBagItem = function(index, item) {
    // console.log(JSON.parse($scope.building.items[index]));
    // if (typeof item.name == 'string') {
    //   item = JSON.parse(item.name);
    // }
    for (var i = 0; i < $scope.careItems.length; i++) {
      const careItem = {
        id:$scope.careItems[i].id,
        name:$scope.careItems[i].name,
        price:$scope.careItems[i].price,
        quantity: $scope.careItems[i].quantity? $scope.careItems[i].quantity: 0
      }
      // console.log($scope.careItems[i].name, $scope.building.items[index].name);
      if (careItem.name === $scope.building.items[index].name) {
        // console.log(item);
        if ($scope.building.items[index].price) {
          $scope.building.individualCost -= $scope.building.items[index].price;
        }
        $scope.building.individualCost += careItem.price;
        $scope.building.items[index] = careItem;
        i = $scope.careItems.length;
      }
      if (i == $scope.careItems.length && $scope.building.categories.length == $scope.building.items.length) {
        $scope.building.maxSelectedQuantity = figureBagQuantities($scope.building.items);
      }
    }
    // $scope.building.items[index] = item;
  }
  $scope.setToMax = function() {
    $scope.building.quantity = $scope.building.maxSelectedQuantity;
  }
  $scope.buildBags = function() {
    $http.post('buildBags', $scope.building)
    .then(function(res) {
      getBags();
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  $scope.setFulfillBagsMax = function(index) {
    $scope.fulfillmentDisplay.byPreset[index].qty = $scope.fulfillmentDisplay.byPreset[index].bags.length;
  }

  async function generateQRCodes(arr) {
    var qrCodes = [];
    await arr.forEach(bag => {
      code = "www.yellowbagofhumanity.com/#!/recipient/:"+ bag.id + "/:"  + bag.bag_data.uid;
      const qrCodeContainer = document.createElement('div');
      const qrCodeWidth = 200;
      const qrCodeHeight = 200;
      const qrCode = new QRCode(qrCodeContainer, {
        text: code,
        width: qrCodeWidth,
        height: qrCodeHeight,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });

      const canvas = qrCodeContainer.querySelector('canvas');
      const dataUrl = canvas.toDataURL();
      qrCodes.push(dataUrl);
    });
    return $http.post('buildQRPrints', qrCodes)
    .then(function(res) {
      console.log(res.data);
      return res.data;
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  async function markBagsAndBatch(bags) {
    for (var i = 0; i < bags.length; i++) {
      bags[i].bag_data.status = 'batched';
      if (i == bags.length - 1) {
        $http.post('markBagsAndBatch', bags)
        .then(function(res) {
          console.log(res.data);
          getFulfillments();
        })
        .catch(function(err) {
          console.log(err);
        })
      }
    }
  }
  async function batchOrders(bags) {
    console.log(bags);
    if ($scope.fulfillmentDisplay.fulfillOrders) {
      var markedOrders = [];
      for (var i = 0; i < bags.length; i++) {
        $scope.fulfillmentDisplay.requestedOrders[i].orderData.status = 'batched';
        $scope.fulfillmentDisplay.requestedOrders[i].orderData.contents = bags[i];
        bags[i].bag_data.order = $scope.fulfillmentDisplay.requestedOrders[i].id;
        console.log(bags[i]);
        markedOrders.push($scope.fulfillmentDisplay.requestedOrders[i]);
        if(i == bags.length - 1) {
          var codes;
          var csvData;
          try {
            [codes, csvData] = await Promise.all([
              generateQRCodes(bags),
              buildOrderCSV(markedOrders)
            ])
            console.log(codes, csvData);
          } catch (err) {
            console.log(err);
          }

          $http.post('batchOrders', markedOrders)
          .then(function(res) {
            console.log(res.data);
            generatePDF(codes, csvData);
            return bags;
          })
          .catch(function(err) {
            console.log(err);
          })
        }
      }
    } else {
      return bags;
    }
  }
  async function unbatchOrders(bags) {
    var markedOrders = [];
    for (var i = 0; i < bags.length; i++) {
      $scope.fulfillmentDisplay.requestedOrders[i].orderData.status = 'requested';
      $scope.fulfillmentDisplay.requestedOrders[i].orderData.contents = bags[i];
      bags[i].bag_data.order = null;
      markedOrders.push($scope.fulfillmentDisplay.requestedOrders[i]);
      if(i == bags.length - 1) {
        $http.post('batchOrders', markedOrders)
        .then(function(res) {
          console.log(res.data);
          return bags;
        })
        .catch(function(err) {
          console.log(err);
        })
      }
    }
  }

  function generatePDF(pdfBuffer, csvData) {
    // Convert the PDF buffer to a Blob object
    console.log(pdfBuffer);
    console.log(csvData);
    const pdfData = atob(pdfBuffer);
    const pdfArray = new Uint8Array(pdfData.length);
    for (let i = 0; i < pdfData.length; i++) {
      pdfArray[i] = pdfData.charCodeAt(i);

      if (i == pdfData.length - 1) {

        const pdfBlob = new Blob([pdfArray], { type: 'application/pdf' });

        // Use FileSaver.js to download the PDF file
        saveAs(pdfBlob, 'QR_Codes.pdf');
      }
    }

    // Convert the CSV data to a Blob object

    // Use js to download the CSV file
    if($scope.fulfillmentDisplay.fulfillOrders) {
      const csvBlob = new Blob([csvData], { type: 'text/csv' });
      saveAs(csvBlob, 'ShippingCSVs.csv');
    }
    return;
  }

  $scope.fulfillBags = async function(type) {
    console.log('hit');
    var uids = [];
    var bagsToFulfill = [];
    if (type == 'all') {
      for (var i = 0; i < $scope.fulfillmentDisplay.byPreset.length; i++) {
        for (var j = 0; j < $scope.fulfillmentDisplay.byPreset[i].bags.length; j++) {
          uids.push($scope.fulfillmentDisplay.byPreset[i].bags[j].bag_data.uid);
          bagsToFulfill.push($scope.fulfillmentDisplay.byPreset[i].bags[j]);
          if (i == $scope.fulfillmentDisplay.byPreset.length-1 && j >= $scope.fulfillmentDisplay.byPreset[i].bags.length-1) {
            // generatePDF(makePrints(bagsToFulfill),[]);
            await markBagsAndBatch(bagsToFulfill);
            var codes;
            var csvData;
            try {
              codes = await generateQRCodes(bagsToFulfill);
              generatePDF(codes, []);
              console.log(codes, csvData);
            } catch (err) {
              console.log(err);
            }
          }
        }
      }
    } else {
      for (var i = 0; i < $scope.fulfillmentDisplay.byPreset.length; i++) {
        if ($scope.fulfillmentDisplay.byPreset[i].qty != 0) {
          for (var j = 0; j < $scope.fulfillmentDisplay.byPreset[i].qty; j++) {
            console.log($scope.fulfillmentDisplay.byPreset[i]);

              uids.push($scope.fulfillmentDisplay.byPreset[i].bags[j].bag_data.uid);
              bagsToFulfill.push($scope.fulfillmentDisplay.byPreset[i].bags[j]);

            if (i == $scope.fulfillmentDisplay.byPreset.length-1 && $scope.fulfillmentDisplay.byPreset[i].qty == 0) {


              console.log(bagsToFulfill);
              if ($scope.fulfillmentDisplay.fulfillOrders) {
                bagsToFulfill = await batchOrders(bagsToFulfill)
                .then(await markBagsAndBatch(bagsToFulfill));
              } else {
                await markBagsAndBatch(bagsToFulfill)
                var codes;
                var csvData;
                try {
                  codes = await generateQRCodes(bagsToFulfill);
                  generatePDF(codes, []);
                  console.log(codes, csvData);
                } catch (err) {
                  console.log(err);
                }
                // generatePDF(makePrints(bagsToFulfill),[])
              }
            }
            if (i == $scope.fulfillmentDisplay.byPreset.length-1 && j >= $scope.fulfillmentDisplay.byPreset[i].qty-1) {

              console.log(bagsToFulfill);
              if ($scope.fulfillmentDisplay.fulfillOrders) {
                bagsToFulfill = await batchOrders(bagsToFulfill)
                .then(await markBagsAndBatch(bagsToFulfill));
              } else {
                await markBagsAndBatch(bagsToFulfill)
                var codes;
                var csvData;
                try {
                  codes = await generateQRCodes(bagsToFulfill);
                  generatePDF(codes, []);
                  console.log(codes, csvData);
                } catch (err) {
                  console.log(err);
                }
                // generatePDF(codeUrls,[])
              }

            }
          }
        } else if (i == $scope.fulfillmentDisplay.byPreset.length-1 && $scope.fulfillmentDisplay.byPreset[i].qty == 0) {

            console.log(bagsToFulfill);
            if ($scope.fulfillmentDisplay.fulfillOrders) {
              bagsToFulfill = await batchOrders(bagsToFulfill)
              .then(await markBagsAndBatch(bagsToFulfill))

            } else {
              await markBagsAndBatch(bagsToFulfill)
              var codes;
              var csvData;
              try {
                codes = await generateQRCodes(bagsToFulfill);
                generatePDF(codes, []);
                console.log(codes, csvData);
              } catch (err) {
                console.log(err);
              }
              // generatePDF(makePrints(bagsToFulfill),[])

            }
          }
      }
    }

  }

  $scope.showFulfillmentBags = function(receipt) {
    receipt.showBags = receipt.showBags? false: true;
  }

  $scope.sendBags = function(bags, receipt) {
    var orders = [];
    for (var i = 0; i < bags.length; i++) {
      bags[i].bag_data.status = 'sent';
      if (bags[i].bag_data.order) {
        orders.push(bags[i].bag_data.order)
      }
      if (i == bags.length - 1) {
        $http.post('sendBags', {bags:bags, receipt: receipt})
        .then(function(res) {
          console.log(res.data);
          if (orders.length > 0) {
            $http.post('sendOrders', orders)
            .then(function(res) {
              console.log(res.data);
            })
            .catch(function(err) {
              console.log(err);
            })
          }
        })
        .catch(function(err) {
          console.log(err);
        })
      }
    }
  }

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
              getCategories();
              getBagPresets();
              getItems();
              getBags();
              getFulfillments();
              getCarePackagePrice();
              getOrders();
              getDonations();
              getShippingRates();
              getPackageDimensions();

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
