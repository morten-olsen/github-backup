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
  const git = simpleGit();
  const authRemote = `https://foo:${token}@github.com/${repo}`

  if (fs.existsSync(target)) {
    const backup = path.join(os.tmpdir(), nanoid());
    await fs.move(target, backup);
    try {
      await git.mirror(authRemote, target);
      await rimraf(backup);
    } catch(err) {
      await rimraf(target);
      await fs.move(backup, target);
      throw err;
    }
  } else {
    await git.mirror(authRemote, target);
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
      const loader = ora(repo.full_name).start();
      try {
        const repoBackupLocation = path.join(backupLocation, repo.full_name);
        const infoLocation = path.join(repoBackupLocation, 'info.json');
        const gitLocation = path.join(repoBackupLocation, 'git');
        await fs.mkdirp(repoBackupLocation);
        await fs.writeFile(infoLocation, JSON.stringify(repo, null, '  '), 'utf-8');
        await mirror(gitLocation, repo.full_name);
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
