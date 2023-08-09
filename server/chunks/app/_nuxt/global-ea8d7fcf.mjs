import { d as defineNuxtRouteMiddleware } from '../server.mjs';
import 'vue';
import 'ofetch';
import 'hookable';
import 'unctx';
import 'vue-router';
import 'h3';
import 'ufo';
import 'destr';
import 'klona';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'ohash';
import 'store';
import 'axios';
import 'vue/server-renderer';
import 'cookie-es';
import 'defu';
import '@vue/runtime-core';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'unstorage';
import 'unstorage/drivers/fs';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'http-graceful-shutdown';

const global = /* @__PURE__ */ defineNuxtRouteMiddleware(() => {
  console.log("running global middleware");
});

export { global as default };
//# sourceMappingURL=global-ea8d7fcf.mjs.map