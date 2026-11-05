import { useRecords } from '../hooks';
import { useState } from '@wordpress/element';
import { RecordState } from '../components/RecordState';
import { CoverflowCarousel } from '../coverflow-carousel';
import { HistoryCard } from '../components/HistoryCard';

/** HistoryPage component or helper. */
export function HistoryPage() {
	const { records, loading, error } = useRecords( 'history' );
	const ordered = [ ...records ].sort(
		( a, b ) => Number( a.year ) - Number( b.year )
	);
	const [ selected, setSelected ] = useState( 0 );
	const record = ordered[ selected ];
	const slides = ordered.map( ( item ) => ( {
		src: item.image || '',
		alt: `${ item.year } ${ item.title }`,
	} ) );
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex min-h-0 flex-1">
				<div className="hidden lg:flex min-h-0 w-1/4 flex-col align-start mb-[27px]">
					<h4 className="flex text-center items-center justify-center border-4 border-black uppercase bg-white p-[30px] lg:px-[60px]">
						Years
					</h4>
					<div className="relative flex-1 min-h-0 overflow-y-auto no-scrollbar">
						<div className="relative min-h-full w-full pr-[30px]">
							<div className="absolute inset-y-0 left-0 w-[calc(100%-60px)] bg-black" />
							<ul className="relative z-10 flex flex-col gap-[20px]">
								{ ordered.map( ( item, index ) => (
									<li key={ item.id }>
										<button
											type="button"
											onClick={ () =>
												setSelected( index )
											}
											className="flex justify-end px-[20px] w-full bg-primary-red border-4 border-black text-white"
										>
											{ item.year }
										</button>
									</li>
								) ) }
							</ul>
						</div>
					</div>
				</div>
				<div className="flex min-w-0 flex-1 items-center justify-center p-5">
					<RecordState
						loading={ loading }
						error={ error }
						empty={
							records.length ? '' : 'No history entries found'
						}
					>
						{ record && (
							<CoverflowCarousel
								slides={ slides }
								selectedIndex={ selected }
								onSelectedIndexChange={ setSelected }
								cardWidth="clamp(250px, 40vw, 600px)"
								gap={ 0 }
								rotate={ 0 }
								depth={ 1.25 }
								fade={ 0 }
								loop={ false }
								showNavigation={ false }
								label="Holmes High School history"
								className="flex h-full my-auto min-w-0 flex-1 items-center overflow-y-scroll [&>div]:h-full [&>div>div]:h-full [&>div>div>div]:h-full!"
								cardClassName="h-[clamp(300px,70vh,1000px)] top-0 bottom-0 my-auto rounded-[20px] border-2 border-black"
								renderSlide={ ( _, index, isSelected ) => {
									const hasPrevious = index > 0;
									const hasNext = index < ordered.length - 1;
									return (
										<HistoryCard
											record={ ordered[ index ] }
											selected={ isSelected }
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
						) }
					</RecordState>
				</div>
			</div>
		</div>
	);
}

export { HistoryPage as HistoryClient };
