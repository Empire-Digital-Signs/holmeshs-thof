import { useEffect, useState } from '@wordpress/element';

/**
 * DateHeader component or helper.
 * @param root0
 * @param root0.variant
 */
export function DateHeader( { variant } ) {
	const [ now, setNow ] = useState( new Date() );
	useEffect( () => {
		const timer = setInterval( () => setNow( new Date() ), 1000 );
		return () => clearInterval( timer );
	}, [] );
	const day = now.toLocaleDateString( 'en-US', {
		month: 'long',
		day: 'numeric',
	} );
	const time = now.toLocaleTimeString( 'en-US', {
		hour: 'numeric',
		minute: '2-digit',
	} );

	return (
		<header
			className={ `absolute top-0 right-0 py-[32px] px-[32px] z-20 whitespace-pre flex text-right justify-end ${ variant === 'home' ? 'flex-col text-white' : 'flex-row text-primary-red bg-white rounded-bl-2xl' }` }
		>
			{ variant === 'home' ? (
				<>
					<h3>{ day }</h3>
					<h3>{ time }</h3>
				</>
			) : (
				<>
					<h5>{ day }</h5>
					<h5>{ '\t' + time }</h5>
				</>
			) }
		</header>
	);
}

export { DateHeader as Header };
