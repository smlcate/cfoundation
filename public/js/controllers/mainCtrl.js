app.controller('mainCtrl', ['$scope', '$http', '$window', '$compile', '$location', function($scope, $http, $window, $compile, $location) {

  $scope.careItems = [];
  $scope.careItemsToDisplay = [];

  $scope.filterTags = [];

  $scope.ribbons = [];
  $scope.ribbonsToShow = [];

  $scope.testimonials = [
    {
      name:'Randa M.',
      text:'Maecenas eget lacus quam. Vestibulum laoreet id ligula sit amet bibendum. Praesent scelerisque justo at lorem aliquet, sed mattis felis dapibus. Phasellus dolor elit, eleifend sed lacinia quis, bibendum ut libero. Curabitur a euismod augue. Nunc fringilla tortor vitae ipsum facilisis, at posuere nisl posuere. Proin auctor ligula tempor risus facilisis pretium. Mauris egestas neque non velit ornare, nec rutrum velit euismod.'
    },
    {
      name:'Lema N.',
      text:'Vestibulum vestibulum odio lorem. Maecenas elementum mauris quis est auctor dignissim. Curabitur convallis massa a leo vestibulum, in eleifend risus interdum. Duis maximus nisi non dolor sagittis feugiat. Suspendisse ornare turpis magna, et eleifend enim rutrum non. Vestibulum ac ullamcorper odio. Donec commodo mollis orci sed tristique. Etiam suscipit ultrices eleifend. Aliquam porttitor, quam nec posuere tristique, nisl purus venenatis magna, non egestas dui mauris nec tortor. Mauris lobortis purus hendrerit, fringilla quam sodales, iaculis lectus.'
    },
    {
      name:'Annonymous',
      text:'Cras mattis ligula vel nisi laoreet vulputate. Nullam at felis quis nulla sagittis ullamcorper. Donec aliquam lacus a rutrum congue. Sed imperdiet, odio ut consectetur aliquet, nisl nunc iaculis arcu, malesuada tristique ante nibh quis felis. Nullam posuere erat varius vestibulum maximus. Fusce justo sapien, pharetra a scelerisque quis, feugiat vitae nisi. Aenean maximus, est eget malesuada tempus, elit est aliquet odio, eu luctus nibh urna at massa. Vivamus quis neque ante. Praesent rhoncus erat quis lorem commodo consectetur. Aliquam at ipsum sed ante interdum mollis. Sed sit amet mattis enim, eu elementum dui. Aliquam maximus magna ac metus tempus aliquet tincidunt tincidunt elit. Curabitur accumsan lacus nec eros fermentum, aliquam pretium dolor molestie. Cras suscipit elit vitae nisl imperdiet tristique. Pellentesque turpis nunc, tincidunt ut mauris ultrices, dignissim aliquam mi.'
    },

  ];

  // console.log(cities.map);

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
    const iconTypes = ["black","yellowFilled",'ribbon'];

    const numBags = 20;
    const bags = [];

    var ribbons = [];

    for (var i = 0; i < $scope.ribbons.length; i++) {
      ribbons.push($scope.ribbons[i].ribbonData.image);
    }

    var selectedRibbon;
    for (let i = 0; i < numBags; i++) {
      type = iconTypes[Math.floor(Math.random() * iconTypes.length)]
      let bag = document.createElement("img");
      if (type != 'ribbon') {
        bag.classList.add("bag" + type);
      } else {
        selectedRibbon = ribbons[Math.floor(Math.random() * ribbons.length)]
        bag.classList.add("ribbonIcons");
        $(bag).attr("src",selectedRibbon);
      }
      // bag.style.content = "../../icons.bag1.svg";
      // bag.style.fill = colors[Math.floor(Math.random() * colors.length)];
      bag.style.left = `${Math.floor(Math.random() * 60)+15}vw`;
      bag.style.top = `${Math.floor(Math.random() * 2)+0.5}vh`;
      bag.style.transform = `scale(${Math.random()})`;
      bag.style.width = `${Math.random()+0.3}em`;
      bag.style.height = bag.style.width;
      // console.log(bag.style);
      bags.push(bag);
      $('header').prepend(bag);
      // document.body.append(bag);

    }
      // Keyframes
    bags.forEach((el, i, ra) => {
      // $(el).attr("fill",colors[Math.floor(Math.random() * colors.length)]);
      // console.log(el.style);
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

  // function buildFilterNav() {
  //   for (var j = 0; j < $scope.ribbons.length; j++) {
  //   for (var i = 0; i < $scope.filterTags.length; i++) {
  //
  //       if ($scope.ribbons[j].ribbonData.name == 'Rectal') {
  //
  //       }
  //
  //       if ($scope.filterTags[i] == $scope.ribbons[j].ribbonData.name[0].toLowerCase() + $scope.ribbons[j].ribbonData.name.slice(1)) {
  //         ribbon = $scope.ribbons[j].ribbonData;
  //         $scope.ribbonsToShow.push(ribbon);
  //       }
  //     }
  //   }
  // }

  function getTestimonials() {
    $http.get('getTestimonials')
    .then(function(res) {
      if (res.data.length > 0) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].testimonial_data = JSON.parse(res.data[i].testimonial_data);
          $scope.testimonials = res.data;
        }
        console.log('hit')
      }
      console.log(res);
      buildTestimonials();
    })
  }

  function buildTestimonials() {

    ts = $scope.testimonials;
    for (var i = 0; i < ts.length; i++) {
      ts[i].index = i;
    }
    $scope.testimonials = ts;
    console.log($scope.testimonials);
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
          // buildFilterNav();
        }

      }
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
    // $('.accountNavAncs').css('background','none');
    $('.accountNavAncs').css('color','#C4B0FF');

    // $('#headerCollapsedDropdown a').css('background','rgba(196, 176, 255, 0.8)','color','#ffff63');
    // $('#headerCollapsedDropdown a').css('background','rgba(255, 255, 99, 0.95)','color','#C4B0FF');


    // $('#collapsedHeaderNav a').css('background','#ffff63');
    // $('.pageNavDropdownAncs').css('color','#C4B0FF');
    // $('.accountNavAncs').css('background','none');
    // $('.accountNavDropdownAncs').css('color','#ffff63');

    if (account) {

      $('#'+p+'Anc').css('background','#C4B0FF');
      // $('#'+p+'DropdownAnc').css('background','#ffff63');
      // $('#'+p+'DropdownAnc').css('color','#C4B0FF');

      // $('#'+p+'DropdownAnc').css('background','rgba(196, 176, 255, 0.8)');


      // $('#'+p+'Anc').css('color','#ffff63');

      $('#'+p+'Anc').animate({
        color: '#ffff63',
      })
      $("header").animate({
        borderColor: '#C4B0FF',
      })
      // $("html").animate({
      //   backgroundImage: "url('../../images/stripesBackgroundPurple.png')"
      // }
      $("html").css({
        // backgroundImage: "url('../../images/homeBags-min.jpg')"
      })

    } else {
      console.log('#'+p+'Anc');
      console.log('#'+p+'DropdownAnc');
      $('#'+p+'Anc').css('background','#ffff63');
      // $('#'+p+'DropdownAnc').css('background','#ffff63');
      // $('#'+p+'DropdownAnc').css('color','#C4B0FF');
      // $('#'+p+'Anc').css('color','#C4B0FF');
      // $('#headerCollapsedDropdown a').css('background','rgba(255, 255, 99, 0.95)');


      $('#'+p+'Anc').animate({
        color: '#C4B0FF',
      })
      $("header").animate({
        borderColor: '#ffff63'
      })

      $("html").css({
        // backgroundImage: "url('../../images/homeBags-min.jpg')"
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
    console.log('hit');
    if ($scope.collapsedToggle == true) {
      $scope.collapsedToggle = false;
      // $('#toggleCollapsedNavBtn img').css('background','#C4B0FF');
      // $('#toggleCollapsedNavBtn img').css('fill','#ffff63');
    } else {
      $scope.collapsedToggle = true;
      // $('#toggleCollapsedNavBtn img').css('background','none');
      // $('#toggleCollapsedNavBtn img').css('fill','#C4B0FF');

    }
  }

  function start() {

    var path = $location.path();
    console.log(path);
    if (path.length > 1) {
      console.log('hit split');
      path = path.split('/')[1];

    }
    console.log(path);
    if (path == '') {
      path = '/';
    }
    if (path) {
      if (path == '' || path == '/') {
        console.log('hit here');
        $scope.changePage('home', false);
      } else if (path[0] == 's') {
        $scope.changePage(path, true);
      } else {
        $scope.changePage(path, false);
      }
    }

    getTestimonials()
    getItems();
    getRibbons();
    checkSignIn();
    // $('#bagsvg').load(function () {
    // });

    console.log($scope.user);

  }

  start();


}])
