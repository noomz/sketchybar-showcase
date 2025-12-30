import type { PageServerLoad, EntryGenerator } from './$types';
import type { ShowcaseDetail, ShowcaseIndex } from '$lib/types';
import { readFileSync } from 'fs';
import { join } from 'path';

export const prerender = true;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/data/showcases/${params.id}.json`);
	const showcase: ShowcaseDetail = await res.json();
	return { showcase };
};

export const entries: EntryGenerator = () => {
	const indexPath = join(process.cwd(), 'static', 'data', 'index.json');
	const indexData: ShowcaseIndex = JSON.parse(readFileSync(indexPath, 'utf-8'));
	return indexData.showcases.map((s) => ({ id: s.id }));
};
