import { academicsPages, athleticsPages } from '../constants';
import { DateHeader } from '../components/DateHeader';
import { MenuGrid } from '../components/MenuGrid';

/**
 * LandingPage component or helper.
 * @param root0
 * @param root0.section
 */
export function LandingPage( { section } ) {
	const title = section === 'academics' ? 'Academics' : 'Athletics';
	const items = section === 'academics' ? academicsPages : athleticsPages;
	return (
		<div className="w-full h-full">
			<DateHeader variant="menu" />
			<MenuGrid entries={ items } />
			<span className="sr-only">{ title }</span>
		</div>
	);
}
