importScripts("https://cdnjs.cloudflare.com/ajax/libs/openpgp/4.10.7/compat/openpgp.min.js");

const password = "my secret password";

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname === '/e2ee_screen_share/swvideo') {
    const path = url.hash.substring(1);
    event.respondWith((async () => {
      const res = await fetch(`https://ppng.io/${path}`);
      // Allow unauthenticated stream
      // (see: https://github.com/openpgpjs/openpgpjs/releases/tag/v4.0.0)
      openpgp.config.allow_unauthenticated_stream = true;
      // Decrypt
      const rawStream = await (async () => {
        const plaintext = await openpgp.decrypt({
          message: await openpgp.message.read(res.body),
          passwords: [password],
          format: 'binary'
        });
        return plaintext.data;
      })();

      return new Response(rawStream);
    })());
  }
});
