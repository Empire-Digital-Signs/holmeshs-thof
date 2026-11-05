import { config } from './config';
import { asset, hasSubmenu, pageSection } from './constants';
import { IdleReturn } from './components/IdleReturn';
import { PageBody } from './pages/PageBody';
import { SubMenu } from './components/SubMenu';
import { Navigation } from './components/Navigation';

/** App component or helper. */
export function App() {
	const page = config.page;
	const section = pageSection( page );
	return (
		<div
			className="w-screen h-screen min-h-0 overflow-hidden bg-black flex flex-col"
			style={ {
				backgroundImage: `url(${ asset( 'images/background.png' ) })`,
				backgroundSize: 'cover',
			} }
		>
			<IdleReturn page={ page } />
			<main className="flex-1 min-h-0 flex flex-col">
				<PageBody page={ page } />
			</main>
			{ section && hasSubmenu( page ) && (
				<SubMenu page={ page } section={ section } />
			) }
			<Navigation page={ page } />
		</div>
	);
}
