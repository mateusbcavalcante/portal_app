angular.module('your_app_name.controllers', [])

.controller('AuthCtrl', function($scope, $ionicConfig) {

})

// APP
.controller('AppCtrl', function($scope, $ionicConfig) {

})

.controller('ProfileCtrl', function($scope) {
	$scope.image = 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg';
})

//LOGIN
.controller('LoginCtrl', function($scope, $state, $templateCache, $q, $rootScope) {
	$scope.doLogIn = function(){
		$state.go('app.feeds-categories');
	};

	$scope.user = {};

	$scope.user.email = "john@doe.com";
	$scope.user.pin = "12345";

	// We need this for the form validation
	$scope.selected_tab = "";

	$scope.$on('my-tabs-changed', function (event, data) {
		$scope.selected_tab = data.title;
	});

})

.controller('SignupCtrl', function($scope, $state) {
	$scope.user = {};

	$scope.user.email = "john@doe.com";

	$scope.doSignUp = function(){
		$state.go('app.feeds-categories');
	};
})

.controller('ForgotPasswordCtrl', function($scope, $state) {
	$scope.recoverPassword = function(){
		$state.go('app.feeds-categories');
	};

	$scope.user = {};
})

.controller('RateApp', function($scope) {
	$scope.rateApp = function(){
		if(ionic.Platform.isIOS()){
			//you need to set your own ios app id
			AppRate.preferences.storeAppURL.ios = '1234555553>';
			AppRate.promptForRating(true);
		}else if(ionic.Platform.isAndroid()){
			//you need to set your own android app id
			AppRate.preferences.storeAppURL.android = 'market://details?id=ionFB';
			AppRate.promptForRating(true);
		}
	};
})


.controller('SendMailCtrl', function($scope, $cordovaEmailComposer, $ionicPlatform) {
  //we use email composer cordova plugin, see the documentation for mor options: http://ngcordova.com/docs/plugins/emailComposer/
  $scope.sendMail = function(){
    $ionicPlatform.ready(function() {
      $cordovaEmailComposer.isAvailable().then(function() {
        // is available
        $cordovaEmailComposer.open({
          to: 'arrudabastos@gmail.com',
          subject: 'Portal Arruda Bastos',
  		  body: ''
        }).then(null, function () {
          // user cancelled email
        });
      }, function () {
        // not available
        console.log("Not available");
      });
    });
  };
})

.controller('MapsCtrl', function($scope, $ionicLoading) {

	$scope.info_position = {
		lat: 43.07493,
		lng: -89.381388
	};

	$scope.center_position = {
		lat: 43.07493,
		lng: -89.381388
	};

	$scope.my_location = "";

	$scope.$on('mapInitialized', function(event, map) {
		$scope.map = map;
	});

	$scope.centerOnMe= function(){

		$scope.positions = [];

		$ionicLoading.show({
			template: 'Loading...'
		});

		// with this function you can get the user’s current position
		// we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			$scope.current_position = {lat: position.coords.latitude, lng: position.coords.longitude};
			$scope.my_location = position.coords.latitude + ", " + position.coords.longitude;
			$scope.map.setCenter(pos);
			$ionicLoading.hide();
		}, function(err) {
				 // error
				$ionicLoading.hide();
		});
	};
})

.controller('AdsCtrl', function($scope, $ionicActionSheet, AdMob, iAd) {

	$scope.manageAdMob = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			buttons: [
				{ text: 'Show Banner' },
				{ text: 'Show Interstitial' }
			],
			destructiveText: 'Remove Ads',
			titleText: 'Choose the ad to show',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			destructiveButtonClicked: function() {
				console.log("removing ads");
				AdMob.removeAds();
				return true;
			},
			buttonClicked: function(index, button) {
				if(button.text == 'Show Banner')
				{
					console.log("show banner");
					AdMob.showBanner();
				}

				if(button.text == 'Show Interstitial')
				{
					console.log("show interstitial");
					AdMob.showInterstitial();
				}

				return true;
			}
		});
	};

	$scope.manageiAd = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			buttons: [
			{ text: 'Show iAd Banner' },
			{ text: 'Show iAd Interstitial' }
			],
			destructiveText: 'Remove Ads',
			titleText: 'Choose the ad to show - Interstitial only works in iPad',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			destructiveButtonClicked: function() {
				console.log("removing ads");
				iAd.removeAds();
				return true;
			},
			buttonClicked: function(index, button) {
				if(button.text == 'Show iAd Banner')
				{
					console.log("show iAd banner");
					iAd.showBanner();
				}
				if(button.text == 'Show iAd Interstitial')
				{
					console.log("show iAd interstitial");
					iAd.showInterstitial();
				}
				return true;
			}
		});
	};
})

