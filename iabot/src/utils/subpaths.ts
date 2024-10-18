import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const rootPath = __dirname.replace(/(\/utils)|()*$/g, '');

const getSubfilePaths = async (relativePath: string): Promise<string[]> => {
  const root = join(rootPath, relativePath.toString());
  const files = await fs.readdir(root);
  const subfiles = await Promise.all(
    files.map(async file => {
      const filePath = join(root, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        return getSubfilePaths(join(relativePath, file));
      }
      return filePath;
    })
  );
  return subfiles.flat();
};

export default getSubfilePaths;
