import chalk from 'chalk';
import fs from 'fs';
import getLogger from '../../utils/getLogger';
import mustache from 'mustache';
import path from 'path';

const logger = getLogger();

const move = (oldRelativePath, newRelativePath, context) => {
  const ROOT = process.cwd();

  const oldPath = path.join(ROOT, oldRelativePath);
  // Let new path be rendered through template engine with context
  const newPath = path.join(ROOT, mustache.render(newRelativePath, context));
  const dirPath = path.dirname(newPath);

  if (!fs.existsSync(oldPath)) {
    logger.warn(chalk`Unable to find file {green.underline ${oldRelativePath}} in move action. Skipping.`);
    return;
  }

  fs.mkdirSync(dirPath, { recursive: true });
  fs.renameSync(oldPath, newPath);
};

export default (action, context) => {
  const { paths } = action;

  if (Array.isArray(paths[0])) {
    paths.forEach((paths) => move(...paths, context));
  } else {
    move(...paths, context);
  }
};
