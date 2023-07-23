import { eventHandler, readBody } from 'h3';
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

const page_post = eventHandler(async (event) => {
  try {
    const { isTop, isHot, page, size, sort, type, category, articleId } = await readBody(event);
    const {
      code,
      message = "",
      data = null
    } = await request.post("/news/article/page", {
      isTop,
      isHot,
      page,
      size,
      sort,
      type,
      category,
      articleId
    });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { page_post as default };
//# sourceMappingURL=page.post2.mjs.map
