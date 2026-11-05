/**
 * ListPanel component or helper.
 * @param root0
 * @param root0.title
 * @param root0.items
 * @param root0.selected
 * @param root0.onSelect
 * @param root0.getItemLabel
 * @param root0.className
 */
export function ListPanel( {
	title,
	items,
	selected,
	onSelect,
	// Avoid `valueOf`: plain props objects inherit Object.prototype.valueOf.
	getItemLabel = ( item ) => item,
	className = '',
} ) {
	const safeItems = Array.isArray( items )
		? items.filter( ( item ) => item !== null && item !== undefined )
		: [];
	return (
		<div className={ `flex min-h-0 flex-1 flex-col w-full ${ className }` }>
			<h4 className="shrink-0 bg-primary-red border-4 border-black text-white uppercase flex items-center justify-center text-center p-[30px] lg:px-[60px]">
				{ title }
			</h4>
			<ul className="min-h-0 flex-1 overflow-y-auto bg-black scrollbar scrollbar-thick scrollbar-track-black scrollbar-thumb-primary-red scrollbar-thumb-rounded-full">
				{ safeItems.map( ( item, index ) => {
					const rawLabel = getItemLabel( item );
					const label =
						typeof rawLabel === 'string' ||
						typeof rawLabel === 'number'
							? rawLabel
							: '';
					return (
						<li key={ `${ label }-${ index }` }>
							<button
								type="button"
								aria-pressed={ selected === label }
								onClick={ () =>
									onSelect(
										selected === label ? null : label,
										item
									)
								}
								className={ `text-center uppercase cursor-pointer w-full flex items-center justify-center border-4 border-black p-[10px] lg:py-[20px] ${ selected === label ? 'bg-primary-red text-white' : 'bg-white text-black' }` }
							>
								{ label }
							</button>
						</li>
					);
				} ) }
			</ul>
		</div>
	);
}

export { ListPanel as InducteeList };
