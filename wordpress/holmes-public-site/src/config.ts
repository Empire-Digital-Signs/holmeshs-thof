export const mount = document.getElementById( 'holmes-public-site' );

export const config = mount
	? {
			page: mount.dataset.page,
			routes: JSON.parse( mount.dataset.routes || '{}' ),
			apiRoot: mount.dataset.apiRoot,
			assets: mount.dataset.assets,
		}
	: null;
