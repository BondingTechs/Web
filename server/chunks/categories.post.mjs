import { d as defineEventHandler, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const categories_post = defineEventHandler(async () => {
  try {
    const {
      code,
      message = "",
      data = null
    } = await request.post("/industry/category/list");
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { categories_post as default };
//# sourceMappingURL=categories.post.mjs.map
