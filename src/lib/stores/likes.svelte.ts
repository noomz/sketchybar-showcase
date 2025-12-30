import { browser } from '$app/environment';

const STORAGE_KEY = 'showcaseLikes';

function loadLikes(): Set<string> {
	if (!browser) return new Set();
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return new Set(JSON.parse(stored));
		}
	} catch (e) {
		console.error('Failed to load likes from localStorage:', e);
	}
	return new Set();
}

function saveLikes(likes: Set<string>): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...likes]));
	} catch (e) {
		console.error('Failed to save likes to localStorage:', e);
	}
}

let likes = $state<Set<string>>(loadLikes());

export function toggleLike(id: string): void {
	if (likes.has(id)) {
		likes.delete(id);
	} else {
		likes.add(id);
	}
	likes = new Set(likes); // Trigger reactivity
	saveLikes(likes);
}

export function isLiked(id: string): boolean {
	return likes.has(id);
}

export function getLikedIds(): string[] {
	return [...likes];
}

export function getLikedCount(): number {
	return likes.size;
}

export function clearAllLikes(): void {
	likes = new Set();
	saveLikes(likes);
}
