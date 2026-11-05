import { asset } from '../constants';

/**
 * HistoryCard component or helper.
 * @param root0
 * @param root0.record
 * @param root0.selected
 * @param root0.hasPrevious
 * @param root0.onPrevious
 * @param root0.hasNext
 * @param root0.onNext
 */
export function HistoryCard( {
	record,
	selected,
	hasPrevious,
	onPrevious,
	hasNext,
	onNext,
} ) {
	return (
		<div
			className={ `flex h-full flex-col justify-start border-2 border-black ${ selected ? 'bg-primary-red' : 'bg-white' } pb-[30px]` }
		>
			{ selected ? (
				<>
					<h4 className="px-3.5 text-center text-white">
						{ record.year }
					</h4>
					{ record.image && (
						<img
							src={ record.image }
							alt={ `${ record.year }: ${ record.title }` }
							className="object-cover h-[200px] [@media(max-height:800px)]:hidden"
						/>
					) }
					<div className="flex min-h-0 flex-1 flex-col gap-[20px] bg-white p-[15px]">
						<h2 className="uppercase text-center text-ellipsis line-clamp-3">
							{ record.title }
						</h2>
						<div className="primary-text min-h-0 overflow-y-auto scrollbar scrollbar-track-white scrollbar-thumb-primary-red font-sans">
							{ record.description }
						</div>
						<div className="mt-auto mb-[10px] flex items-center justify-evenly w-full gap-[5px]">
							<button
								type="button"
								onPointerDown={ ( event ) =>
									event.stopPropagation()
								}
								onPointerUp={ ( event ) =>
									event.stopPropagation()
								}
								className={ `${ hasPrevious ? 'visible' : 'invisible' } uppercase w-full p-[10px] bg-primary-red text-white text-nowrap` }
								onClick={ onPrevious }
							>
								&lt; Previous
							</button>
							<img
								src={ asset( 'images/crest.png' ) }
								alt=""
								className="hidden xl:block w-[75px]"
							/>
							<button
								type="button"
								onPointerDown={ ( event ) =>
									event.stopPropagation()
								}
								onPointerUp={ ( event ) =>
									event.stopPropagation()
								}
								className={ `${ hasNext ? 'visible' : 'invisible' } uppercase w-full p-[10px] bg-primary-red text-white text-nowrap` }
								onClick={ onNext }
							>
								Next &gt;
							</button>
						</div>
					</div>
				</>
			) : (
				<>
					<h5 className="px-[20px] text-black">{ record.year }</h5>
					<div
						className="relative flex flex-1 flex-col justify-end p-3.5 h-3/4 bg-no-repeat bg-center opacity-50"
						style={ {
							backgroundImage: `url(${ asset( 'images/crest.png' ) })`,
							backgroundSize: '132px 180px',
						} }
					>
						<div className="secondary-text line-clamp-3 font-sans text-black">
							{ record.description }
						</div>
					</div>
				</>
			) }
		</div>
	);
}
