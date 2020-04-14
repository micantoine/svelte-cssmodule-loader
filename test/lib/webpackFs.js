/*
 * Issue with fs.join is not part of fs
 * https://github.com/webpack/memory-fs/issues/67
 * https://github.com/streamich/memfs/issues/404
 */
import joinPath from 'memory-fs/lib/join';
import { fs } from 'memfs';


function ensureWebpackMemoryFs(fs) {
  if (fs.join) {
    return fs
  }
  const nextFs = Object.create(fs)
  nextFs.join = joinPath

  return nextFs
}

const webpackFs = ensureWebpackMemoryFs(fs);

export default webpackFs