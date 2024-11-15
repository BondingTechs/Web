import { e as eventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const list_post = eventHandler(async (event) => {
  try {
    const { isTop, isHot, size, sort, type, category, articleId } = await readBody(event);
    const {
      code,
      message = "",
      data = null
    } = await request.post("/news/article/list", {
      isTop,
      isHot,
      size,
      sort,
      type,
      category,
      articleId
    });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { list_post as default };
//# sourceMappingURL=list.post.mjs.map
