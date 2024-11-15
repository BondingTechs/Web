import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const emailBinding_post = defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);
    const {
      code,
      message = "",
      data = {}
    } = await request.post("/user/email-binding", { email });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { emailBinding_post as default };
//# sourceMappingURL=email-binding.post.mjs.map
