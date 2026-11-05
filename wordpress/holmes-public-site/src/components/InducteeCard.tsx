import { asset } from '../constants';

/**
 * Selectable portrait card used by the Hall of Fame and Hall of Distinction galleries.
 * @param root0
 * @param root0.person
 * @param root0.onSelect
 */
export function InducteeCard( { person, onSelect } ) {
	return (
		<button
			type="button"
			key={ person.id }
			onClick={ () => onSelect( person ) }
			className="relative h-[350px] overflow-hidden cursor-pointer bg-black text-left"
		>
			{ person.image ? (
				<img
					src={ person.image }
					alt={ `${ person.firstName } ${ person.lastName }` }
					className="absolute inset-0 h-full w-full object-cover"
				/>
			) : (
				<span className="absolute inset-0 bg-black" />
			) }
			<span className="absolute inset-0 bg-linear-to-t from-primary-red/70 from-0% via-primary-red/30 via-10% to-transparent to-20%" />
			<span className="absolute bottom-[10px] left-[15px] right-[15px] flex flex-col text-white uppercase">
				<span className="text-[clamp(1.25rem,4vw,1.625rem)]">
					{ person.lastName }
				</span>
				<span className="text-[clamp(1rem,3vw,1.375rem)]">
					{ person.firstName }
				</span>
			</span>
			<img
				src={ asset( 'images/circle-plus.svg' ) }
				alt="View biography"
				className="absolute bottom-0 right-0 z-10 w-[66px] h-[66px]"
			/>
		</button>
	);
}
