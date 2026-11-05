import { HomePage } from './HomePage';
import { AcademicsPage } from './AcademicsPage';
import { AthleticsPage } from './AthleticsPage';
import { AcademicProgramsPage } from './AcademicProgramsPage';
import { CareerAndTechnicalEducationPage } from './CareerAndTechnicalEducationPage';
import { HallOfDistinctionPage } from './HallOfDistinctionPage';
import { HallOfFamePage } from './HallOfFamePage';
import { ChampionshipPage } from './ChampionshipPage';
import { TimelinePage } from './TimelinePage';
import { HistoryPage } from './HistoryPage';
import { YearbooksPage } from './YearbooksPage';

/**
 * PageBody component or helper.
 * @param root0
 * @param root0.page
 */
export function PageBody( { page } ) {
	if ( page === 'home' ) {
		return <HomePage />;
	}
	if ( page === 'academics' ) {
		return <AcademicsPage />;
	}
	if ( page === 'academic-programs' ) {
		return <AcademicProgramsPage />;
	}
	if ( page === 'career-and-technical-education' ) {
		return <CareerAndTechnicalEducationPage />;
	}
	if ( page === 'hall-of-distinction' ) {
		return <HallOfDistinctionPage />;
	}
	if ( page === 'hall-of-fame' ) {
		return <HallOfFamePage />;
	}
	if ( page === 'athletics' ) {
		return <AthleticsPage />;
	}
	if ( page === 'championship' ) {
		return <ChampionshipPage />;
	}
	if ( page === 'timeline' ) {
		return <TimelinePage />;
	}
	if ( page === 'history' ) {
		return <HistoryPage />;
	}
	if ( page === 'yearbooks' ) {
		return <YearbooksPage />;
	}
	return <HomePage />;
}
