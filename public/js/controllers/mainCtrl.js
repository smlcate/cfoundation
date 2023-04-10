app.controller('mainCtrl', ['$scope', '$http', '$window', '$compile', '$location', function($scope, $http, $window, $compile, $location) {

  $scope.careItems = [];
  $scope.careItemsToDisplay = [];

  $scope.filterTags = [];

  $scope.ribbons = [];
  $scope.ribbonsToShow = [];

  $scope.testimonials = [];

  $scope.reviews = []

  $scope.feedback = {
    reviews:[],
    testimonials:[]
  }

  $scope.testimonialIndex = 0;

  $scope.user = {};
  $scope.signedIn = false;

  $scope.collapsedToggle = true;

  function getRibbons() {
    $http.get('getRibbons')
    .then(function(res) {
      $scope.ribbons = res.data;
      for (var i = 0; i < $scope.ribbons.length; i++) {
        $scope.ribbons[i].ribbonData = JSON.parse($scope.ribbons[i].ribbonData);
      }
      makeBackground();
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function makeBackground() {

    // Some random colors
    // const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];
    // const images = ["../../icons/bag2.png", "../../icons/bag3.png", "../../icons/bag4.png"];
    const iconTypes = ["bag1","bag2","heart","ribbon"];

    const numBags = 16;
    const bags = [];

    var ribbons = [];

    for (var i = 0; i < $scope.ribbons.length; i++) {
      ribbons.push($scope.ribbons[i].ribbonData);
    }

    var ribbon;
    for (let i = 0; i < numBags; i++) {
      var type = iconTypes[Math.floor(Math.random() * iconTypes.length)]
      let bag;
      let pos = {
        left: `${Math.floor(Math.random() * 60)+15}vw`,
        top: `${Math.floor(Math.random() * 2)}vh`,
        transform: `scale(${Math.random()})`,
        width: `${Math.random()+0.5}em`,
        height: ''
      }
      pos.height = pos.width;

      if (type != 'ribbon' && type != 'heart') {

        if (Math.floor(Math.random() * 2) == 1) {
          bag = '<svg class="headerIcons" margin-left="'+pos.left+'" top="'+pos.top+'" transform="'+pos.transform+'" width="'+pos.width+'" height="'+pos.height+'" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 1024 1024" width="100%" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:vectornator="http://vectornator.io" xmlns:xlink="http://www.w3.org/1999/xlink"><defs/><g id="Layer-1" vectornator:layerName="Layer 1"><path d="M915.989 275.134L123.097 275.134L83.4519 988.737L955.634 988.737L915.989 275.134Z" fill="none" fill-rule="evenodd" opacity="1" stroke="' + '#ffff63' + '" stroke-linecap="round" stroke-linejoin="round" stroke-width="62"/><path d="M321.32 473.357L321.32 235.489C321.32 126.466 410.52 37.2657 519.543 37.2657L519.543 37.2657C628.566 37.2657 717.766 126.466 717.766 235.489L717.766 473.357" fill="none" fill-rule="evenodd" opacity="1" stroke="' + '#ffff63' + '" stroke-linecap="round" stroke-linejoin="round" stroke-width="62"/></g></svg>';
        } else {
          bag = '<svg class="headerIcons" margin-left="'+pos.left+'" top="'+pos.top+'" transform="'+pos.transform+'" width="'+pos.width+'" height="'+pos.height+'" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 1024 1024" width="100%" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:vectornator="http://vectornator.io" xmlns:xlink="http://www.w3.org/1999/xlink"><defs/><g id="Layer-1" vectornator:layerName="Layer 1"><path d="M1016.15 902.259L934.167 102.236C934.167 51.9384 896.596 11.1998 850.211 11.1998L514.387 11.1998L178.563 11.1998C132.178 11.1998 94.6075 51.9384 94.6075 102.236L12.6245 902.259C11.4071 908.495 10.6515 914.913 10.6515 921.559C10.6515 971.856 48.2218 1012.59 94.6075 1012.59L514.387 1012.59L934.167 1012.59C980.552 1012.59 1018.12 971.856 1018.12 921.559C1018.12 914.913 1017.37 908.495 1016.15 902.259ZM724.277 234.602L724.277 284.308C724.277 409.801 630.12 511.897 514.387 511.897C398.654 511.897 304.497 409.801 304.497 284.308L304.497 234.602C280.108 225.225 262.519 200.19 262.519 170.513C262.519 132.824 290.728 102.236 325.486 102.236C360.244 102.236 388.453 132.824 388.453 170.513L388.453 284.308C388.453 359.594 444.955 420.861 514.387 420.861C583.819 420.861 640.321 359.594 640.321 284.308L640.321 170.513C640.321 132.824 668.53 102.236 703.288 102.236C738.046 102.236 766.255 132.824 766.255 170.513C766.255 200.19 748.666 225.225 724.277 234.602Z" fill="#C4B0FF" fill-rule="evenodd" opacity="1" stroke="none"/></g></svg>';
        }

      } else if(type == "ribbon") {

        ribbon = ribbons[Math.floor(Math.random() * ribbons.length)]
        bag = '<svg class="headerIcons" margin-left="'+pos.left+'" top="'+pos.top+'" transform="'+pos.transform+'" width="'+pos.width+'" height="'+pos.height+'" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 1024 1024" width="3em" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:vectornator="http://vectornator.io" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><clipPath id="TextBounds"><rect height="861.588" transform="matrix(0.614981 -0.788542 0.788542 0.614981 -275.584 92.8005)" width="683.244" x="213.828" y="160.239"/></clipPath></defs><clipPath id="ArtboardFrame"><rect height="1024" width="1024" x="0" y="0"/></clipPath><g clip-path="url(#ArtboardFrame)" id="Layer-1" vectornator:layerName="Layer 1"><path d="M337.357 56.1719C337.357 56.1719 364.349 2.38001 499.309 2.38001C634.27 2.38001 661.262 56.1719 661.262 56.1719C661.262 56.1719 688.254 190.652 634.27 217.548C634.27 217.548 602.689 190.652 499.309 190.652C395.93 190.652 364.349 217.548 364.349 217.548C312.902 203.266 337.357 56.1719 337.357 56.1719Z" fill="' + ribbon.colors.dark + '" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M599.531 277.526C641.962 214.643 665.149 146.542 665.149 115.128C665.149 83.6596 661.262 56.1719 661.262 56.1719C661.262 56.1719 738.405 226.45 761.537 281.452C784.67 336.508 753.818 411.198 722.966 458.347C692.114 505.549 279.459 1024.43 279.459 1024.43L121.42 890.753C121.42 890.753 557.126 340.408 599.531 277.526Z" fill="' + ribbon.colors.secondary + '" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M877.198 890.753L719.16 1024.43C719.16 1024.43 306.532 505.549 275.653 458.347C244.801 411.198 213.949 336.508 237.081 281.452C260.213 226.45 337.357 56.1719 337.357 56.1719C337.357 56.1719 333.47 83.6596 333.47 115.128C333.47 146.542 356.629 214.643 399.088 277.526C441.492 340.408 877.198 890.753 877.198 890.753Z" fill="' + ribbon.colors.primary + '" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M499.309 746.86C452.694 687.769 406.106 628.464 367.318 578.733C355.846 593.338 344.402 607.915 333.011 622.412C372.527 673.057 418.981 732.094 464.921 790.351C476.312 775.988 487.784 761.438 499.309 746.86ZM499.309 409.719C538.421 460.149 584.658 519.293 631.301 578.733C643.555 562.999 654.973 548.287 665.392 534.839C616.941 473.086 571 414.238 533.373 365.664C522.819 379.354 511.429 394.066 499.309 409.719Z" fill="' + ribbon.colors.shadow + '" fill-rule="evenodd" opacity="1" stroke="none"/></g><g id="Name" vectornator:layerName="Name"><text class="ribbonTexts" clip-path="url(#TextBounds)" fill="#efe9f0" font-family="Helvetica-Bold" font-size="' + ribbon.fontSize + '" opacity="1" stroke="none" text-anchor="middle" transform="matrix(0.614981 0.788542 -0.788542 0.614981 242.656 160.239)" vectornator:text="Multiple&#x20;Myeloma" vectornator:width="100%" x="0" y="0"><tspan x="532.062" y="97">' + ribbon.name + '</tspan></text></g></svg>'

      } else {

        var colors = ribbons[Math.floor(Math.random() * ribbons.length)].colors;
        bag = '<svg class="headerIcons" margin-left="'+pos.left+'" top="'+pos.top+'" transform="'+pos.transform+'" width="'+pos.width+'" height="'+pos.height+'" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 1024 1024" width="100%" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:vectornator="http://vectornator.io" xmlns:xlink="http://www.w3.org/1999/xlink"><defs/><g id="Layer-1" vectornator:layerName="Layer 1"><path d="M307.877 122.35C389.149 122.35 461.391 161.417 511.057 223.168C560.724 161.417 632.965 122.35 714.237 122.35C864.365 122.35 985.144 254.673 985.144 418.502C985.144 511.758 945.637 593.672 884.683 649.122L884.683 649.122L511.057 971.738L144.205 654.163L144.205 654.163C78.7356 599.973 36.9708 514.278 36.9708 418.502C36.9708 254.673 157.75 122.35 307.877 122.35Z" fill="' + colors.primary + '" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M511.057 1009.54C504.285 1009.54 496.383 1007.02 490.739 1001.98L122.758 684.408C121.629 683.148 120.5 681.888 119.372 681.888C46.001 617.616 3.10751 521.84 3.10751 418.502C3.10751 234.51 139.69 84.5434 307.877 84.5434C383.505 84.5434 455.747 114.789 511.057 170.238C566.367 116.049 638.609 84.5434 714.237 84.5434C882.425 84.5434 1019.01 234.51 1019.01 418.502C1019.01 519.319 978.371 612.576 908.387 676.847C907.258 678.107 907.258 678.107 906.129 679.367L531.375 1003.24C525.731 1007.02 517.83 1009.54 511.057 1009.54ZM167.909 627.698L511.057 925.11L863.236 620.137L864.365 618.877C919.675 569.728 951.281 496.635 951.281 418.502C951.281 276.097 845.175 160.157 714.237 160.157C646.511 160.157 581.042 192.922 535.89 248.372C523.474 264.755 498.641 264.755 485.095 248.372C439.944 191.662 375.604 160.157 306.749 160.157C175.81 160.157 69.7054 276.097 69.7054 418.502C69.7054 499.156 103.569 574.769 163.394 623.918C165.651 625.178 166.78 626.438 167.909 627.698Z" fill="' + colors.dark + '" fill-rule="evenodd" opacity="1" stroke="none"/><path d="M114.856 456.308C95.6673 456.308 80.9931 439.925 80.9931 418.502C80.9931 281.138 182.583 170.238 307.877 170.238C327.067 170.238 341.741 186.621 341.741 208.045C341.741 229.469 327.067 245.852 307.877 245.852C219.833 245.852 148.72 322.725 148.72 418.502C148.72 439.925 134.046 456.308 114.856 456.308Z" fill="' + colors.secondary + '" fill-rule="evenodd" opacity="1" stroke="none"/></g></svg>';

      }

      bags.push(bag);
      angular.element($('header')).prepend($compile(bag)($scope));

    }
      // Keyframes
    const bagElements = document.querySelectorAll(".headerIcons");

    bagElements.forEach((el, i, ra) => {
      el.style.left = `${Math.floor(Math.random() * 60)+15}vw`;
      el.style.top = `${Math.floor(Math.random() * 2)+0.5}vh`;
      el.style.transform = `scale(${Math.random()})`;
      el.style.width = `${Math.random()+0.5}em`;
      el.style.height = el.style.width;
      let to = {
        x: Math.random() * (i % 2 === 0 ? -7 : 7),
        y: Math.random() * 3
      };

      let anim = el.animate(
        [
          { transform: "translate(0, 0)" },
          { transform: `translate(${to.x}em, ${to.y}em)` }
        ],
        {
          duration: (Math.random() + 1) * 6000, // random duration
          direction: "alternate",
          fill: "both",
          iterations: Infinity,
          easing: "ease-in-out"
        }
      );
    });

  }

  function checkSignIn() {
    if (sessionStorage.user != null && sessionStorage.user != {} && sessionStorage.user != undefined && sessionStorage.user != 'null') {

      user = JSON.parse(sessionStorage.user)

      $scope.user = {
        email: user.email,
        fullName: user.fullName,
        donations: user.donations,
        permission: user.permission,
        id: user.id
      }

      $scope.signedIn = true;

    }
  }

  function getReviews() {
    $http.get('getReviews')
    .then(function(res) {
      $scope.reviews = res.data;
      for (var i = 0; i < $scope.reviews.length; i++) {
        $scope.reviews[i].review_data = JSON.parse($scope.reviews[i].review_data);
      }
      getTestimonials()
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function getTestimonials() {
    $http.get('getTestimonials')
    .then(function(res) {
      if (res.data.length > 0) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].testimonial_data = JSON.parse(res.data[i].testimonial_data);
          $scope.testimonials = res.data;
        }
      }
      buildFeedback();
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  function findRibbons(arr) {
    if (arr) {
      for (var j = 0; j < arr.length; j++) {
        for (var k = 0; k < $scope.ribbons.length; k++) {
          if (arr[j] == $scope.ribbons[k].ribbonData.name) {
            arr[j] = $scope.ribbons[k].ribbonData;
            if (j == arr.length-2) {
              return arr;
            }
          }
        }
      }
    }
  }

  function getAverage(obj) {
    var sum = 0;
    var count = 0;
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'number') {
        sum += obj[key];
        count++;
      }
    }
    return count > 0 ? sum / count : 0;
  }

  function buildFeedback() {

    for (var i = 0; i < $scope.reviews.length; i++) {
      if ($scope.reviews[i].review_data.favorite) {
        $scope.reviews[i].review_data.ribbons = findRibbons($scope.reviews[i].review_data.ribbons);
        $scope.reviews[i].review_data.averageRating = getAverage($scope.reviews[i].review_data.ratings);
        if($scope.reviews[i].review_data.type) $scope.reviews[i].review_data.type = $scope.reviews[i].review_data.type.charAt(0).toUpperCase() + $scope.reviews[i].review_data.type.slice(1);
        $scope.feedback.reviews.push($scope.reviews[i]);
      }
    }
    for (var i = 0; i < $scope.testimonials.length; i++) {
      if ($scope.testimonials[i].testimonial_data.favorite) {
        // console.log($scope.testimonials[i].testimonial_data.ribbons);
        $scope.testimonials[i].testimonial_data.ribbons = findRibbons($scope.testimonials[i].testimonial_data.ribbons)
        if($scope.testimonials[i].testimonial_data.type) $scope.testimonials[i].testimonial_data.type = $scope.testimonials[i].testimonial_data.type.charAt(0).toUpperCase() + $scope.testimonials[i].testimonial_data.type.slice(1);
        $scope.feedback.testimonials.push($scope.testimonials[i]);
      }
    }
    // console.log($scope.feedback.testimonials);
    console.log($scope.feedback.reviews);
    // console.log($scope.ribbons);

  }

  function changeTestimonial(c) {
    if (c == 0) {
      if ($scope.testimonialIndex == 0) {
        $scope.testimonialIndex = $scope.testimonials.length - 1;
      } else {
        $scope.testimonialIndex --;
      }
    } else {
      if ($scope.testimonialIndex == $scope.testimonials.length - 1) {
        $scope.testimonialIndex = 0;
      } else {
        $scope.testimonialIndex ++;
      }
    }
  }

  function selectTestimonial(c) {
    $scope.testimonialIndex = c;
  }

  function getItems() {
    $http.get('getItems')
    .then(function(res) {
      $scope.careItems = [];
      for (var i = 0; i < res.data.length; i++) {
        var data = JSON.parse(res.data[i].itemData)
        $scope.careItems.push(data);
        $scope.careItems[i].id = res.data[i].id;
        if (data.tags.split(',')[0] != 'all') {
          tags = data.tags.split(',');
          if ($scope.filterTags.length > 0) {
            for (var k = 0; k < tags.length; k++) {
              var exists = false;
              for (var j = 0; j < $scope.filterTags.length; j++) {

                if ($scope.filterTags[j] == tags[k][0].toLowerCase() + tags[k].slice(1)) {
                  exists == true;
                  j = $scope.filterTags.length;
                } else if(j == $scope.filterTags.length-1 && exists == false) {
                  $scope.filterTags.push(tags[k]);
                }

              }
            }
          } else {
            $scope.filterTags = data.tags.split(',');
          }

        }
        if (i == res.data.length-1) {
          buildItemDisplay('all');
          console.log($scope.careItems);
        }

      }
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  function buildItemDisplay(tag) {
    $scope.careItemsToDisplay = [];
    for (var i = 0; i < $scope.careItems.length; i++) {
      var tags = $scope.careItems[i].tags.split(',');
      if (tags[0] == 'all') {
        $scope.careItemsToDisplay.push($scope.careItems[i])
      } else {
        for (var j = 0; j < tags.length; j++) {
          if (tags[j] == tag) {
            $scope.careItemsToDisplay.push($scope.careItems[i])
          }
        }
      }
    }
  }


  $scope.changeTestimonial = function(c) {
    changeTestimonial(c);
  }

  $scope.selectTestimonial = function(t) {
    selectTestimonial(t);
  }

  $scope.changeFilter = function(tag) {
    buildItemDisplay(tag[0].toLowerCase() + tag.slice(1));
  }

  $scope.changePage = function(p, account) {

    $('#headerNav a').css('background','none');
    $('.pageNavAncs').css('color','#ffff63');
    $('.accountNavAncs').css('color','#C4B0FF');

    if (account) {

      $('#'+p+'Anc').css('background','#C4B0FF');

      $('#'+p+'Anc').animate({
        color: '#ffff63',
      })
      $("header").animate({
        borderColor: '#C4B0FF',
      })
      $("html").css({
        backgroundImage: "url('../../images/homeBags-min.jpg')"
      })

    } else {

      $('#'+p+'Anc').css('background','#ffff63');

      $('#'+p+'Anc').animate({
        color: '#C4B0FF',
      })
      $("header").animate({
        borderColor: '#ffff63'
      })

      $("html").css({
        backgroundImage: "url('../../images/homeBags-min.jpg')"
      })
    }

  }

  $scope.signOut = function() {

    sessionStorage.user = null;
    $scope.user = null;
    $scope.signedIn = false;
    $('#signInNav').css('display','flex')
    $('#userSettingsNav').css('display','none')

  }

  $scope.toggleCollapsedNav = function() {
    if ($scope.collapsedToggle == true) {
      $scope.collapsedToggle = false;
    } else {
      $scope.collapsedToggle = true;
    }
  }

  function start() {

    var path = $location.path();
    if (path.length > 1) {
      path = path.split('/')[1];

    }
    if (path == '') {
      path = '/';
    }
    if (path) {
      if (path == '' || path == '/') {
        $scope.changePage('home', false);
      } else if (path[0] == 's') {
        $scope.changePage(path, true);
      } else {
        $scope.changePage(path, false);
      }
    }

    getReviews();
    getItems();
    getRibbons();
    checkSignIn();

  }

  start();

}])
