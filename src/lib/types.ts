export interface ShowcaseListItem {
	id: string;
	title: string;
	author: string;
	thumbnail: string;
	tags: string[];
	mode: 'dark' | 'light' | 'both';
}

export interface ShowcaseIndex {
	showcases: ShowcaseListItem[];
}

export interface ShowcaseDetail {
	id: string;
	title: string;
	author: string;
	authorUrl: string;
	description: string;
	screenshots: string[];
	thumbnail: string;
	mode: 'dark' | 'light' | 'both';
	tags: string[];
	githubUrl: string;
	dependencies: string[];
	dotfiles: Record<string, string>;
	createdAt: string;
}

export interface TagsData {
	tags: Array<{
		id: string;
		label: string;
		count: number;
	}>;
}
