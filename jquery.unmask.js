/**
 * jQuery Unmask
 * A lightweight jQuery plugin to lazy load images with responsive
 *
 * Licensed under the MIT license.
 * Copyright 2016 Adrián Caamaño
 * https://github.com/adriancaamano/unmask
 */

;(function($) {

  $.fn.unmask = function(options, callback) {

    var $w = $(window),
        defaults = {
          mobile: 767,
          tablet: 1024,
          threshold: 0,
          background: false,
          source: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        },
        opts = $.extend( {}, defaults, options ),
        retina = window.devicePixelRatio > 1,
        images = this,
        loaded;

    this.one('unmask', function() {
      var attrib = $w.width() > opts.tablet ? retina ? 'data-src-retina' : 'data-src' : $w.width() > opts.mobile ? 'data-src-tablet' : 'data-src-mobile',
          source = this.getAttribute(attrib),
          originalsrc = this.getAttribute('src');
      source = source || this.getAttribute('data-src');
      if (source) {
        if (opts.background)
          this.style.backgroundImage = 'url(' + source + ')';
        else
          this.setAttribute('src', source);
        if (typeof callback === 'function') callback.call(this);
        $(this).one('error', function () {
          this.setAttribute('src', originalsrc);
        });
      }
    });

    function unmask() {
      var wt = $w.scrollTop(),
          wb = wt + $w.height();
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(':hidden')) { return true; }

        var et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - opts.threshold && et <= wb + opts.threshold;
      });

      loaded = inview.trigger('unmask');
      images = images.not(loaded);
    }

    images.each(function() {
      if (opts.background)
        this.style.backgroundImage = 'url(' + opts.source + ')';
      else
        this.setAttribute('src', opts.source);
    });

    $w.on('scroll.unmask resize.unmask lookup.unmask touchmove.unmask', unmask);

    unmask();

    return this;

  };

})(window.jQuery || window.Zepto);
