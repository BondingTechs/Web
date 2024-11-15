import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const create_post = defineEventHandler(async (event) => {
  try {
    const { articleId, content, parentId } = await readBody(event);
    const {
      code,
      message = "",
      data = null
    } = await request.post("/news/article/comment/create", {
      articleId,
      content,
      parentId
    });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { create_post as default };
//# sourceMappingURL=create.post.mjs.map
