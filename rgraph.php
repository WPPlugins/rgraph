<?php
/*
Plugin Name: RGraph
Plugin URI: http://www.ramoonus.nl/wordpress/rgraph/
Description: RGraph. HTML5 canvas graph library based on the HTML5 canvas tag
Version: 4.5.6
Author: Ramoonus
Author URI: http://www.ramoonus.nl/
License: GPL2
*/

/**
 * Dummy Function
 * for future usage
 */
function rw_rgraph() {
	// nothing
}

/**
 * Backwards Compatibility
 *
 * @since 4.5.6
 * @deprecated
 */
function rgraph_init(){
	rw_rgraph_init();
}

/**
 * Main Function
 *
 * @since 1.0
 * @todo update libs
 */
function rw_rgraph_init() {

		// version variable for easer updating the enqueues
		$ver = '4.5.6';

		// core
		wp_deregister_script('RGraph.common.core'); // deregister
		wp_enqueue_script('RGraph.common.core', plugins_url('/libraries/RGraph.common.core.js', __FILE__), false, $ver);
		
		// common 
		wp_deregister_script('RGraph.common.adjusting'); // deregister
		wp_enqueue_script('RGraph.common.adjusting', plugins_url('/libraries/RGraph.common.adjusting.js', __FILE__), false, $ver);
		
		wp_deregister_script('RGraph.common.annotate'); // deregister
		wp_enqueue_script('RGraph.common.annotate', plugins_url('/libraries/RGraph.common.annotate.js', __FILE__), false, $ver);

		wp_deregister_script('RGraph.common.context'); // deregister
		wp_enqueue_script('RGraph.common.context', plugins_url('/libraries/RGraph.common.context.js', __FILE__), false, $ver);
		
		wp_deregister_script('RGraph.common.resizing'); // deregister
		wp_enqueue_script('RGraph.common.resizing', plugins_url('/libraries/RGraph.common.resizing.js', __FILE__), false, $ver);
		
		wp_deregister_script('RGraph.common.tooltips'); // deregister
		wp_enqueue_script('RGraph.common.tooltips', plugins_url('/libraries/RGraph.common.tooltips.js', __FILE__), false, $ver);
		
		wp_deregister_script('RGraph.common.zoom'); // deregister
		wp_enqueue_script('RGraph.common.zoom', plugins_url('/libraries/RGraph.common.zoom.js', __FILE__), false, $ver);
		
		// plugins part 2
		wp_deregister_script('RGraph.bar'); // deregister
		wp_enqueue_script('RGraph.bar', plugins_url('/libraries/RGraph.bar.js', __FILE__), false, $ver);
		
		wp_deregister_script('RGraph.bipolar'); // deregister
		wp_enqueue_script('RGraph.bipolar', plugins_url('/libraries/RGraph.bipolar.js', __FILE__), false, $ver);
		
		wp_deregister_script('RGraph.funnel'); // deregister
		wp_enqueue_script('RGraph.funnel', plugins_url('/libraries/RGraph.funnel.js', __FILE__), false, $ver);
				
		wp_deregister_script('RGraph.gantt'); // deregister
		wp_enqueue_script('RGraph.gantt', plugins_url('/libraries/RGraph.gantt.js', __FILE__), false, $ver);
				
		wp_deregister_script('RGraph.hbar'); // deregister
		wp_enqueue_script('RGraph.hbar', plugins_url('/libraries/RGraph.hbar.js', __FILE__), false, $ver);
				
		wp_deregister_script('RGraph.hprogress'); // deregister
		wp_enqueue_script('RGraph.hprogress', plugins_url('/libraries/RGraph.hprogress.js', __FILE__), false, $ver);

		wp_deregister_script('RGraph.led'); // deregister
		wp_enqueue_script('RGraph.led', plugins_url('/libraries/RGraph.led.js', __FILE__), false, $ver);

		wp_deregister_script('RGraph.line'); // deregister
		wp_enqueue_script('RGraph.line', plugins_url('/libraries/RGraph.line.js', __FILE__), false, $ver);
				
		wp_deregister_script('RGraph.meter'); // deregister
		wp_enqueue_script('RGraph.meter', plugins_url('/libraries/RGraph.meter.js', __FILE__), false, $ver);

		wp_deregister_script('RGraph.odo'); // deregister
		wp_enqueue_script('RGraph.odo', plugins_url('/libraries/RGraph.odo.js', __FILE__), false, $ver);

		wp_deregister_script('RGraph.pie'); // deregister
		wp_enqueue_script('RGraph.pie', plugins_url('/libraries/RGraph.pie.js', __FILE__), false, $ver);

		wp_deregister_script('RGraph.rose'); // deregister
		wp_enqueue_script('RGraph.rose', plugins_url('/libraries/RGraph.rose.js', __FILE__), false, $ver);

		wp_deregister_script('RGraph.rscatter'); // deregister
		wp_enqueue_script('RGraph.rscatter', plugins_url('/libraries/RGraph.rscatter.js', __FILE__), false, $ver);

		wp_deregister_script('RGraph.scatter'); // deregister
		wp_enqueue_script('RGraph.scatter', plugins_url('/libraries/RGraph.scatter.js', __FILE__), false, $ver);
		wp_enqueue_script('RGraph.scatter'); // load
		
				
		wp_deregister_script('RGraph.tradar'); // deregister
		wp_enqueue_script('RGraph.tradar', plugins_url('/libraries/RGraph.tradar.js', __FILE__), false, $ver);

		wp_deregister_script('RGraph.vprogress'); // deregister
		wp_enqueue_script('RGraph.vprogress', plugins_url('/libraries/RGraph.vprogress.js', __FILE__), false, $ver);
		
		// part 3
		wp_deregister_script('RGraph.skeleton'); // deregister
		wp_enqueue_script('RGraph.skeleton', plugins_url('/libraries/RGraph.skeleton.js', __FILE__), false, $ver);
		
		wp_deregister_script('RGraph.modaldialog'); // deregister
		wp_enqueue_script('RGraph.modaldialog', plugins_url('/libraries/RGraph.modaldialog.js', __FILE__), false, $ver);
		
		wp_deregister_script('RGraph.thermometer'); // deregister
		wp_enqueue_script('RGraph.thermometer', plugins_url('/libraries/RGraph.thermometer.js', __FILE__), false, $ver);
		
		wp_deregister_script('RGraph.waterfall'); // deregister
		wp_enqueue_script('RGraph.waterfall', plugins_url('/libraries/RGraph.waterfall.js', __FILE__), false, $ver);
}
add_action('wp_enqueue_scripts', 'rw_rgraph_init');

