import { defineEventHandler, readBody, createError } from 'h3';
import { p as phoneRegex } from './regex.mjs';
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

const _type_Captcha_post = defineEventHandler(async (event) => {
  try {
    const type = event.context.params["type-captcha"].replace("-captcha", "");
    const body = await readBody(event);
    const { phone, area } = body;
    console.log(body);
    const rules = [
      {
        key: "phone",
        message: "\u8ACB\u8F38\u5165\u624B\u6A5F\u865F\u78BC",
        regex: phoneRegex
      }
    ];
    const validateRule = (rule) => {
      const value = body[rule.key] || "";
      if (value && rule.regex && rule.regex.test(value))
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
