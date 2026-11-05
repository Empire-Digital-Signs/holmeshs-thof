import { useRecords } from '../hooks';
import { useState } from '@wordpress/element';
import { RecordState } from '../components/RecordState';
import { ProgramDetail } from '../components/ProgramDetail';
import { ListPanel } from '../components/ListPanel';
import { SearchBox } from '../components/Searchbar';

/**
 * ProgramPage component or helper.
 * @param root0
 * @param root0.type
 * @param root0.label
 */
export function ProgramPage( { type, label } ) {
	const { records, loading, error } = useRecords( type );
	const [ selected, setSelected ] = useState( null );
	const [ query, setQuery ] = useState( '' );
	const filtered = records.filter( ( record ) =>
		record.title.toLowerCase().includes( query.trim().toLowerCase() )
	);
	let programContent;
	if ( loading || error ) {
		programContent = <RecordState loading={ loading } error={ error } />;
	} else if ( selected ) {
		programContent = (
			<ProgramDetail
				program={ selected }
				onClose={ () => setSelected( null ) }
			/>
		);
	} else {
		programContent = (
			<div className="h-full flex items-center justify-center">
				<h3 className="text-center uppercase text-white">
					{ records.length
						? `Select a program`
						: 'No programs found' }
				</h3>
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="grid min-h-0 flex-1 grid-cols-4">
				<div className="h-full min-h-0 flex-col gap-[20px] items-start hidden md:flex col-span-1">
					<ListPanel
						title={ label }
						items={ filtered }
						selected={ selected?.title }
						getItemLabel={ ( item ) => item.title }
						onSelect={ ( value, item ) =>
							setSelected( value === null ? null : item )
						}
					/>
					<SearchBox
						value={ query }
						onChange={ setQuery }
						label="programs"
					/>
				</div>
				<div className="relative col-span-4 min-h-0 md:col-span-3 p-8">
					{ programContent }
				</div>
			</div>
		</div>
	);
}
