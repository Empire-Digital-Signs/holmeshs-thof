import { useCallback, useEffect, useState } from '@wordpress/element';
import { EMPTY_FORM, SCHOOL_NAME, TABLE_COLUMNS, TYPES } from './constants';
import { ContentTypeTabs } from './components/ContentTypeTabs';
import { DeleteConfirmation } from './components/DeleteConfirmation';
import { EditorForm } from './components/EditorForm';
import { RecordTable } from './components/RecordTable';
import { SlideshowSettings } from './components/SlideshowSettings';
import {
	apiUrl,
	formPayload,
	isRequiredField,
	request,
	selectMedia,
	toForm,
} from './utils';

/** Main shared CRUD interface for all content types. */
export function EditorApp() {
	const editableTypes = TYPES.filter(
		( type ) =>
			! type.adminOnly || window.HolmesContentPortal.canEditYearbooks
	);
	const [ activeKey, setActiveKey ] = useState( editableTypes[ 0 ]?.key );
	const [ records, setRecords ] = useState( [] );
	const [ form, setForm ] = useState( null );
	const [ loading, setLoading ] = useState( true );
	const [ busy, setBusy ] = useState( false );
	const [ error, setError ] = useState( '' );
	const [ notice, setNotice ] = useState( '' );
	const [ transitionDuration, setTransitionDuration ] = useState( 2 );
	const [ pendingDelete, setPendingDelete ] = useState( null );
	const [ darkMode, setDarkMode ] = useState( () => {
		try {
			const saved = window.localStorage.getItem(
				'holmes-content-portal-theme'
			);
			return saved
				? saved === 'dark'
				: window.matchMedia( '(prefers-color-scheme: dark)' ).matches;
		} catch {
			return false;
		}
	} );
	const activeType =
		editableTypes.find( ( type ) => type.key === activeKey ) ||
		editableTypes[ 0 ];
	const tableColumns = TABLE_COLUMNS[ activeType?.key ] || [];

	const endpoint = activeType?.rest || '';

	useEffect( () => {
		try {
			window.localStorage.setItem(
				'holmes-content-portal-theme',
				darkMode ? 'dark' : 'light'
			);
		} catch {
			setError( 'Theme preference could not be saved in this browser.' );
		}
	}, [ darkMode ] );

	const loadRecords = useCallback( async () => {
		if ( ! activeType ) {
			return;
		}
		setLoading( true );
		setError( '' );
		try {
			const url = apiUrl(
				window.HolmesContentPortal.apiRoot,
				`${ endpoint }?context=edit&per_page=100&_embed=1`
			);
			const items = await request( url );
			setRecords( items );
			if ( activeType.key === 'slides' ) {
				const settings = await request(
					apiUrl(
						window.HolmesContentPortal.customApiRoot,
						'slideshow-settings'
					)
				);
				setTransitionDuration( settings.transitionDuration );
			}
		} catch ( loadError ) {
			setError( loadError.message );
		} finally {
			setLoading( false );
		}
	}, [ activeType, endpoint ] );

	useEffect( () => {
		setForm( null );
		loadRecords();
	}, [ activeKey, loadRecords ] );

	function startNew() {
		setError( '' );
		setNotice( '' );
		setPendingDelete( null );
		setForm( { ...EMPTY_FORM, meta: {} } );
	}

	function startEdit( record ) {
		setError( '' );
		setNotice( '' );
		setPendingDelete( null );
		setForm( toForm( record ) );
	}

	function openMedia( multiple, callback ) {
		try {
			selectMedia( multiple, callback );
		} catch ( mediaError ) {
			setError( mediaError.message );
		}
	}

	async function saveRecord( event ) {
		event.preventDefault();
		if ( ! activeType || ! form ) {
			return;
		}
		if (
			isRequiredField( activeType, 'image' ) &&
			! Number( form.featured_media )
		) {
			setError( 'Choose an image before saving this record.' );
			return;
		}
		setBusy( true );
		setError( '' );
		setNotice( '' );
		try {
			const path = apiUrl(
				window.HolmesContentPortal.apiRoot,
				`${ activeType.rest }${ form.id ? `/${ form.id }` : '' }`
			);
			await request( path, {
				method: 'POST',
				body: JSON.stringify( formPayload( activeType, form ) ),
			} );
			setForm( null );
			setNotice( 'Record saved.' );
			await loadRecords();
		} catch ( saveError ) {
			setError( saveError.message );
		} finally {
			setBusy( false );
		}
	}

	async function deleteRecord( record ) {
		setBusy( true );
		setError( '' );
		setNotice( '' );
		try {
			await request(
				apiUrl(
					window.HolmesContentPortal.apiRoot,
					`${ activeType.rest }/${ record.id }?force=true`
				),
				{ method: 'DELETE' }
			);
			setPendingDelete( null );
			setNotice( 'Record deleted.' );
			await loadRecords();
		} catch ( deleteError ) {
			setError( deleteError.message );
		} finally {
			setBusy( false );
		}
	}

	async function saveTransitionDuration( event ) {
		event.preventDefault();
		setBusy( true );
		setError( '' );
		setNotice( '' );
		try {
			await request(
				apiUrl(
					window.HolmesContentPortal.customApiRoot,
					'slideshow-settings'
				),
				{
					method: 'POST',
					body: JSON.stringify( {
						transitionDuration: Number( transitionDuration ),
					} ),
				}
			);
			setNotice( 'Slideshow settings saved.' );
		} catch ( saveError ) {
			setError( saveError.message );
		} finally {
			setBusy( false );
		}
	}

	if ( ! activeType ) {
		return (
			<p className="hhs-admin-error">
				No editable content types are available for this account.
			</p>
		);
	}

	return (
		<div className={ `hhs-admin ${ darkMode ? 'is-dark' : 'is-light' }` }>
			<header className="hhs-admin-header">
				<div>
					<p className="hhs-admin-eyebrow">{ SCHOOL_NAME }</p>
					<h1>EZ Edit</h1>
					<p>
						Manage content for your Touch Hall of Fame system.
						Select a content type below to view, edit, or add
						records.
					</p>
				</div>
				<div className="hhs-admin-header-actions">
					<button
						className="hhs-admin-theme-toggle"
						type="button"
						onClick={ () => setDarkMode( ( value ) => ! value ) }
						aria-pressed={ darkMode }
					>
						{ darkMode ? 'Light mode' : 'Dark mode' }
					</button>
					<a
						className="hhs-admin-support"
						href="mailto:support@empiredigitalsigns.com"
					>
						Contact support
					</a>
					<a
						className="hhs-admin-account"
						href={ window.HolmesContentPortal.profileUrl }
					>
						WordPress account
					</a>
				</div>
			</header>

			<ContentTypeTabs
				editableTypes={ editableTypes }
				activeKey={ activeKey }
				onSelect={ setActiveKey }
			/>

			{ error && (
				<div className="hhs-admin-alert is-error" role="alert">
					{ error }
				</div>
			) }
			{ notice && (
				<div className="hhs-admin-alert is-success" role="status">
					{ notice }
				</div>
			) }
			<DeleteConfirmation
				pendingDelete={ pendingDelete }
				busy={ busy }
				onDelete={ deleteRecord }
				onCancel={ () => setPendingDelete( null ) }
			/>

			<section className="hhs-admin-panel">
				<div className="hhs-admin-panel-heading">
					<div>
						<h2>{ activeType.label }</h2>
						<p>
							{ records.length }{ ' ' }
							{ records.length === 1 ? 'record' : 'records' }
						</p>
					</div>
					<button
						className="hhs-admin-primary"
						type="button"
						onClick={ startNew }
						disabled={ busy }
					>
						Add record
					</button>
				</div>

				{ activeType.key === 'slides' && (
					<SlideshowSettings
						transitionDuration={ transitionDuration }
						onChange={ setTransitionDuration }
						onSave={ saveTransitionDuration }
						busy={ busy }
					/>
				) }

				<EditorForm
					form={ form }
					activeType={ activeType }
					busy={ busy }
					onSave={ saveRecord }
					onClose={ () => setForm( null ) }
					setForm={ setForm }
					openMedia={ openMedia }
				/>

				{ loading && (
					<p className="hhs-admin-empty">Loading records…</p>
				) }
				{ ! loading && ! error && records.length === 0 && (
					<p className="hhs-admin-empty">
						No records yet. Add one to get started.
					</p>
				) }
				<RecordTable
					records={ records }
					tableColumns={ tableColumns }
					busy={ busy }
					loading={ loading }
					error={ error }
					onEdit={ startEdit }
					onDelete={ setPendingDelete }
				/>
			</section>
		</div>
	);
}
