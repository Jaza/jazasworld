// =========================================================

// jq-rolloverstar.js
// based on the work of Matt Oakes http://portfolio.gizone.co.uk/applications/slideshow/

// =========================================================

(function() {
  function jqRollOverFeetAutoAttach(event, parent) {
    jQuery('#gallery-israel-feet a').click(function() {
      return false;
    })
    .each(function() {
      var elem = jQuery(this).get();
      elem = elem[0];

      var oldOnmouseover = elem.onmouseover;
      if (typeof elem.onmouseover != 'function') {
        elem.onmouseover = jqRollOverFeetInit;
      }
      else {
       elem.onmouseover = function() {
          oldOnmouseover();
          jqRollOverFeetInit();
        }
      }

      var oldOnmouseout = elem.onmouseout;
      if (typeof elem.onmouseout != 'function') {
        elem.onmouseout = jqRollOverFeetExit;
      }
      else {
       elem.onmouseout = function() {
          oldOnmouseout();
          jqRollOverFeetExit();
        }
      }
    });
  }

  function jqRollOverFeetInit() {
    var imagein = '#gallery-israel-feet a img[src$="feet2.jpg"]';
    var imageout = '#gallery-israel-feet a img[src$="feet3.jpg"]';
    var options = { speed: 500, containerheight: '294px', containerwidth: '500px' };

    jQuery.fn.rollover(imagein, imageout, options);
  }

  function jqRollOverFeetExit() {
    var imageout = '#gallery-israel-feet a img[src$="feet2.jpg"]';
    var imagein = '#gallery-israel-feet a img[src$="feet3.jpg"]';
    var options = { speed: 500, containerheight: '294px', containerwidth: '500px' };

    jQuery.fn.rollover(imagein, imageout, options);
  }

  jQuery(function() {
    jqRollOverFeetAutoAttach();
  });
}());
