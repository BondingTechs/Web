import { d as defineEventHandler, r as readBody, c as createError, a as request } from './nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';

const forgot_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { area, phone, password, passwordConfirm, verifyCode } = body;
    const rules = [
      {
        key: "area",
        message: "\u8ACB\u9078\u64C7\u5730\u5340"
      },
      {
        key: "phone",
        message: "\u8ACB\u8F38\u5165\u624B\u6A5F\u865F\u78BC"
        // regex: phoneRegex,
      },
      {
        key: "password",
        label: "\u5BC6\u78BC",
        message: "\u5BC6\u78BC\u683C\u5F0F\u932F\u8AA4"
      },
      {
        key: "passwordConfirm",
        message: "\u5169\u6B21\u5BC6\u78BC\u4E0D\u4E00\u81F4"
      },
      {
        key: "verifyCode",
        message: "\u8ACB\u8F38\u5165\u9A57\u8B49\u78BC"
      }
    ];
    const validateRule = (rule) => {
      const value = body[rule.key] || "";
      if (!value) {
        throw createError({
          message: rule.message
        });
      }
      if (rule.regex && !rule.regex.test(value)) {
        throw createError({
          message: rule.message
        });
      }
    };
    await Promise.all(rules.map(async (rule) => await validateRule(rule)));
    const {
      code,
      message = "",
      data = {}
    } = await request.post("/auth/forgot", {
      area,
      phone,
      password,
      passwordConfirm,
      verifyCode
    });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { forgot_post as default };
//# sourceMappingURL=forgot.post.mjs.map
