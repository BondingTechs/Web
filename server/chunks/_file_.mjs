import { defineEventHandler, getRouterParams, sendStream } from 'h3';
import axios from 'axios';
import { u as useRuntimeConfig } from './nitro/node-server.mjs';
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
import 'http-graceful-shutdown';

const config = useRuntimeConfig();
const request = axios.create({
  baseURL: config.public.apiUpload,
  timeout: 5e3
});
const _file_ = defineEventHandler(async (event) => {
  try {
    event.node.res.setHeader("content-type", "image/png");
    const { date, file } = await getRouterParams(event);
    const path = `/public/uploads/${date}/${file}`;
    const { data } = await request.get(path, {
      responseType: "stream"
    });
    return sendStream(event, data);
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { _file_ as default };
//# sourceMappingURL=_file_.mjs.map
