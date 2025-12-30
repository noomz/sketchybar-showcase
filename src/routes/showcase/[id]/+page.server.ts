import type { PageServerLoad, EntryGenerator } from './$types';
import type { ShowcaseDetail, ShowcaseIndex } from '$lib/types';
import { base } from '$app/paths';
import { readFileSync } from 'fs';
import { join } from 'path';

export const prerender = true;

// Cache the index data
let indexCache: ShowcaseIndex | null = null;
function getIndexData(): ShowcaseIndex {
	if (!indexCache) {
		const indexPath = join(process.cwd(), 'static', 'data', 'index.json');
		indexCache = JSON.parse(readFileSync(indexPath, 'utf-8'));
	}
	return indexCache!;
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`${base}/data/showcases/${params.id}.json`);
	const showcase: ShowcaseDetail = await res.json();

	// Get prev/next showcase IDs
	const indexData = getIndexData();
	const ids = indexData.showcases.map((s) => s.id);
	const currentIndex = ids.indexOf(params.id);

	const prevId = currentIndex > 0 ? ids[currentIndex - 1] : null;
	const nextId = currentIndex < ids.length - 1 ? ids[currentIndex + 1] : null;

	return {
		showcase,
		prevId,
		nextId,
		currentIndex: currentIndex + 1,
		totalCount: ids.length
	};
};

export const entries: EntryGenerator = () => {
	const indexData = getIndexData();
	return indexData.showcases.map((s) => ({ id: s.id }));
};
