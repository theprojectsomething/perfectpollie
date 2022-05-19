import "@/styles/global.scss"
import "@/styles/main.scss"

import domtoimage from 'dom-to-image'

const gooduns = [
  '#david-the-tony-tony-joanne',
];

const heroIds = ['10280', '10468', '10007', '10734'];

const majorParties = new Set([
  'Australian Greens',
  'Australian Labor Party',
  'Liberal-National Coalition'
]);

const majorPartiesFoodMap = new Map([
  ['Australian Greens', 'brocolli'],
  ['Australian Labor Party', 'tomatoes'],
  ['Liberal-National Coalition', 'blueberries'],
]);

const coalitionParties = new Map([
  ['National Party', 'Liberal-National Coalition'],
  ['Liberal Party', 'Liberal-National Coalition'],
  ['Liberal National Party', 'Liberal-National Coalition'],
  ['Country Liberal Party', 'Liberal-National Coalition']
]);

// const getFactorial = (n, useBigInt, r = 1) => {
//   const usingBigInt = useBigInt || n > 18;
//   let n0 = usingBigInt ? BigInt(n) : n;
//   let r0 = usingBigInt ? BigInt(r) : r;
//   while (n0) r0 *= n0--;
//   return useBigInt || !usingBigInt ? r0 : r0.toString();
// }

// // non-repeating permutations = n! / (n-r)!
// const getPermutations = (items, itemsPerPermutation, useBigInt) => {
//   const usingBigInt = useBigInt || items > 18;
//   const permutations = getFactorial(items, usingBigInt) / getFactorial(items - itemsPerPermutation, usingBigInt);
//   return useBigInt || !usingBigInt ? permutations : 2n ** 53n < permutations && permutations.toString() || Number(permutations);
// }

// much simpler factiorial
const getPermutations = (people) => {
  let options = 4;
  let val = 1; 
  while(options) val *= (people - --options)
  return val;
}

const DEBUG = false;

// comment out to enable console!
const console = new Proxy(window.console, { get() { return () => {} } });

const mapGet = (map, key, defaultValue=[]) =>
  map.get(key) ?? (map.set(key, defaultValue) && defaultValue);

const loadDB = async () => {
  const raw = await fetch('/db.json').then(e => e.json());

  const ids = Object.keys(raw.people);
  const people = new Map(Object.entries(raw.people));
  const policies = new Map(Object.entries(raw.policies));
  const parties = new Map();

  // const permutations = getPermutations(people.size, 4).toLocaleString();
  const names = new Map();
  let index = 0;
  for (const [id, person] of people) {
    // allow for double-barreled names
    const name = person.name[0].replace(/-/g, '').toLowerCase();
    const list = mapGet(names, name);
    person.index = ++index;
    person.lookup = {
      name,
      list,
      index: list.push(id),
    };

    person.policies = new Map(Object.entries(person.policies));

    const party = mapGet(parties, person.party, { policies: new Map(), people: [] });
    party.people.push(id);

    // check for a coalition party alliance
    const coalitionPartyName = coalitionParties.get(person.party);
    const coalitionParty = coalitionPartyName && mapGet(parties, coalitionPartyName, { policies: new Map(), people: [] });
    if (coalitionParty) {
      coalitionParty.people.push(id);
    }

    for (const [policyId, agreement] of person.policies) {
      // if not always for or against we'll skip
      // i.e. !== 0 | 100
      if (agreement % 100) {
        continue;
      }

      const policy = policies.get(policyId);
      if (!policy) {
        continue;
      }


      if (!policy.parties) {
        policy.parties = new Map();
      }

      const policyParty = mapGet(policy.parties, person.party, { for: [], against: [] });
      
      // agreement === 100
      if (agreement) {
        policyParty.for.push(id);
      } else {
        policyParty.against.push(id);
      }

      if (!party.policies.has(policyId)) {
        party.policies.set(policyId, policyParty);
      }

      if (!coalitionPartyName) {
        continue;
      }

      const policyCoalitionParty = mapGet(policy.parties, coalitionPartyName, { for: [], against: [] });
      
      // agreement === 100
      if (agreement) {
        policyCoalitionParty.for.push(id);
      } else {
        policyCoalitionParty.against.push(id);
      }

      if (!coalitionParty.policies.has(policyId)) {
        coalitionParty.policies.set(policyId, policyCoalitionParty);
      }
    }
  }

  console.log('NAMES', names);
  console.log('POLICIES', policies);
  console.log('PARTIES', parties);

  return {
    // permutations: '2,495,102,400',
    permutations: getPermutations(people.size).toLocaleString(),
    names,
    ids,
    people,
    policies,
    parties,
  }
};

