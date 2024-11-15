import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const history_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      code,
      message = "",
      data
    } = await request.post("/location/history/add", body);
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { history_post as default };
//# sourceMappingURL=history.post.mjs.map
