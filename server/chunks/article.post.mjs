import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const article_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const { slug } = await readBody(event);
    const {
      code,
      message = "",
      data = null
    } = await request.post("/news/article/info", {
      slug,
      client: !((_a = request) == null ? void 0 : _a.server)
    });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { article_post as default };
//# sourceMappingURL=article.post.mjs.map