/**
 * Shortcode
 *
 * support for attributes in the shortcode as you might want more than one graph on a page and different sizes
 * Patch by Jaco Theron from  Starsites
 *
 * @since 1.1.1
 */
function rw_rgraph_sc($attr, $content) {
    extract( shortcode_atts( array(
        'id' => 'myCanvas',
        'width' => '600',
        'height' => '450'
    ), $attr ) );

	echo '<canvas id="'. $id .'" width="'. $width .'" height="'. $height .'">No canvas support</canvas>'; // Canvas, with the attributes
	echo '<script>';
	
	$html_entities = array( "&#8216;" , "&#8217;" ); //wordpress convert quotes to HTML entities when posting
    $entities = array( "'" , "'" ); //this is what the HTML entities should be

    $content = str_replace( $html_entities , $entities , $content ); //now replace the entities with the correct form

	
	$rw_p_sc_replacement = array("<br />", "<br>", "<p>", "</p>");
	echo str_replace($rw_p_sc_replacement, '', $content); // replace those strings to nothing
	
	echo '</script>';
}
add_shortcode("rgraph", "rw_rgraph_sc");
add_shortcode("RGraph", "rw_rgraph_sc"); // and RGraph (notice the caps)
add_shortcode("RGRAPH", "rw_rgraph_sc"); // fully caps