// FEED
//brings all feed categories
.controller('FeedsCategoriesCtrl', function($scope, $http, $templateCache, $ionicLoading, PORTAL_API_URL) {
	$templateCache.removeAll();

	$scope.feeds_categories = [];

	$ionicLoading.show({
		template: 'Carregando..'
	});

	function dataHoje() {
	    var data = new Date();
	    var dia = data.getDate();
	    var mes = data.getMonth() + 1;
	    var ano = data.getFullYear();

	    if (mes < 10) {
	    	mes = '0'+mes;
	    }

	    if (dia < 10) {
	    	dia = '0'+dia;
	    }
	    return [ano, mes, dia].join('-');
	}

	$scope.doRefresh = function() {
		$http.get(PORTAL_API_URL + 'categories').success(function(response) {
			var qtdAcademica = 0;
			var qtdBlog = 0
			var qtdColunistas = 0;
			var qtdComunicacao = 0;
			var qtdDestaque = 0;
			var qtdLivros = 0;
			var qtdMultimidia = 0;
			var qtdNoticias = 0;
			var qtdPolitica = 0;
			var qtdSaude = 0;
			var qtdTv = 0;

			angular.forEach(response, function (v) {
				if (v.slug == 'destaque') {
					$http.get(PORTAL_API_URL + 'posts?categories='+v.id).success(function(posts) {
						angular.forEach(posts, function (p) {
							if (dataHoje() == p.date.substring(0,10)) {
								qtdDestaque = qtdDestaque + 1;
							}
						});
						v.quantidade = qtdDestaque;
					});
					v.image = 'img/feeds/destaque.png';
				} else if (v.slug == 'colunistas') {
					$http.get(PORTAL_API_URL + 'posts?categories='+v.id).success(function(posts) {
						angular.forEach(posts, function (p) {
							if (dataHoje() == p.date.substring(0,10)) {							
								qtdColunistas = qtdColunistas + 1;
							}
						});
						v.quantidade = qtdColunistas;
					});
					v.image = 'img/feeds/colunistas.jpg';	
				} else if (v.slug == 'noticias') {
					$http.get(PORTAL_API_URL + 'posts?categories='+v.id).success(function(posts) {
						angular.forEach(posts, function (p) {
							if (dataHoje() == p.date.substring(0,10)) {
								qtdNoticias = qtdNoticias + 1;
							}
						});
						v.quantidade = qtdNoticias;
					});
					v.image = 'img/feeds/news.jpg';	
				} else if (v.slug == 'academica') {
					$http.get(PORTAL_API_URL + 'posts?categories=' + v.id).success(function(posts) {
						angular.forEach(posts, function (p) {
							if (dataHoje() == p.date.substring(0,10)) {
								qtdAcademica = qtdAcademica + 1;
							}
						});
						v.quantidade = qtdAcademica;
					});
					v.image = 'img/feeds/academica.jpg';	
				} else if (v.slug == 'blog') {
					$http.get(PORTAL_API_URL + 'posts?categories='+v.id).success(function(posts) {
						angular.forEach(posts, function (p) {
							if (dataHoje() == p.date.substring(0,10)) {
								qtdBlog = qtdBlog + 1;
							}
						});
						v.quantidade = qtdBlog;
					});
					v.image = 'img/feeds/blog.jpg';	
				
				} else if (v.slug == 'comunicacao') {
					$http.get(PORTAL_API_URL + 'posts?categories='+v.id).success(function(posts) {
						angular.forEach(posts, function (p) {
							if (dataHoje() == p.date.substring(0,10)) {
								qtdComunicacao = qtdComunicacao + 1;
							}
						});
						v.quantidade = qtdComunicacao;
					});
					v.image = 'img/feeds/comunicacao.png';	
				} else if (v.slug == 'livros') {
					$http.get(PORTAL_API_URL + 'posts?categories='+v.id).success(function(posts) {
						angular.forEach(posts, function (p) {
							if (dataHoje() == p.date.substring(0,10)) {
								qtdLivros = qtdLivros + 1;
							}
						});
						v.quantidade = qtdLivros;
					});
					v.image = 'img/feeds/livros.jpg';
				
				} else if (v.slug == 'multimidia') {
					$http.get(PORTAL_API_URL + 'posts?categories='+v.id).success(function(posts) {
						angular.forEach(posts, function (p) {
							if (dataHoje() == p.date.substring(0,10)) {
								qtdMultimidia = qtdMultimidia + 1;
							}
						});
						v.quantidade = qtdMultimidia;
					});
					v.image = 'img/feeds/multimidia.png';	
				
				} else if (v.slug == 'politica') {
					$http.get(PORTAL_API_URL + 'posts?categories='+v.id).success(function(posts) {
						angular.forEach(posts, function (p) {
							if (dataHoje() == p.date.substring(0,10)) {
								qtdPolitica = qtdPolitica + 1;
							}
						});
						v.quantidade = qtdPolitica;
					});
					v.image = 'img/feeds/politics.jpg';	
				} else if (v.slug == 'saude') {
					$http.get(PORTAL_API_URL + 'posts?categories='+v.id).success(function(posts) {
						angular.forEach(posts, function (p) {
							if (dataHoje() == p.date.substring(0,10)) {
								qtdSaude = qtdSaude + 1;
							}
						});
						v.quantidade = qtdSaude;
					});
					v.image = 'img/feeds/saude.jpg';	
				} else if (v.slug == 'tvarrudabastos') {
					$http.get(PORTAL_API_URL + 'posts?categories='+v.id).success(function(posts) {
						angular.forEach(posts, function (p) {
							if (dataHoje() == p.date.substring(0,10)) {
								qtdTv = qtdTv + 1;
							}
						});
						v.quantidade = qtdTv;
					});
					v.image = 'img/feeds/tv.png';	
				}
			});
			$scope.feeds_categories = response;
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
	$scope.doRefresh();
})

//bring specific category providers
.controller('CategoryFeedsCtrl', function($scope, $http, $stateParams) {
	$scope.category_sources = [];

	$scope.categoryId = $stateParams.categoryId;
	$scope.categoryName = $stateParams.categoryName;

	$http.get('http://portalarrudabastos.com.br/wp-json/wp/v2/posts?categories='+$scope.categoryId).success(function(response) {
		$scope.feed.entries = response;
	});
})

//this method brings posts for a source provider
.controller('FeedEntriesCtrl', function($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService, PORTAL_API_URL) {

	$scope.sourceTitle =  $stateParams.sourceId;
	$scope.categoryId = $stateParams.categoryId;	
	$scope.page = 1;
	$scope.totalPages = 1;
	$scope.feed = [];
	$scope.telaColunista = $stateParams.telaColunista;

	$scope.action = 'categories';

	if ($scope.telaColunista == 'S') {
		$scope.action = 'author';
	}

	$ionicLoading.show({
		template: 'Carregando..'
	});

	$scope.doRefresh = function() {
		$http.get(PORTAL_API_URL + 'posts?page=1&'+$scope.action+'=' + $scope.categoryId).success(function(response) {

			angular.forEach(response, function (v) {
				$http.get(PORTAL_API_URL + 'users/' +v.author).success(function(response) {
					v.nameAuthor = response.slug;
				});
				v.dateFormated = [v.date.substring(8,10), v.date.substring(5,7), v.date.substring(0,4)].join('/');
				v.content.rendered = v.content.rendered.substring(v.content.rendered.indexOf('<p>'),v.content.rendered.indexOf('<p>')+150) + " (...)";
				
				$http.get(PORTAL_API_URL + 'media/' +v.featured_media).success(function(response) {
					v.imageSrc = response.source_url;
				});
			});
			$scope.feed.entries = response;
			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.teste = function() {
		$scope.page = $scope.page + 1;
		
		$http.get(PORTAL_API_URL + 'posts?page='+$scope.page+'&'+$scope.action+'=' + $scope.categoryId).success(function(response) {
			angular.forEach(response, function (v) {
				$http.get(PORTAL_API_URL + 'users/' +v.author).success(function(response) {
					v.nameAuthor = response.slug;
				});
				v.dateFormated = [v.date.substring(8,10), v.date.substring(5,7), v.date.substring(0,4)].join('/');
				v.content.rendered = v.content.rendered.substring(v.content.rendered.indexOf('<p>'),v.content.rendered.indexOf('<p>')+150) + " (...)";

				$http.get(PORTAL_API_URL + 'media/' +v.featured_media).success(function(response) {
					v.imageSrc = response.source_url;
				});
			});
			var new_posts = response;
			$scope.feed.entries = $scope.feed.entries.concat(new_posts);
			$scope.$broadcast('scroll.infiniteScrollComplete');	
		});
	}
	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Postagem salva!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkWordpressPost(post);
	};

	$scope.doRefresh();
})

// SETTINGS
.controller('SettingsCtrl', function($scope, $ionicActionSheet, $state) {
	$scope.airplaneMode = true;
	$scope.wifi = false;
	$scope.bluetooth = true;
	$scope.personalHotspot = true;

	$scope.checkOpt1 = true;
	$scope.checkOpt2 = true;
	$scope.checkOpt3 = false;

	$scope.radioChoice = 'B';

	// Triggered on a the logOut button click
	$scope.showLogOutMenu = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			// buttons: [
			// { text: '<b>Share</b> This' },
			// { text: 'Move' }
			// ],
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				//Called when one of the non-destructive buttons is clicked,
				//with the index of the button that was clicked and the button object.
				//Return true to close the action sheet, or false to keep it opened.
				return true;
			},
			destructiveButtonClicked: function(){
				//Called when the destructive button is clicked.
				//Return true to close the action sheet, or false to keep it opened.
				$state.go('auth.walkthrough');
			}
		});

	};
})

// TINDER CARDS
.controller('TinderCardsCtrl', function($scope, $http) {

	$scope.cards = [];


	$scope.addCard = function(img, name) {
		var newCard = {image: img, name: name};
		newCard.id = Math.random();
		$scope.cards.unshift(angular.extend({}, newCard));
	};

	$scope.addCards = function(count) {
		$http.get('http://api.randomuser.me/?results=' + count).then(function(value) {
			angular.forEach(value.data.results, function (v) {
				$scope.addCard(v.picture.large, v.name.first + " " + v.name.last);
			});
		});
	};

	$scope.addFirstCards = function() {
		$scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png","Nope");
		$scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes");
	};

	$scope.addFirstCards();
	$scope.addCards(5);

	$scope.cardDestroyed = function(index) {
		$scope.cards.splice(index, 1);
		$scope.addCards(1);
	};

	$scope.transitionOut = function(card) {
		console.log('card transition out');
	};

	$scope.transitionRight = function(card) {
		console.log('card removed to the right');
		console.log(card);
	};

	$scope.transitionLeft = function(card) {
		console.log('card removed to the left');
		console.log(card);
	};
})


// BOOKMARKS
.controller('BookMarksCtrl', function($scope, $rootScope, BookMarkService, $state) {

	$scope.bookmarks = BookMarkService.getBookmarks();

	// When a new post is bookmarked, we should update bookmarks list
	$rootScope.$on("new-bookmark", function(event){
		$scope.bookmarks = BookMarkService.getBookmarks();
	});

	$scope.goToFeedPost = function(link){
		window.open(link, '_blank', 'location=yes');
	};
	$scope.goToWordpressPost = function(postId){
		$state.go('app.post', {postId: postId});
	};

	$scope.removerFavorito = function(index) {
		$scope.bookmarks.wordpress.splice(index, 1);
	};
})

// WORDPRESS
.controller('WordpressCtrl', function($scope, $http, $ionicLoading, PostService, BookMarkService) {
	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;

	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: 'Loading posts...'
		});

		//Always bring me the latest posts => page=1
		PostService.getRecentPosts(1)
		.then(function(data){
			$scope.totalPages = data.pages;
			$scope.posts = PostService.shortenPosts(data.posts);

			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.loadMoreData = function(){
		$scope.page += 1;

		PostService.getRecentPosts($scope.page)
		.then(function(data){
			//We will update this value in every request because new posts can be created
			$scope.totalPages = data.pages;
			var new_posts = PostService.shortenPosts(data.posts);
			$scope.posts = $scope.posts.concat(new_posts);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	$scope.moreDataCanBeLoaded = function(){
		return $scope.totalPages > $scope.page;
	};

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkWordpressPost(post);
	};

	$scope.doRefresh();
})

// WORDPRESS POST
.controller('WordpressPostCtrl', function($scope, post_data, $ionicLoading) {

	$scope.post = post_data;

	$ionicLoading.hide();

	$scope.sharePost = function(link){
		window.plugins.socialsharing.share('Confira esta postagem aqui: ', null, null, link);
	};
})

.controller('ContactsCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaCamera) {
	$scope.linkFacebook = 'https://facebook.com/arrudabastos';
	$scope.linkTwitter = 'https://twitter.com/arrudabastos';
	$scope.linkGooglePlus = 'https://plus.google.com/+ArrudaBastos';
	$scope.linkInstagram = 'https://www.instagram.com/arrudabastos/';
	$scope.linkYoutube = 'https://www.youtube.com/results?search_query=arruda+bastos';
})

.controller('AnuncieCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaCamera) {
	$scope.linkAnuncie = 'http://www.portalarrudabastos.com.br/contato/';
})

.controller('AreaRestritaCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaCamera) {
	$scope.linkAnuncie = 'http://www.portalarrudabastos.com.br/contato/';
})