const urlParseIds = (path) => {
  if (path.length < 2) {
    return;
  }

  const components = path.slice(1).split('/');
  const names = components.pop().split('-');
  const indexes = components.length ? components.pop().split(/\B/) : [];
  const newIndexs = indexes.slice()
  const ids = [];
  for (const name of names) {
    const list = db.names.get(name);
    if (!list) {
      continue;
    }
    let index = 0;
    if (list.length > 1 && indexes.length) {
      console.log(list, )
      index = Math.max(1, Math.min(list.length, parseInt(indexes.shift(), 36))) - 1;
    }
    ids.push(list[index])
  }
  console.log('PARSE', path, components, newIndexs, ids)
  return ids;
}

const urlGenerate = (...ids) => {
  const names = [];
  let indexes = '';
  for (const id of ids) {
    const person = db.people.get(id);
    if (person) {
      names.push(person.lookup.name);

      if (person.lookup.list.length > 1) {
        indexes += person.lookup.index.toString(36);
      }
    }
  }
  console.log({ names, indexes }, [''].concat(indexes || [], names.join('-')).join('/'));
  return [''].concat(indexes || [], names.join('-')).join('/');
}


const top = 330 / 800;
const height = 300 / 800;


let activeTitle;
let activeUrl;
let ready = 0;
const $description = document.querySelector('.description');
const $twitter = document.querySelector('.twitter');
const $email = document.querySelector('.email');
const $ol = document.querySelector('.partials');
const $imglist = document.querySelectorAll('.partial-image');
const $infolist = document.querySelectorAll('.info');
const onimg = (e) => {
  if (++ready >= $imglist.length) {
    setTimeout(() => {
      delete $ol.dataset.loading;
    }, 500);
  }
}
const onimgerror = (e) => {
  if (e.target.classList.contains('default')) {
    return onimg(e);
  }

  e.target.parentElement.parentElement.style = '';
  e.target.parentElement.style = '';
  e.target.classList.add('default');
  e.target.src = '/assets/whereswilma.webp';
}

$ol.addEventListener('load', onimg, true);
$ol.addEventListener('error', onimgerror, true);

const getIds = (ids=[]) => {
  const list = [];
  while (list.length < $imglist.length) {
    const id = ids[list.length] ?? db.ids[Math.floor(Math.random() * db.ids.length)];
    if (id && !list.includes(id) && db.people.get(id)) {
      list.push(id);
    }
  }
  return list;
}

