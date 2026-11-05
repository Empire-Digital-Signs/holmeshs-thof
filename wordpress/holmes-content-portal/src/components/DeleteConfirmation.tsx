/**
 * DeleteConfirmation shared by the content-type editors.
 * @param root0
 * @param root0.pendingDelete
 * @param root0.busy
 * @param root0.onDelete
 * @param root0.onCancel
 */
export function DeleteConfirmation( {
	pendingDelete,
	busy,
	onDelete,
	onCancel,
} ) {
	if ( ! pendingDelete ) {
		return null;
	}

	return (
		<div
			className="hhs-admin-confirm"
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="hhs-delete-title"
		>
			<h2 id="hhs-delete-title">Delete this record?</h2>
			<p>
				{ pendingDelete.title?.rendered || 'This record' } will be
				permanently removed.
			</p>
			<div className="hhs-admin-actions">
				<button
					className="hhs-admin-danger"
					type="button"
					onClick={ () => onDelete( pendingDelete ) }
					disabled={ busy }
				>
					Delete record
				</button>
				<button
					className="hhs-admin-secondary"
					type="button"
					onClick={ onCancel }
					disabled={ busy }
				>
					Cancel
				</button>
			</div>
		</div>
	);
}
