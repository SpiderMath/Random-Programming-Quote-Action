const quotes = require('./Quotes.json');
const core = require('@actions/core');
const { spawn } = require('child_process');
const { Toolkit } = require('actions-toolkit');
const { readFileSync, writeFileSync } = require('fs');

const GH_USERNAME = core.getInput('GH_USERNAME');
const COMMIT_MESSAGE = core.getInput('COMMIT_MESSAGE');

// Execute shell commands FIRST
function exec(cmd, args = []) {
	new Promise((resolve, reject) => {
		const app = spawn(cmd, args, { stdio: 'pipe' });
		let stdout = '';
		app.stdout.on('data', (data) => {
			stdout = data;
		});
		app.on('close', (code) => {
			if (code !== 0 && !stdout.includes('nothing to commit')) {
				const err = new Error(`Invalid status code: ${code}`);
				err.code = code;
				return reject(err);
			}
			return resolve(code);
		});
		app.on('error', reject);
	});
}

function getRandomQuote() {
	return quotes[
		Math.floor(quotes.length * Math.random())
	];
}

// Commits the file
async function commitFile() {
	await exec('git', [
		'config',
		'--global',
		'user.email',
		'41898282+github-actions[bot]@users.noreply.github.com',
	]);
	await exec('git', ['config', '--global', 'user.name', 'readme-bot']);
	await exec('git', ['add', 'README.md']);
	await exec('git', ['commit', '-m', COMMIT_MESSAGE]);
	await exec('git', ['push']);
}

Toolkit
	.run(async (tools) => {
		const readmeContent = readFileSync('./README.md', 'utf-8').split('\n');

		const startIndex = readmeContent.findIndex(content => content.trim() === '<!--QUOTE-BOT:start-->');
		const endIndex = readmeContent.findIndex(content => content.trim() === '<!--QUOTE-BOT:end-->');

		if(startIndex === -1) return tools.exit.failure('Couldn\'t find the <!--QUOTE-BOT:start--> comment! Exiting the process...');
		if(endIndex === -1) return tools.exit.failure('Couldn\'t find the <!--QUOTE-BOT:end--> comment! Exiting the process...');

		if(startIndex !== endIndex) readmeContent.splice(startIndex + 1, (endIndex - startIndex) - 1);

		const quote = getRandomQuote();
		const string = `
			## <i>${quote.text}</i><br>
			## - <b>${quote.author}</b><br>		
		`;

		readmeContent.splice(startIndex + 1, 0, string);

		writeFileSync('./README.md', readmeContent.join('\n'));

		try {
			commitFile();
		}
		catch(err) {
			return tools.exit.failure(err);
		}

		tools.exit.success('Updated the readme successfully 🚀');

	}, {
		events: ['schedule', 'workflow_dispatch'],
		secrets: ['GITHUB_TOKEN'],
	});