import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const info_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      code,
      message = "",
      data
    } = await request.post("/location/info/add", body);
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { info_post as default };
//# sourceMappingURL=info.post2.mjs.map