.controller('ColunistasCtrl', function($ionicLoading, $filter, $http, $scope, $rootScope, $ionicPlatform, $cordovaCamera, PORTAL_API_URL) {

	$ionicLoading.show({
		template: 'Carregando..'
	});

	$http.get(PORTAL_API_URL + 'users').success(function(response) {
		var indicePab = 0;
		angular.forEach(response, function (v, $index) {

			if (v.slug == 'arrudabastos') {
				v.image = 'img/colunistas/perfil_arrudabastos.jpg';
			} else if (v.slug == 'joanedesson') {
				v.image = 'img/colunistas/perfil_joanedesson.jpg';
			} else if (v.slug == 'manoelfonseca') {
				v.image = 'img/colunistas/perfil_manoelfonseca.jpg';
			} else if (v.slug == 'marciobastos') {
				v.image = 'img/colunistas/perfil_marciobastos.jpg';
			} else if (v.slug == 'regisbarros') {
				v.image = 'img/colunistas/perfil_regisbarros.jpg';
			} else if (v.slug == 'liliabastos') {
				v.image = 'img/colunistas/perfil_liliabastos.jpg';
			} else if (v.slug == 'sergiocunha') {
				v.image = 'img/colunistas/perfil_sergiocunha.jpg';
			} else if (v.slug == 'luizclaudio') {
				v.image = 'img/colunistas/perfil_luizclaudio.jpg';
			} else if (v.slug == 'pab') {
				indicePab = $index;
			}
		});
		response.splice(indicePab,1);
		response = $filter('orderBy')(response, 'name');

		$scope.category_sources = response;
		$ionicLoading.hide();
	});

	
})

