// =========================================================

// jq-rolloverstar.js
// based on the work of Matt Oakes http://portfolio.gizone.co.uk/applications/slideshow/

// =========================================================

(function() {
  function jqRollOverAutoAttach() {
    jQuery('header ul a').each(function(){
      var elem = jQuery(this).get();
      elem = elem[0];

      var oldOnmouseover = elem.onmouseover;
      if (typeof elem.onmouseover != 'function') {
        elem.onmouseover = jqRollOverInit;
      }
      else {
       elem.onmouseover = function(e) {
          oldOnmouseover();
          jqRollOverInit(e);
        }
      }

      var oldOnmouseout = elem.onmouseout;
      if (typeof elem.onmouseout != 'function') {
        elem.onmouseout = jqRollOverExit;
      }
      else {
       elem.onmouseout = function(e) {
          oldOnmouseout();
          jqRollOverExit(e);
        }
      }
    });
  }

  function jqRollOverInit(e) {
    var link = $(e.target).parent();
    var imageinfrag = link.attr('href').split('/').filter(Boolean).pop();
    if (!imageinfrag) imageinfrag = 'home';
    var imagein = 'header ul img[src$="' + imageinfrag + '-rollover.gif"]';
    var imageout = 'header ul img[src$="star.gif"]';
    var options = { speed: 500, containerheight: '50px', containerwidth: '100px' };

    jQuery.fn.rollover(imagein, imageout, options);
  }

  function jqRollOverExit(e) {
    var link = $(e.target).parent();
    var imageoutfrag = link.attr('href').split('/').filter(Boolean).pop();
    if (!imageoutfrag) imageoutfrag = 'home';
    var imageout = 'header ul img[src$="' + imageoutfrag + '-rollover.gif"]';
    var imagein = 'header ul img[src$="star.gif"]';
    var options = { speed: 500, containerheight: '50px', containerwidth: '100px' };

    jQuery.fn.rollover(imagein, imageout, options);
  }

  jQuery.fn.rollover = function(imagein, imageout, options) {
    var settings = {
      speed: 'normal',
      containerheight: 'auto',
      containerwidth: 'auto'
    }

    if(options)
      jQuery.extend(settings, options);

    jQuery(imagein).parent().css('position', 'relative');
    jQuery(imagein).parent().css('height', settings.containerheight);
    jQuery(imagein).parent().css('width', settings.containerwidth);

    jQuery.rollover.swap(imagein, imageout, settings);
  }

  jQuery.rollover = function() {}

  jQuery.rollover.swap = function (imagein, imageout, settings) {
    jQuery(imageout).css('position', 'absolute').hide();
    jQuery(imagein).css('position', 'absolute').show();
  }

  jQuery(function() {
    jqRollOverAutoAttach();
  });
}());
