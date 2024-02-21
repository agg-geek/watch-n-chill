import { useEffect } from 'react';

export function useKey(keyCode, callback) {
	useEffect(
		function () {
			function handleKeydown(evt) {
				if (evt.code.toLowerCase() === keyCode.toLowerCase()) callback();
			}

			document.addEventListener('keydown', handleKeydown);

			return function () {
				document.removeEventListener('keydown', handleKeydown);
			};
		},
		[keyCode, callback]
	);
}
