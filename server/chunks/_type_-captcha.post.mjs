import { d as defineEventHandler, r as readBody, c as createError, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const _type_Captcha_post = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const type = (_b = (_a = event.context) == null ? void 0 : _a.params) == null ? void 0 : _b["type-captcha"].replace("-captcha", "");
    const body = await readBody(event);
    const { phone, area } = body;
    const rules = [
      {
        key: "area",
        message: "\u8ACB\u9078\u64C7\u5730\u5340"
      },
      {
        key: "phone",
        message: "\u8ACB\u8F38\u5165\u624B\u6A5F\u865F\u78BC"
        // regex: phoneRegex,
      }
    ];
    const validateRule = (rule) => {
      const value = body[rule.key] || "";
      if (value)
        return;
      throw createError({
        message: rule.message
      });
    };
    await Promise.all(rules.map(async (rule) => await validateRule(rule)));
    const {
      code,
      message = "",
      data = null
    } = await request.post("/auth/captcha", { area, phone, type });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { _type_Captcha_post as default };
//# sourceMappingURL=_type_-captcha.post.mjs.map
