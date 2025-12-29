import type { PageLoad, EntryGenerator } from './$types';
import type { ShowcaseDetail } from '$lib/types';
import indexData from '../../../../static/data/index.json';

export const prerender = true;

export const load: PageLoad = async ({ params, fetch }) => {
	const res = await fetch(`/data/showcases/${params.id}.json`);
	const showcase: ShowcaseDetail = await res.json();
	return { showcase };
};

export const entries: EntryGenerator = () => {
	return indexData.showcases.map((s) => ({ id: s.id }));
};
