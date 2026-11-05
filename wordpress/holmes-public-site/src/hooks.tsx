import { useEffect, useState } from '@wordpress/element';
import { getRecords } from './api';

/**
 * useRecords component or helper.
 * @param type
 */
export function useRecords( type ) {
	const [ records, setRecords ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( '' );

	useEffect( () => {
		let active = true;
		setLoading( true );
		setError( '' );
		getRecords( type )
			.then( ( response ) => {
				if ( ! active ) {
					return;
				}
				setRecords( response );
			} )
			.catch( ( loadError ) => {
				if ( active ) {
					setError( loadError.message );
				}
			} )
			.finally( () => {
				if ( active ) {
					setLoading( false );
				}
			} );
		return () => {
			active = false;
		};
	}, [ type ] );

	return { records, loading, error };
}
