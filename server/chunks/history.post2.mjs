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

const history_post = defineEventHandler(async (event) => {
  try {
    const {
      keyWord,
      size,
      page,
      order,
      sort,
      category,
      type = "article"
    } = await readBody(event);
    const {
      code,
      message = "",
      data
    } = await request.post("/my/history", {
      keyWord,
      size,
      page,
      order,
      sort,
      category,
      type
    });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { history_post as default };
//# sourceMappingURL=history.post2.mjs.map
