#!/usr/bin/env node

/**
 * Scrapes SketchyBar setups from GitHub Discussion #47
 * Usage: node scripts/scrape-discussion.js
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import https from 'https';
import http from 'http';

const STATIC_DIR = join(process.cwd(), 'static');
const DATA_DIR = join(STATIC_DIR, 'data');
const SHOWCASES_DIR = join(DATA_DIR, 'showcases');
const SCREENSHOTS_DIR = join(STATIC_DIR, 'screenshots');

// Ensure directories exist
[DATA_DIR, SHOWCASES_DIR, SCREENSHOTS_DIR].forEach(dir => {
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

// GraphQL query to fetch discussion comments
const QUERY = `
query($cursor: String) {
  repository(owner: "FelixKratz", name: "SketchyBar") {
    discussion(number: 47) {
      comments(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          author {
            login
          }
          body
          createdAt
        }
      }
    }
  }
}`;

async function fetchAllComments() {
	let allComments = [];
	let cursor = null;
	let hasNextPage = true;
	let iterations = 0;
	const MAX_ITERATIONS = 10; // Safety limit (187 comments / 100 per page = 2 pages max)

	console.log('Fetching comments from GitHub Discussion #47...');

	while (hasNextPage && iterations < MAX_ITERATIONS) {
		iterations++;
		const variablesJson = cursor ? JSON.stringify({ cursor }) : '{}';
		const result = execSync(
			`gh api graphql -f query='${QUERY.replace(/\n/g, ' ').replace(/'/g, "'\\''")}' -f variables='${variablesJson}'`,
			{ encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
		);

		const data = JSON.parse(result);
		const comments = data.data.repository.discussion.comments;

		allComments = allComments.concat(comments.nodes.filter(n => n !== null));
		hasNextPage = comments.pageInfo.hasNextPage;
		cursor = comments.pageInfo.endCursor;

		console.log(`  Page ${iterations}: fetched ${comments.nodes.length} comments (total: ${allComments.length})`);

		if (!cursor) break; // No more pages
	}

	return allComments;
}

function extractImageUrls(body) {
	const patterns = [
		// Markdown images: ![alt](url)
		/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/g,
		// HTML images: <img ... src="url" ...>
		/<img[^>]+src=["']([^"']+)["']/gi,
		// Direct GitHub user-content URLs
		/(https:\/\/user-images\.githubusercontent\.com\/[^\s\)\"\']+)/g,
		/(https:\/\/github\.com\/[^\/]+\/[^\/]+\/assets\/[^\s\)\"\']+)/g
	];

	const urls = new Set();
	for (const pattern of patterns) {
		const matches = body.matchAll(pattern);
		for (const match of matches) {
			const url = match[1] || match[0];
			if (url && (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif') || url.includes('user-images') || url.includes('/assets/'))) {
				urls.add(url);
			}
		}
	}

	return [...urls];
}

function extractDotfilesUrl(body) {
	const patterns = [
		// GitHub repo URLs
		/https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/g,
		// Gist URLs
		/https:\/\/gist\.github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9]+)/g
	];

	for (const pattern of patterns) {
		const matches = [...body.matchAll(pattern)];
		for (const match of matches) {
			const url = match[0];
			// Filter for likely dotfiles repos
			if (url.includes('dotfiles') || url.includes('sketchybar') || url.includes('dots') || url.includes('gist')) {
				return url;
			}
		}
	}

	// Return first GitHub URL if no dotfiles-specific found
	for (const pattern of patterns) {
		const match = body.match(pattern);
		if (match) return match[0];
	}

	return null;
}

function generateId(author, index) {
	const sanitized = author.toLowerCase().replace(/[^a-z0-9]/g, '-');
	return `${sanitized}-${index}`;
}

function guessMode(body) {
	const lowerBody = body.toLowerCase();
	if (lowerBody.includes('light') && lowerBody.includes('dark')) return 'both';
	if (lowerBody.includes('light') || lowerBody.includes('bright')) return 'light';
	return 'dark'; // Default to dark as most setups are dark themed
}

function extractTags(body) {
	const tagPatterns = {
		'minimal': /minimal|simple|clean/i,
		'catppuccin': /catppuccin/i,
		'nord': /nord/i,
		'dracula': /dracula/i,
		'tokyo-night': /tokyo.?night/i,
		'gruvbox': /gruvbox/i,
		'rose-pine': /ros[eé].?pine/i,
		'icons': /icon|symbol|nerd.?font/i,
		'widgets': /widget|cpu|memory|battery|weather/i,
		'aerospace': /aerospace/i,
		'yabai': /yabai/i,
		'lua': /lua/i
	};

	const tags = [];
	for (const [tag, pattern] of Object.entries(tagPatterns)) {
		if (pattern.test(body)) {
			tags.push(tag);
		}
	}

	return tags.length > 0 ? tags : ['custom'];
}

async function downloadImage(url, filepath) {
	return new Promise((resolve, reject) => {
		const protocol = url.startsWith('https') ? https : http;

		const request = protocol.get(url, {
			headers: { 'User-Agent': 'SketchyBar-Showcase-Scraper' }
		}, response => {
			// Handle redirects
			if (response.statusCode === 301 || response.statusCode === 302) {
				downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
				return;
			}

			if (response.statusCode !== 200) {
				reject(new Error(`Failed to download: ${response.statusCode}`));
				return;
			}

			const chunks = [];
			response.on('data', chunk => chunks.push(chunk));
			response.on('end', () => {
				writeFileSync(filepath, Buffer.concat(chunks));
				resolve(filepath);
			});
			response.on('error', reject);
		});

		request.on('error', reject);
		request.setTimeout(30000, () => {
			request.destroy();
			reject(new Error('Timeout'));
		});
	});
}

async function processComments(comments) {
	const showcases = [];
	const authorCounts = {};
	const seenImageSets = new Set(); // Track unique image sets to avoid duplicates

	for (const comment of comments) {
		if (!comment.author) continue;

		const author = comment.author.login;
		const imageUrls = extractImageUrls(comment.body);

		// Skip comments without images (not a setup showcase)
		if (imageUrls.length === 0) continue;

		// Create a key from sorted image URLs to detect duplicates
		const imageKey = [...imageUrls].sort().join('|');
		if (seenImageSets.has(imageKey)) {
			continue; // Skip duplicate image sets (likely from replies quoting parent)
		}
		seenImageSets.add(imageKey);

		// Track author submission count
		authorCounts[author] = (authorCounts[author] || 0) + 1;

		const id = generateId(author, authorCounts[author]);
		const dotfilesUrl = extractDotfilesUrl(comment.body);
		const mode = guessMode(comment.body);
		const tags = extractTags(comment.body);
		const createdAt = comment.createdAt.split('T')[0];

		showcases.push({
			id,
			author,
			authorUrl: `https://github.com/${author}`,
			imageUrls,
			dotfilesUrl,
			mode,
			tags,
			createdAt,
			body: comment.body
		});
	}

	return showcases;
}

async function generateShowcaseFiles(showcases) {
	console.log(`\nProcessing ${showcases.length} showcases...`);

	const indexEntries = [];
	const allTags = new Map();
	let processed = 0;
	let skipped = 0;

	for (const showcase of showcases) {
		const screenshotDir = join(SCREENSHOTS_DIR, showcase.id);

		// Create screenshot directory
		if (!existsSync(screenshotDir)) {
			mkdirSync(screenshotDir, { recursive: true });
		}

		// Download screenshots
		const downloadedScreenshots = [];
		for (let i = 0; i < showcase.imageUrls.length; i++) {
			const url = showcase.imageUrls[i];
			const ext = url.includes('.png') ? '.png' :
			            url.includes('.gif') ? '.gif' :
			            url.includes('.jpeg') ? '.jpeg' : '.jpg';
			const filename = i === 0 ? `main${ext}` : `screenshot-${i}${ext}`;
			const filepath = join(screenshotDir, filename);

			try {
				if (!existsSync(filepath)) {
					await downloadImage(url, filepath);
					console.log(`  Downloaded: ${showcase.id}/${filename}`);
				}
				downloadedScreenshots.push(`/screenshots/${showcase.id}/${filename}`);
			} catch (err) {
				console.error(`  Failed to download ${url}: ${err.message}`);
			}
		}

		if (downloadedScreenshots.length === 0) {
			console.log(`  Skipping ${showcase.id} - no screenshots downloaded`);
			skipped++;
			continue;
		}

		// Create thumbnail reference (first image)
		const thumbnail = downloadedScreenshots[0];

		// Generate showcase detail JSON
		const showcaseDetail = {
			id: showcase.id,
			title: `${showcase.author}'s Setup${showcase.tags.includes('catppuccin') ? ' (Catppuccin)' : showcase.tags.includes('nord') ? ' (Nord)' : showcase.tags.includes('dracula') ? ' (Dracula)' : ''}`,
			author: showcase.author,
			authorUrl: showcase.authorUrl,
			description: `A SketchyBar configuration shared by ${showcase.author} in the community showcase thread.`,
			screenshots: downloadedScreenshots,
			thumbnail,
			mode: showcase.mode,
			tags: showcase.tags,
			githubUrl: showcase.dotfilesUrl || showcase.authorUrl,
			dependencies: ['sketchybar'],
			dotfiles: {},
			createdAt: showcase.createdAt
		};

		// Write individual showcase JSON
		const showcaseFile = join(SHOWCASES_DIR, `${showcase.id}.json`);
		writeFileSync(showcaseFile, JSON.stringify(showcaseDetail, null, 2));

		// Add to index
		indexEntries.push({
			id: showcase.id,
			title: showcaseDetail.title,
			author: showcase.author,
			thumbnail,
			tags: showcase.tags,
			mode: showcase.mode
		});

		// Track tags
		for (const tag of showcase.tags) {
			allTags.set(tag, (allTags.get(tag) || 0) + 1);
		}

		processed++;
	}

	// Write index.json
	const indexFile = join(DATA_DIR, 'index.json');
	writeFileSync(indexFile, JSON.stringify({ showcases: indexEntries }, null, 2));

	// Write tags.json
	const tagsArray = [...allTags.entries()]
		.map(([id, count]) => ({ id, label: id, count }))
		.sort((a, b) => b.count - a.count);
	const tagsFile = join(DATA_DIR, 'tags.json');
	writeFileSync(tagsFile, JSON.stringify({ tags: tagsArray }, null, 2));

	console.log(`\nDone! Processed ${processed} showcases, skipped ${skipped}`);
	console.log(`Index: ${indexFile}`);
	console.log(`Tags: ${tagsFile}`);
}

async function main() {
	try {
		const comments = await fetchAllComments();
		console.log(`\nTotal comments fetched: ${comments.length}`);

		const showcases = await processComments(comments);
		console.log(`Found ${showcases.length} showcases with images`);

		await generateShowcaseFiles(showcases);
	} catch (err) {
		console.error('Error:', err.message);
		process.exit(1);
	}
}

main();
