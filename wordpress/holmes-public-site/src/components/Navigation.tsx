import { useState } from '@wordpress/element';
import { asset, navPages, pageSection } from '../constants';
import { config } from '../config';

/**
 * Navigation component or helper.
 * @param root0
 * @param root0.page
 */
export function Navigation( { page } ) {
	const [ menuOpen, setMenuOpen ] = useState( false );
	const activeSection = pageSection( page );

	const borders = ( key ) => {
		if ( page === 'home' ) {
			return '';
		}
		if ( activeSection === 'history' && key === 'academics' ) {
			return 'rounded-tl-2xl';
		}
		if ( activeSection === 'academics' && key === 'history' ) {
			return 'rounded-tr-2xl';
		}
		if ( activeSection === 'academics' && key === 'athletics' ) {
			return 'rounded-tl-2xl';
		}
		if ( activeSection === 'athletics' && key === 'academics' ) {
			return 'rounded-tr-2xl';
		}
		if ( activeSection === 'athletics' && key === 'yearbooks' ) {
			return 'rounded-tl-2xl';
		}
		if ( page === 'yearbooks' && key === 'yearbooks' ) {
			return 'rounded-tr-2xl';
		}
		return '';
	};

	return (
		<>
			<button
				type="button"
				aria-label={
					menuOpen ? 'Close navigation menu' : 'Open navigation menu'
				}
				aria-expanded={ menuOpen }
				onClick={ () => setMenuOpen( ! menuOpen ) }
				className={ `${ menuOpen ? 'bg-black border-white' : 'bg-white border-black' } fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center sm:hidden border-3` }
			>
				<img
					src={ asset(
						`images/${ menuOpen ? 'close.svg' : 'menu.svg' }`
					) }
					alt=""
					className="h-7 w-7"
				/>
			</button>
			<div
				aria-hidden={ ! menuOpen }
				className={ `fixed inset-0 z-40 flex min-h-screen w-screen flex-col bg-cover bg-center transition-transform duration-300 ease-in-out sm:hidden ${ menuOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full' }` }
				style={ {
					backgroundImage: `url(${ asset( 'images/background.png' ) })`,
					backgroundSize: 'cover',
				} }
			>
				<header className="px-8 pt-12 pb-8 text-center text-2xl font-bold uppercase text-white">
					Holmes High School
					<br />
					Touch Hall of Fame
				</header>
				<div className="flex flex-1 flex-col justify-start">
					{ navPages.map( ( item ) => {
						const selected = activeSection === item.key;
						return (
							<a
								href={
									selected
										? config?.routes.home
										: config?.routes[ item.key ]
								}
								className={ `w-full border-b border-black/20 px-8 py-6 text-right text-2xl font-bold uppercase ${ selected ? 'bg-primary-red text-white' : 'bg-white text-black' }` }
								key={ item.key }
								onClick={ () => setMenuOpen( false ) }
							>
								{ item.name }
							</a>
						);
					} ) }
				</div>
			</div>
			<nav className="hidden w-full pt-[25px] items-end bg-primary-red z-30 shadow-[0_-8px_12px_-6px_rgba(0,0,0,0.6)] sm:flex">
				{ navPages.map( ( item ) => {
					const selected = activeSection === item.key;
					return (
						<a
							href={
								selected
									? config?.routes.home
									: config?.routes[ item.key ]
							}
							className={ `flex-1 uppercase text-center text-2xl whitespace-nowrap overflow-hidden cursor-pointer truncate p-[10px] md:p-[30px] ${ selected ? 'bg-primary-red text-white' : 'bg-white text-black' } ${ borders( item.key ) }` }
							key={ item.key }
						>
							{ item.name }
						</a>
					);
				} ) }
			</nav>
		</>
	);
}
