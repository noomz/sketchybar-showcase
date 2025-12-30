#!/usr/bin/env node

/**
 * Fetches dotfiles from GitHub repos linked in showcases
 * Usage: node scripts/fetch-dotfiles.js
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SHOWCASES_DIR = join(process.cwd(), 'static', 'data', 'showcases');

// Common paths where sketchybar configs might be found
const SKETCHYBAR_PATHS = [
	'sketchybar',
	'.config/sketchybar',
	'config/sketchybar',
	'dot_config/sketchybar', // chezmoi format
	'private_dot_config/sketchybar', // chezmoi format
];

// File patterns that indicate sketchybar config
const SKETCHYBAR_FILES = [
	'sketchybarrc',
	'sketchybarrc.sh',
	'items',
	'plugins',
	'colors.sh',
	'icons.sh',
];

function ghApi(endpoint) {
	try {
		const result = execSync(`gh api "${endpoint}"`, {
			encoding: 'utf-8',
			maxBuffer: 10 * 1024 * 1024,
			stdio: ['pipe', 'pipe', 'pipe']
		});
		return JSON.parse(result);
	} catch (err) {
		return null;
	}
}

function parseGitHubUrl(url) {
	if (!url) return null;

	// Match: github.com/owner/repo or github.com/owner/repo/tree/branch/path
	const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+)\/(.+))?/);
	if (!match) return null;

	return {
		owner: match[1],
		repo: match[2].replace(/\.git$/, ''),
		branch: match[3] || null,
		path: match[4] || null
	};
}

async function findSketchybarPath(owner, repo, branch = null) {
	// Get default branch if not specified
	if (!branch) {
		const repoInfo = ghApi(`repos/${owner}/${repo}`);
		if (!repoInfo) return null;
		branch = repoInfo.default_branch;
	}

	// Check each potential path
	for (const path of SKETCHYBAR_PATHS) {
		const contents = ghApi(`repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
		if (contents && Array.isArray(contents)) {
			// Found a directory with contents
			return { path, branch, contents };
		}
	}

	// Check root for sketchybarrc
	const rootContents = ghApi(`repos/${owner}/${repo}/contents?ref=${branch}`);
	if (rootContents && Array.isArray(rootContents)) {
		const hasSketchybar = rootContents.some(f =>
			f.name === 'sketchybarrc' ||
			f.name === 'sketchybarrc.sh' ||
			f.name === 'sketchybar' && f.type === 'dir'
		);
		if (hasSketchybar) {
			return { path: '', branch, contents: rootContents };
		}
	}

	return null;
}

async function fetchFileContent(owner, repo, path, branch) {
	const file = ghApi(`repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
	if (!file || !file.content) return null;

	// Decode base64 content
	return Buffer.from(file.content, 'base64').toString('utf-8');
}

async function fetchDirectoryRecursive(owner, repo, basePath, branch, prefix = '') {
	const dotfiles = {};
	const contents = ghApi(`repos/${owner}/${repo}/contents/${basePath}?ref=${branch}`);

	if (!contents || !Array.isArray(contents)) return dotfiles;

	for (const item of contents) {
		const relativePath = prefix ? `${prefix}/${item.name}` : item.name;

		if (item.type === 'file') {
			// Skip large files and non-text files
			if (item.size > 100000) continue;
			if (/\.(png|jpg|jpeg|gif|ico|woff|ttf|pdf)$/i.test(item.name)) continue;

			const content = await fetchFileContent(owner, repo, item.path, branch);
			if (content) {
				dotfiles[relativePath] = content;
			}
		} else if (item.type === 'dir') {
			// Recursively fetch subdirectories (limit depth)
			if (prefix.split('/').length < 3) {
				const subDotfiles = await fetchDirectoryRecursive(owner, repo, item.path, branch, relativePath);
				Object.assign(dotfiles, subDotfiles);
			}
		}
	}

	return dotfiles;
}

async function processShowcase(showcaseFile) {
	const showcasePath = join(SHOWCASES_DIR, showcaseFile);
	const showcase = JSON.parse(readFileSync(showcasePath, 'utf-8'));

	// Skip if already has dotfiles
	if (Object.keys(showcase.dotfiles).length > 0) {
		return { id: showcase.id, status: 'skipped', reason: 'already has dotfiles' };
	}

	const parsed = parseGitHubUrl(showcase.githubUrl);
	if (!parsed) {
		return { id: showcase.id, status: 'skipped', reason: 'invalid/missing GitHub URL' };
	}

	// Skip if it's just a user profile (no repo)
	if (!parsed.repo || parsed.repo === parsed.owner) {
		return { id: showcase.id, status: 'skipped', reason: 'no specific repo' };
	}

	// Skip non-relevant repos
	const skipRepos = ['SketchyBar', 'SketchyBarHelper', 'sketchybar-app-font', 'catppuccin'];
	if (skipRepos.includes(parsed.repo)) {
		return { id: showcase.id, status: 'skipped', reason: 'not a dotfiles repo' };
	}

	console.log(`  Checking ${parsed.owner}/${parsed.repo}...`);

	// If URL has a specific path, use that
	let sketchybarInfo;
	if (parsed.path) {
		const contents = ghApi(`repos/${parsed.owner}/${parsed.repo}/contents/${parsed.path}?ref=${parsed.branch || 'main'}`);
		if (contents && Array.isArray(contents)) {
			sketchybarInfo = { path: parsed.path, branch: parsed.branch || 'main', contents };
		}
	} else {
		sketchybarInfo = await findSketchybarPath(parsed.owner, parsed.repo, parsed.branch);
	}

	if (!sketchybarInfo) {
		return { id: showcase.id, status: 'skipped', reason: 'no sketchybar config found' };
	}

	console.log(`    Found config at: ${sketchybarInfo.path || 'root'}`);

	// Fetch all files recursively
	const fullPath = sketchybarInfo.path || '';
	const dotfiles = await fetchDirectoryRecursive(
		parsed.owner,
		parsed.repo,
		fullPath,
		sketchybarInfo.branch
	);

	if (Object.keys(dotfiles).length === 0) {
		return { id: showcase.id, status: 'skipped', reason: 'no files fetched' };
	}

	// Update showcase
	showcase.dotfiles = dotfiles;
	writeFileSync(showcasePath, JSON.stringify(showcase, null, 2));

	return {
		id: showcase.id,
		status: 'success',
		filesCount: Object.keys(dotfiles).length,
		path: sketchybarInfo.path || 'root'
	};
}

async function main() {
	console.log('Fetching dotfiles from GitHub repos...\n');

	const showcaseFiles = readdirSync(SHOWCASES_DIR).filter(f => f.endsWith('.json'));
	console.log(`Found ${showcaseFiles.length} showcases to process\n`);

	const results = {
		success: [],
		skipped: [],
		failed: []
	};

	for (const file of showcaseFiles) {
		try {
			const result = await processShowcase(file);

			if (result.status === 'success') {
				results.success.push(result);
				console.log(`    ✓ Downloaded ${result.filesCount} files\n`);
			} else {
				results.skipped.push(result);
			}
		} catch (err) {
			results.failed.push({ id: file, error: err.message });
			console.error(`    ✗ Error: ${err.message}\n`);
		}

		// Rate limiting - small delay between requests
		await new Promise(r => setTimeout(r, 100));
	}

	console.log('\n--- Summary ---');
	console.log(`Success: ${results.success.length}`);
	console.log(`Skipped: ${results.skipped.length}`);
	console.log(`Failed: ${results.failed.length}`);

	if (results.success.length > 0) {
		console.log('\nSuccessfully fetched:');
		results.success.forEach(r => console.log(`  - ${r.id}: ${r.filesCount} files from ${r.path}`));
	}
}

main().catch(console.error);
