/*
Cloudflare worker for routing / asset management
- works in tandem with storage worker (in progress)
*/
const storageUrl = 'https://perfectpollie-au-storage.theprojectsomething.workers.dev';

const getImageUrl = pathname =>
  `${pathname.slice(1).replace(/([^\/]+)\/(.*)$/, '$2-$1')}.jpg`;

const getImageTitle = pathname =>
  pathname.slice(1).replace(/.*\/([^\/]+)/, '$1').split('-')
  .map((val, i) => {
    const name = val[0].toUpperCase() + val.slice(1);
    return i === 1 ? `&quot;the ${name}&quot;` : name;
  }).join(' ').replace(/(.*) /, '$1-');

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cacheKey = new Request(url.toString(), request);

    const cacheResponse = await caches.default.match(cacheKey);
    if (cacheResponse) {
      return cacheResponse;
    }

    const doCache = (response) => {
      response = new Response(response.body, response);
      response.headers.append('Cache-Control', 's-maxage=86400');
      ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
    }

    if (url.pathname.startsWith('/images/')) {
      try {
        const headers = {};
        const authKey = request.headers.get('X-Custom-Auth-Key');
        if (authKey) {
          headers['X-Custom-Auth-Key'] = authKey;
        }
        let image = fetch(`${storageUrl}/${url.pathname.replace(/.*\//, '')}`, {
          method: request.method,
          headers,
          body: request.body,
        });
        if (image.status === 200 && request.method === 'GET') {
          doCache(image);
        }
        return image
      } catch (e) {
        return new Response(true);
      }
    }

    let asset = env.ASSETS.fetch(request);
    if (/\/[^.\/]+$/.test(url.pathname)) {
      const response = await asset;
      if (response.headers.get('content-type') === 'text/html') {
        let html = await response.text();
        let cache = true;
        const imageUrl = getImageUrl(url.pathname);
        if (imageUrl) {
          const exists = true;
          // const exists = await fetch(`${storageUrl}/${imageUrl}`, { method: 'HEAD' })
          // .then(e => e.status === 200).catch(() => false);
          
          if (exists) {
            html = html.replace(/(<meta.*?image" content=")[^"]+/g, `$1https://perfectpollie.au/images/${imageUrl}`);
          } else {
            cache = false;
          }
        }

        const imageTitle = getImageTitle(url.pathname);
        if (imageTitle) {
          // meta tags
          html = html.replace(/(<meta.*?(?:title|"name)" content=")[^"]+/g, `$1${imageTitle}`);
          // title tag
          html = html.replace(/(<title>)[^<]+/g, `$1${imageTitle} | Perfect ❤ Pollie`);
          // document references
          html = html.replace(/(class="[^"]*pollie(?:"| )[^>]*>)[^<]*/g, `$1${imageTitle}`);
        }

        if (imageUrl || imageTitle) {
          html = html.replace('<html', '$& data-custom');
        }

        asset = new Response(html, response);

        if (imageUrl && imageTitle && cache) {
          doCache(new Response(html, response));
        }
      }
    } else if (url.pathname === '/') {
      const response = await asset;
      let html = await response.text();
      html = html.replace('<html', '$& data-default')
      asset = new Response(html, response);
    }

    // Otherwise, serve the static assets.
    // Without this, the Worker will error and no assets will be served.
    return asset;
  },
};
