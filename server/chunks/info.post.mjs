import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const info_post = defineEventHandler(async (event) => {
  try {
    const { slug } = await readBody(event);
    const {
      code,
      message = "",
      data = null
    } = await request.post("/industry/category/info", { slug });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { info_post as default };
//# sourceMappingURL=info.post.mjs.map
