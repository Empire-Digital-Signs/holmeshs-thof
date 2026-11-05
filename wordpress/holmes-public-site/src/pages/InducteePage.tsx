import { useRecords } from '../hooks';
import { useState } from '@wordpress/element';
import { ListPanel } from '../components/ListPanel';
import { SearchBox } from '../components/Searchbar';
import { InducteeDetail } from '../components/InducteeDisplay';
import { RecordState } from '../components/RecordState';
import { InducteeCard } from '../components/InducteeCard';

/**
 * InducteePage component or helper.
 * @param root0
 * @param root0.type
 * @param root0.label
 */
export function InducteePage( { type, label } ) {
	const { records, loading, error } = useRecords( type );
	const [ selectedYear, setSelectedYear ] = useState( null );
	const [ selected, setSelected ] = useState( null );
	const [ query, setQuery ] = useState( '' );
	const people = records.filter(
		( person ) => person && typeof person === 'object'
	);
	const years = [
		...new Set(
			people
				.map( ( person ) => Number( person.inductionYear ) )
				.filter( ( year ) => Number.isInteger( year ) && year > 0 )
		),
	].sort( ( a, b ) => b - a );
	const displayed = people.filter( ( person ) => {
		const nameMatches =
			`${ person.firstName || '' } ${ person.lastName || '' }`
				.toLowerCase()
				.includes( query.trim().toLowerCase() );
		return (
			nameMatches &&
			( ! selectedYear ||
				Number( person.inductionYear ) === selectedYear )
		);
	} );

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="grid min-h-0 flex-1 grid-cols-4">
				{ ! selected && (
					<div className="h-full min-h-0 flex-col gap-[20px] items-start hidden md:flex col-span-1">
						<ListPanel
							title="Induction Years"
							items={ years }
							selected={ selectedYear }
							onSelect={ ( year ) => setSelectedYear( year ) }
						/>
						<SearchBox
							value={ query }
							onChange={ setQuery }
							label={ 'Inductees' }
						/>
					</div>
				) }
				{ selected ? (
					<div className="relative col-span-4 min-h-0">
						<InducteeDetail
							person={ selected }
							onClose={ () => setSelected( null ) }
							athletics={ type === 'hall-of-fame' }
						/>
					</div>
				) : (
					<div className="relative col-span-4 min-h-0 md:col-span-3">
						<RecordState
							loading={ loading }
							error={ error }
							empty={
								people.length
									? ''
									: `No ${ label.toLowerCase() } inductees found`
							}
						>
							{ displayed.length === 0 ? (
								<div className="h-full flex items-center justify-center">
									<h3 className="text-center uppercase text-white">
										No matching inductees found
									</h3>
								</div>
							) : (
								<div className="h-full p-8 overflow-y-auto no-scrollbar">
									<div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-[20px] lg:gap-x-[40px] gap-y-[20px]">
										{ displayed.map( ( person ) => (
											<InducteeCard
												key={ person.id }
												person={ person }
												onSelect={ setSelected }
											/>
										) ) }
									</div>
								</div>
							) }
						</RecordState>
					</div>
				) }
			</div>
		</div>
	);
}

export { InducteePage as InducteeGallery };
