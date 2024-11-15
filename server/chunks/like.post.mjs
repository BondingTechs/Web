import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const like_post = defineEventHandler(async (event) => {
  try {
    const { commentId, articleId } = await readBody(event);
    const {
      code,
      message = "",
      data = null
    } = await request.post("/news/article/comment/like", { commentId, articleId });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { like_post as default };
//# sourceMappingURL=like.post.mjs.map
