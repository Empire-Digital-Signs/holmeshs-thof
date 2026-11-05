import { render } from '@wordpress/element';
import { EditorApp } from './EditorApp';
import './style.css';

/** Mount the content portal into the WordPress admin root. */
const root = document.getElementById( 'holmes-content-portal' );
if ( root ) {
	render( <EditorApp />, root );
}
