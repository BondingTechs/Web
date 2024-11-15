import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const login_post = defineEventHandler(async (event) => {
  try {
    const { area, phone, password } = await readBody(event);
    const {
      code,
      message = "",
      data = {}
    } = await request.post("/auth/login", { area, phone, password });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
