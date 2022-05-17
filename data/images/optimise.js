import { createWriteStream } from 'fs';
import { access, mkdir } from 'fs/promises';
import sharp from 'sharp';
import db from '../../public/db.json' assert { type: 'json' }
import { dirname } from 'path'
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const inputdir = `${__dirname}/colab/results/restored_imgs`;
try {
  await access(inputdir);
} catch {
  console.log('(!) nothing to optimise:\n - see the Google Colab instructions: images/colab/readme.md');
  process.exit();
}

const outputdir = `${__dirname}/../../public/assets/people`;

try {
  await access(outputdir);
} catch {
  await mkdir(outputdir, { recursive: true });
}

const stats = Object.defineProperty({}, 'i', {
  value(prop) { this[prop] = (this[prop] || 0) + 1 }
});

const optimise = async (id) => {
  stats.i('processed');
  const input = `${inputdir}/${id}.jpg`;
  try {
    await access(input);
  } catch {
    stats.i('notfound');
    // input missing
    return '❌ not found';
  }

  let output = `${outputdir}/${id}.webp`;
  let outputSmall = `${outputdir}/${id}-sm.webp`;
  try {
    // output exists
    output = await access(output) && '';
    outputSmall = await access(outputSmall) && '';
    stats.i('exists');
    return;
  } catch { /**/ }

  const pipeline = []
  const image = sharp(input);

  if (output) {
    pipeline.push(image.clone().toFile(output));
  }
  if (outputSmall) {
    pipeline.push(image.clone().resize(200).toFile(outputSmall));
  }
  return Promise.all(pipeline)
  .then(() => '✅');
}

for (const [id, { name }] of Object.entries(db.people)) {
  const msg = await optimise(id);
  if (msg) {
    console.log(id, ...name, msg);
  }
}

console.log({ ...stats })
