import { useRecords } from '../hooks';
import { EMPTY_SLIDES, asset } from '../constants';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { DateHeader } from '../components/DateHeader';

/** HomeSlideshow component or helper. */
export function HomeSlideshow() {
	const { records: response, loading, error } = useRecords( 'slides' );
	const slides = response.slides || EMPTY_SLIDES;
	const activeSlides = useMemo( () => {
		const now = new Date();
		return slides.filter( ( slide ) => {
			if (
				slide.startDate &&
				new Date( `${ slide.startDate }T00:00:00` ) > now
			) {
				return false;
			}
			if (
				slide.endDate &&
				new Date( `${ slide.endDate }T23:59:59` ) < now
			) {
				return false;
			}
			return !! slide.image;
		} );
	}, [ slides ] );
	const fadeValue = Number( response.transitionDuration );
	let fadeMs = 0;
	if ( activeSlides.length > 1 ) {
		fadeMs =
			Number.isFinite( fadeValue ) && fadeValue > 0
				? fadeValue * 1000
				: 2000;
	}
	const [ index, setIndex ] = useState( 0 );
	const [ outgoingIndex, setOutgoingIndex ] = useState( null );
	const [ transitionStarted, setTransitionStarted ] = useState( false );

	useEffect( () => {
		setIndex( 0 );
		setOutgoingIndex( null );
		setTransitionStarted( false );
	}, [ activeSlides.length ] );

	useEffect( () => {
		if ( activeSlides.length < 2 ) {
			return undefined;
		}
		const duration = Number( activeSlides[ index ]?.duration );
		const seconds =
			Number.isFinite( duration ) && duration > 0 ? duration : 10;
		const timer = setTimeout(
			() => {
				setOutgoingIndex( index );
				setIndex(
					( current ) => ( current + 1 ) % activeSlides.length
				);
				setTransitionStarted( false );
				window.requestAnimationFrame( () => {
					window.requestAnimationFrame( () =>
						setTransitionStarted( true )
					);
				} );
			},
			seconds * 1000 + fadeMs
		);
		return () => clearTimeout( timer );
	}, [ activeSlides, fadeMs, index ] );

	useEffect( () => {
		if ( outgoingIndex === null ) {
			return undefined;
		}
		const timer = setTimeout( () => setOutgoingIndex( null ), fadeMs );
		return () => clearTimeout( timer );
	}, [ fadeMs, outgoingIndex ] );

	if ( error ) {
		return (
			<p
				className="absolute left-5 bottom-5 z-20 bg-white p-3 text-black"
				role="alert"
			>
				{ error }
			</p>
		);
	}
	if ( loading || ! activeSlides.length ) {
		return null;
	}
	const slide = activeSlides[ index ];
	const outgoingSlide =
		outgoingIndex === null ? null : activeSlides[ outgoingIndex ];
	let slideOpacity = 1;
	if ( outgoingSlide && ! transitionStarted ) {
		slideOpacity = 0;
	}
	return (
		<div
			className="absolute w-full flex-1 h-full overflow-hidden bg-black"
			aria-label="Homepage slideshow"
		>
			{ outgoingSlide && (
				<img
					key={ outgoingSlide.id }
					src={ outgoingSlide.image }
					alt=""
					aria-hidden="true"
					className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
					style={ {
						opacity: transitionStarted ? 0 : 1,
						transitionDuration: `${ fadeMs }ms`,
					} }
				/>
			) }
			<img
				key={ slide.id }
				src={ slide.image }
				alt={ slide.title || '' }
				className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
				style={ {
					opacity: slideOpacity,
					transitionDuration: `${ fadeMs }ms`,
				} }
			/>
		</div>
	);
}

/** HomePage component or helper. */
export function HomePage() {
	return (
		<main className="overflow-hidden flex flex-1">
			<DateHeader variant="home" />
			<HomeSlideshow />
			<div className="absolute top-[10vh] left-[20px] flex flex-col sm:flex-row z-10 gap-[20px]">
				<img
					src={ asset( 'images/logo.png' ) }
					alt=""
					className="w-[clamp(100px,20vw,200px)] h-auto object-contain"
				/>
				<div className="flex flex-col justify-center items-start uppercase text-white [text-shadow:2px_2px_4px_rgb(0_0_0/75%)]">
					<h1>Holmes</h1>
					<h1>High School</h1>
				</div>
			</div>
			<img
				src={ asset( 'images/home-banner.png' ) }
				alt=""
				className="w-screen h-screen object-fill z-9"
			/>
			<img
				src={ asset( 'images/crest.png' ) }
				alt=""
				className="hidden md:block absolute opacity-50 right-[10vw] top-1/2 -translate-y-1/2 z-10 w-[clamp(200px,20vw,400px)] h-auto object-contain"
			/>
		</main>
	);
}
