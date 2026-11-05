/**
 * ChampionshipDetail component or helper.
 * @param root0
 * @param root0.championship
 * @param root0.onClose
 */
export function ChampionshipDetail( { championship, onClose } ) {
	return (
		<article className="h-full w-full max-w-[1100px] mx-auto md:p-[62px]">
			<div className="flex h-full min-h-0 bg-white">
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden p-[24px]">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="uppercase text-primary-red">
								{ championship.sport } · { championship.year }
							</p>
							<h2 className="uppercase">
								{ championship.title }
							</h2>
						</div>
						<button
							type="button"
							className="text-3xl"
							onClick={ onClose }
							aria-label="Close championship details"
						>
							×
						</button>
					</div>
					<p className="primary-text min-h-0 flex-1 overflow-y-auto font-sans whitespace-pre-wrap">
						{ championship.description }
					</p>
				</div>
				{ championship.image && (
					<img
						src={ championship.image }
						alt={ championship.title }
						className="hidden md:block h-full w-1/2 object-cover"
					/>
				) }
			</div>
		</article>
	);
}
