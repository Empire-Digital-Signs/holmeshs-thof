import { asset } from '../constants';

/**
 * InducteeDetail component or helper.
 * @param root0
 * @param root0.person
 * @param root0.onClose
 * @param root0.athletics
 */
export function InducteeDetail( { person, onClose, athletics } ) {
	return (
		<div className="h-full w-full max-w-[1600px] mx-auto md:p-[62px]">
			<div className="flex h-full w-full min-h-0">
				<div className="my-[30px] flex min-h-0 flex-1 flex-col bg-white overflow-hidden">
					<div className="flex justify-between p-[15px] gap-[10px]">
						<div className="flex flex-col">
							<h4>{ person.inductionYear }</h4>
							<img
								src={ asset(
									athletics
										? 'images/logo.png'
										: 'images/crest.png'
								) }
								alt={
									athletics ? 'Holmes Logo' : 'Holmes Crest'
								}
								className="w-[100px] h-[100px] object-contain"
							/>
						</div>
						<div className="flex flex-col gap-[7px] w-full text-right uppercase">
							<h2 className="line-clamp-2 text-ellipsis">
								{ person.lastName }
							</h2>
							<h3 className="line-clamp-2 text-ellipsis">
								{ person.firstName }
							</h3>
						</div>
					</div>
					<p className="primary-text ml-[56px] my-[36px] mx-[30px] min-h-0 flex-1 overflow-y-auto scrollbar scrollbar-track-white scrollbar-thumb-primary-red font-sans">
						{ person.description }
					</p>
					<button
						type="button"
						className="m-4 self-end bg-primary-red px-5 py-3 uppercase text-white"
						onClick={ onClose }
					>
						Close
					</button>
				</div>
				<div className="relative h-full min-h-0 flex-1">
					{ person.image ? (
						<img
							src={ person.image }
							alt={ `${ person.firstName } ${ person.lastName }` }
							className="absolute inset-0 h-full w-full object-cover"
						/>
					) : (
						<div className="absolute inset-0 bg-black" />
					) }
				</div>
			</div>
		</div>
	);
}

export { InducteeDetail as InducteeDisplay };
