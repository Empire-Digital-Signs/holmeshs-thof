import { MenuCard } from './MenuCard';

/**
 * MenuGrid component or helper.
 * @param root0
 * @param root0.entries
 */
export function MenuGrid( { entries } ) {
	return (
		<div className="w-full h-full flex items-center justify-around gap-[30px] flex-row flex-wrap pt-[120px] overflow-y-scroll">
			{ entries.map( ( item ) => (
				<MenuCard key={ item.key } item={ item } />
			) ) }
		</div>
	);
}

export { MenuGrid as Menu };