//bring specific category providers
.controller('CategoryFeedsCtrl2', function($scope, $http, $stateParams) {
	$scope.category_sources = [];

	$scope.categoryId = $stateParams.categoryId;

	$http.get('feeds-categories.json').success(function(response) {
		var category = _.find(response, {id: $scope.categoryId});
		$scope.categoryTitle = category.title;
		$scope.category_sources = category.feed_sources;
	});
})

.controller('MultimidiaCtrl', function($scope, $http, $stateParams) {
	$scope.linkSaudeEmDia = 'http://www.portalarrudabastos.com.br/2016/09/23/escutar-ao-vivo/';
	$scope.linkDimensaoTotal = 'http://tvmais.org/aovivo/';
})

.controller('ParceirosCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaCamera) {
	$scope.descricao_1 = 'É um escritório de advocacia formado por uma equipe de profissionais com experiência nas áreas relacionadas ao direito empresarial, tendo como foco o estudo das relações trabalhistas, cíveis em geral, contratuais, consumeristas e previdenciárias.';
	$scope.link_1 = 'http://www.bastosesilveira.adv.br';

	$scope.descricao_2 = 'Empresa que desenvolve sistemas, sites e aplicativos de acordo com a sua necessidade.';
	$scope.link_2 = 'http://www.a2dm.com.br';

	$scope.descricao_3 = 'Empresa de fotografia focada em ensaio, evento infantil, aniversário, chá de baby, chá de panela, eucaristia e batizado.';
	$scope.link_3 = 'http://www.wanessafacofotografia.com.br';
})

