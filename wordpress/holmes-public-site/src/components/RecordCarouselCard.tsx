/**
 * RecordCarouselCard component or helper.
 * @param root0
 * @param root0.record
 * @param root0.selected
 * @param root0.mode
 * @param root0.onPrevious
 * @param root0.onNext
 * @param root0.hasPrevious
 * @param root0.hasNext
 */
export function RecordCarouselCard( {
	record,
	selected,
	mode,
	onPrevious,
	onNext,
	hasPrevious,
	hasNext,
} ) {
	return (
		<article
			className={ `flex h-full flex-col justify-start border-2 border-black ${ selected ? 'bg-primary-red' : 'bg-white' } pb-[30px] bg-no-repeat bg-center` }
		>
			{ selected ? (
				<>
					<div className="flex flex-col px-[20px] py-[10px] justify-center">
						{ mode === 'timeline' && (
							<h3 className="uppercase text-white hidden lg:block">
								Holmes High School
							</h3>
						) }
						<h2 className="text-white">{ record.year }</h2>
					</div>
					<div className="flex min-h-0 flex-1 flex-col gap-[20px] bg-white p-[15px] overflow-hidden">
						<h4 className="shrink-0 uppercase text-left text-primary-red text-ellipsis line-clamp-3">
							{ record.title }
						</h4>
						<p className="primary-text min-h-0 font-sans overflow-y-auto scrollbar scrollbar-track-white scrollbar-thumb-primary-red">
							{ record.description }
						</p>
						<div className="mt-auto mb-[10px] flex justify-evenly items-center w-full gap-[5px]">
							<button
								type="button"
								onPointerDown={ ( event ) =>
									event.stopPropagation()
								}
								onPointerUp={ ( event ) =>
									event.stopPropagation()
								}
								disabled={ ! hasPrevious }
								onClick={ onPrevious }
								className="w-full h-min p-[10px] text-nowrap bg-primary-red text-white disabled:invisible"
							>
								&lt; Previous
							</button>
							<button
								type="button"
								onPointerDown={ ( event ) =>
									event.stopPropagation()
								}
								onPointerUp={ ( event ) =>
									event.stopPropagation()
								}
								disabled={ ! hasNext }
								onClick={ onNext }
								className="w-full h-min p-[10px] text-nowrap bg-primary-red text-white disabled:invisible"
							>
								Next &gt;
							</button>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="flex flex-col pl-[20px] pt-[30px]">
						<h6 className="uppercase text-primary-red hidden lg:block">
							Holmes High School
						</h6>
						<h5 className="text-primary-red">{ record.year }</h5>
					</div>
					<div className="relative flex flex-1 flex-col justify-end p-3.5 h-3/4">
						<p className="secondary-text line-clamp-3 font-sans text-black">
							{ record.description }
						</p>
					</div>
				</>
			) }
		</article>
	);
}
