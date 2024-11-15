import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const emailVerify_post = defineEventHandler(async (event) => {
  try {
    const { token } = await readBody(event);
    const {
      code,
      message = "",
      data = {}
    } = await request.post("/auth/email-verify", { token });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { emailVerify_post as default };
//# sourceMappingURL=email-verify.post.mjs.map
