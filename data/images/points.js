import '@tensorflow/tfjs-node';
import * as faceapi from '@vladmandic/face-api'; // use this when face-api is installed as module (majority of use cases)
import { access, readFile, writeFile } from 'fs/promises'
import zlib from 'zlib'
import { dirname } from 'path'
import { fileURLToPath } from 'url';
import db from '../../public/db.json' assert { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagedir = `${__dirname}/../../public/assets/people`;

const models = `${__dirname}/models`;

const facePositions = {
  head: [0, 19, 24, 16, 8],
  eyeleft: [36, 39],
  eyeright: [42, 45],
  mouth: [48, 51, 54, 57],
};

const stats = Object.defineProperty({}, 'i', {
  value(prop) { this[prop] = (this[prop] || 0) + 1 }
});

async function points(id, person) {
  stats.i('processed');
  
  const input = `${__dirname}/colab/results/restored_imgs/${id}.jpg`;
  try {
    await access(input);
  } catch {
    stats.i('notfound');
    // input missing
    return '❌ not found';
  }

  if (person.image) {
    stats.i('exists');
    return;
  }

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(models); // load models from a specific patch
  await faceapi.nets.faceLandmark68Net.loadFromDisk(models);
  const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.1, maxResults: 10 }); // set model options
  const buffer = await readFile(input); // load jpg image as binary
  const decodeT = faceapi.tf.node.decodeImage(buffer, 3); // decode binary buffer to rgb tensor
  const expandT = faceapi.tf.expandDims(decodeT, 0); // add batch dimension to tensor
  const result = await faceapi.detectAllFaces(expandT, options) // run detection
    .withFaceLandmarks()
  faceapi.tf.dispose([decodeT, expandT]); // dispose tensors to avoid memory leaks

  const [{ landmarks, detection }] = result;

  const points = {};
  const { width, height } = detection.imageDims;

  for (const [type, positions] of Object.entries(facePositions)) {
    for (const i of positions) {
      const { x=0, y=0 } = landmarks.positions[i];
      points[i] = [+(x / width).toFixed(3), +(y / height).toFixed(3)];
    }
  }

  person.image = points;

  return '✅';
}

for (const [id, person] of Object.entries(db.people)) {
  const msg = await points(id, person);
  if (msg) {
    console.log(id, ...person.name, msg);
  }
}

console.log({ ...stats })

const json = JSON.stringify(db);
const jsonpath = `${__dirname}/../../public/db.json`;
await writeFile(jsonpath, json);
await new Promise(_ => zlib.brotliCompress(Buffer.from(json), (err, compressed) =>
  _(writeFile(`${jsonpath}.br`, compressed))));
