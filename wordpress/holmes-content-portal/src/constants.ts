/** SCHOOL_NAME configuration for the content editor. */
export const SCHOOL_NAME = 'Holmes High School';

/** TYPES configuration for the content editor. */
export const TYPES = [
	{
		key: 'slides',
		label: 'Home Slideshow',
		rest: 'hhs-slides',
		fields: [ 'title', 'image', 'startDate', 'endDate', 'duration' ],
	},
	{
		key: 'history',
		label: 'History',
		rest: 'hhs-history',
		fields: [ 'title', 'year', 'description', 'image' ],
	},
	{
		key: 'academic-programs',
		label: 'Academic Programs',
		rest: 'hhs-programs',
		fields: [ 'title', 'description', 'images' ],
	},
	{
		key: 'career-and-technical-education',
		label: 'Career and Technical Education',
		rest: 'hhs-cte-programs',
		fields: [ 'title', 'description', 'images' ],
	},
	{
		key: 'hall-of-distinction',
		label: 'Hall of Distinction',
		rest: 'hhs-hod-inductees',
		fields: [
			'firstName',
			'lastName',
			'inductionYear',
			'description',
			'image',
		],
	},
	{
		key: 'hall-of-fame',
		label: 'Hall of Fame',
		rest: 'hhs-hof-inductees',
		fields: [
			'firstName',
			'lastName',
			'inductionYear',
			'description',
			'image',
		],
	},
	{
		key: 'championships',
		label: 'Championships',
		rest: 'hhs-championships',
		fields: [ 'title', 'sport', 'year', 'description', 'image' ],
	},
	{
		key: 'timeline',
		label: 'Timeline',
		rest: 'hhs-timeline',
		fields: [ 'title', 'year', 'description' ],
	},
	{
		key: 'yearbooks',
		label: 'Yearbooks',
		rest: 'hhs-yearbooks',
		fields: [ 'year', 'url' ],
		adminOnly: true,
	},
];

/** FIELD_LABELS configuration for the content editor. */
export const FIELD_LABELS = {
	title: 'Name',
	firstName: 'First name',
	lastName: 'Last name',
	inductionYear: 'Induction year',
	year: 'Year',
	sport: 'Sport',
	description: 'Description / bio',
	image: 'Image',
	images: 'Slideshow images',
	startDate: 'Start date',
	endDate: 'End date',
	duration: 'Display duration (seconds)',
	url: 'Yearbook URL',
};

/** TABLE_COLUMNS configuration for the content editor. */
export const TABLE_COLUMNS = {
	slides: [
		{ label: 'Slide', value: ( record ) => record.title?.rendered },
		{
			label: 'Display duration',
			value: ( record ) => `${ record.meta?.duration ?? '—' } sec`,
		},
		{ label: 'Start date', value: ( record ) => record.meta?.startDate },
		{ label: 'End date', value: ( record ) => record.meta?.endDate },
	],
	history: [
		{ label: 'Title', value: ( record ) => record.title?.rendered },
		{ label: 'Year', value: ( record ) => record.meta?.year },
	],
	'academic-programs': [
		{ label: 'Program', value: ( record ) => record.title?.rendered },
		{
			label: 'Slideshow images',
			value: ( record ) => record.meta?.images?.length ?? 0,
		},
	],
	'career-and-technical-education': [
		{ label: 'Program', value: ( record ) => record.title?.rendered },
		{
			label: 'Slideshow images',
			value: ( record ) => record.meta?.images?.length ?? 0,
		},
	],
	'hall-of-distinction': [
		{
			label: 'Name',
			value: ( record ) =>
				[ record.meta?.firstName, record.meta?.lastName ]
					.filter( Boolean )
					.join( ' ' ),
		},
		{
			label: 'Induction year',
			value: ( record ) => record.meta?.inductionYear,
		},
	],
	'hall-of-fame': [
		{
			label: 'Name',
			value: ( record ) =>
				[ record.meta?.firstName, record.meta?.lastName ]
					.filter( Boolean )
					.join( ' ' ),
		},
		{
			label: 'Induction year',
			value: ( record ) => record.meta?.inductionYear,
		},
	],
	championships: [
		{ label: 'Championship', value: ( record ) => record.title?.rendered },
		{ label: 'Sport', value: ( record ) => record.meta?.sport },
		{ label: 'Year', value: ( record ) => record.meta?.year },
	],
	timeline: [
		{ label: 'Event', value: ( record ) => record.title?.rendered },
		{ label: 'Year', value: ( record ) => record.meta?.year },
	],
	yearbooks: [
		{ label: 'Year', value: ( record ) => record.meta?.year },
		{ label: 'URL', value: ( record ) => record.meta?.url },
	],
};

/** REQUIRED_FIELDS configuration for the content editor. */
export const REQUIRED_FIELDS = {
	'hall-of-distinction': [
		'firstName',
		'lastName',
		'inductionYear',
		'image',
	],
	'hall-of-fame': [ 'firstName', 'lastName', 'inductionYear', 'image' ],
	championships: [ 'sport', 'year', 'image' ],
	history: [ 'year' ],
	timeline: [ 'year' ],
	yearbooks: [ 'year', 'url' ],
};

/** EMPTY_FORM configuration for the content editor. */
export const EMPTY_FORM = {
	title: '',
	description: '',
	status: 'publish',
	featured_media: 0,
	featuredUrl: '',
	meta: {},
};
