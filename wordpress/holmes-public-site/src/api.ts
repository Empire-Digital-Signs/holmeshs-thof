import { config } from './config';

/**
 * getRecords component or helper.
 * @param type
 */
export async function getRecords( type ) {
	const response = await fetch( `${ config.apiRoot }${ type }` );
	const body = await response.json().catch( () => null );
	if ( ! response.ok ) {
		throw new Error(
			body?.message || `Unable to load ${ type } (${ response.status }).`
		);
	}
	if ( type !== 'slides' && ! Array.isArray( body ) ) {
		throw new Error(
			`The ${ type } endpoint returned an invalid record list.`
		);
	}
	return body;
}
