import { d as defineEventHandler, g as getRouterParams, s as sendStream, u as useRuntimeConfig } from './nitro/node-server.mjs';
import axios from 'axios';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';

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
