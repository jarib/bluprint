import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

import handleActions from '../../actions';
import choosePart from '../start/choosePart';
import getParser from '../start/fetchBluprint/parser';

const fetchBluprint = async(directory, filterGlobs, mergeJson) => {
  return new Promise((resolve, reject) => {
    const proc = spawn('git',
      [
        'archive',
        '--format=tar',
        `--prefix=${path.basename(directory)}/`,
        'HEAD',
      ],
      { cwd: directory }
    );

    proc.stdout.pipe(getParser(resolve, reject, filterGlobs, mergeJson));
    proc.on('close', resolve).on('error', reject);
  });
};

const defaultInject = {
  method: null,
  category: null,
  bluprint: null,
  partConfirm: null,
  partChoice: null,
};

export default async(directory, inject = defaultInject) => {
  const bluprintrc = JSON.parse(fs.readFileSync(path.join(directory, '.bluprintrc')));

  const { parts, mergeJson } = bluprintrc;
  const { part, globs: filterGlobs } = await choosePart(parts, inject);

  await fetchBluprint(directory, filterGlobs, mergeJson);
  await handleActions(bluprintrc.actions, part);
};
