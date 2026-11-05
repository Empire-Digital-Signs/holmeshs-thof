import { render } from '@wordpress/element';
import { App } from './App';
import './style.css';
import { config, mount } from './config';

/** Mount the public kiosk application into its shortcode root. */
if ( mount && config ) {
	render( <App />, mount );
}
