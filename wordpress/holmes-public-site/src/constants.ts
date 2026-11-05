import { config } from './config';

/**
 * pageSection component or helper.
 * @param page
 */
export function pageSection( page ) {
	if (
		page.startsWith( 'academic-' ) ||
		page === 'career-and-technical-education' ||
		page === 'hall-of-distinction'
	) {
		return 'academics';
	}
	if (
		page === 'hall-of-fame' ||
		page === 'championship' ||
		page === 'timeline'
	) {
		return 'athletics';
	}
	return page;
}

/**
 * hasSubmenu component or helper.
 * @param page
 */
export function hasSubmenu( page ) {
	return (
		academicsPages.some( ( item ) => item.key === page ) ||
		athleticsPages.some( ( item ) => item.key === page )
	);
}

/**
 * submenuClip component or helper.
 * @param index
 */
export function submenuClip( index ) {
	if ( index === 0 ) {
		return 'polygon(0% 0%, 100% 0%, 100% 100%, 12% 100%)';
	}
	if ( index === 2 ) {
		return 'polygon(0% 0%, 100% 0%, 88% 100%, 0% 100%)';
	}
	return '';
}

/**
 * submenuAlignment component or helper.
 * @param index
 */
export function submenuAlignment( index ) {
	if ( index === 0 ) {
		return 'ml-auto';
	}
	if ( index === 1 ) {
		return 'mx-auto';
	}
	return 'mr-auto';
}

export const academicsPages = [
	{ key: 'academic-programs', name: 'Academic Programs' },
	{
		key: 'career-and-technical-education',
		name: 'Career and Technical Education',
	},
	{ key: 'hall-of-distinction', name: 'Hall of Distinction' },
];

export const athleticsPages = [
	{ key: 'hall-of-fame', name: 'Hall of Fame' },
	{ key: 'championship', name: 'Championship' },
	{ key: 'timeline', name: 'Timeline' },
];

export const navPages = [
	{ key: 'history', name: 'History' },
	{ key: 'academics', name: 'Academics' },
	{ key: 'athletics', name: 'Athletics' },
	{ key: 'yearbooks', name: 'Yearbooks' },
];

export const EMPTY_SLIDES = [];

export const asset = ( path ) => `${ config.assets }${ path }`;
