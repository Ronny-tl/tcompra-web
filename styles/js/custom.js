/*
  Version: 1.0
  Author: BanyanTheme
  Website: https://banyanthemes.com/
*/

(function($) {
 
 	"use strict"; 
    $(document).ready(function(){		
 
    	// Page preloader    	
		$("#fakeloader").fakeLoader({
			timeToHide:1000,
			zIndex:"999999",//Default zIndex
			bgColor:"#ffffff",
			spinner:"spinner3"
		});	
	
		// show body after site load
		$('body').show();
		
		//counter
		$('.counter').counterUp({
			delay: 10,
			time: 1000
		});	
		
		//Sticky sidebar
		  $('.sticky-body, .sticky-sidebar').theiaStickySidebar({
			// Settings
			additionalMarginTop: 100
		  });
		
		
		//Sticky menu
		$(".edufair-nav").sticky({ topSpacing: 0 });
		
      
		// Bootstrap submenu hover dropdown
		$('ul.nav li.dropdown').hover(function() {
		  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
		}, function() {
		  $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
		});	
		
		// Masonry portfolio
		$('#edufair-portfolio').mixItUp({
			selectors: {
				target: '.tile',
				filter: '.filter',
				sort: '.sort-btn'
			},		  
			animation: {
			animateResizeContainer: false,
			effects: 'fade scale'
			}
		});	
		
		// Initilize wow js
		new WOW().init();
		
		//bootstap tooltip
		$(function () {
		  $('[data-toggle="tooltip"]').tooltip();
		});
		
  }); // End load document
 
})(jQuery);




