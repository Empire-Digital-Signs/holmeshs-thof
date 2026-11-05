import { useRecords } from '../hooks';
import { useState } from '@wordpress/element';
import { ChampionshipDetail } from '../components/ChampionshipDetail';
import { asset } from '../constants';
import { RecordState } from '../components/RecordState';

/** ChampionshipPage component or helper. */
export function ChampionshipPage() {
	const { records, loading, error } = useRecords( 'championships' );
	const sports = [
		...new Set(
			records.map( ( record ) => record.sport ).filter( Boolean )
		),
	].sort( ( a, b ) => a.localeCompare( b ) );
	const [ sport, setSport ] = useState( null );
	const [ selected, setSelected ] = useState( null );
	const displayed = records
		.filter( ( record ) => record.sport === sport )
		.sort( ( a, b ) => Number( b.year ) - Number( a.year ) );
	let content;
	if ( selected ) {
		content = (
			<ChampionshipDetail
				championship={ selected }
				onClose={ () => setSelected( null ) }
			/>
		);
	} else if ( ! sport ) {
		content = (
			<div className="h-full flex items-center justify-center">
				<h3 className="text-center uppercase text-white">
					Select a sport
				</h3>
			</div>
		);
	} else if ( displayed.length === 0 ) {
		content = (
			<div className="h-full flex items-center justify-center">
				<h3 className="text-center uppercase text-white">
					No championships for { sport } yet
				</h3>
			</div>
		);
	} else {
		content = (
			<div className="h-full overflow-y-auto no-scrollbar">
				<h2 className="mb-5 text-center uppercase text-white">
					{ sport }
				</h2>
				<div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-[20px] lg:gap-x-[40px] gap-y-[20px]">
					{ displayed.map( ( championship ) => (
						<button
							type="button"
							key={ championship.id }
							onClick={ () => setSelected( championship ) }
							className="relative h-[350px] overflow-hidden cursor-pointer bg-black text-left"
						>
							{ championship.image ? (
								<img
									src={ championship.image }
									alt=""
									className="absolute inset-0 h-full w-full object-cover"
								/>
							) : (
								<span className="absolute inset-0 bg-black" />
							) }
							<span className="absolute inset-0 bg-linear-to-t from-primary-red/70 from-0% via-primary-red/30 via-10% to-transparent to-20%" />
							<span className="absolute bottom-[10px] left-[15px] right-[15px] flex flex-col text-white uppercase">
								<span className="text-[clamp(1.25rem,4vw,1.625rem)]">
									{ championship.title }
								</span>
								<span className="text-[clamp(1rem,3vw,1.375rem)]">
									{ championship.year }
								</span>
							</span>
							<img
								src={ asset( 'images/circle-plus.svg' ) }
								alt="View championship details"
								className="absolute bottom-0 right-0 z-10 w-[66px] h-[66px]"
							/>
						</button>
					) ) }
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="grid min-h-0 flex-1 grid-cols-4">
				<div className="hidden md:flex col-span-1 h-full min-h-0 flex-col">
					<h4 className="shrink-0 bg-primary-red border-4 border-black text-white uppercase flex items-center justify-center text-center p-[30px]">
						Sports
					</h4>
					<div className="min-h-0 flex-1 overflow-y-auto bg-black">
						{ sports.map( ( item ) => (
							<button
								type="button"
								key={ item }
								className={ `w-full border-4 border-black p-[12px] text-left uppercase ${ sport === item ? 'bg-primary-red text-white' : 'bg-white text-black' }` }
								onClick={ () => {
									setSport( item );
									setSelected( null );
								} }
								aria-pressed={ sport === item }
							>
								{ item }
							</button>
						) ) }
					</div>
				</div>
				<div className="relative col-span-4 min-h-0 md:col-span-3 p-8">
					<RecordState
						loading={ loading }
						error={ error }
						empty={ records.length ? '' : 'No championships found' }
					>
						{ content }
					</RecordState>
				</div>
			</div>
		</div>
	);
}
