import { d as defineEventHandler, r as readBody, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const resetPassword_post = defineEventHandler(async (event) => {
  try {
    const { oldPassword, newPassword, newPasswordConfirm } = await readBody(
      event
    );
    const {
      code,
      message = "",
      data = {}
    } = await request.post("/user/reset-password", {
      oldPassword,
      newPassword,
      newPasswordConfirm
    });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { resetPassword_post as default };
//# sourceMappingURL=reset-password.post.mjs.map
