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
