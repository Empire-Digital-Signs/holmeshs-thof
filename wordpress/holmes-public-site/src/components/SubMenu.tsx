import {
	academicsPages,
	athleticsPages,
	submenuAlignment,
	submenuClip,
} from '../constants';
import { config } from '../config';

/**
 * SubMenu component or helper.
 * @param root0
 * @param root0.page
 * @param root0.section
 */
export function SubMenu( { page, section } ) {
	const pages = section === 'academics' ? academicsPages : athleticsPages;
	return (
		<div className="w-full min-w-0 flex items-stretch justify-center gap-[20px] overflow-hidden z-20 my-[10px] px-[30px]">
			{ pages.map( ( item, index ) => {
				const selected = page === item.key;
				return (
					<a
						href={ config.routes[ item.key ] }
						key={ item.key }
						style={ { clipPath: submenuClip( index ) } }
						className={
							`submenu-button relative isolate min-w-0 shrink basis-0 flex-1 items-center
							overflow-hidden font-bold uppercase text-wrap py-[10px] md:py-[20px]
							${ selected ? 'bg-black text-white' : 'bg-white text-black' }`
						}
					>
						<span
							className={ `block w-[88%] text-center ${ submenuAlignment( index ) }` }
						>
							{ item.name }
						</span>
					</a>
				);
			} ) }
		</div>
	);
}
