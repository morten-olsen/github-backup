require('dotenv').config();
import { Octokit } from '@octokit/rest';
import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import rimrafSync from 'rimraf';
import { nanoid } from 'nanoid';
import util from 'util';
import ora from 'ora';

const rimraf = util.promisify(rimrafSync);

const token = process.env.GITHUB_TOKEN;
const backupLocation = process.env.GITHUB_BACKUP_LOCATION || '/backup';

const mirror = async (target: string, repo: string) => {
  const authRemote = `https://foo:${token}@github.com/${repo}`

  if (fs.existsSync(target)) {
    const git = simpleGit(target);
    const remotes = await git.getRemotes();
    const origin = remotes.find(r => r.name === 'origin');
    if (origin) {
      await git.remote(['set-url', 'origin', authRemote]);
    } else {
      await git.addRemote('origin', authRemote);
    }
    await git.remote(['update']);
    await git.remote(['set-url', 'origin', `https://github.com/${repo}`]);
  } else {
    await fs.mkdirp(target);
    const git = simpleGit(target);
    await git.mirror(authRemote, target);
    await git.remote(['set-url', 'origin', `https://github.com/${repo}`]);
  }
};

const run = async () => {
  const github = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const action = github.repos.listForAuthenticatedUser;
  const errors: any[] = [];
  for await (const repos of github.paginate.iterator(action, { visibility: 'all' })) {
    for (const repo of repos.data) {
      const loader = ora('preparing');
      loader.prefixText = repo.full_name;
      loader.start();
      try {
        const repoBackupLocation = path.join(backupLocation, repo.full_name);
        const infoLocation = path.join(repoBackupLocation, 'info.json');
        const gitLocation = path.join(repoBackupLocation, 'git');
        await fs.mkdirp(repoBackupLocation);
        loader.text = 'fething info';
        await fs.writeFile(infoLocation, JSON.stringify(repo, null, '  '), 'utf-8');
        loader.text = 'mirroring';
        await mirror(gitLocation, repo.full_name);
        loader.text = '';
        loader.succeed();
      } catch (err) {
        loader.fail(err.toString());
        errors.push(err);
      }
    }
  }
  if (errors.length > 0) {
    process.exit(-1);
  }
};

run().catch(console.error);
