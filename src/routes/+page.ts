import type { PageLoad } from './$types';
import type { ShowcaseIndex, TagsData } from '$lib/types';
import { base } from '$app/paths';

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
	const [indexRes, tagsRes] = await Promise.all([
		fetch(`${base}/data/index.json`),
		fetch(`${base}/data/tags.json`)
	]);

	const index: ShowcaseIndex = await indexRes.json();
	const tagsData: TagsData = await tagsRes.json();

	return {
		showcases: index.showcases,
		tags: tagsData.tags
	};
};
