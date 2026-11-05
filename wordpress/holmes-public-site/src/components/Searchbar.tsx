import { useState } from '@wordpress/element';
import { asset } from '../constants';
import { OnScreenKeyboard } from './OnScreenKeyboard';

/**
 * Search input with a touchscreen keyboard for non-touch kiosk devices.
 * @param root0
 * @param root0.value
 * @param root0.onChange
 * @param root0.label
 */
export function SearchBox( { value, onChange, label } ) {
	const [ keyboardOpen, setKeyboardOpen ] = useState( false );
	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		) ||
		( navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 );

	return (
		<>
			<div className="relative w-full pl-[5px] z-40">
				<div className="flex items-center gap-[10px] w-full bg-white rounded-[12px] p-[5px]">
					<img
						src={ asset( 'images/search.svg' ) }
						alt=""
						className="w-[53px] h-[53px]"
					/>
					<input
						type="search"
						inputMode={ isMobile ? 'search' : 'none' }
						value={ value }
						onChange={ ( event ) => onChange( event.target.value ) }
						onFocus={ () => ! isMobile && setKeyboardOpen( true ) }
						placeholder={ `Search ${ label }` }
						aria-label={ `Search ${ label }` }
						className="flex-1 min-w-0 primary-text h-full uppercase text-ellipsis"
					/>
				</div>
			</div>
			{ keyboardOpen && (
				<OnScreenKeyboard
					value={ value }
					onChange={ onChange }
					onClose={ () => setKeyboardOpen( false ) }
				/>
			) }
		</>
	);
}

export { SearchBox as Searchbar };
