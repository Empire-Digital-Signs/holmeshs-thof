import { FIELD_LABELS } from '../constants';
import {
	fieldValue,
	inputType,
	isRequiredField,
	minimumValue,
	numericValue,
	setField,
} from '../utils';

/**
 * EditorForm shared by the content-type editors.
 * @param root0
 * @param root0.form
 * @param root0.activeType
 * @param root0.busy
 * @param root0.onSave
 * @param root0.onClose
 * @param root0.setForm
 * @param root0.openMedia
 */
export function EditorForm( {
	form,
	activeType,
	busy,
	onSave,
	onClose,
	setForm,
	openMedia,
} ) {
	if ( ! form ) {
		return null;
	}

	return (
		<form className="hhs-admin-form" onSubmit={ onSave }>
			<div className="hhs-admin-form-heading">
				<h3>{ form.id ? 'Edit record' : 'New record' }</h3>
				<button
					type="button"
					className="hhs-admin-close"
					onClick={ onClose }
					aria-label="Close form"
				>
					×
				</button>
			</div>
			<div className="hhs-admin-fields">
				{ activeType.fields.map( ( field ) => {
					const fieldId = `hhs-${ activeType.key }-${ field }`;
					const required = isRequiredField( activeType, field );
					const numberField = [
						'year',
						'inductionYear',
						'duration',
					].includes( field );
					return (
						<div
							key={ field }
							className={
								field === 'description' ? 'is-wide' : ''
							}
						>
							<span id={ fieldId }>
								{ FIELD_LABELS[ field ] }
								{ required ? ' *' : '' }
							</span>
							{ field === 'description' && (
								<textarea
									id={ fieldId }
									aria-labelledby={ fieldId }
									rows="5"
									value={ fieldValue( form, field ) }
									onChange={ ( event ) =>
										setForm(
											setField(
												form,
												field,
												event.target.value
											)
										)
									}
								/>
							) }
							{ field === 'image' && (
								<div className="hhs-admin-media">
									{ form.featuredUrl && (
										<img src={ form.featuredUrl } alt="" />
									) }
									<button
										className="hhs-admin-secondary"
										type="button"
										aria-labelledby={ fieldId }
										onClick={ () =>
											openMedia( false, ( value ) =>
												setForm(
													setField(
														form,
														field,
														value
													)
												)
											)
										}
									>
										{ form.featured_media
											? 'Replace image'
											: 'Choose image' }
									</button>
								</div>
							) }
							{ field === 'images' && (
								<div className="hhs-admin-media">
									<p>
										{ ( form.meta.images || [] ).length }{ ' ' }
										images selected
									</p>
									<button
										className="hhs-admin-secondary"
										type="button"
										aria-labelledby={ fieldId }
										onClick={ () =>
											openMedia( true, ( value ) =>
												setForm(
													setField(
														form,
														field,
														value
													)
												)
											)
										}
									>
										Choose slideshow images
									</button>
								</div>
							) }
							{ ! [ 'description', 'image', 'images' ].includes(
								field
							) && (
								<input
									id={ fieldId }
									aria-labelledby={ fieldId }
									required={ required }
									type={ inputType( field ) }
									min={ minimumValue( field ) }
									step={
										field === 'duration' ? '0.1' : undefined
									}
									value={ fieldValue( form, field ) }
									onChange={ ( event ) =>
										setForm(
											setField(
												form,
												field,
												numberField
													? numericValue(
															event.target.value
														)
													: event.target.value
											)
										)
									}
								/>
							) }
						</div>
					);
				} ) }
				<div>
					<label htmlFor="hhs-record-visibility">Visibility</label>
					<select
						id="hhs-record-visibility"
						value={ form.status }
						onChange={ ( event ) =>
							setForm( {
								...form,
								status: event.target.value,
							} )
						}
					>
						<option value="publish">Published</option>
						<option value="draft">Draft</option>
					</select>
				</div>
			</div>
			<div className="hhs-admin-actions">
				<button
					className="hhs-admin-primary"
					type="submit"
					disabled={ busy }
				>
					{ busy ? 'Saving…' : 'Save record' }
				</button>
				<button
					className="hhs-admin-secondary"
					type="button"
					onClick={ onClose }
				>
					Cancel
				</button>
			</div>
		</form>
	);
}
