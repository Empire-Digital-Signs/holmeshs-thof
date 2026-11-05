import { useEffect } from '@wordpress/element';
import { config } from '../config';

/**
 * IdleReturn component or helper.
 * @param root0
 * @param root0.page
 */
export function IdleReturn( { page } ) {
	useEffect( () => {
		let timer;
		const timeout = page === 'home' ? 300000 : 600000;
		const reset = () => {
			clearTimeout( timer );
			timer = setTimeout( () => {
				if ( page === 'home' ) {
					window.location.reload();
				} else {
					window.location.assign( config.routes.home );
				}
			}, timeout );
		};
		const events = [
			'mousedown',
			'mousemove',
			'keypress',
			'scroll',
			'touchstart',
			'click',
		];
		events.forEach( ( event ) =>
			document.addEventListener( event, reset )
		);
		reset();
		return () => {
			clearTimeout( timer );
			events.forEach( ( event ) =>
				document.removeEventListener( event, reset )
			);
		};
	}, [ page ] );
	return null;
}

export { IdleReturn as InactivityTimer };
