import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const changePhone_post = defineEventHandler(async (event) => {
  try {
    const { phone, verifyCode } = await readBody(event);
    const {
      code,
      message = "",
      data = {}
    } = await request.post("/user/change-phone", { phone, verifyCode });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { changePhone_post as default };
//# sourceMappingURL=change-phone.post.mjs.map
