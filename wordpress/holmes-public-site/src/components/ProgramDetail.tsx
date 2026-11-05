import { useEffect, useState } from '@wordpress/element';

/**
 * ProgramDetail component or helper.
 * @param root0
 * @param root0.program
 * @param root0.onClose
 */
export function ProgramDetail( { program, onClose } ) {
	const [ imageIndex, setImageIndex ] = useState( 0 );
	const images = program.images || [];
	useEffect( () => {
		if ( images.length < 2 ) {
			return undefined;
		}
		const timer = setInterval(
			() =>
				setImageIndex( ( current ) => ( current + 1 ) % images.length ),
			5000
		);
		return () => clearInterval( timer );
	}, [ images.length ] );

	return (
		<article className="flex h-full w-full min-h-0 overflow-hidden rounded-[20px] border-2 border-black bg-white">
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<div className="flex items-center justify-between bg-primary-red p-[15px] text-white">
					<h2 className="uppercase">{ program.title }</h2>
					<button
						type="button"
						className="text-3xl"
						onClick={ onClose }
						aria-label="Close program details"
					>
						×
					</button>
				</div>
				<div className="primary-text min-h-0 flex-1 overflow-y-auto p-[30px] font-sans whitespace-pre-wrap">
					{ program.description }
				</div>
			</div>
			{ images.length > 0 && (
				<div className="hidden md:block relative min-h-0 w-1/2 bg-black">
					<img
						src={ images[ imageIndex ] }
						alt=""
						className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
					/>
				</div>
			) }
		</article>
	);
}
