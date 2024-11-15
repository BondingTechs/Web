import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const history_post = defineEventHandler(async (event) => {
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
      data
    } = await request.post("/my/history", {
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

export { history_post as default };
//# sourceMappingURL=history.post2.mjs.map
