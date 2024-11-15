import { e as eventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const collection_post = eventHandler(async (event) => {
  try {
    const { id } = await readBody(event);
    const {
      code,
      message = "",
      data = null
    } = await request.post("/tip/collection", { id });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { collection_post as default };
//# sourceMappingURL=collection.post2.mjs.map
