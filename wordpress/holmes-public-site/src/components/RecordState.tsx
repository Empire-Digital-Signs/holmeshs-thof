/**
 * RecordState component or helper.
 * @param root0
 * @param root0.loading
 * @param root0.error
 * @param root0.empty
 * @param root0.children
 */
export function RecordState( { loading, error, empty, children } ) {
	if ( loading ) {
		return (
			<div className="h-full flex items-center justify-center">
				<h3 className="text-center uppercase text-white">Loading…</h3>
			</div>
		);
	}
	if ( error ) {
		return (
			<div className="h-full flex items-center justify-center p-8">
				<p className="bg-white p-6 text-center text-black" role="alert">
					{ error }
				</p>
			</div>
		);
	}
	if ( empty ) {
		return (
			<div className="h-full flex items-center justify-center">
				<h3 className="text-center uppercase text-white">{ empty }</h3>
			</div>
		);
	}
	return children;
}
