/**
 * ContentTypeTabs shared by the content-type editors.
 * @param root0
 * @param root0.editableTypes
 * @param root0.activeKey
 * @param root0.onSelect
 */
export function ContentTypeTabs( { editableTypes, activeKey, onSelect } ) {
	return (
		<nav className="hhs-admin-tabs" aria-label="Content types">
			{ editableTypes.map( ( type ) => (
				<button
					key={ type.key }
					className={ activeKey === type.key ? 'is-active' : '' }
					type="button"
					onClick={ () => onSelect( type.key ) }
				>
					{ type.label }
				</button>
			) ) }
		</nav>
	);
}
