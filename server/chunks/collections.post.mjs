import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const collections_post = defineEventHandler(async (event) => {
  try {
    const {
      keyWord,
      size,
      page,
      order,
      sort,
      category,
      type = "article"
    } = await readBody(event);
    const {
      code,
      message = "",
      data = null
    } = await request.post("/my/collections", {
      keyWord,
      size,
      page,
      order,
      sort,
      category,
      type
    });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { collections_post as default };
//# sourceMappingURL=collections.post.mjs.map
