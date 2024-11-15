import { e as eventHandler, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const today_post = eventHandler(async () => {
  var _a;
  try {
    const {
      code,
      message = "",
      data = null
    } = await request.post("/tip/today", { client: !((_a = request) == null ? void 0 : _a.server) });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { today_post as default };
//# sourceMappingURL=today.post.mjs.map