.controller('ImagePickerCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaCamera) {

	$scope.images = [];
	// $scope.image = {};

	// $scope.openImagePicker = function() {
	//
	// 	//We use image picker plugin: http://ngcordova.com/docs/plugins/imagePicker/
  //   //implemented for iOS and Android 4.0 and above.
	//
  //   $ionicPlatform.ready(function() {
  //     $cordovaImagePicker.getPictures()
  //      .then(function (results) {
  //         for (var i = 0; i < results.length; i++) {
  //           console.log('Image URI: ' + results[i]);
  //           $scope.images.push(results[i]);
  //         }
  //       }, function(error) {
  //         // error getting photos
  //       });
  //   });
	// };

	$scope.openImagePicker = function(){
    //We use image picker plugin: http://ngcordova.com/docs/plugins/imagePicker/
    //implemented for iOS and Android 4.0 and above.

    $ionicPlatform.ready(function() {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 350,
        targetHeight: 350,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options)
       .then(function (imageData) {
          var image = "data:image/jpeg;base64," + imageData;
          $scope.images.push(image);
        }, function(error) {
          console.log(error);
        });
    });
  };

	$scope.removeImage = function(image) {
		$scope.images = _.without($scope.images, image);
	};

	$scope.shareImage = function(image) {
		window.plugins.socialsharing.share(null, null, image);
	};

	$scope.shareAll = function() {
		window.plugins.socialsharing.share(null, null, $scope.images);
	};
})

;
