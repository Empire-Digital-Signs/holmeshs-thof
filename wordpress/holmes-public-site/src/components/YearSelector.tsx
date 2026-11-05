import { useRef } from '@wordpress/element';

/**
 * YearSelector component or helper.
 * @param root0
 * @param root0.years
 * @param root0.selected
 * @param root0.onSelect
 */
export function YearSelector( { years, selected, onSelect } ) {
	const refs = useRef( {} );
	const index = years.indexOf( selected );
	const move = ( direction ) => {
		const year = years[ index + direction ];
		if ( year === undefined ) {
			return;
		}

		onSelect( year );
		refs.current[ year ]?.scrollIntoView( {
			behavior: 'smooth',
			block: 'nearest',
			inline: 'nearest',
		} );
	};
	return (
		<div className="flex min-w-0 w-auto self-stretch items-center justify-between gap-5 md:mx-[100px] bg-white rounded-[16px] mb-[10px] sm:px-[20px]">
			<button
				type="button"
				onClick={ () => move( -1 ) }
				disabled={ index <= 0 }
				aria-label="Previous year"
				className="shrink-0 disabled:opacity-30"
			>
				<svg
					viewBox="0 0 50 50"
					className="w-[50px] h-[50px] hidden sm:block"
					aria-hidden="true"
				>
					<polygon
						points="43.301,0 43.301,50 0,25"
						fill="var(--primary-red)"
					/>
				</svg>
			</button>
			<ul className="flex gap-3.75 min-w-0 w-full overflow-x-auto no-scrollbar p-2.5">
				{ years.map( ( year ) => (
					<li key={ year } className="shrink-0 flex items-center">
						<button
							type="button"
							ref={ ( element ) => {
								refs.current[ year ] = element;
							} }
							onClick={ () => onSelect( year ) }
							aria-pressed={ year === selected }
							className={ `flex items-center justify-center text-center uppercase cursor-pointer p-[2px] border-10 rounded-full ${ year === selected ? 'border-primary-red' : 'border-transparent' }` }
						>
							{ year }
						</button>
					</li>
				) ) }
			</ul>
			<button
				type="button"
				onClick={ () => move( 1 ) }
				disabled={ index < 0 || index >= years.length - 1 }
				aria-label="Next year"
				className="shrink-0 disabled:opacity-30"
			>
				<svg
					viewBox="0 0 50 50"
					className="w-[50px] h-[50px] hidden sm:block"
					aria-hidden="true"
				>
					<polygon
						points="6.699,0 50,25 6.699,50"
						fill="var(--primary-red)"
					/>
				</svg>
			</button>
		</div>
	);
}

export { YearSelector as YearsList };
