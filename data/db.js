import credentials from './credentials.json' assert { type: 'json' }
import { writeFile } from 'fs/promises'
import zlib from 'zlib'
import { dirname } from 'path'
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const theyvoteforyou = (endpoint, params={}, key=credentials.theyvoteforyou) =>
  `https://theyvoteforyou.org.au/api/v1/${endpoint}.json?${new URLSearchParams({ key, ...params })}`;

const api = async (fn, endpoint, params) =>
  fetch(fn(endpoint, params)).then(e => e.json());

const sortkeys = (unsorted) => {
  const sorted = {};
  for (const key of Object.keys(unsorted).sort()) {
    sorted[key] = unsorted[key];
  }
  return sorted;
}

const peopleRaw = await api(theyvoteforyou, 'people');
const people = {};
for (const { id } of peopleRaw) {
  const {
    latest_member: {
      name,
      electorate,
      house,
      party,
    },
    policy_comparisons,
    rebellions,
    votes_attended,
    votes_possible,
    offices,
  } = await api(theyvoteforyou, `people/${id}`);

  const policies = {};
  for (const { policy: { id: policyId }, agreement, voted } of policy_comparisons) {
    if (agreement !== "50" || voted) {
      policies[policyId] = Math.round(+agreement);
    }
  }

  for (const [i, office] of Object.entries(offices)) {
    offices[i] = office.position;
  }
  
  people[id] = {
    name: Object.values(name),
    electorate,
    house,
    party,
    rebellions,
    votes_attended,
    votes_possible,
    offices,
    policies: sortkeys(policies),
  };
  console.log(id, ...people[id].name);
}

const policiesRaw = await api(theyvoteforyou, 'policies');

const policies = {};
for (const { id } of policiesRaw) {
  const {
    name,
    description,
    provisional,
    people_comparisons,
  } = await api(theyvoteforyou, `policies/${id}`);

  if (provisional && !people_comparisons.length) {
    continue;
  }
  
  for (const comparison of people_comparisons) {
    if (comparison.category === 'not_enough' && people[comparison.person.id]) {
      delete people[comparison.person.id].policies[id];
    }
  }

  console.log(id, name);
  policies[id] = { name, description, provisional };
  if (!provisional) {
    delete policies[id].provisional;
  }
}

const db = {
  people: sortkeys(people),
  policies: sortkeys(policies),
};

const json = JSON.stringify(db);
const jsonpath = `${__dirname}/../public/db.json`;
await writeFile(jsonpath, json);
await new Promise(_ => zlib.brotliCompress(Buffer.from(json), (err, compressed) =>
  _(writeFile(`${jsonpath}.br`, compressed))));
