import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const page_post = defineEventHandler(async (event) => {
  try {
    const { articleId, parentId, page = 1, size = 10 } = await readBody(event);
    const {
      code,
      message = "",
      data = null
    } = await request.post("/news/article/comment/page", {
      articleId,
      parentId,
      page,
      size
    });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { page_post as default };
//# sourceMappingURL=page.post.mjs.map
