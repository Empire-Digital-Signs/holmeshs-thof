/**
 * SlideshowSettings shared by the content-type editors.
 * @param root0
 * @param root0.transitionDuration
 * @param root0.onChange
 * @param root0.onSave
 * @param root0.busy
 */
export function SlideshowSettings( {
	transitionDuration,
	onChange,
	onSave,
	busy,
} ) {
	return (
		<form className="hhs-admin-settings" onSubmit={ onSave }>
			<label htmlFor="hhs-transition-duration">
				Transition duration (seconds)
				<input
					id="hhs-transition-duration"
					type="number"
					min="0"
					max="60"
					step="0.1"
					value={ transitionDuration }
					onChange={ ( event ) => onChange( event.target.value ) }
				/>
			</label>
			<button
				type="submit"
				className="hhs-admin-secondary"
				disabled={ busy }
			>
				Save slideshow settings
			</button>
		</form>
	);
}
