import { REQUIRED_FIELDS } from './constants';

/**
 * apiUrl helper for WordPress content editing.
 * @param base
 * @param path
 */
export function apiUrl( base, path ) {
	return `${ base.replace( /\/?$/, '/' ) }${ path }`;
}

/**
 * request helper for WordPress content editing.
 * @param path
 * @param options
 */
export async function request( path, options = {} ) {
	const response = await fetch( path, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			'X-WP-Nonce': window.HolmesContentPortal.nonce,
			...options.headers,
		},
	} );
	const body = await response.json().catch( () => null );
	if ( ! response.ok ) {
		throw new Error(
			body?.message || `WordPress request failed (${ response.status }).`
		);
	}
	return body;
}

/**
 * toForm helper for WordPress content editing.
 * @param record
 */
export function toForm( record ) {
	return {
		title: record.title?.raw || '',
		description: record.content?.raw || '',
		status: record.status || 'publish',
		featured_media: record.featured_media || 0,
		featuredUrl:
			record._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]?.source_url || '',
		meta: record.meta || {},
		id: record.id,
	};
}

/**
 * fieldValue helper for WordPress content editing.
 * @param form
 * @param field
 */
export function fieldValue( form, field ) {
	if ( field === 'title' || field === 'description' ) {
		return form[ field ];
	}
	if ( field === 'image' ) {
		return form.featured_media;
	}
	return form.meta[ field ] ?? ( field === 'images' ? [] : '' );
}

/**
 * setField helper for WordPress content editing.
 * @param form
 * @param field
 * @param value
 */
export function setField( form, field, value ) {
	if ( field === 'title' || field === 'description' ) {
		return { ...form, [ field ]: value };
	}
	if ( field === 'image' ) {
		return { ...form, featured_media: value.id, featuredUrl: value.url };
	}
	return { ...form, meta: { ...form.meta, [ field ]: value } };
}

/**
 * selectMedia helper for WordPress content editing.
 * @param multiple
 * @param callback
 */
export function selectMedia( multiple, callback ) {
	if ( ! window.wp?.media ) {
		throw new Error(
			'The WordPress media library is unavailable on this page.'
		);
	}
	const frame = window.wp.media( {
		title: multiple ? 'Choose slideshow images' : 'Choose an image',
		button: { text: multiple ? 'Use selected images' : 'Use this image' },
		library: { type: 'image' },
		multiple,
	} );
	frame.on( 'select', () => {
		const selection = frame.state().get( 'selection' ).toJSON();
		callback(
			multiple
				? selection.map( ( item ) => item.id )
				: {
						id: selection[ 0 ]?.id || 0,
						url: selection[ 0 ]?.url || '',
					}
		);
	} );
	frame.open();
}

/**
 * numericValue helper for WordPress content editing.
 * @param value
 */
export function numericValue( value ) {
	return value === '' ? '' : Number( value );
}

/**
 * inputType helper for WordPress content editing.
 * @param field
 */
export function inputType( field ) {
	if ( [ 'year', 'inductionYear', 'duration' ].includes( field ) ) {
		return 'number';
	}
	if ( [ 'startDate', 'endDate' ].includes( field ) ) {
		return 'date';
	}
	if ( field === 'url' ) {
		return 'url';
	}
	return 'text';
}

/**
 * minimumValue helper for WordPress content editing.
 * @param field
 */
export function minimumValue( field ) {
	if ( field === 'duration' ) {
		return '0';
	}
	if ( [ 'year', 'inductionYear' ].includes( field ) ) {
		return '1';
	}
	return undefined;
}

/**
 * isRequiredField helper for WordPress content editing.
 * @param type
 * @param field
 */
export function isRequiredField( type, field ) {
	return (
		( field === 'title' && type.fields.includes( 'title' ) ) ||
		( REQUIRED_FIELDS[ type.key ] || [] ).includes( field )
	);
}

/**
 * formPayload helper for WordPress content editing.
 * @param type
 * @param form
 */
export function formPayload( type, form ) {
	let title = form.title;
	if ( type.key === 'yearbooks' ) {
		title = String( form.meta.year || '' );
	} else if (
		[ 'hall-of-distinction', 'hall-of-fame' ].includes( type.key )
	) {
		title =
			`${ form.meta.firstName || '' } ${ form.meta.lastName || '' }`.trim();
	}
	const meta = { ...form.meta };
	for ( const key of [ 'year', 'inductionYear', 'duration' ] ) {
		if ( meta[ key ] !== undefined && meta[ key ] !== '' ) {
			meta[ key ] = Number( meta[ key ] );
		}
	}
	if ( Array.isArray( meta.images ) ) {
		meta.images = meta.images.map( Number ).filter( Boolean );
	}

	const payload = {
		title,
		content: form.description,
		status: form.status,
		meta,
	};
	if ( type.fields.includes( 'image' ) ) {
		payload.featured_media = Number( form.featured_media || 0 );
	}
	return payload;
}
