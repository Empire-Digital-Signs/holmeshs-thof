import { useRecords } from '../hooks';
import { useEffect, useState } from '@wordpress/element';
import { RecordState } from '../components/RecordState';
import { YearSelector } from '../components/YearSelector';

/** YearbooksPage component or helper. */
export function YearbooksPage() {
	const { records, loading, error } = useRecords( 'yearbooks' );
	const books = [ ...records ].sort(
		( a, b ) => Number( b.year ) - Number( a.year )
	);
	const years = books.map( ( book ) => Number( book.year ) );
	const [ selected, setSelected ] = useState( null );
	const selectedBook =
		books.find( ( book ) => Number( book.year ) === selected ) ||
		books[ 0 ];
	const initialYear = books[ 0 ]?.year;
	useEffect( () => {
		if ( initialYear !== undefined && selected === null ) {
			setSelected( Number( initialYear ) );
		}
	}, [ initialYear, selected ] );
	return (
		<div className="flex flex-col w-full h-full min-h-0 box-border pt-[20px] gap-[20px]">
			<RecordState
				loading={ loading }
				error={ error }
				empty={ records.length ? '' : 'No yearbooks are available' }
			>
				{ selectedBook && (
					<>
						<iframe
							src={ selectedBook.url }
							className="w-3/4 min-h-0 flex-1 mx-auto"
							title={ `${ selectedBook.year } Yearbook` }
						/>
						<YearSelector
							years={ years }
							selected={ Number( selectedBook.year ) }
							onSelect={ ( year ) => setSelected( year ) }
						/>
					</>
				) }
			</RecordState>
		</div>
	);
}
