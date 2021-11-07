app.controller('mainCtrl', ['$scope', '$http', '$window', '$compile', '$location', function($scope, $http, $window, $compile, $location) {

  $scope.careItems = [];
  $scope.careItemsToDisplay = [];

  $scope.filterTags = [];

  $scope.ribbons = [];
  $scope.ribbonsToShow = [];

  $scope.user = {};
  $scope.signedIn = false;

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
      bag.style.left = `${Math.floor(Math.random() * 95)+2.5}vw`;
      bag.style.top = `${Math.floor(Math.random() * 3)+0.5}vh`;
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
        x: Math.random() * (i % 2 === 0 ? -11 : 11),
        y: Math.random() * 3
      };

      let anim = el.animate(
        [
          { transform: "translate(0, 0)" },
          { transform: `translate(${to.x}rem, ${to.y}rem)` }
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


  $scope.changeFilter = function(tag) {
    buildItemDisplay(tag[0].toLowerCase() + tag.slice(1));
  }

  $scope.changePage = function(p, account) {

    $('#headerNav a').css('background','none');
    $('.pageNavAncs').css('color','#ffff63');
    // $('.accountNavAncs').css('background','none');
    $('.accountNavAncs').css('color','#C4B0FF');

    if (account) {

      $('#'+p+'Anc').css('background','#C4B0FF');
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
        backgroundImage: "url('../../images/stripesBackgroundPurple.png')"
      })

    } else {
      $('#'+p+'Anc').css('background','#ffff63');
      // $('#'+p+'Anc').css('color','#C4B0FF');

      $('#'+p+'Anc').animate({
        color: '#C4B0FF',
      })
      $("header").animate({
        borderColor: '#ffff63'
      })

      $("html").css({
        backgroundImage: "url('../../images/stripesBackground.png')"
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

  function start() {

    var path = $location.path();
    path = path.split('/')[1];

    if (path == '') {
      $scope.changePage('home', false);
    } else if (path[0] == 's') {
      $scope.changePage(path, true);
    } else {
      $scope.changePage(path, false);
    }


    getItems();
    getRibbons();
    checkSignIn();
    // $('#bagsvg').load(function () {
    // });

    console.log($scope.user);

  }

  start();


}])
