import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const click_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      code,
      message = "",
      data
    } = await request.post("/external-link/add", body);
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { click_post as default };
//# sourceMappingURL=click.post.mjs.map
