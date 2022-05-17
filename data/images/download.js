import { createWriteStream } from 'fs';
import { access, mkdir } from 'fs/promises';
import https from 'https';
import db from '../../public/db.json' assert { type: 'json' }

import { dirname } from 'path'
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const dir = `${__dirname}/original`;
try {
  await access(dir);
} catch {
  await mkdir(dir, { recursive: true });
}

const url = id =>
  `https://www.openaustralia.org.au/images/mpsXL/${id}.jpg`;

const stats =  Object.defineProperty({}, 'i', {
  value(prop) { this[prop] = (this[prop] || 0) + 1 }
});

const download = async (id) => {
  stats.i('processed');
  const path = `${dir}/${id}.jpg`;
  try {
    await access(path);
    stats.i('exists');
    return;
  } catch { /**/ }
  return new Promise(resolve =>
    https.get(url(id), (response) => {
      if (response.statusCode !== 200) {
        stats.i('notfound');
        return resolve(`❌ ${response.statusCode}`);
      }

      const file = createWriteStream(path);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve('✅');
      });
    }));
}

for (const [id, { name }] of Object.entries(db.people)) {
  const msg = await download(id);
  if (msg) {
    console.log(id, ...name, msg);
  }
}

console.log({ ...stats })
