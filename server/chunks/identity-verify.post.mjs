import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const identityVerify_post = defineEventHandler(async (event) => {
  try {
    const { idCard, positive, negative } = await readBody(event);
    const {
      code,
      message = "",
      data = {}
    } = await request.post("/user/identity-verify", {
      idCard,
      positiveId: positive,
      negativeId: negative
    });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { identityVerify_post as default };
//# sourceMappingURL=identity-verify.post.mjs.map
