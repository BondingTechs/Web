import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const refresh_post = defineEventHandler(async (event) => {
  try {
    const { refreshToken } = await readBody(event);
    const {
      code,
      message = "",
      data = {}
    } = await request.post("/auth/refreshToken", { refreshToken });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { refresh_post as default };
//# sourceMappingURL=refresh.post.mjs.map