const refresh = (inputIds) => {
  ready = 0;
  $ol.dataset.alt = +$ol.dataset.alt ? 0 : 1;
  $ol.dataset.loading = 1;

  const topBottomTransform = [0, 0];
  const namecombo = [];

  const policies = new Map();

  const ids = getIds(inputIds);

  let permutation = 1;
  for (const [i, id] of Object.entries(ids)) {
    const person = db.people.get(id);
    permutation *= person.index;

    const $img = $imglist[i];
    const haspoints = person.image;
    // const defaultSrc = '/assets/whereswilma.webp'; // no women without photos yet
    const defaultSrc = '/assets/manofmystery.webp';
    $img.src = haspoints ? `/assets/people/${id}.webp` : defaultSrc;
    $img.classList.toggle('default', !haspoints);


    const alignment = new Map();
    let consistentVotes = 0;
    for (const [policyId, personAgreement] of person.policies) {
      // add each person into the relevant overall policy
      const agreement = mapGet(policies, policyId, { aggregate: 0, count: 0, parties: new Map(), people: { names: [], ids: [], parties: new Set() } });
      agreement.people.names.push(person.name[0]);
      agreement.people.ids.push(id);
      agreement.people.parties.add(person.party);
      agreement.aggregate += personAgreement;
      ++agreement.count;
      
      // now for updating individual alliances
      // first skip anything that isn't 100% for or against (we're interested in consistency!)
      if (personAgreement % 100) {
        continue;
      }
      ++consistentVotes;

      // convert to +/- 1
      const vote = (2 * personAgreement / 100) - 1;

      const aligned = [];
      for (const [partyName, partyAgreement] of db.policies.get(policyId).parties) {
        // party majority voted for === party vote
        const partyVote = Math.max(-1, Math.min(1, partyAgreement.for.length - partyAgreement.against.length));
        // if there's' a majority party vote we'll
        // save it for the overall comparison (0=tied / no majority)
        if (partyVote) {
          agreement.parties.set(partyName, partyVote);
        }

        if (!majorParties.has(partyName)) {
          continue;
        }

        // no alignment if vote doesn't match the party's
        if (partyVote !== vote) {
          continue;
        }

        aligned.push(partyName);

        const list = mapGet(alignment, partyName);
        list.push(policyId);
      }
      if (!aligned.length) {
        const list = mapGet(alignment, 'Other');
        list.push(policyId);
      }
      // console.log('POLICY', db.policies.get(id).name, personAgreement);
    }

    let alignmentMax = 0;
    const alignmentEntriesSorted = Array.from(alignment)
      .sort(([partyA, a], [partyB, b]) => {
        alignmentMax = Math.max(alignmentMax, a.length, b.length);
        return b.length - a.length || (partyA === person.party ? 1 : 0);
      });
    if (!alignmentMax) {
      alignmentMax = alignmentEntriesSorted[0][1].length;
      console.log({ alignmentMax }, alignmentEntriesSorted)
    }

    const $info = $infolist[i];
    if ($info) {
      const role = `${person.house[0] === 's' ? 'Senator' : 'Representative'} for ${person.electorate}`;
      const offices = person.offices.length
      ? [person.offices[0].replace(/ (to|for) .*?(?= \(|$)/, '')]
      : [];
      // const offices = [
      //   ...person.offices.reduce((_, office) =>
      //     _.add(office.replace(/ (to|for) .*?(?= \(|$)/, '')), new Set())
      // ];

      $info.dataset.party = person.party.toLowerCase().replace(/ /g, '-').replace(/[^a-z-]/g, '');
      $info.querySelector('img').src = $img.classList.contains('default') ? $img.src : $img.src.replace('.webp', '-sm.webp');
      $info.querySelector('.name').innerText = person.name.join(' ');
      $info.querySelector('.role').innerText = role;
      $info.querySelector('.party').innerText = person.party === 'CWM' ? '' : person.party;
      $info.querySelector('.offices').innerHTML = offices.concat(person.offices.length > 1 ? `+${person.offices.length - 1} more offices` : []).join('<br>');
      $info.querySelector('.votes').innerHTML = `Consistent votes: ${consistentVotes.toLocaleString()}`;

      for (const $li of $info.querySelectorAll('.partial-alignment li')) {
        $li.style = null;
      }

      $info.querySelector('.partial-alignment').title = `${person.name[0]}'s consistent voting alignment with the major parties`;
      for (const [i, [party, alignedPolicies]] of  Object.entries(alignmentEntriesSorted)) {
        console.log(party);
        const $li = $info.querySelector(`.partial-alignment li[data-party="${party}"]`);
        $li.style.order = +i + 1
        $li.style.width = `${Math.round(100 * alignedPolicies.length / alignmentMax)}%`;
        console.log(i, party, alignedPolicies)
      }

    }

    console.log(id, person.name, person.party, person)
    console.log('ALIGNMENT', alignment);
    console.log(alignmentEntriesSorted)

    namecombo.push(person.name[0]);

    let styleParent;
    let style;

    // bunch of napkin math .. rotating and scaling images so points of interest align
    if (haspoints) {
      // points
      const eyeLeft = person.image[36];
      const eyeRight = person.image[45];
      const chin = person.image[8];
      const headLeft = person.image[0];
      const headRight = person.image[16];

      // offset points
      const eyeLeftEyeRight = [eyeRight[0] - eyeLeft[0], eyeRight[1] - eyeLeft[1]];
      const eyeLeftChin = [chin[0] - eyeLeft[0], chin[1] - eyeLeft[1]];
      const headLeftEyeLeft = [eyeLeft[0] - headLeft[0], eyeLeft[1] - headLeft[1]];
      const headRightEyeRight = [headRight[0] - eyeRight[0], headRight[1] - eyeRight[1]];

      // distances
      const eyeRightFromEyeLeft = (eyeLeftEyeRight[0] ** 2 + eyeLeftEyeRight[1] ** 2) ** 0.5;
      const chinFromLeftEye = (eyeLeftChin[0] ** 2 + eyeLeftChin[1] ** 2) ** 0.5;
      const headToLeftEye = (headLeftEyeLeft[0] ** 2 + headLeftEyeLeft[1] ** 2) ** 0.5;
      const headToRightEye = (headRightEyeRight[0] ** 2 + headRightEyeRight[1] ** 2) ** 0.5;

      // angle between 
      const eyesAngle = Math.atan(eyeLeftEyeRight[1] / eyeLeftEyeRight[0]);
      const eyeLeftChinAngle = Math.atan(eyeLeftChin[1] / eyeLeftChin[0]);

      // transformed
      const rotatedHeight = Math.sin(eyeLeftChinAngle - eyesAngle) * chinFromLeftEye;
      const scaleDirection = headToLeftEye > headToRightEye ? 1 : -1;
      const rotatedScale = height / rotatedHeight;
      const transformX = 0.5 - eyeLeft[0] - rotatedScale * eyeRightFromEyeLeft / 2;
      const transformY = top - eyeLeft[1];

      // some more napkin math (not perfect at all) to center the image based
      // on any whitespace between the top and first tile / bottom and last
      if (i == 0) {
        const scaleOffsetTop = transformY * rotatedScale - eyeLeft[1] * (rotatedScale - 1);
        topBottomTransform[0] = Math.max(0, scaleOffsetTop);
      } else if (i == ids.length - 1) {
        const scaleOffsetBottom = (1 - eyeLeft[1]) * (rotatedScale - 1) + transformY * rotatedScale;
        topBottomTransform[1] = Math.max(0, -scaleOffsetBottom);
      }

      // look in the same direction everyone!
      if (scaleDirection < 0) {
        styleParent = `transform: scaleX(${scaleDirection});`;
      }

      // where the magic happens .. dirty but works
      style = `transform: translate(${transformX * 100}%, ${transformY * 100}%) scale(${rotatedScale}, ${rotatedScale}) rotate(${-eyesAngle}rad); transform-origin: ${eyeLeft[0] * 100}% ${eyeLeft[1] * 100}%;`
      

      // debug helper
      if (DEBUG) {
        for (const $div of $img.parentElement.querySelectorAll('.debug')) {
          $div.remove();
        }
        for (const point of [person.image[0], person.image[16], eyeLeft, eyeRight, chin]) {
          const $div = document.createElement('div');
          $div.classList.add('debug');
          $div.style = `position: absolute; left: ${point[0] * 100}%; top: ${point[1] * 100}%; border: 0.5em solid #0F0; border-radius: 50%; transform: translate(-50%, -50%);`;
          $img.after($div);
        }
      }
    }

    $img.parentElement.parentElement.style = styleParent;
    $img.parentElement.style = style;
  }

  const offsetTransformY = (topBottomTransform[1] - topBottomTransform[0]) / 4;

  $ol.style = `transform: translateY(${offsetTransformY * 100}%)`
  console.log({topBottomTransform, offsetTransformY});

  activeTitle = `${namecombo[0]} "the ${namecombo[1]}" ${namecombo[2]}-${namecombo[3]}`;
  for (const $pollie of document.querySelectorAll('.pollie')) {
    $pollie.dataset.permutation = permutation.toLocaleString();
    $pollie.dataset.permutations = db.permutations.toLocaleString();
    $pollie.innerText = activeTitle;
  }

  activeUrl = urlGenerate(...ids);

  if (history.state && history.state.ids && history.state.ids.join('') !== ids.join('')) {
    console.log('PUSH STATE!', history.state, activeUrl);
    // previously updated
    history.pushState({ ids }, '', activeUrl)
  } else {
    console.log('REPLACE STATE!');

    // first run ... we'll replace the url to be sure
    history.replaceState({ ids }, '', activeUrl)
  }

  $twitter.href = getTwitterHref(activeTitle);
  $email.href = getEmailHref(activeTitle);

  renderPolicies(policies);
}

const getTwitterHref = (title) => {
  const url = new URL('https://twitter.com/intent/tweet');
  url.searchParams.set('text', `${title} is truly the Perfect ❤️ Pollie`);
  url.searchParams.set('url', location.origin + location.pathname);
  return url;
}

const getEmailHref = (title) => {
  const bodyEncoded = encodeURIComponent(`Hey I found the the Perfect Pollie -\n\n${location.origin + location.pathname}\n\nLove ya guts!`)
  return `mailto:?subject=${encodeURIComponent('found the the perfect pollie')}&body=${bodyEncoded}`;
}

const listJoinAnd = (list) => {
  if (list.length <= 2) {
    return list.join(' and ');
  }
  return list.slice(0, -2).join(', ').concat(', ', list.slice(-2).join(' and '));
}


const $policiesBigTicket = document.querySelector('.policies-bigticket');
const $policiesForBigTicket = document.querySelector('.policies-for-bigticket');
const $policiesForMajor = document.querySelector('.policies-for-major');
const $policiesFor = document.querySelector('.policies-for');
const $policiesAgainstBigTicket = document.querySelector('.policies-against-bigticket');
const $policiesAgainstMajor = document.querySelector('.policies-against-major');
const $policiesAgainst = document.querySelector('.policies-against');
const $alignmentList = document.querySelectorAll('.alignment li');

const renderPolicies = (policies) => {
  let alignmentTotal = 0;
  let alignmentMajorTotal = 0;
  const alignment = new Map();
  const alignmentMajor = new Map();
  const policiesForCounts = new Map();
  const policiesAgainstCounts = new Map();
  for (const [id, agreement] of policies) {
    const avg = agreement.aggregate / agreement.count;
    let html, counts;

    // we only want to include consensus votes
    // ... so only policies where everyone that voted did so the same way
    // and consistantly, either FOR or AGAINST
    // our new person is not in two minds about these things, but they are
    // either strongly or weakly-held beliefs depending on how many voted
    if (avg === 100) {
      counts = policiesForCounts;
    } else if (avg === 0) {
      counts = policiesAgainstCounts;
    // .. everything else is excluded
    } else {
      continue;
    }

    // Now to generate our overall allignment
    const policy = db.policies.get(id);

    // convert consensus vote to +/- 1
    const vote = (2 * avg / 100) - 1;
    const increment = agreement.count ** 2;
    if (increment > 10) {
      console.log(id, policy.name, agreement.count, increment);
    }

    // 
    const alignedMajor = [];
    const aligned = [];
    for (const [partyName, partyVote] of agreement.parties) {
      if (vote === partyVote) {
        aligned.push(partyName);
        const party = mapGet(alignment, partyName, { score: 0, total: 0 });

        if (majorParties.has(partyName)) {
          alignedMajor.push(id);
          const partyMajor = mapGet(alignmentMajor, partyName, { score: 0, total: 0 });
          partyMajor[id] = increment;
          partyMajor.score += increment;
          ++partyMajor.total;
          alignmentMajorTotal += increment;
          if (increment > 10) {
            console.log(partyMajor, partyName, vote, partyVote);
          }
        }

        party[id] = increment;
        party.score += increment;
        alignmentTotal += increment;
      }
    }


    
    if (!alignedMajor.length) {
      const partyMajor = mapGet(alignmentMajor, 'Other', { score: 0, total: 0 });
      partyMajor[id] = increment;
      partyMajor.score += increment;
      ++partyMajor.total;
      alignmentMajorTotal += increment;
    }

    const list = mapGet(counts, agreement.count);
    const names = listJoinAnd(agreement.people.names);
    const decisionAgree = agreement.count > 1 ? 'agree' : 'agrees';
    const decisionDisagree = agreement.count > 1 ? 'do not agree' : 'does not agree';
    list.push(`<li class="${avg ? 'is-for' : 'is-against'}">
      <details>
        <summary title="${names} ${decisionAgree} this is a ${avg ? 'great' : 'terrible'} policy" data-count="${agreement.count}">${policy.name}</summary>
        <p><i>${names}</i> ${avg ? decisionAgree : decisionDisagree} that ${policy.description}
          <br><small>Aligned Parties: ${aligned.sort().join(', ')}</small>
        </p>
      </details>
    </li>`);

  }

  console.log('POLICY ALIGNMENT', alignmentTotal, alignment);
  console.log('POLICY ALIGNMENT MAJOR', alignmentMajorTotal, alignmentMajor);

  let majorPartyClosestAlignment;
  let majorPartyTotalPercentRounded = 0;
  const majorPartiesOver25 = [];
  const majorPartiesUnder25 = [];
  for (const [majorPartyName, majorParty] of alignmentMajor) {
    majorParty.percent = 100 * majorParty.score / alignmentMajorTotal;
    majorParty.percentRounded = Math.ceil(majorParty.percent);
    majorPartyTotalPercentRounded += majorParty.percentRounded;
    if (!majorPartyClosestAlignment
      || majorParty.score > majorPartyClosestAlignment.score) {
      majorPartyClosestAlignment = majorParty;
    }
    if (majorPartyName !== 'Other' || majorParty.percent > 75) {
      if (majorParty.percent >= 25) {
        majorPartiesOver25.push(majorPartyName);
      } else if (majorParty.percent > 10) {
        majorPartiesUnder25.push(majorPartiesFoodMap.get(majorPartyName));
      }
    }
  }
  majorPartyClosestAlignment.percentRounded += 100 - majorPartyTotalPercentRounded;


  for (const $li of $alignmentList) {
    const majorParty = alignmentMajor.get($li.dataset.party);
    delete $li.dataset.primary;
    if (majorParty) {
      // const percent = 100 * majorParty.score / alignmentMajorTotal;
      $li.style.width = `${majorParty.percent}%`;
      $li.style.order = $li.dataset.percent = majorParty.percentRounded;
      $li.dataset.score = majorParty.score;
      $li.dataset.total = majorParty.total;
      if (majorPartyClosestAlignment === majorParty) {
        $li.dataset.primary = '1';
      }
    } else {
      delete $li.dataset.total;
      delete $li.dataset.score;
      delete $li.dataset.percent;
      $li.style = null;
    }
  }


  const policiesForOther = [].concat(policiesForCounts.get(2) || [], policiesForCounts.get(1) || []);
  const policiesAgainstOther = [].concat(policiesAgainstCounts.get(2) || [], policiesAgainstCounts.get(1) || []);
  const bigTicketCount = (policiesForCounts.get(4)?.length ?? 0) + (policiesAgainstCounts.get(4)?.length ?? 0);

  $policiesBigTicket.dataset.total = bigTicketCount;
  $policiesForBigTicket.innerHTML = (policiesForCounts.get(4) || []).join('')
    + (policiesAgainstCounts.get(4) || []).join('');
  $policiesForMajor.innerHTML = (policiesForCounts.get(3) || []).join('')
    + (policiesAgainstCounts.get(3) || []).join('');
  $policiesFor.innerHTML = policiesForOther.join('')
    + policiesAgainstOther.join('');

  const majorPartyOther = alignmentMajor.get('Other');
  const alignedAll = majorPartiesOver25.length === majorParties.size;
  const description = [`<i>${activeTitle}</i>`].concat(
    bigTicketCount ? 'has' : 'has the look, but doesn\'t have any',
    bigTicketCount > 5 ? 'any number of' : bigTicketCount || [],
    `<a href="#big-ticket-policies">big ticket ${bigTicketCount === 1 ? 'policy' : 'policies'}</a>`,
    majorPartyClosestAlignment.percent >= 75
      ?  (majorPartiesOver25[0] === 'Other'
        ? 'and is essentially a bizarre non-conformist'
        : `${bigTicketCount < 5 ? '&hellip; and' : 'but'} `
          + (bigTicketCount ? `(of course) is essentially a` : 'is really just a plain-packaged')
          + ` <span class="party-align">${majorPartiesOver25[0]}</span> stooge`)
        + ` (who enjoys a side of ${listJoinAnd(majorPartiesUnder25)})`
      : `${bigTicketCount ? 'and susbscribes to' : '&hellip; despite subscribing to'} `
        + (alignedAll
          ? 'a confused middle ground in the divine trinity of major party ideaologies'
          : 'a soggy sandwich of '
            + (majorPartiesOver25.length > 1
              // ? `${majorPartiesOver25.length} of the ${majorParties.size} major parties`
              ? `<span class="party-align">${majorPartiesOver25.join('</span> and <span class="party-align">')}</span>`
              : `<span class="party-align">${majorPartiesOver25[0]}</span>`)
            + ' thinking'
            + (majorPartiesUnder25.length ? ` (with a side of ${majorPartiesUnder25.join(' and ')})` : '')
            )
        + (majorPartyOther
          ? `. And, in true Canberra style, tops things off with ${majorPartyOther.percent < 2 ? 'an efficient smidge' : majorPartyOther.percent < 10 && 'conservative pinch' || 'fair dollop'} of bizarre otherness`
          : ''),
  ).join(' ').concat('.');

  $description.innerHTML = description;
}

document.querySelector('.btn-refresh').addEventListener('click', (e) => {
  e.target.blur();
  document.body.focus();
  // alert(e.target.classList.toString());
  refresh()
})

window.addEventListener('popstate', ({ state }) => {
  if (state && state.ids) {
    refresh(state.ids);
  }
  console.log('POPSTATE', state);
});

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isIOS = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

const renderImage = async (isSafariTimeWasting) => {
  const outputScale = 600 * (1 + 1 / 37.5 * 2 * 1.35) /  $image.offsetWidth;
  const dataUrl = await domtoimage.toJpeg($image, {
    width: $image.offsetWidth * outputScale,
    height: $image.offsetHeight * outputScale,
    style: {
      transform: `scale(${outputScale})`, transformOrigin: '0 0'
    },
    bgcolor: '#fff',
  });
  // safari (yay) doesn't load images on the first go
  // probably "smarter" ?? ... anyway, let's try again
  if (isSafari && !isSafariTimeWasting) {
    return renderImage(true);
  }
  return dataUrl;
}

for (const $hint of document.querySelectorAll('[data-hint]')) {
  const type = $hint.dataset.hint === 'over' ? 'pointerover' : 'click';
  $hint.addEventListener(type, () => {
    delete $hint.dataset.hint;
  }, { once: true });
}

const $image = document.querySelector('.image');

document.querySelector('.copy').addEventListener('click', () => {
  navigator.clipboard.writeText(location.origin + location.pathname).then(() => {
    console.log('saved!')
  }, () => {
    console.log('whoops!')
  });
})

document.querySelector('.save').addEventListener('click', async () => {
  const popup = isIOS && window.open('about:blank', '_blank');

  const dataUrl = await renderImage();
  const objectUrl = await fetch(dataUrl).then(e => e.blob()).then(e => URL.createObjectURL(e));
  // window.open(objectUrl);
  if (popup) {
    popup.location.href = objectUrl;
  } else {
    const link = document.createElement('a');
    link.download = `${location.pathname.slice(1).replace(/([^\/]+)\/(.*)$/, '$2-$1')}.jpg`;
    link.href = objectUrl;
    link.click();
  }
  URL.revokeObjectURL(objectUrl);
});


if (DEBUG) {
  document.body.dataset.debug = true;
}

let db;
const init = async () => {
  db = await loadDB();
  const $combos = document.querySelector('.combos');
  if ($combos) {
    $combos.innerText = db.permutations;
  }
  const urlIds = urlParseIds(location.pathname);
  refresh(urlIds);
}

init();