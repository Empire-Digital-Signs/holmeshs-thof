/**
 * RecordTable shared by the content-type editors.
 * @param root0
 * @param root0.records
 * @param root0.tableColumns
 * @param root0.busy
 * @param root0.onEdit
 * @param root0.onDelete
 * @param root0.loading
 * @param root0.error
 */
export function RecordTable( {
	records,
	tableColumns,
	busy,
	onEdit,
	onDelete,
	loading,
	error,
} ) {
	if ( loading || error || records.length === 0 ) {
		return null;
	}

	return (
		<div className="hhs-admin-table-wrap">
			<table className="hhs-admin-table">
				<thead>
					<tr>
						{ tableColumns.map( ( column ) => (
							<th key={ column.label }>{ column.label }</th>
						) ) }
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{ records.map( ( record ) => (
						<tr key={ record.id }>
							{ tableColumns.map( ( column ) => {
								const value = column.value( record );
								const hasValue =
									value !== undefined &&
									value !== null &&
									value !== '';
								let cellContent = hasValue ? value : '—';
								if ( column.label === 'URL' && hasValue ) {
									cellContent = (
										<a
											href={ value }
											target="_blank"
											rel="noreferrer"
										>
											{ value }
										</a>
									);
								}
								return (
									<td
										key={ column.label }
										className={
											column.label === 'URL'
												? 'hhs-admin-yearbook-url'
												: ''
										}
									>
										{ cellContent }
									</td>
								);
							} ) }
							<td>
								<span
									className={ `hhs-admin-status is-${ record.status }` }
								>
									{ record.status }
								</span>
							</td>
							<td className="hhs-admin-row-actions-cell">
								<div className="hhs-admin-row-actions">
									<button
										type="button"
										onClick={ () => onEdit( record ) }
									>
										Edit
									</button>
									<button
										type="button"
										onClick={ () => onDelete( record ) }
										disabled={ busy }
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
					) ) }
				</tbody>
			</table>
		</div>
	);
}
