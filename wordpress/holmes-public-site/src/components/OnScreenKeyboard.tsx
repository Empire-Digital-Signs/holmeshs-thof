/**
 * Touchscreen keyboard used by the kiosk search fields.
 * @param root0
 * @param root0.value
 * @param root0.onChange
 * @param root0.onClose
 */
export function OnScreenKeyboard( { value, onChange, onClose } ) {
	const rows = [ 'QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM' ];
	const append = ( character ) => onChange( value + character );

	return (
		<>
			<button
				type="button"
				aria-label="Close search keyboard"
				onClick={ onClose }
				className="fixed inset-0 z-30 cursor-default bg-black/10"
			/>
			<div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 p-4">
				<div className="mx-auto flex max-w-5xl flex-col gap-2">
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={ () => onChange( '' ) }
							className="bg-white px-4 py-2 uppercase text-black"
						>
							Clear
						</button>
						<button
							type="button"
							onClick={ onClose }
							className="bg-primary-red px-4 py-2 uppercase text-white"
						>
							Done
						</button>
					</div>
					{ rows.map( ( row ) => (
						<div key={ row } className="flex justify-center gap-1">
							{ Array.from( row ).map( ( character ) => (
								<button
									key={ character }
									type="button"
									onClick={ () => append( character ) }
									className="min-w-0 flex-1 bg-white p-3 text-center text-lg text-black"
								>
									{ character }
								</button>
							) ) }
						</div>
					) ) }
					<div className="flex justify-center gap-1">
						<button
							type="button"
							onClick={ () => onChange( value.slice( 0, -1 ) ) }
							className="bg-white px-4 py-3 uppercase text-black"
						>
							Backspace
						</button>
						<button
							type="button"
							onClick={ () => append( ' ' ) }
							className="flex-1 bg-white px-4 py-3 uppercase text-black"
						>
							Space
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
