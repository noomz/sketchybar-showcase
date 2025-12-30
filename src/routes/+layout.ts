import type { LayoutLoad } from './$types';
import type { ShowcaseIndex } from '$lib/types';
import { base } from '$app/paths';

export const prerender = true;

export const load: LayoutLoad = async ({ fetch }) => {
	const indexRes = await fetch(`${base}/data/index.json`);
	const index: ShowcaseIndex = await indexRes.json();

	return {
		allShowcases: index.showcases
	};
};
