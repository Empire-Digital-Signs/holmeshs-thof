import { config } from '../config';
import { asset } from '../constants';

/**
 * Navigation tile linking to an individual public-site page.
 * @param root0
 * @param root0.item
 */
export function MenuCard( { item } ) {
	return (
		<a
			href={ config.routes[ item.key ] }
			className="relative aspect-3/5 w-full max-w-[290px] shrink-0 bg-cover bg-no-repeat bg-center text-center text-black uppercase"
			style={ {
				backgroundImage: `url(${ asset( 'images/menu-banner.png' ) })`,
			} }
		>
			<span className="absolute inset-0 flex justify-center items-center pt-[70px] pb-[280px] text-center px-2">
				{ item.name }
			</span>
		</a>
	);
}
