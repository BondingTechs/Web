import { defineEventHandler, readBody, createError } from 'h3';
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

const register_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      firstName,
      lastName,
      birthday,
      area,
      phone,
      password,
      passwordConfirm,
      gender,
      verifyCode
    } = body;
    const rules = [
      {
        key: "firstName",
        message: "\u8ACB\u8F38\u5165\u59D3\u6C0F"
      },
      {
        key: "lastName",
        message: "\u8ACB\u8F38\u5165\u540D\u5B57"
      },
      {
        key: "birthday",
        message: "\u8ACB\u8F38\u5165\u751F\u65E5"
      },
      {
        key: "area",
        message: "\u8ACB\u9078\u64C7\u5730\u5340"
      },
      {
        key: "phone",
        message: "\u8ACB\u8F38\u5165\u624B\u6A5F\u865F\u78BC"
      },
      {
        key: "password",
        message: "\u5BC6\u78BC\u683C\u5F0F\u932F\u8AA4"
      },
      {
        key: "passwordConfirm",
        message: "\u5169\u6B21\u5BC6\u78BC\u4E0D\u4E00\u81F4"
      },
      {
        key: "gender",
        message: "\u8ACB\u8F38\u5165\u6027\u5225"
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
    } = await request.post("/auth/register", {
      firstName,
      lastName,
      birthday,
      area,
      phone,
      password,
      passwordConfirm,
      gender,
      verifyCode
    });
    return { error: code !== 1e3, code, message, data };
  } catch (err) {
    const { code, message = "" } = err;
    return { error: code !== 1e3, code, message };
  }
});

export { register_post as default };
//# sourceMappingURL=register.post.mjs.map
