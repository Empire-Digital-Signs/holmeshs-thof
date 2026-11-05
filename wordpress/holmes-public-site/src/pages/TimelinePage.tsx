import { useRecords } from '../hooks';
import { useState } from '@wordpress/element';
import { RecordState } from '../components/RecordState';
import { CoverflowCarousel } from '../coverflow-carousel';
import { RecordCarouselCard } from '../components/RecordCarouselCard';
import { YearSelector } from '../components/YearSelector';

/**
 * TimelineLikePage component or helper.
 * @param root0
 * @param root0.type
 */
export function TimelineLikePage( { type } ) {
	const { records, loading, error } = useRecords( type );
	const ordered = [ ...records ].sort(
		( a, b ) => Number( a.year ) - Number( b.year )
	);
	const [ selected, setSelected ] = useState( 0 );
	const years = ordered.map( ( record ) => record.year );
	const record = ordered[ selected ];
	const slides = ordered.map( ( item ) => ( {
		src: '',
		alt: `${ item.year } ${ item.title }`,
	} ) );
	return (
		<div className="flex h-full flex-col">
			<RecordState
				loading={ loading }
				error={ error }
				empty={ records.length ? '' : 'No entries found' }
			>
				{ record && (
					<div className="flex min-h-0 flex-1 flex-col">
						<CoverflowCarousel
							slides={ slides }
							selectedIndex={ selected }
							onSelectedIndexChange={ setSelected }
							cardWidth="clamp(300px, 40vw, 600px)"
							gap={ 0 }
							rotate={ 0 }
							depth={ 1.25 }
							fade={ 0 }
							loop={ false }
							showNavigation={ false }
							label="Holmes High School athletics timeline"
							className="flex h-[600px] my-auto min-w-0 flex-1 items-center [&>div]:h-full [&>div>div]:h-full [&>div>div>div]:h-full!"
							cardClassName="h-full rounded-[20px] border-2 border-black"
							renderSlide={ ( _, index, isSelected ) => {
								const hasPrevious = index > 0;
								const hasNext = index < ordered.length - 1;
								return (
									<RecordCarouselCard
										record={ ordered[ index ] }
										selected={ isSelected }
										mode={ type }
										hasPrevious={ hasPrevious }
										hasNext={ hasNext }
										onPrevious={ () =>
											setSelected( index - 1 )
										}
										onNext={ () =>
											setSelected( index + 1 )
										}
									/>
								);
							} }
						/>
						<YearSelector
							years={ years }
							selected={ record.year }
							onSelect={ ( year ) =>
								setSelected( years.indexOf( year ) )
							}
						/>
					</div>
				) }
			</RecordState>
		</div>
	);
}

/** Render the athletics timeline route using the shared timeline carousel. */
export function TimelinePage() {
	return <TimelineLikePage type="timeline" />;
}
