import { defineEventHandler, readBody } from 'h3';
import { r as request } from './nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'ofetch';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'klona';
import 'defu';
import 'ohash';
import 'ufo';
import 'unstorage';
import 'unstorage/drivers/fs';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'axios';
import 'http-graceful-shutdown';

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
