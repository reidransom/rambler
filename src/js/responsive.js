/* globals jQuery, Modernizr */

jQuery(function ($) {

	// SVG to PNG Fallback
	if (!Modernizr.svg) {
		$('img[src*="svg"]').attr('src', function () {
			return $(this).attr('src').replace('.svg', '.png')
		})
	}

	// Fittext headers
	$("h1.heading").fitText(0.8)
	$("h2.heading").fitText(1.0)

})
