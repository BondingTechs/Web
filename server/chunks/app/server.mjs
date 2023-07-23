import { toRef, isRef, hasInjectionContext, inject, version, toRaw, isReactive, defineComponent, mergeProps, withCtx, renderSlot, createTextVNode, toDisplayString, useSSRContext, ref, computed, provide, h as h$1, Fragment, onMounted, onUnmounted, watch, watchEffect, nextTick, Suspense, Transition, createElementBlock, getCurrentInstance, resolveComponent, reactive, unref, cloneVNode, createVNode, openBlock, createBlock, renderList, createCommentVNode, shallowReactive, withDirectives, vModelCheckbox, vShow, createApp, onServerPrefetch, markRaw, effectScope, onErrorCaptured, resolveDynamicComponent, shallowRef, isReadonly, defineAsyncComponent, isShallow, toRefs } from 'vue';
import { $fetch as $fetch$1 } from 'ofetch';
import { createHooks } from 'hookable';
import { getContext, executeAsync } from 'unctx';
import { RouterView, useRoute as useRoute$1, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { createError as createError$1, sanitizeStatusCode, setCookie, getCookie, deleteCookie } from 'h3';
import { hasProtocol, parseURL, parseQuery, withTrailingSlash, withoutTrailingSlash, withQuery, joinURL } from 'ufo';
import destr from 'destr';
import { klona } from 'klona';
import { renderSSRHead } from '@unhead/ssr';
import { composableNames, getActiveHead, createServerHead as createServerHead$1 } from 'unhead';
import { defineHeadPlugin } from '@unhead/shared';
import { ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderTeleport, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import { parse } from 'cookie-es';
import { hash, isEqual } from 'ohash';
import store from 'store';
import { defu } from 'defu';
import { ref as ref$1 } from '@vue/runtime-core';
import { a as useRuntimeConfig$1 } from '../nitro/node-server.mjs';
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
import 'axios';
import 'http-graceful-shutdown';

const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.7.0-28168358.7046930a";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    runWithContext: (fn) => callWithNuxt(nuxtApp, fn),
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    _payloadRevivers: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    async function contextCaller(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    }
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
      nuxtApp.ssrContext._payloadReducers = {};
      nuxtApp.payload.path = nuxtApp.ssrContext.url;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const parallels = [];
  const errors = [];
  for (const plugin2 of plugins2) {
    const promise = applyPlugin(nuxtApp, plugin2);
    if (plugin2.parallel) {
      parallels.push(promise.catch((e2) => errors.push(e2)));
    } else {
      await promise;
    }
  }
  await Promise.all(parallels);
  if (errors.length) {
    throw errors[0];
  }
}
/*! @__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true });
}
function callWithNuxt(nuxt, setup2, args) {
  const fn = () => args ? setup2(...args) : setup2();
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
/*! @__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function useNuxtApp() {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
/*! @__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig() {
  return (/* @__PURE__ */ useNuxtApp()).$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
function defineAppConfig(config) {
  return config;
}
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxt = /* @__PURE__ */ useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = /* @__PURE__ */ useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, (/* @__PURE__ */ useNuxtApp())._route);
  }
  return (/* @__PURE__ */ useNuxtApp())._route;
};
/*! @__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if ((/* @__PURE__ */ useNuxtApp())._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : withQuery(to.path || "/", to.query || {}) + (to.hash || "");
  if (options == null ? void 0 : options.open) {
    return Promise.resolve();
  }
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `navigateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      async function redirect(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(/"/g, "%22");
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: location2 }
        };
        return response;
      }
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const useError = () => toRef((/* @__PURE__ */ useNuxtApp()).payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const error = useError();
    if (false)
      ;
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const isNuxtError = (err) => !!(err && typeof err === "object" && "__nuxt_error" in err);
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
const __nuxt_page_meta$6 = {
  layout: "blog"
};
const __nuxt_page_meta$5 = {
  middleware: ["auth"]
};
const __nuxt_page_meta$4 = {
  middleware: ["auth"]
};
const __nuxt_page_meta$3 = {
  layout: "blog"
};
const __nuxt_page_meta$2 = {
  layout: "blog"
};
const __nuxt_page_meta$1 = {
  layout: "blog"
};
const __nuxt_page_meta = {
  layout: "blog"
};
const _routes = [
  {
    name: "404",
    path: "/404",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/404-46c75357.mjs').then((m2) => m2.default || m2)
  },
  {
    name: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.name) ?? "index",
    path: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.path) ?? "/",
    meta: __nuxt_page_meta$6 || {},
    alias: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.alias) || [],
    redirect: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.redirect) || void 0,
    component: () => import('./_nuxt/index-8ba810b8.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "member-rule",
    path: "/member-rule",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/member-rule-4e73f12e.mjs').then((m2) => m2.default || m2)
  },
  {
    path: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.path) ?? "/my",
    children: [
      {
        name: "my-account-change-phone",
        path: "account/change-phone",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/change-phone-0557a70d.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "my-account-email-binding",
        path: "account/email-binding",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/email-binding-0687f601.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "my-account-email-verify",
        path: "account/email-verify",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/email-verify-ca1c11c9.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "my-account-identity-verify",
        path: "account/identity-verify",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/identity-verify-a0845ec6.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "my-account",
        path: "account",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/index-eb59f8c1.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "my-account-reset-password",
        path: "account/reset-password",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/reset-password-6079e8e4.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "my-collections",
        path: "collections",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/collections-4c1fdd0b.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "my-history",
        path: "history",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/history-d2446b92.mjs').then((m2) => m2.default || m2)
      },
      {
        name: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.name) ?? "my",
        path: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.path) ?? "",
        meta: __nuxt_page_meta$5 || {},
        alias: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.alias) || [],
        redirect: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.redirect) || void 0,
        component: () => import('./_nuxt/index-9285f131.mjs').then((m2) => m2.default || m2)
      },
      {
        name: "my-tips",
        path: "tips",
        meta: {},
        alias: [],
        redirect: void 0,
        component: () => import('./_nuxt/tips-11b2631b.mjs').then((m2) => m2.default || m2)
      }
    ],
    name: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.name) ?? void 0,
    meta: __nuxt_page_meta$4 || {},
    alias: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.alias) || [],
    redirect: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.redirect) || void 0,
    component: () => import('./_nuxt/my-8cfd5e46.mjs').then((m2) => m2.default || m2)
  },
  {
    name: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.name) ?? "news-article-articleSlug",
    path: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.path) ?? "/news/article/:articleSlug()",
    meta: __nuxt_page_meta$3 || {},
    alias: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.alias) || [],
    redirect: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.redirect) || void 0,
    component: () => import('./_nuxt/_articleSlug_-d43c18f4.mjs').then((m2) => m2.default || m2)
  },
  {
    name: "news-categories",
    path: "/news/categories",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/categories-02cf976f.mjs').then((m2) => m2.default || m2)
  },
  {
    name: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.name) ?? "news-category-categorySlug",
    path: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.path) ?? "/news/category/:categorySlug()",
    meta: __nuxt_page_meta$2 || {},
    alias: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.alias) || [],
    redirect: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.redirect) || void 0,
    component: () => import('./_nuxt/_categorySlug_-f6e5d02b.mjs').then((m2) => m2.default || m2)
  },
  {
    name: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.name) ?? "news-video-categorySlug",
    path: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.path) ?? "/news/video/:categorySlug()",
    meta: __nuxt_page_meta$1 || {},
    alias: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.alias) || [],
    redirect: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.redirect) || void 0,
    component: () => import('./_nuxt/_categorySlug_-eca25dc3.mjs').then((m2) => m2.default || m2)
  },
  {
    name: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.name) ?? "news-video",
    path: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.path) ?? "/news/video",
    meta: __nuxt_page_meta || {},
    alias: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.alias) || [],
    redirect: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.redirect) || void 0,
    component: () => import('./_nuxt/index-de4db2a3.mjs').then((m2) => m2.default || m2)
  }
];
function resolveUnref(r2) {
  return typeof r2 === "function" ? r2() : unref(r2);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r2) => resolveUnrefHeadInput(r2, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k2, v]) => {
        if (k2 === "titleTemplate" || k2.startsWith("on"))
          return [k2, unref(v)];
        return [k2, resolveUnrefHeadInput(v, k2)];
      })
    );
  }
  return root;
}
const Vue3 = version.startsWith("3");
const headSymbol = "usehead";
function injectHead() {
  return getCurrentInstance() && inject(headSymbol) || getActiveHead();
}
function vueInstall(head) {
  const plugin2 = {
    install(app) {
      if (Vue3) {
        app.config.globalProperties.$unhead = head;
        app.config.globalProperties.$head = head;
        app.provide(headSymbol, head);
      }
    }
  };
  return plugin2.install;
}
function createServerHead(options = {}) {
  const head = createServerHead$1({
    ...options,
    plugins: [
      VueReactiveUseHeadPlugin(),
      ...(options == null ? void 0 : options.plugins) || []
    ]
  });
  head.install = vueInstall(head);
  return head;
}
function VueReactiveUseHeadPlugin() {
  return defineHeadPlugin({
    hooks: {
      "entries:resolve": function(ctx) {
        for (const entry2 of ctx.entries)
          entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
      }
    }
  });
}
function clientUseHead(input, options = {}) {
  const head = injectHead();
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e2) => {
    entry2.patch(e2);
  });
  getCurrentInstance();
  return entry2;
}
function serverUseHead(input, options = {}) {
  const head = injectHead();
  return head.push(input, options);
}
function useHead(input, options = {}) {
  var _a;
  const head = injectHead();
  if (head) {
    const isBrowser = !!((_a = head.resolvedOptions) == null ? void 0 : _a.document);
    if (options.mode === "server" && isBrowser || options.mode === "client" && !isBrowser)
      return;
    return isBrowser ? clientUseHead(input, options) : serverUseHead(input, options);
  }
}
const coreComposableNames = [
  "injectHead"
];
({
  "@unhead/vue": [...coreComposableNames, ...composableNames]
});
const getDefault = () => null;
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  options.server = options.server ?? true;
  options.default = options.default ?? getDefault;
  options.lazy = options.lazy ?? false;
  options.immediate = options.immediate ?? true;
  const nuxt = /* @__PURE__ */ useNuxtApp();
  const getCachedData = () => nuxt.isHydrating ? nuxt.payload.data[key] : nuxt.static.data[key];
  const hasCachedData = () => getCachedData() !== void 0;
  if (!nuxt._asyncData[key]) {
    nuxt._asyncData[key] = {
      data: ref(getCachedData() ?? options.default()),
      pending: ref(!hasCachedData()),
      error: toRef(nuxt.payload._errors, key),
      status: ref("idle")
    };
  }
  const asyncData = { ...nuxt._asyncData[key] };
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    if (nuxt._asyncDataPromises[key]) {
      if (opts.dedupe === false) {
        return nuxt._asyncDataPromises[key];
      }
      nuxt._asyncDataPromises[key].cancelled = true;
    }
    if ((opts._initial || nuxt.isHydrating && opts._initial !== false) && hasCachedData()) {
      return getCachedData();
    }
    asyncData.pending.value = true;
    asyncData.status.value = "pending";
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxt));
        } catch (err) {
          reject(err);
        }
      }
    ).then((_result) => {
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      let result = _result;
      if (options.transform) {
        result = options.transform(_result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      asyncData.data.value = result;
      asyncData.error.value = null;
      asyncData.status.value = "success";
    }).catch((error) => {
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      asyncData.error.value = error;
      asyncData.data.value = unref(options.default());
      asyncData.status.value = "error";
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      nuxt.payload.data[key] = asyncData.data.value;
      if (asyncData.error.value) {
        nuxt.payload._errors[key] = createError(asyncData.error.value);
      }
      delete nuxt._asyncDataPromises[key];
    });
    nuxt._asyncDataPromises[key] = promise;
    return nuxt._asyncDataPromises[key];
  };
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxt.hook("app:created", () => promise);
    }
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function useRequestEvent(nuxtApp = /* @__PURE__ */ useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
function useRequestFetch() {
  var _a;
  const event = (_a = (/* @__PURE__ */ useNuxtApp()).ssrContext) == null ? void 0 : _a.event;
  return (event == null ? void 0 : event.$fetch) || globalThis.$fetch;
}
function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _key = opts.key || hash([autoKey, unref(opts.baseURL), typeof request === "string" ? request : "", unref(opts.params || opts.query)]);
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useFetch] key must be a string: " + _key);
  }
  if (!request) {
    throw new Error("[nuxt] [useFetch] request is missing.");
  }
  const key = _key === autoKey ? "$f" + _key : _key;
  const _request = computed(() => {
    let r2 = request;
    if (typeof r2 === "function") {
      r2 = r2();
    }
    return unref(r2);
  });
  if (!opts.baseURL && typeof _request.value === "string" && _request.value.startsWith("//")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    watch: watch2,
    immediate,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    immediate,
    watch: watch2 === false ? [] : [_fetchOptions, _request, ...watch2 || []]
  };
  let controller;
  const asyncData = useAsyncData(key, () => {
    var _a;
    (_a = controller == null ? void 0 : controller.abort) == null ? void 0 : _a.call(controller);
    controller = typeof AbortController !== "undefined" ? new AbortController() : {};
    const isLocalFetch = typeof _request.value === "string" && _request.value.startsWith("/");
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch && isLocalFetch) {
      _$fetch = useRequestFetch();
    }
    return _$fetch(_request.value, { signal: controller.signal, ..._fetchOptions });
  }, _asyncDataOptions);
  return asyncData;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a;
  const opts = { ...CookieDefaults, ..._opts };
  const cookies = readRawCookies(opts) || {};
  const cookie = ref(cookies[name] ?? ((_a = opts.default) == null ? void 0 : _a.call(opts)));
  {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const writeFinalCookieValue = () => {
      if (!isEqual(cookie.value, cookies[name])) {
        writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
      }
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  var _a;
  {
    return parse(((_a = useRequestEvent()) == null ? void 0 : _a.node.req.headers.cookie) || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const appPageTransition = { "name": "page" };
const appLayoutTransition = { "name": "layout" };
const appHead = { "meta": [{ "name": "viewport", "content": "width=device-width, initial-scale=1" }, { "charset": "utf-8" }], "link": [], "style": [], "script": [], "noscript": [] };
const appKeepalive = false;
function definePayloadReducer(name, reduce) {
  {
    (/* @__PURE__ */ useNuxtApp()).ssrContext._payloadReducers[name] = reduce;
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
/*! @__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  const resolveTrailingSlashBehavior = (to, resolve) => {
    if (!to || options.trailingSlash !== "append" && options.trailingSlash !== "remove") {
      return to;
    }
    const normalizeTrailingSlash = options.trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
    if (typeof to === "string") {
      return normalizeTrailingSlash(to, true);
    }
    const path = "path" in to ? to.path : resolve(to).path;
    return {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: normalizeTrailingSlash(path, true)
    };
  };
  return /* @__PURE__ */ defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        const path = props.to || props.href || "";
        return resolveTrailingSlashBehavior(path, router.resolve);
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, { acceptRelative: true });
      });
      const prefetched = ref(false);
      const el = void 0;
      const elRef = void 0;
      return () => {
        var _a, _b;
        if (!isExternal.value) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            if (prefetched.value) {
              routerLinkProps.class = props.prefetchedClass || options.prefetchedClass;
            }
            routerLinkProps.rel = props.rel;
          }
          return h$1(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const href = typeof to.value === "object" ? ((_a = router.resolve(to.value)) == null ? void 0 : _a.href) ?? null : to.value || null;
        const target = props.target || null;
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        const navigate = () => navigateTo(href, { replace: props.replace });
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href,
            navigate,
            get route() {
              if (!href) {
                return void 0;
              }
              const url = parseURL(href);
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                // stub properties for compat with vue-router
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href
              };
            },
            rel,
            target,
            isExternal: isExternal.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h$1("a", { ref: el, href, rel, target }, (_b = slots.default) == null ? void 0 : _b.call(slots));
      };
    }
  });
}
const __nuxt_component_0$3 = /* @__PURE__ */ defineNuxtLink({ componentName: "NuxtLink" });
function isObject(value) {
  return value !== null && typeof value === "object";
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isObject(value) && isObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p2, c2) => _defu(p2, c2, "", merger), {})
  );
}
const defuFn = createDefu((object, key, currentValue) => {
  if (typeof object[key] !== "undefined" && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});
const cfg0 = defineAppConfig({
  name: "BondingTechs 鍵結科技",
  link: "/"
});
const inlineConfig = {};
const __appConfig = /* @__PURE__ */ defuFn(cfg0, inlineConfig);
function useAppConfig() {
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  if (!nuxtApp._appConfig) {
    nuxtApp._appConfig = klona(__appConfig);
  }
  return nuxtApp._appConfig;
}
const routerOptions0 = {
  scrollBehavior: (to, from, savedPosition) => {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce("page:finish", async () => {
        await nextTick();
        setTimeout(() => {
          if (savedPosition)
            resolve(savedPosition);
          resolve({ top: 0 });
        }, 150);
      });
    });
  }
};
const routerOptions1 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    let position = savedPosition || void 0;
    if (!position && from && to && to.meta.scrollToTop !== false && _isDifferentRoute(from, to)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
function _isDifferentRoute(from, to) {
  const samePageComponent = to.matched.every((comp, index) => {
    var _a, _b, _c;
    return ((_a = comp.components) == null ? void 0 : _a.default) === ((_c = (_b = from.matched[index]) == null ? void 0 : _b.components) == null ? void 0 : _c.default);
  });
  if (!samePageComponent) {
    return true;
  }
  if (samePageComponent && JSON.stringify(from.params) !== JSON.stringify(to.params)) {
    return true;
  }
  return false;
}
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions1,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
});
const globalMiddleware = [
  validate
];
const namedMiddleware = {
  auth: () => import('./_nuxt/auth-ceed06c0.mjs')
};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    if (routerOptions.hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = ((_b = routerOptions.routes) == null ? void 0 : _b.call(routerOptions, _routes)) ?? _routes;
    let startPosition;
    const initialURL = nuxtApp.ssrContext.url;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        var _a2;
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
        return (_a2 = routerOptions.scrollBehavior) == null ? void 0 : _a2.call(routerOptions, to, START_LOCATION, startPosition || savedPosition);
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const _route = shallowRef(router.resolve(initialURL));
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key]
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const initialLayout = useState("_layout");
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout.value && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout.value;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          if (Array.isArray(componentMiddleware)) {
            for (const entry2 of componentMiddleware) {
              middlewareEntries.add(entry2);
            }
          } else {
            middlewareEntries.add(componentMiddleware);
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r2) => r2.default || r2)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(() => {
      delete nuxtApp._processingMiddleware;
    });
    router.afterEach(async (to, _from, failure) => {
      var _a2;
      delete nuxtApp._processingMiddleware;
      if ((failure == null ? void 0 : failure.type) === 4) {
        return;
      }
      if (to.matched.length === 0 && !((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        await nuxtApp.runWithContext(() => showError(createError$1({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`
        })));
      } else if (to.redirectedFrom && to.fullPath !== initialURL) {
        await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        await router.replace({
          ...router.resolve(initialURL),
          name: void 0,
          // #4920, #4982
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = {
  NuxtError: (data) => isNuxtError(data) && data.toJSON(),
  EmptyShallowRef: (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  EmptyRef: (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ShallowRef: (data) => isRef(data) && isShallow(data) && data.value,
  ShallowReactive: (data) => isReactive(data) && isShallow(data) && toRaw(data),
  Ref: (data) => isRef(data) && data.value,
  Reactive: (data) => isReactive(data) && toRaw(data)
};
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const reducer in reducers) {
      definePayloadReducer(reducer, reducers[reducer]);
    }
  }
});
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  setup(nuxtApp) {
    const createHead = createServerHead;
    const head = createHead();
    head.push(appHead);
    nuxtApp.vueApp.use(head);
    {
      nuxtApp.ssrContext.renderMeta = async () => {
        const meta = await renderSSRHead(head);
        return {
          ...meta,
          bodyScriptsPrepend: meta.bodyTagsOpen,
          // resolves naming difference with NuxtMeta and Unhead
          bodyScripts: meta.bodyTags
        };
      };
    }
  }
});
const plugin = {
  install: (app, options) => {
    app.provide("n-config-provider", {
      mergedThemeHashRef: computed(() => ""),
      mergedBreakpointsRef: computed(() => void 0),
      mergedRtlRef: computed(() => void 0),
      mergedIconsRef: computed(() => void 0),
      mergedComponentPropsRef: computed(() => void 0),
      mergedBorderedRef: computed(() => void 0),
      mergedNamespaceRef: computed(() => void 0),
      mergedClsPrefixRef: computed(() => void 0),
      mergedLocaleRef: computed(() => void 0),
      mergedDateLocaleRef: computed(() => void 0),
      mergedHljsRef: computed(() => void 0),
      mergedThemeRef: computed(() => void 0),
      mergedThemeOverridesRef: computed(() => options.themeOverrides),
      inlineThemeDisabled: false,
      preflightStyleDisabled: false
    });
  }
};
const config_hyx03WSFRE = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  var _a, _b;
  const config = (_b = (_a = /* @__PURE__ */ useRuntimeConfig()) == null ? void 0 : _a.public) == null ? void 0 : _b.naiveUI;
  if (config)
    nuxtApp.vueApp.use(plugin, config);
});
const ssrContextKey = Symbol("@css-render/vue3-ssr");
function setup(app) {
  const styles = [];
  const ssrContext = {
    styles,
    ids: /* @__PURE__ */ new Set()
  };
  app.provide(ssrContextKey, ssrContext);
  return {
    collect() {
      const res = styles.join("\n");
      styles.length = 0;
      return res;
    }
  };
}
const plugin_dUrdF0P1fL = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  setup(nuxtApp.vueApp);
  nuxtApp.hook("app:beforeMount", () => {
    const meta = document.createElement("meta");
    meta.name = "naive-ui-style";
    document.head.appendChild(meta);
  });
});
const isVue2 = false;
const preference = "system";
const plugin_server_XNCxeHyTuP = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const colorMode = useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
const unocss_MzCDxu9LMj = /* @__PURE__ */ defineNuxtPlugin(() => {
});
/*!
  * pinia v2.0.23
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject(o2) {
  return o2 && typeof o2 === "object" && Object.prototype.toString.call(o2) === "[object Object]" && typeof o2.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin2) => _p.push(plugin2));
        toBeInstalled = [];
      }
    },
    use(plugin2) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin2);
      } else {
        _p.push(plugin2);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentInstance()) {
    onUnmounted(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  }
  if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o2) {
  return !!(isRef(o2) && o2.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store2;
  function setup2() {
    if (!initialState && (!("production" !== "production") )) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store3 = pinia._s.get(id);
        return getters[name].call(store3, store3);
      }));
      return computedGetters;
    }, {}));
  }
  store2 = createSetupStore(id, setup2, options, pinia, hot, true);
  store2.$reset = function $reset() {
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  };
  return store2;
}
function createSetupStore($id, setup2, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  const $subscribeOptions = {
    deep: true
    // flush: 'post',
  };
  let isListening;
  let isSyncListening;
  let subscriptions = markRaw([]);
  let actionSubscriptions = markRaw([]);
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && (!("production" !== "production") )) {
    {
      pinia.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = noop;
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  function wrapAction(name, action) {
    return function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store: store2,
        after,
        onError
      });
      let ret;
      try {
        ret = action.apply(this && this.$id === $id ? this : store2, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
  }
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store2 = reactive(partialStore);
  pinia._s.set($id, store2);
  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup2());
  });
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = wrapAction(key, prop);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else ;
  }
  {
    assign(store2, setupStore);
    assign(toRaw(store2), setupStore);
  }
  Object.defineProperty(store2, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign(store2, scope.run(() => extender({
        store: store2,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store2.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store2;
}
function defineStore(idOrOptions, setup2, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup2 === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup2;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia, hot) {
    const currentInstance = getCurrentInstance();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (pinia) || currentInstance && inject(piniaSymbol);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup2, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store2 = pinia._s.get(id);
    return store2;
  }
  useStore.$id = id;
  return useStore;
}
function storeToRefs(store2) {
  {
    store2 = toRaw(store2);
    const refs = {};
    for (const key in store2) {
      const value = store2[key];
      if (isRef(value) || isReactive(value)) {
        refs[key] = // ---
        toRef(store2, key);
      }
    }
    return refs;
  }
}
const plugin_vue3_A0OWXRrUgq = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia);
  setActivePinia(pinia);
  {
    nuxtApp.payload.pinia = pinia.state.value;
  }
  return {
    provide: {
      pinia
    }
  };
});
const plugins = [
  plugin$1,
  revive_payload_server_eJ33V7gbc6,
  components_plugin_KR1HBZs4kY,
  unhead_KgADcZ0jPj,
  config_hyx03WSFRE,
  plugin_dUrdF0P1fL,
  plugin_server_XNCxeHyTuP,
  unocss_MzCDxu9LMj,
  plugin_vue3_A0OWXRrUgq
];
const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory({ ...removeUndefinedProps(props), ...ctx.attrs }, ctx));
  return () => {
    var _a, _b;
    return renderChild ? (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: [String, Object, Array],
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
const Html = /* @__PURE__ */ defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Html",
  inheritAttrs: false,
  props: {
    ...globalProps,
    manifest: String,
    version: String,
    xmlns: String,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
const Body = /* @__PURE__ */ defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Body",
  inheritAttrs: false,
  props: {
    ...globalProps,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "Anchor",
  __ssrInlineRender: true,
  props: {
    text: {
      type: String,
      default: ""
    },
    to: {
      type: [String, Object],
      default: void 0
    },
    href: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      if (__props.to) {
        _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
          tag: "a",
          to: __props.to,
          class: "transition-colors duration-300 dark:hover:text-white hover:text-gray-900 hover:underline"
        }, _attrs), {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                _push2(`${ssrInterpolate(__props.text)}`);
              }, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default", {}, () => [
                  createTextVNode(toDisplayString(__props.text), 1)
                ])
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<a${ssrRenderAttrs(mergeProps({
          class: "transition-colors duration-300 dark:hover:text-white hover:text-gray-900 hover:underline",
          href: __props.href
        }, _attrs))}>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, () => {
          _push(`${ssrInterpolate(__props.text)}`);
        }, _push, _parent);
        _push(`</a>`);
      }
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Anchor.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const defaultStyle$2 = `
  cursor-pointer
  border transition-color duration-300
  focus:outline-none focus:ring-1 focus:ring-offset-1 focus:dark:ring-offset-gray-50 focus:dark:ring-gray-400 focus:ring-gray-600/[0.6] focus:ring-offset-gray-800/[0.6]
  flex items-center justify-center
`;
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    text: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "primary"
    },
    size: {
      type: String,
      default: "md"
    },
    to: {
      type: [String, Object],
      default: void 0
    },
    href: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const styles = reactive({
      primary: "text-white bg-gray-800 hover:bg-white hover:text-gray-800 hover:border-gray-900 dark:text-gray-800 dark:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:border-white",
      secondary: "text-gray-800 bg-white hover:border-gray-900  dark:border-gray-900 dark:text-white dark:bg-gray-800 dark:hover:border-white"
    });
    const sizes = reactive({
      lg: "h-12 px-8 text-lg rounded-lg",
      md: "h-10 px-6 text-base rounded",
      sm: "h-8 px-4 text-sm rounded",
      xs: "h-6 px-3 text-xs rounded"
    });
    const selectedStyle = computed(() => styles[props.type] || styles.primary);
    const selectedSize = computed(() => sizes[props.size] || sizes.lg);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      if (__props.to) {
        _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
          tag: "a",
          to: __props.to,
          class: `${defaultStyle$2} ${unref(selectedStyle)} ${unref(selectedSize)}`
        }, _attrs), {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                _push2(`${ssrInterpolate(__props.text)}`);
              }, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default", {}, () => [
                  createTextVNode(toDisplayString(__props.text), 1)
                ])
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<a${ssrRenderAttrs(mergeProps({
          class: `${defaultStyle$2} ${unref(selectedStyle)} ${unref(selectedSize)}`,
          href: __props.href
        }, _attrs))}>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, () => {
          _push(`${ssrInterpolate(__props.text)}`);
        }, _push, _parent);
        _push(`</a>`);
      }
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Button.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$q = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@unocss/nuxt/runtime/UnoIcon.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["ssrRender", _sfc_ssrRender$1]]);
function u(r2, n2, ...a2) {
  if (r2 in n2) {
    let e2 = n2[r2];
    return typeof e2 == "function" ? e2(...a2) : e2;
  }
  let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t2, u), t2;
}
var R = ((o2) => (o2[o2.None = 0] = "None", o2[o2.RenderStrategy = 1] = "RenderStrategy", o2[o2.Static = 2] = "Static", o2))(R || {}), O$1 = ((e2) => (e2[e2.Unmount = 0] = "Unmount", e2[e2.Hidden = 1] = "Hidden", e2))(O$1 || {});
function P({ visible: r2 = true, features: t2 = 0, ourProps: e2, theirProps: o2, ...i }) {
  var a2;
  let n2 = k(o2, e2), s2 = Object.assign(i, { props: n2 });
  if (r2 || t2 & 2 && n2.static)
    return p$1(s2);
  if (t2 & 1) {
    let l2 = (a2 = n2.unmount) == null || a2 ? 0 : 1;
    return u(l2, { [0]() {
      return null;
    }, [1]() {
      return p$1({ ...i, props: { ...n2, hidden: true, style: { display: "none" } } });
    } });
  }
  return p$1(s2);
}
function p$1({ props: r2, attrs: t2, slots: e2, slot: o2, name: i }) {
  var y2;
  let { as: n2, ...s2 } = w$1(r2, ["unmount", "static"]), a2 = (y2 = e2.default) == null ? void 0 : y2.call(e2, o2), l2 = {};
  if (o2) {
    let d2 = false, u2 = [];
    for (let [f2, c2] of Object.entries(o2))
      typeof c2 == "boolean" && (d2 = true), c2 === true && u2.push(f2);
    d2 && (l2["data-headlessui-state"] = u2.join(" "));
  }
  if (n2 === "template") {
    if (a2 = g$1(a2 != null ? a2 : []), Object.keys(s2).length > 0 || Object.keys(t2).length > 0) {
      let [d2, ...u2] = a2 != null ? a2 : [];
      if (!x$1(d2) || u2.length > 0)
        throw new Error(['Passing props on "template"!', "", `The current component <${i} /> is rendering a "template".`, "However we need to passthrough the following props:", Object.keys(s2).concat(Object.keys(t2)).sort((f2, c2) => f2.localeCompare(c2)).map((f2) => `  - ${f2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".', "Render a single element as the child so that we can forward the props onto that element."].map((f2) => `  - ${f2}`).join(`
`)].join(`
`));
      return cloneVNode(d2, Object.assign({}, s2, l2));
    }
    return Array.isArray(a2) && a2.length === 1 ? a2[0] : a2;
  }
  return h$1(n2, Object.assign({}, s2, l2), { default: () => a2 });
}
function g$1(r2) {
  return r2.flatMap((t2) => t2.type === Fragment ? g$1(t2.children) : [t2]);
}
function k(...r2) {
  if (r2.length === 0)
    return {};
  if (r2.length === 1)
    return r2[0];
  let t2 = {}, e2 = {};
  for (let i of r2)
    for (let n2 in i)
      n2.startsWith("on") && typeof i[n2] == "function" ? (e2[n2] != null || (e2[n2] = []), e2[n2].push(i[n2])) : t2[n2] = i[n2];
  if (t2.disabled || t2["aria-disabled"])
    return Object.assign(t2, Object.fromEntries(Object.keys(e2).map((i) => [i, void 0])));
  for (let i in e2)
    Object.assign(t2, { [i](n2, ...s2) {
      let a2 = e2[i];
      for (let l2 of a2) {
        if (n2 instanceof Event && n2.defaultPrevented)
          return;
        l2(n2, ...s2);
      }
    } });
  return t2;
}
function V$1(r2) {
  let t2 = Object.assign({}, r2);
  for (let e2 in t2)
    t2[e2] === void 0 && delete t2[e2];
  return t2;
}
function w$1(r2, t2 = []) {
  let e2 = Object.assign({}, r2);
  for (let o2 of t2)
    o2 in e2 && delete e2[o2];
  return e2;
}
function x$1(r2) {
  return r2 == null ? false : typeof r2.type == "string" || typeof r2.type == "object" || typeof r2.type == "function";
}
let e$1 = 0;
function n$1() {
  return ++e$1;
}
function t() {
  return n$1();
}
var o$1 = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o$1 || {});
function f$3(r2) {
  throw new Error("Unexpected object: " + r2);
}
var a$1 = ((e2) => (e2[e2.First = 0] = "First", e2[e2.Previous = 1] = "Previous", e2[e2.Next = 2] = "Next", e2[e2.Last = 3] = "Last", e2[e2.Specific = 4] = "Specific", e2[e2.Nothing = 5] = "Nothing", e2))(a$1 || {});
function x(r2, n2) {
  let t2 = n2.resolveItems();
  if (t2.length <= 0)
    return null;
  let l2 = n2.resolveActiveIndex(), s2 = l2 != null ? l2 : -1, d2 = (() => {
    switch (r2.focus) {
      case 0:
        return t2.findIndex((e2) => !n2.resolveDisabled(e2));
      case 1: {
        let e2 = t2.slice().reverse().findIndex((i, c2, u2) => s2 !== -1 && u2.length - c2 - 1 >= s2 ? false : !n2.resolveDisabled(i));
        return e2 === -1 ? e2 : t2.length - 1 - e2;
      }
      case 2:
        return t2.findIndex((e2, i) => i <= s2 ? false : !n2.resolveDisabled(e2));
      case 3: {
        let e2 = t2.slice().reverse().findIndex((i) => !n2.resolveDisabled(i));
        return e2 === -1 ? e2 : t2.length - 1 - e2;
      }
      case 4:
        return t2.findIndex((e2) => n2.resolveId(e2) === r2.id);
      case 5:
        return null;
      default:
        f$3(r2);
    }
  })();
  return d2 === -1 ? l2 : d2;
}
function o(n2) {
  var l2;
  return n2 == null || n2.value == null ? null : (l2 = n2.value.$el) != null ? l2 : n2.value;
}
let n = Symbol("Context");
var l$1 = ((e2) => (e2[e2.Open = 0] = "Open", e2[e2.Closed = 1] = "Closed", e2))(l$1 || {});
function f$2() {
  return p() !== null;
}
function p() {
  return inject(n, null);
}
function c(o2) {
  provide(n, o2);
}
function r(t2, e2) {
  if (t2)
    return t2;
  let n2 = e2 != null ? e2 : "button";
  if (typeof n2 == "string" && n2.toLowerCase() === "button")
    return "button";
}
function b$1(t2, e2) {
  let n2 = ref(r(t2.value.type, t2.value.as));
  return onMounted(() => {
    n2.value = r(t2.value.type, t2.value.as);
  }), watchEffect(() => {
    var o$12;
    n2.value || !o(e2) || o(e2) instanceof HTMLButtonElement && !((o$12 = o(e2)) != null && o$12.hasAttribute("type")) && (n2.value = "button");
  }), n2;
}
function m$2(r2) {
  return null;
}
let m$1 = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e2) => `${e2}:not([tabindex='-1'])`).join(",");
var M = ((n2) => (n2[n2.First = 1] = "First", n2[n2.Previous = 2] = "Previous", n2[n2.Next = 4] = "Next", n2[n2.Last = 8] = "Last", n2[n2.WrapAround = 16] = "WrapAround", n2[n2.NoScroll = 32] = "NoScroll", n2))(M || {}), N = ((o2) => (o2[o2.Error = 0] = "Error", o2[o2.Overflow = 1] = "Overflow", o2[o2.Success = 2] = "Success", o2[o2.Underflow = 3] = "Underflow", o2))(N || {}), b = ((r2) => (r2[r2.Previous = -1] = "Previous", r2[r2.Next = 1] = "Next", r2))(b || {});
var F$2 = ((r2) => (r2[r2.Strict = 0] = "Strict", r2[r2.Loose = 1] = "Loose", r2))(F$2 || {});
function h(e2, t2 = 0) {
  var r2;
  return e2 === ((r2 = m$2()) == null ? void 0 : r2.body) ? false : u(t2, { [0]() {
    return e2.matches(m$1);
  }, [1]() {
    let l2 = e2;
    for (; l2 !== null; ) {
      if (l2.matches(m$1))
        return true;
      l2 = l2.parentElement;
    }
    return false;
  } });
}
function O(e2, t2 = (r2) => r2) {
  return e2.slice().sort((r2, l2) => {
    let o2 = t2(r2), s2 = t2(l2);
    if (o2 === null || s2 === null)
      return 0;
    let n2 = o2.compareDocumentPosition(s2);
    return n2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function y(f2, m2, i = computed(() => true)) {
  ref(null);
}
var a = ((e2) => (e2[e2.None = 1] = "None", e2[e2.Focusable = 2] = "Focusable", e2[e2.Hidden = 4] = "Hidden", e2))(a || {});
let f$1 = defineComponent({ name: "Hidden", props: { as: { type: [Object, String], default: "div" }, features: { type: Number, default: 1 } }, setup(r2, { slots: t2, attrs: d2 }) {
  return () => {
    let { features: e2, ...o2 } = r2, n2 = { "aria-hidden": (e2 & 2) === 2 ? true : void 0, style: { position: "fixed", top: 1, left: 1, width: 1, height: 0, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", ...(e2 & 4) === 4 && (e2 & 2) !== 2 && { display: "none" } } };
    return P({ ourProps: n2, theirProps: o2, slot: {}, attrs: d2, slots: t2, name: "Hidden" });
  };
} });
function e(n2 = {}, r2 = null, t2 = []) {
  for (let [i, o2] of Object.entries(n2))
    f(t2, s$1(r2, i), o2);
  return t2;
}
function s$1(n2, r2) {
  return n2 ? n2 + "[" + r2 + "]" : r2;
}
function f(n2, r2, t2) {
  if (Array.isArray(t2))
    for (let [i, o2] of t2.entries())
      f(n2, s$1(r2, i.toString()), o2);
  else
    t2 instanceof Date ? n2.push([r2, t2.toISOString()]) : typeof t2 == "boolean" ? n2.push([r2, t2 ? "1" : "0"]) : typeof t2 == "string" ? n2.push([r2, t2]) : typeof t2 == "number" ? n2.push([r2, `${t2}`]) : t2 == null ? n2.push([r2, ""]) : e(t2, r2, n2);
}
function d$2(u2, e2, r2) {
  let i = ref(r2 == null ? void 0 : r2.value), f2 = computed(() => u2.value !== void 0);
  return [computed(() => f2.value ? u2.value : i.value), function(t2) {
    return f2.value || (i.value = t2), e2 == null ? void 0 : e2(t2);
  }];
}
function s() {
  let a2 = [], i = [], t2 = { enqueue(e2) {
    i.push(e2);
  }, addEventListener(e2, n2, o2, r2) {
    return e2.addEventListener(n2, o2, r2), t2.add(() => e2.removeEventListener(n2, o2, r2));
  }, requestAnimationFrame(...e2) {
    let n2 = requestAnimationFrame(...e2);
    t2.add(() => cancelAnimationFrame(n2));
  }, nextFrame(...e2) {
    t2.requestAnimationFrame(() => {
      t2.requestAnimationFrame(...e2);
    });
  }, setTimeout(...e2) {
    let n2 = setTimeout(...e2);
    t2.add(() => clearTimeout(n2));
  }, add(e2) {
    a2.push(e2);
  }, dispose() {
    for (let e2 of a2.splice(0))
      e2();
  }, async workQueue() {
    for (let e2 of i.splice(0))
      await e2();
  } };
  return t2;
}
function ue$1(o2, m2) {
  return o2 === m2;
}
var re = ((l2) => (l2[l2.Open = 0] = "Open", l2[l2.Closed = 1] = "Closed", l2))(re || {}), se$1 = ((l2) => (l2[l2.Single = 0] = "Single", l2[l2.Multi = 1] = "Multi", l2))(se$1 || {}), de = ((l2) => (l2[l2.Pointer = 0] = "Pointer", l2[l2.Other = 1] = "Other", l2))(de || {});
function fe$1(o2) {
  requestAnimationFrame(() => requestAnimationFrame(o2));
}
let H = Symbol("ListboxContext");
function V(o2) {
  let m2 = inject(H, null);
  if (m2 === null) {
    let l2 = new Error(`<${o2} /> is missing a parent <Listbox /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(l2, V), l2;
  }
  return m2;
}
let Me = defineComponent({ name: "Listbox", emits: { "update:modelValue": (o2) => true }, props: { as: { type: [Object, String], default: "template" }, disabled: { type: [Boolean], default: false }, by: { type: [String, Function], default: () => ue$1 }, horizontal: { type: [Boolean], default: false }, modelValue: { type: [Object, String, Number, Boolean], default: void 0 }, defaultValue: { type: [Object, String, Number, Boolean], default: void 0 }, name: { type: String, optional: true }, multiple: { type: [Boolean], default: false } }, inheritAttrs: false, setup(o$12, { slots: m2, attrs: l2, emit: L2 }) {
  let e$12 = ref(1), p2 = ref(null), s2 = ref(null), O$12 = ref(null), d2 = ref([]), S = ref(""), t2 = ref(null), i = ref(1);
  function k2(a2 = (n2) => n2) {
    let n2 = t2.value !== null ? d2.value[t2.value] : null, u2 = O(a2(d2.value.slice()), (y2) => o(y2.dataRef.domRef)), c2 = n2 ? u2.indexOf(n2) : null;
    return c2 === -1 && (c2 = null), { options: u2, activeOptionIndex: c2 };
  }
  let h$2 = computed(() => o$12.multiple ? 1 : 0), [w2, r2] = d$2(computed(() => o$12.modelValue), (a2) => L2("update:modelValue", a2), computed(() => o$12.defaultValue)), f2 = { listboxState: e$12, value: w2, mode: h$2, compare(a2, n2) {
    if (typeof o$12.by == "string") {
      let u2 = o$12.by;
      return (a2 == null ? void 0 : a2[u2]) === (n2 == null ? void 0 : n2[u2]);
    }
    return o$12.by(a2, n2);
  }, orientation: computed(() => o$12.horizontal ? "horizontal" : "vertical"), labelRef: p2, buttonRef: s2, optionsRef: O$12, disabled: computed(() => o$12.disabled), options: d2, searchQuery: S, activeOptionIndex: t2, activationTrigger: i, closeListbox() {
    o$12.disabled || e$12.value !== 1 && (e$12.value = 1, t2.value = null);
  }, openListbox() {
    o$12.disabled || e$12.value !== 0 && (e$12.value = 0);
  }, goToOption(a2, n2, u2) {
    if (o$12.disabled || e$12.value === 1)
      return;
    let c2 = k2(), y2 = x(a2 === a$1.Specific ? { focus: a$1.Specific, id: n2 } : { focus: a2 }, { resolveItems: () => c2.options, resolveActiveIndex: () => c2.activeOptionIndex, resolveId: (T) => T.id, resolveDisabled: (T) => T.dataRef.disabled });
    S.value = "", t2.value = y2, i.value = u2 != null ? u2 : 1, d2.value = c2.options;
  }, search(a2) {
    if (o$12.disabled || e$12.value === 1)
      return;
    let u2 = S.value !== "" ? 0 : 1;
    S.value += a2.toLowerCase();
    let y2 = (t2.value !== null ? d2.value.slice(t2.value + u2).concat(d2.value.slice(0, t2.value + u2)) : d2.value).find((A) => A.dataRef.textValue.startsWith(S.value) && !A.dataRef.disabled), T = y2 ? d2.value.indexOf(y2) : -1;
    T === -1 || T === t2.value || (t2.value = T, i.value = 1);
  }, clearSearch() {
    o$12.disabled || e$12.value !== 1 && S.value !== "" && (S.value = "");
  }, registerOption(a2, n2) {
    let u2 = k2((c2) => [...c2, { id: a2, dataRef: n2 }]);
    d2.value = u2.options, t2.value = u2.activeOptionIndex;
  }, unregisterOption(a2) {
    let n2 = k2((u2) => {
      let c2 = u2.findIndex((y2) => y2.id === a2);
      return c2 !== -1 && u2.splice(c2, 1), u2;
    });
    d2.value = n2.options, t2.value = n2.activeOptionIndex, i.value = 1;
  }, select(a2) {
    o$12.disabled || r2(u(h$2.value, { [0]: () => a2, [1]: () => {
      let n2 = toRaw(f2.value.value).slice(), u2 = toRaw(a2), c2 = n2.findIndex((y2) => f2.compare(u2, toRaw(y2)));
      return c2 === -1 ? n2.push(u2) : n2.splice(c2, 1), n2;
    } }));
  } };
  return y([s2, O$12], (a2, n2) => {
    var u2;
    f2.closeListbox(), h(n2, F$2.Loose) || (a2.preventDefault(), (u2 = o(s2)) == null || u2.focus());
  }, computed(() => e$12.value === 0)), provide(H, f2), c(computed(() => u(e$12.value, { [0]: l$1.Open, [1]: l$1.Closed }))), () => {
    let { name: a$12, modelValue: n2, disabled: u2, ...c2 } = o$12, y2 = { open: e$12.value === 0, disabled: u2, value: w2.value };
    return h$1(Fragment, [...a$12 != null && w2.value != null ? e({ [a$12]: w2.value }).map(([T, A]) => h$1(f$1, V$1({ features: a.Hidden, key: T, as: "input", type: "hidden", hidden: true, readOnly: true, name: T, value: A }))) : [], P({ ourProps: {}, theirProps: { ...l2, ...w$1(c2, ["defaultValue", "onUpdate:modelValue", "horizontal", "multiple", "by"]) }, slot: y2, slots: m2, attrs: l2, name: "Listbox" })]);
  };
} }), Pe = defineComponent({ name: "ListboxLabel", props: { as: { type: [Object, String], default: "label" } }, setup(o$12, { attrs: m2, slots: l2 }) {
  let L2 = V("ListboxLabel"), e2 = `headlessui-listbox-label-${t()}`;
  function p2() {
    var s2;
    (s2 = o(L2.buttonRef)) == null || s2.focus({ preventScroll: true });
  }
  return () => {
    let s2 = { open: L2.listboxState.value === 0, disabled: L2.disabled.value }, O2 = { id: e2, ref: L2.labelRef, onClick: p2 };
    return P({ ourProps: O2, theirProps: o$12, slot: s2, attrs: m2, slots: l2, name: "ListboxLabel" });
  };
} }), Ie = defineComponent({ name: "ListboxButton", props: { as: { type: [Object, String], default: "button" } }, setup(o$2, { attrs: m2, slots: l2, expose: L2 }) {
  let e2 = V("ListboxButton"), p2 = `headlessui-listbox-button-${t()}`;
  L2({ el: e2.buttonRef, $el: e2.buttonRef });
  function s2(t2) {
    switch (t2.key) {
      case o$1.Space:
      case o$1.Enter:
      case o$1.ArrowDown:
        t2.preventDefault(), e2.openListbox(), nextTick(() => {
          var i;
          (i = o(e2.optionsRef)) == null || i.focus({ preventScroll: true }), e2.value.value || e2.goToOption(a$1.First);
        });
        break;
      case o$1.ArrowUp:
        t2.preventDefault(), e2.openListbox(), nextTick(() => {
          var i;
          (i = o(e2.optionsRef)) == null || i.focus({ preventScroll: true }), e2.value.value || e2.goToOption(a$1.Last);
        });
        break;
    }
  }
  function O2(t2) {
    switch (t2.key) {
      case o$1.Space:
        t2.preventDefault();
        break;
    }
  }
  function d2(t2) {
    e2.disabled.value || (e2.listboxState.value === 0 ? (e2.closeListbox(), nextTick(() => {
      var i;
      return (i = o(e2.buttonRef)) == null ? void 0 : i.focus({ preventScroll: true });
    })) : (t2.preventDefault(), e2.openListbox(), fe$1(() => {
      var i;
      return (i = o(e2.optionsRef)) == null ? void 0 : i.focus({ preventScroll: true });
    })));
  }
  let S = b$1(computed(() => ({ as: o$2.as, type: m2.type })), e2.buttonRef);
  return () => {
    var k2, h2;
    let t2 = { open: e2.listboxState.value === 0, disabled: e2.disabled.value, value: e2.value.value }, i = { ref: e2.buttonRef, id: p2, type: S.value, "aria-haspopup": true, "aria-controls": (k2 = o(e2.optionsRef)) == null ? void 0 : k2.id, "aria-expanded": e2.disabled.value ? void 0 : e2.listboxState.value === 0, "aria-labelledby": e2.labelRef.value ? [(h2 = o(e2.labelRef)) == null ? void 0 : h2.id, p2].join(" ") : void 0, disabled: e2.disabled.value === true ? true : void 0, onKeydown: s2, onKeyup: O2, onClick: d2 };
    return P({ ourProps: i, theirProps: o$2, slot: t2, attrs: m2, slots: l2, name: "ListboxButton" });
  };
} }), Ve = defineComponent({ name: "ListboxOptions", props: { as: { type: [Object, String], default: "ul" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(o$2, { attrs: m2, slots: l2, expose: L2 }) {
  let e2 = V("ListboxOptions"), p$12 = `headlessui-listbox-options-${t()}`, s2 = ref(null);
  L2({ el: e2.optionsRef, $el: e2.optionsRef });
  function O2(t2) {
    switch (s2.value && clearTimeout(s2.value), t2.key) {
      case o$1.Space:
        if (e2.searchQuery.value !== "")
          return t2.preventDefault(), t2.stopPropagation(), e2.search(t2.key);
      case o$1.Enter:
        if (t2.preventDefault(), t2.stopPropagation(), e2.activeOptionIndex.value !== null) {
          let i = e2.options.value[e2.activeOptionIndex.value];
          e2.select(i.dataRef.value);
        }
        e2.mode.value === 0 && (e2.closeListbox(), nextTick(() => {
          var i;
          return (i = o(e2.buttonRef)) == null ? void 0 : i.focus({ preventScroll: true });
        }));
        break;
      case u(e2.orientation.value, { vertical: o$1.ArrowDown, horizontal: o$1.ArrowRight }):
        return t2.preventDefault(), t2.stopPropagation(), e2.goToOption(a$1.Next);
      case u(e2.orientation.value, { vertical: o$1.ArrowUp, horizontal: o$1.ArrowLeft }):
        return t2.preventDefault(), t2.stopPropagation(), e2.goToOption(a$1.Previous);
      case o$1.Home:
      case o$1.PageUp:
        return t2.preventDefault(), t2.stopPropagation(), e2.goToOption(a$1.First);
      case o$1.End:
      case o$1.PageDown:
        return t2.preventDefault(), t2.stopPropagation(), e2.goToOption(a$1.Last);
      case o$1.Escape:
        t2.preventDefault(), t2.stopPropagation(), e2.closeListbox(), nextTick(() => {
          var i;
          return (i = o(e2.buttonRef)) == null ? void 0 : i.focus({ preventScroll: true });
        });
        break;
      case o$1.Tab:
        t2.preventDefault(), t2.stopPropagation();
        break;
      default:
        t2.key.length === 1 && (e2.search(t2.key), s2.value = setTimeout(() => e2.clearSearch(), 350));
        break;
    }
  }
  let d2 = p(), S = computed(() => d2 !== null ? d2.value === l$1.Open : e2.listboxState.value === 0);
  return () => {
    var h2, w2, r2, f2;
    let t2 = { open: e2.listboxState.value === 0 }, i = { "aria-activedescendant": e2.activeOptionIndex.value === null || (h2 = e2.options.value[e2.activeOptionIndex.value]) == null ? void 0 : h2.id, "aria-multiselectable": e2.mode.value === 1 ? true : void 0, "aria-labelledby": (f2 = (w2 = o(e2.labelRef)) == null ? void 0 : w2.id) != null ? f2 : (r2 = o(e2.buttonRef)) == null ? void 0 : r2.id, "aria-orientation": e2.orientation.value, id: p$12, onKeydown: O2, role: "listbox", tabIndex: 0, ref: e2.optionsRef };
    return P({ ourProps: i, theirProps: o$2, slot: t2, attrs: m2, slots: l2, features: R.RenderStrategy | R.Static, visible: S.value, name: "ListboxOptions" });
  };
} }), Ae = defineComponent({ name: "ListboxOption", props: { as: { type: [Object, String], default: "li" }, value: { type: [Object, String, Number, Boolean] }, disabled: { type: Boolean, default: false } }, setup(o$12, { slots: m2, attrs: l2, expose: L2 }) {
  let e2 = V("ListboxOption"), p2 = `headlessui-listbox-option-${t()}`, s2 = ref(null);
  L2({ el: s2, $el: s2 });
  let O2 = computed(() => e2.activeOptionIndex.value !== null ? e2.options.value[e2.activeOptionIndex.value].id === p2 : false), d2 = computed(() => u(e2.mode.value, { [0]: () => e2.compare(toRaw(e2.value.value), toRaw(o$12.value)), [1]: () => toRaw(e2.value.value).some((r2) => e2.compare(toRaw(r2), toRaw(o$12.value))) })), S = computed(() => u(e2.mode.value, { [1]: () => {
    var f2;
    let r2 = toRaw(e2.value.value);
    return ((f2 = e2.options.value.find((a2) => r2.some((n2) => e2.compare(toRaw(n2), toRaw(a2.dataRef.value))))) == null ? void 0 : f2.id) === p2;
  }, [0]: () => d2.value })), t$1 = computed(() => ({ disabled: o$12.disabled, value: o$12.value, textValue: "", domRef: s2 }));
  onMounted(() => {
    var f2, a2;
    let r2 = (a2 = (f2 = o(s2)) == null ? void 0 : f2.textContent) == null ? void 0 : a2.toLowerCase().trim();
    r2 !== void 0 && (t$1.value.textValue = r2);
  }), onMounted(() => e2.registerOption(p2, t$1)), onUnmounted(() => e2.unregisterOption(p2)), onMounted(() => {
    watch([e2.listboxState, d2], () => {
      e2.listboxState.value === 0 && (!d2.value || u(e2.mode.value, { [1]: () => {
        S.value && e2.goToOption(a$1.Specific, p2);
      }, [0]: () => {
        e2.goToOption(a$1.Specific, p2);
      } }));
    }, { immediate: true });
  }), watchEffect(() => {
    e2.listboxState.value === 0 && (!O2.value || e2.activationTrigger.value !== 0 && nextTick(() => {
      var r2, f2;
      return (f2 = (r2 = o(s2)) == null ? void 0 : r2.scrollIntoView) == null ? void 0 : f2.call(r2, { block: "nearest" });
    }));
  });
  function i(r2) {
    if (o$12.disabled)
      return r2.preventDefault();
    e2.select(o$12.value), e2.mode.value === 0 && (e2.closeListbox(), nextTick(() => {
      var f2;
      return (f2 = o(e2.buttonRef)) == null ? void 0 : f2.focus({ preventScroll: true });
    }));
  }
  function k2() {
    if (o$12.disabled)
      return e2.goToOption(a$1.Nothing);
    e2.goToOption(a$1.Specific, p2);
  }
  function h2() {
    o$12.disabled || O2.value || e2.goToOption(a$1.Specific, p2, 0);
  }
  function w2() {
    o$12.disabled || !O2.value || e2.goToOption(a$1.Nothing);
  }
  return () => {
    let { disabled: r2 } = o$12, f2 = { active: O2.value, selected: d2.value, disabled: r2 }, a2 = { id: p2, ref: s2, role: "option", tabIndex: r2 === true ? void 0 : -1, "aria-disabled": r2 === true ? true : void 0, "aria-selected": d2.value, disabled: void 0, onClick: i, onFocus: k2, onPointermove: h2, onMousemove: h2, onPointerleave: w2, onMouseleave: w2 };
    return P({ ourProps: a2, theirProps: w$1(o$12, ["value", "disabled"]), slot: f2, attrs: l2, slots: m2, name: "ListboxOption" });
  };
} });
function l(r2) {
  let e2 = { called: false };
  return (...t2) => {
    if (!e2.called)
      return e2.called = true, r2(...t2);
  };
}
function m(e2, ...t2) {
  e2 && t2.length > 0 && e2.classList.add(...t2);
}
function d$1(e2, ...t2) {
  e2 && t2.length > 0 && e2.classList.remove(...t2);
}
var g = ((i) => (i.Finished = "finished", i.Cancelled = "cancelled", i))(g || {});
function F$1(e2, t2) {
  let i = s();
  if (!e2)
    return i.dispose;
  let { transitionDuration: n2, transitionDelay: a2 } = getComputedStyle(e2), [l2, s$12] = [n2, a2].map((o2) => {
    let [u2 = 0] = o2.split(",").filter(Boolean).map((r2) => r2.includes("ms") ? parseFloat(r2) : parseFloat(r2) * 1e3).sort((r2, c2) => c2 - r2);
    return u2;
  });
  return l2 !== 0 ? i.setTimeout(() => t2("finished"), l2 + s$12) : t2("finished"), i.add(() => t2("cancelled")), i.dispose;
}
function L(e2, t2, i, n2, a2, l$12) {
  let s$12 = s(), o2 = l$12 !== void 0 ? l(l$12) : () => {
  };
  return d$1(e2, ...a2), m(e2, ...t2, ...i), s$12.nextFrame(() => {
    d$1(e2, ...i), m(e2, ...n2), s$12.add(F$1(e2, (u2) => (d$1(e2, ...n2, ...t2), m(e2, ...a2), o2(u2))));
  }), s$12.add(() => d$1(e2, ...t2, ...i, ...n2, ...a2)), s$12.add(() => o2("cancelled")), s$12.dispose;
}
function d(e2 = "") {
  return e2.split(" ").filter((t2) => t2.trim().length > 1);
}
let B = Symbol("TransitionContext");
var ae = ((a2) => (a2.Visible = "visible", a2.Hidden = "hidden", a2))(ae || {});
function le() {
  return inject(B, null) !== null;
}
function ie() {
  let e2 = inject(B, null);
  if (e2 === null)
    throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
  return e2;
}
function se() {
  let e2 = inject(F, null);
  if (e2 === null)
    throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
  return e2;
}
let F = Symbol("NestingContext");
function w(e2) {
  return "children" in e2 ? w(e2.children) : e2.value.filter(({ state: t2 }) => t2 === "visible").length > 0;
}
function K(e2) {
  let t2 = ref([]), a2 = ref(false);
  onMounted(() => a2.value = true), onUnmounted(() => a2.value = false);
  function s2(r2, n2 = O$1.Hidden) {
    let l2 = t2.value.findIndex(({ id: i }) => i === r2);
    l2 !== -1 && (u(n2, { [O$1.Unmount]() {
      t2.value.splice(l2, 1);
    }, [O$1.Hidden]() {
      t2.value[l2].state = "hidden";
    } }), !w(t2) && a2.value && (e2 == null || e2()));
  }
  function v(r2) {
    let n2 = t2.value.find(({ id: l2 }) => l2 === r2);
    return n2 ? n2.state !== "visible" && (n2.state = "visible") : t2.value.push({ id: r2, state: "visible" }), () => s2(r2, O$1.Unmount);
  }
  return { children: t2, register: v, unregister: s2 };
}
let _ = R.RenderStrategy, oe = defineComponent({ props: { as: { type: [Object, String], default: "div" }, show: { type: [Boolean], default: null }, unmount: { type: [Boolean], default: true }, appear: { type: [Boolean], default: false }, enter: { type: [String], default: "" }, enterFrom: { type: [String], default: "" }, enterTo: { type: [String], default: "" }, entered: { type: [String], default: "" }, leave: { type: [String], default: "" }, leaveFrom: { type: [String], default: "" }, leaveTo: { type: [String], default: "" } }, emits: { beforeEnter: () => true, afterEnter: () => true, beforeLeave: () => true, afterLeave: () => true }, setup(e2, { emit: t$1, attrs: a2, slots: s2, expose: v }) {
  if (!le() && f$2())
    return () => h$1(fe, { ...e2, onBeforeEnter: () => t$1("beforeEnter"), onAfterEnter: () => t$1("afterEnter"), onBeforeLeave: () => t$1("beforeLeave"), onAfterLeave: () => t$1("afterLeave") }, s2);
  let r2 = ref(null), n2 = ref("visible"), l2 = computed(() => e2.unmount ? O$1.Unmount : O$1.Hidden);
  v({ el: r2, $el: r2 });
  let { show: i, appear: x2 } = ie(), { register: g$12, unregister: p2 } = se(), R2 = { value: true }, m2 = t(), S = { value: false }, N2 = K(() => {
    S.value || (n2.value = "hidden", p2(m2), t$1("afterLeave"));
  });
  onMounted(() => {
    let o2 = g$12(m2);
    onUnmounted(o2);
  }), watchEffect(() => {
    if (l2.value === O$1.Hidden && !!m2) {
      if (i && n2.value !== "visible") {
        n2.value = "visible";
        return;
      }
      u(n2.value, { ["hidden"]: () => p2(m2), ["visible"]: () => g$12(m2) });
    }
  });
  let k2 = d(e2.enter), $ = d(e2.enterFrom), q = d(e2.enterTo), O2 = d(e2.entered), z = d(e2.leave), G = d(e2.leaveFrom), J = d(e2.leaveTo);
  onMounted(() => {
    watchEffect(() => {
      if (n2.value === "visible") {
        let o$12 = o(r2);
        if (o$12 instanceof Comment && o$12.data === "")
          throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
      }
    });
  });
  function Q(o$12) {
    let c2 = R2.value && !x2.value, u2 = o(r2);
    !u2 || !(u2 instanceof HTMLElement) || c2 || (S.value = true, i.value && t$1("beforeEnter"), i.value || t$1("beforeLeave"), o$12(i.value ? L(u2, k2, $, q, O2, (C) => {
      S.value = false, C === g.Finished && t$1("afterEnter");
    }) : L(u2, z, G, J, O2, (C) => {
      S.value = false, C === g.Finished && (w(N2) || (n2.value = "hidden", p2(m2), t$1("afterLeave")));
    })));
  }
  return onMounted(() => {
    watch([i], (o2, c2, u2) => {
      Q(u2), R2.value = false;
    }, { immediate: true });
  }), provide(F, N2), c(computed(() => u(n2.value, { ["visible"]: l$1.Open, ["hidden"]: l$1.Closed }))), () => {
    let { appear: o2, show: c2, enter: u2, enterFrom: C, enterTo: de2, entered: ve, leave: pe, leaveFrom: me, leaveTo: Te, ...W } = e2;
    return P({ theirProps: W, ourProps: { ref: r2 }, slot: {}, slots: s2, attrs: a2, features: _, visible: n2.value === "visible", name: "TransitionChild" });
  };
} }), ue = oe, fe = defineComponent({ inheritAttrs: false, props: { as: { type: [Object, String], default: "div" }, show: { type: [Boolean], default: null }, unmount: { type: [Boolean], default: true }, appear: { type: [Boolean], default: false }, enter: { type: [String], default: "" }, enterFrom: { type: [String], default: "" }, enterTo: { type: [String], default: "" }, entered: { type: [String], default: "" }, leave: { type: [String], default: "" }, leaveFrom: { type: [String], default: "" }, leaveTo: { type: [String], default: "" } }, emits: { beforeEnter: () => true, afterEnter: () => true, beforeLeave: () => true, afterLeave: () => true }, setup(e2, { emit: t2, attrs: a2, slots: s2 }) {
  let v = p(), r2 = computed(() => e2.show === null && v !== null ? u(v.value, { [l$1.Open]: true, [l$1.Closed]: false }) : e2.show);
  watchEffect(() => {
    if (![true, false].includes(r2.value))
      throw new Error('A <Transition /> is used but it is missing a `:show="true | false"` prop.');
  });
  let n2 = ref(r2.value ? "visible" : "hidden"), l2 = K(() => {
    n2.value = "hidden";
  }), i = ref(true), x2 = { show: r2, appear: computed(() => e2.appear || !i.value) };
  return onMounted(() => {
    watchEffect(() => {
      i.value = false, r2.value ? n2.value = "visible" : w(l2) || (n2.value = "hidden");
    });
  }), provide(F, l2), provide(B, x2), () => {
    let g2 = w$1(e2, ["show", "appear", "unmount", "onBeforeEnter", "onBeforeLeave", "onAfterEnter", "onAfterLeave"]), p2 = { unmount: e2.unmount };
    return P({ ourProps: { ...p2, as: "template" }, theirProps: {}, slot: {}, slots: { ...s2, default: () => [h$1(ue, { onBeforeEnter: () => t2("beforeEnter"), onAfterEnter: () => t2("afterEnter"), onBeforeLeave: () => t2("beforeLeave"), onAfterLeave: () => t2("afterLeave"), ...a2, ...p2, ...g2 }, s2.default)] }, attrs: {}, features: _, visible: n2.value === "visible", name: "Transition" });
  };
} });
const availableSizes = {
  sm: {
    name: "小",
    iso: "14px"
  },
  md: {
    name: "中",
    iso: "16px"
  },
  lg: {
    name: "大",
    iso: "18px"
  },
  xl: {
    name: "超大",
    iso: "20px"
  }
};
function sizeController() {
  const sizeUserSetting = useCookie("size");
  if (!sizeUserSetting.value)
    sizeUserSetting.value = "16px";
  const getUserSize = () => sizeUserSetting.value;
  const sizeSetting = useState("size.setting", () => getUserSize());
  watch(sizeSetting, (val) => {
    sizeUserSetting.value = val;
    document.documentElement.style.fontSize = sizeSetting.value;
  });
  const init = () => {
    sizeSetting.value = getUserSize();
    if (sizeSetting.value)
      document.documentElement.style.fontSize = sizeSetting.value;
  };
  return {
    sizeSetting,
    init
  };
}
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "SizeChange",
  __ssrInlineRender: true,
  props: {
    type: {
      type: String,
      default: "dropdown-right-top"
    }
  },
  setup(__props) {
    const props = __props;
    const currentStyle = toRef(props, "type");
    const sizeSetting = useState("size.setting");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center" }, _attrs))}>`);
      if (unref(currentStyle) === "dropdown-right-top") {
        _push(ssrRenderComponent(unref(Me), {
          modelValue: unref(sizeSetting),
          "onUpdate:modelValue": ($event) => isRef(sizeSetting) ? sizeSetting.value = $event : null,
          as: "div",
          class: "relative flex items-center"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Pe), { class: "sr-only" }, {
                default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Theme `);
                  } else {
                    return [
                      createTextVNode(" Theme ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(Ie), {
                type: "button",
                class: "flex w-7 h-7 items-center justify-center",
                title: "更改文字大小"
              }, {
                default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="flex items-center justify-center"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UnoIcon, { class: "i-octicon-text-size" }, null, _parent3, _scopeId2));
                    _push3(`</span>`);
                  } else {
                    return [
                      createVNode("span", { class: "flex items-center justify-center" }, [
                        createVNode(_component_UnoIcon, { class: "i-octicon-text-size" })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(Ve), { class: "absolute mt-3 ring-1 ring-black ring-opacity-5 top-full right-0 z-20 mt-2 w-40 overflow-hidden rounded-sm bg-white text-sm font-semibold text-gray-700 shadow-md shadow-gray-300/[0.2] outline-none dark:bg-gray-800 dark:text-white dark:shadow-gray-500/[0.2] dark:ring-0" }, {
                default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(unref(availableSizes), (size) => {
                      _push3(ssrRenderComponent(unref(Ae), {
                        key: size.iso,
                        value: size.iso,
                        class: ["flex w-full cursor-pointer items-center justify-between py-2 px-3", {
                          "text-white-500 bg-gray-200 dark:bg-gray-500/50": unref(sizeSetting) === size.iso,
                          "hover:bg-gray-200 dark:hover:bg-gray-700/30": unref(sizeSetting) !== size.iso
                        }]
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<span class="flex-1 truncate flex w-full items-center justify-between"${_scopeId3}><p${_scopeId3}>${ssrInterpolate(size.name)}</p><span class="text-xs"${_scopeId3}>(${ssrInterpolate(size.iso)})</span></span>`);
                          } else {
                            return [
                              createVNode("span", { class: "flex-1 truncate flex w-full items-center justify-between" }, [
                                createVNode("p", null, toDisplayString(size.name), 1),
                                createVNode("span", { class: "text-xs" }, "(" + toDisplayString(size.iso) + ")", 1)
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(availableSizes), (size) => {
                        return openBlock(), createBlock(unref(Ae), {
                          key: size.iso,
                          value: size.iso,
                          class: ["flex w-full cursor-pointer items-center justify-between py-2 px-3", {
                            "text-white-500 bg-gray-200 dark:bg-gray-500/50": unref(sizeSetting) === size.iso,
                            "hover:bg-gray-200 dark:hover:bg-gray-700/30": unref(sizeSetting) !== size.iso
                          }]
                        }, {
                          default: withCtx(() => [
                            createVNode("span", { class: "flex-1 truncate flex w-full items-center justify-between" }, [
                              createVNode("p", null, toDisplayString(size.name), 1),
                              createVNode("span", { class: "text-xs" }, "(" + toDisplayString(size.iso) + ")", 1)
                            ])
                          ]),
                          _: 2
                        }, 1032, ["value", "class"]);
                      }), 128))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Pe), { class: "sr-only" }, {
                  default: withCtx(() => [
                    createTextVNode(" Theme ")
                  ]),
                  _: 1
                }),
                createVNode(unref(Ie), {
                  type: "button",
                  class: "flex w-7 h-7 items-center justify-center",
                  title: "更改文字大小"
                }, {
                  default: withCtx(() => [
                    createVNode("span", { class: "flex items-center justify-center" }, [
                      createVNode(_component_UnoIcon, { class: "i-octicon-text-size" })
                    ])
                  ]),
                  _: 1
                }),
                createVNode(unref(Ve), { class: "absolute mt-3 ring-1 ring-black ring-opacity-5 top-full right-0 z-20 mt-2 w-40 overflow-hidden rounded-sm bg-white text-sm font-semibold text-gray-700 shadow-md shadow-gray-300/[0.2] outline-none dark:bg-gray-800 dark:text-white dark:shadow-gray-500/[0.2] dark:ring-0" }, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(availableSizes), (size) => {
                      return openBlock(), createBlock(unref(Ae), {
                        key: size.iso,
                        value: size.iso,
                        class: ["flex w-full cursor-pointer items-center justify-between py-2 px-3", {
                          "text-white-500 bg-gray-200 dark:bg-gray-500/50": unref(sizeSetting) === size.iso,
                          "hover:bg-gray-200 dark:hover:bg-gray-700/30": unref(sizeSetting) !== size.iso
                        }]
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { class: "flex-1 truncate flex w-full items-center justify-between" }, [
                            createVNode("p", null, toDisplayString(size.name), 1),
                            createVNode("span", { class: "text-xs" }, "(" + toDisplayString(size.iso) + ")", 1)
                          ])
                        ]),
                        _: 2
                      }, 1032, ["value", "class"]);
                    }), 128))
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(currentStyle) === "select-box") {
        _push(`<select class="w-full px-2 pr-3 py-1 outline-none rounded border bg-transparent text-gray-700 dark:text-gray-300 border-gray-900/10 dark:border-gray-50/[0.2]"><!--[-->`);
        ssrRenderList(unref(availableSizes), (size) => {
          _push(`<option${ssrRenderAttr("value", size.iso)} class="flex items-center space-x-2">${ssrInterpolate(size.name)} (${ssrInterpolate(size.iso)}) </option>`);
        });
        _push(`<!--]--></select>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tem/SizeChange.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const useColorMode = () => {
  return useState("color-mode").value;
};
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "ThemeChange",
  __ssrInlineRender: true,
  setup(__props) {
    useColorMode();
    const availableColor = ref([
      {
        id: 1,
        name: "dark",
        text: "深色模式",
        icon: "i-ph-moon-stars-duotone"
      },
      {
        id: 2,
        name: "light",
        text: "淺色模式",
        icon: "i-ph-sun-dim-duotone"
      },
      // {
      //   id: 3,
      //   name: 'sepia',
      //   text: '護眼模式',
      //   icon: 'i-ph-coffee',
      // },
      {
        id: 4,
        name: "system",
        text: "根據系統設定",
        icon: "i-ph-laptop-duotone"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(unref(Me), {
        modelValue: _ctx.$colorMode.preference,
        "onUpdate:modelValue": ($event) => _ctx.$colorMode.preference = $event,
        as: "div",
        class: "relative flex items-center"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Pe), { class: "sr-only" }, {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Theme `);
                } else {
                  return [
                    createTextVNode(" Theme ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Ie), {
              type: "button",
              title: "Change Color"
            }, {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex w-7 h-7 items-center justify-center"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UnoIcon, { class: "i-ph-palette-duotone text-lg dark:text-white" }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex w-7 h-7 items-center justify-center" }, [
                      createVNode(_component_UnoIcon, { class: "i-ph-palette-duotone text-lg dark:text-white" })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Ve), { class: "absolute mt-3 ring-1 ring-black ring-opacity-5 top-full right-0 z-20 mt-2 w-40 overflow-hidden rounded-sm bg-white text-sm font-semibold text-gray-700 shadow-md shadow-gray-300/[0.2] outline-none dark:bg-gray-800 dark:text-white dark:shadow-gray-500/[0.2] dark:ring-0" }, {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(unref(availableColor), (color) => {
                    _push3(ssrRenderComponent(unref(Ae), {
                      key: color.id,
                      value: color.name,
                      class: "flex w-full cursor-pointer items-center justify-between py-2 px-3"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<span class="truncate"${_scopeId3}>${ssrInterpolate(color.text)}</span><span class="flex items-center justify-center text-sm"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_UnoIcon, {
                            class: [color.icon, "text-base"]
                          }, null, _parent4, _scopeId3));
                          _push4(`</span>`);
                        } else {
                          return [
                            createVNode("span", { class: "truncate" }, toDisplayString(color.text), 1),
                            createVNode("span", { class: "flex items-center justify-center text-sm" }, [
                              createVNode(_component_UnoIcon, {
                                class: [color.icon, "text-base"]
                              }, null, 8, ["class"])
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(availableColor), (color) => {
                      return openBlock(), createBlock(unref(Ae), {
                        key: color.id,
                        value: color.name,
                        class: "flex w-full cursor-pointer items-center justify-between py-2 px-3"
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { class: "truncate" }, toDisplayString(color.text), 1),
                          createVNode("span", { class: "flex items-center justify-center text-sm" }, [
                            createVNode(_component_UnoIcon, {
                              class: [color.icon, "text-base"]
                            }, null, 8, ["class"])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["value"]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Pe), { class: "sr-only" }, {
                default: withCtx(() => [
                  createTextVNode(" Theme ")
                ]),
                _: 1
              }),
              createVNode(unref(Ie), {
                type: "button",
                title: "Change Color"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex w-7 h-7 items-center justify-center" }, [
                    createVNode(_component_UnoIcon, { class: "i-ph-palette-duotone text-lg dark:text-white" })
                  ])
                ]),
                _: 1
              }),
              createVNode(unref(Ve), { class: "absolute mt-3 ring-1 ring-black ring-opacity-5 top-full right-0 z-20 mt-2 w-40 overflow-hidden rounded-sm bg-white text-sm font-semibold text-gray-700 shadow-md shadow-gray-300/[0.2] outline-none dark:bg-gray-800 dark:text-white dark:shadow-gray-500/[0.2] dark:ring-0" }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(availableColor), (color) => {
                    return openBlock(), createBlock(unref(Ae), {
                      key: color.id,
                      value: color.name,
                      class: "flex w-full cursor-pointer items-center justify-between py-2 px-3"
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "truncate" }, toDisplayString(color.text), 1),
                        createVNode("span", { class: "flex items-center justify-center text-sm" }, [
                          createVNode(_component_UnoIcon, {
                            class: [color.icon, "text-base"]
                          }, null, 8, ["class"])
                        ])
                      ]),
                      _: 2
                    }, 1032, ["value"]);
                  }), 128))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tem/ThemeChange.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _imports_0$1 = "" + __publicAssetsURL("user.png");
const storage = {
  // 后缀标识
  suffix: "_deadtime",
  /**
   * 获取
   * @param {string} key 關鍵字
   */
  get(key) {
    return store.get(key);
  },
  /**
   * 获取全部
   */
  info() {
    const d2 = {};
    store.each((value, key) => {
      d2[key] = value;
    });
    return d2;
  },
  /**
   * 设置
   * @param {string} key 關鍵字
   * @param {*} value 值
   * @param {number} expires 过期时间
   */
  set(key, value, expires) {
    store.set(key, value);
    if (expires) {
      store.set(
        `${key}${this.suffix}`,
        Date.parse(String(/* @__PURE__ */ new Date())) + expires * 1e3
      );
    }
  },
  /**
   * 是否过期
   * @param {string} key 關鍵字
   */
  isExpired(key) {
    return (this.getExpiration(key) || 0) - Date.parse(String(/* @__PURE__ */ new Date())) <= 2e3;
  },
  /**
   * 获取到期时间
   * @param {string} key 關鍵字
   */
  getExpiration(key) {
    return this.get(key + this.suffix);
  },
  /**
   * 移除
   * @param {string} key 關鍵字
   */
  remove(key) {
    store.remove(key);
    this.removeExpiration(key);
  },
  /**
   * 移除到期时间
   * @param {string} key 關鍵字
   */
  removeExpiration(key) {
    store.remove(key + this.suffix);
  },
  /**
   * 清理
   */
  clearAll() {
    store.clearAll();
  }
};
const fetchConfig = {
  baseURL: "/api"
};
function useGetFetchOptions(options = {}) {
  options.baseURL = options.baseURL ?? fetchConfig.baseURL;
  options.headers = options.headers ?? {};
  options.initialCache = options.initialCache ?? false;
  options.lazy = options.lazy ?? false;
  options.async = options.async ?? false;
  options.body = { ...options.body, server: true };
  if (options.multipart) {
    options.headers = {
      ...options.headers,
      "Accept": "*/*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      "Access-Control-Allow-Headers": "origin,X-Requested-With,content-type,accept",
      "Access-Control-Allow-Credentials": "true"
    };
    delete options.headers["Content-Type"];
  }
  const { user } = useBaseStore();
  const { token: tokenStore } = storeToRefs(user);
  const token = tokenStore.value || storage.get("token");
  if (token)
    options.headers.Authorization = token;
  else
    delete options.headers.Authorization;
  return options;
}
async function useHttp(key, url, options = {}) {
  options = useGetFetchOptions(options);
  options.key = key;
  if (options.async) {
    const res2 = await useAsyncData(
      key,
      () => $fetch(fetchConfig.baseURL + url, { ...options }),
      "$8HXlY3lqR9"
    );
    return { ...res2 };
  }
  if (options.$) {
    const data = ref(null);
    const error = ref(null);
    return await $fetch(url, options).then((res2) => {
      data.value = res2.data;
      return {
        data,
        error
      };
    }).catch((err) => {
      var _a;
      const msg = (_a = err == null ? void 0 : err.data) == null ? void 0 : _a.data;
      error.value = msg;
      return {
        data,
        error
      };
    });
  }
  const res = await useFetch(url, {
    ...options,
    onRequest({ options: options2 }) {
      return useGetFetchOptions(options2);
    },
    // 相當於響應攔截器
    transform: (res2) => {
      return res2.data;
    }
  }, "$Nbwy13v9tA");
  return res;
}
function useHttpPost(key, url, options = {}) {
  options.method = "POST";
  return useHttp(key, url, options);
}
async function useHttpFetch(url, options = {}) {
  options = useGetFetchOptions(options);
  const {
    error,
    code,
    message = "",
    data = null
  } = await $fetch(fetchConfig.baseURL + url, { ...options });
  if (error && code === 1005) {
    const router = useRouter();
    router.push("/");
  }
  return {
    code,
    error,
    message,
    data
  };
}
function useHttpFetchPost(url, options = {}) {
  options.method = "POST";
  return useHttpFetch(url, options);
}
const phoneRegex = /^09\d{8}$/;
const emailRegex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
const idCardRegex = /^[A-Z]+[0-9]{9}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const htmlTag = /<[^>]*>/g;
function getTodayExpired() {
  const current = /* @__PURE__ */ new Date();
  const full = 24 * 60 * 60;
  const hours = current.getHours();
  const minutes = current.getMinutes();
  const seconds = current.getSeconds();
  const total = hours * 60 + minutes * 60 + seconds;
  return full - total;
}
const useTipStore = defineStore("tip", () => {
  const info = ref(null);
  const storageName = "tip";
  function detect() {
    const todayTip = storage.get(storageName);
    return !todayTip || storage.isExpired(storageName);
  }
  async function get() {
    if (!detect())
      return;
    try {
      const tip = await useHttpFetchPost("/tip/today");
      const { data, error } = tip;
      if (!error) {
        const $show = useState("tip.show", () => false);
        const $tip = useState("tip.data");
        $show.value = true;
        $tip.value = {
          id: data.id,
          title: data.title,
          content: data.content,
          publishDate: data.publishDate
        };
        set2(data);
        return data;
      }
    } catch (e2) {
    }
  }
  function set2(value) {
    info.value = value;
    storage.set(storageName, 1, getTodayExpired());
  }
  function clear() {
    storage.remove("today_tip");
    info.value = {};
  }
  return {
    info,
    get,
    set: set2,
    clear
  };
});
const useUserStore = defineStore("user", () => {
  const token = ref("");
  function setToken(data) {
    token.value = data.token;
    storage.set("token", data.token, data.expire);
    storage.set("refreshToken", data.refreshToken, data.refreshExpire);
  }
  const isLogin = ref(false);
  async function refreshToken(token2) {
    try {
      const { data, error } = await useHttpFetchPost("/auth/refresh", {
        body: { refreshToken: token2 }
      });
      if (!error) {
        setToken(data);
        await get();
      }
    } catch (e2) {
      logout();
    }
  }
  const info = ref(null);
  async function get() {
    const { code, error, data } = await useHttpFetchPost("/user/person");
    if (error) {
      if (code === 1005) {
        const storeRefreshToken = storage.get("refreshToken");
        await refreshToken(storeRefreshToken);
      } else {
        clear();
      }
    } else if (!error) {
      set2(data);
    }
    return data;
  }
  function set2(value) {
    isLogin.value = true;
    info.value = value;
    storage.set("userInfo", value);
  }
  async function update(form) {
    const $alert = useState("alert");
    const updatePick = (({ firstName, lastName, birthday, gender, intro }) => ({
      firstName,
      lastName,
      birthday,
      gender,
      intro
    }))(info.value);
    if (JSON.stringify(form) === JSON.stringify(updatePick)) {
      return $alert.value = {
        type: "info",
        text: "未修改個人資料",
        center: true
      };
    }
    const $loading = useState("loading");
    $loading.value = true;
    const { error, message } = await useHttpFetchPost("/user/update", {
      body: {
        firstName: form.firstName,
        lastName: form.lastName,
        birthday: form.birthday,
        gender: form.gender,
        intro: form.intro
      }
    });
    $loading.value = false;
    if (error)
      return $alert.value = { type: "error", text: message, center: true };
    updateField({
      firstName: form.firstName,
      lastName: form.lastName,
      birthday: form.birthday,
      gender: form.gender,
      intro: form.intro
    });
    $alert.value = { type: "success", text: "個人資料已更新", center: true };
  }
  function updateField(obj) {
    for (const key in obj)
      info.value[key] = obj[key];
    storage.set("userInfo", info.value);
  }
  async function login(loginForm) {
    const { data, error, message } = await useHttpFetchPost(
      "/auth/login",
      {
        body: {
          phone: loginForm.phone,
          password: loginForm.password
        }
      }
    );
    const $alert = useState("alert");
    const $auth = useState("showAuth", () => false);
    if (error && message) {
      $alert.value = { type: "error", text: message, center: true };
    } else {
      $auth.value = false;
      await setToken(data);
      await get();
      const tip = useTipStore();
      await tip.get();
      $alert.value = { type: "success", title: "登入成功" };
      if (loginForm.rememberMe)
        storage.set("loginData", loginForm);
      else
        storage.remove("loginData");
    }
  }
  async function register(registerForm) {
    const $alert = useState("alert");
    if (!passwordRegex.test(registerForm.password)) {
      return $alert.value = {
        type: "error",
        text: "密碼須為英數混合8位數以上",
        center: true
      };
    }
    const { error, message, data } = await useHttpFetchPost("/auth/register", {
      body: {
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        birthday: registerForm.birthday,
        phone: registerForm.phone,
        password: registerForm.password,
        gender: registerForm.gender,
        passwordConfirm: registerForm.passwordConfirm,
        verifyCode: registerForm.verifyCode
      }
    });
    const $auth = useState("showAuth", () => false);
    if (error && message) {
      $alert.value = { type: "error", text: message, center: true };
    } else {
      $auth.value = false;
      await setToken(data);
      await get();
      const tip = useTipStore();
      await tip.get();
      $alert.value = { type: "success", title: "登入成功" };
      if (data.rememberMe)
        storage.set("loginData", data);
      else
        storage.remove("loginData");
    }
    if (error) {
      const $alert2 = useState("alert");
      $alert2.value = {
        type: "error",
        title: "驗證錯誤",
        text: message,
        center: true
      };
    }
    return { error, message, data };
  }
  async function forgot(forgotForm) {
    const $alert = useState("alert");
    if (!passwordRegex.test(forgotForm.password)) {
      return $alert.value = {
        type: "error",
        text: "密碼須為英數混合8位數以上",
        center: true
      };
    }
    const { error, message, data } = await useHttpFetchPost("/auth/forgot", {
      body: {
        phone: forgotForm.phone,
        password: forgotForm.password,
        passwordConfirm: forgotForm.passwordConfirm,
        verifyCode: forgotForm.verifyCode
      }
    });
    const $auth = useState("showAuth", () => false);
    if (error && message) {
      $alert.value = { type: "error", text: message, center: true };
    } else {
      $auth.value = false;
      await setToken(data);
      await get();
      $alert.value = { type: "success", title: "修改成功，已登入" };
      if (data.rememberMe)
        storage.set("loginData", forgotForm);
      else
        storage.remove("loginData");
    }
    if (error) {
      const $alert2 = useState("alert");
      $alert2.value = {
        type: "error",
        title: "驗證錯誤",
        text: message,
        center: true
      };
    }
    return { error, message, data };
  }
  async function logout() {
    const $alert = useState("alert");
    await useHttpFetchPost("/user/logout");
    $alert.value = {
      type: "success",
      title: "登出成功"
    };
    clear();
  }
  async function clear() {
    return await new Promise((resolve) => {
      storage.remove("userInfo");
      storage.remove("token");
      storage.remove("tip");
      storage.remove("tip_deadtime");
      const isLoginState = useState("isLogin");
      isLoginState.value = false;
      isLogin.value = false;
      info.value = null;
      token.value = "";
      const route = useRoute();
      const router = useRouter();
      const middleware = route.meta.middleware ?? [];
      if (middleware && middleware.includes("auth"))
        router.push("/");
      resolve("");
    });
  }
  return {
    token,
    info,
    isLogin,
    get,
    set: set2,
    update,
    updateField,
    login,
    register,
    forgot,
    logout,
    clear,
    setToken,
    refreshToken
  };
});
function useBaseStore() {
  const user = useUserStore();
  const tip = useTipStore();
  return {
    // app,
    // process,
    user,
    tip
  };
}
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "User",
  __ssrInlineRender: true,
  props: {
    type: {
      type: String,
      default: "dropdown-right-top"
    }
  },
  setup(__props) {
    const props = __props;
    const router = useRouter();
    const { user } = useBaseStore();
    const { info, isLogin } = storeToRefs(user);
    const showAuth = useState("showAuth", () => false);
    const userMenu = ref([
      { id: 1, icon: "i-uil-user", label: "個人資料", path: "/my/account" },
      { id: 2, icon: "i-uil-file-alt", label: "瀏覽紀錄", path: "/my/history" },
      { id: 3, icon: "i-ion-heart-outline", label: "我的收藏", path: "/my/collections" },
      { id: 4, icon: "i-uil-lightbulb-alt", label: "小知識", path: "/my/tips" },
      { id: 5, icon: "i-uil-sign-out-alt", label: "登出", action: () => user.logout() }
    ]);
    const clickNav = (id) => {
      const item = userMenu.value.find((item2) => item2.id === id);
      if (item == null ? void 0 : item.path)
        router.push(item.path);
      else if (item == null ? void 0 : item.action)
        item.action();
    };
    const currentStyle = toRef(props, "type");
    const sizeSetting = useState("size.setting");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center relative" }, _attrs))}>`);
      if (unref(currentStyle) === "dropdown-right-top") {
        _push(ssrRenderComponent(unref(Me), {
          modelValue: unref(sizeSetting),
          "onUpdate:modelValue": ($event) => isRef(sizeSetting) ? sizeSetting.value = $event : null,
          as: "div",
          class: "flex items-center"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Pe), { class: "sr-only" }, {
                default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` 用戶 `);
                  } else {
                    return [
                      createTextVNode(" 用戶 ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(Ie), {
                class: "block",
                type: "button",
                title: "用戶中心"
              }, {
                default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                  var _a, _b, _c, _d;
                  if (_push3) {
                    if (unref(isLogin)) {
                      _push3(`<div class="flex items-center justify-center cursor-pointer"${_scopeId2}><img class="w-6 h-6 rounded-full"${ssrRenderAttr("src", _imports_0$1)}${_scopeId2}><span class="ml-2 text-sm font-semibold"${_scopeId2}>${ssrInterpolate(`${((_a = unref(info)) == null ? void 0 : _a.firstName) || ""}${((_b = unref(info)) == null ? void 0 : _b.lastName) || ""}`)}</span>`);
                      _push3(ssrRenderComponent(_component_UnoIcon, { class: "i-uil-angle-down" }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<div class="flex items-center justify-center h-full cursor-pointer"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_UnoIcon, { class: "i-ph-user-circle w-6 h-6" }, null, _parent3, _scopeId2));
                      _push3(`<span class="ml-2 text-sm font-semibold"${_scopeId2}>未登入</span>`);
                      _push3(ssrRenderComponent(_component_UnoIcon, { class: "i-uil-angle-down" }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    }
                  } else {
                    return [
                      unref(isLogin) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center justify-center cursor-pointer"
                      }, [
                        createVNode("img", {
                          class: "w-6 h-6 rounded-full",
                          src: _imports_0$1
                        }),
                        createVNode("span", { class: "ml-2 text-sm font-semibold" }, toDisplayString(`${((_c = unref(info)) == null ? void 0 : _c.firstName) || ""}${((_d = unref(info)) == null ? void 0 : _d.lastName) || ""}`), 1),
                        createVNode(_component_UnoIcon, { class: "i-uil-angle-down" })
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex items-center justify-center h-full cursor-pointer",
                        onClick: ($event) => showAuth.value = true
                      }, [
                        createVNode(_component_UnoIcon, { class: "i-ph-user-circle w-6 h-6" }),
                        createVNode("span", { class: "ml-2 text-sm font-semibold" }, "未登入"),
                        createVNode(_component_UnoIcon, { class: "i-uil-angle-down" })
                      ], 8, ["onClick"]))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (unref(isLogin)) {
                _push2(ssrRenderComponent(unref(Ve), { class: "absolute ring-1 ring-black mt-3 ring-opacity-5 top-full right-0 z-[999] mt-2 w-32 overflow-hidden rounded-sm bg-white text-sm font-semibold text-gray-700 shadow-md shadow-gray-300/[0.2] outline-none dark:bg-gray-800 dark:text-white dark:shadow-gray-500/[0.2] dark:ring-0" }, {
                  default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<!--[-->`);
                      ssrRenderList(unref(userMenu), (menu, index) => {
                        _push3(ssrRenderComponent(unref(Ae), { key: index }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`<div class="flex items-center w-full cursor-pointer items-center py-2 px-3 hover:bg-gray-200 dark:hover:bg-gray-700/30"${_scopeId3}>`);
                              _push4(ssrRenderComponent(_component_UnoIcon, {
                                class: [menu.icon, "mr-3"]
                              }, null, _parent4, _scopeId3));
                              _push4(`<span class="truncate"${_scopeId3}>${ssrInterpolate(menu.label)}</span></div>`);
                            } else {
                              return [
                                createVNode("div", {
                                  class: "flex items-center w-full cursor-pointer items-center py-2 px-3 hover:bg-gray-200 dark:hover:bg-gray-700/30",
                                  onClick: ($event) => clickNav(menu.id)
                                }, [
                                  createVNode(_component_UnoIcon, {
                                    class: [menu.icon, "mr-3"]
                                  }, null, 8, ["class"]),
                                  createVNode("span", { class: "truncate" }, toDisplayString(menu.label), 1)
                                ], 8, ["onClick"])
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      });
                      _push3(`<!--]-->`);
                    } else {
                      return [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(userMenu), (menu, index) => {
                          return openBlock(), createBlock(unref(Ae), { key: index }, {
                            default: withCtx(() => [
                              createVNode("div", {
                                class: "flex items-center w-full cursor-pointer items-center py-2 px-3 hover:bg-gray-200 dark:hover:bg-gray-700/30",
                                onClick: ($event) => clickNav(menu.id)
                              }, [
                                createVNode(_component_UnoIcon, {
                                  class: [menu.icon, "mr-3"]
                                }, null, 8, ["class"]),
                                createVNode("span", { class: "truncate" }, toDisplayString(menu.label), 1)
                              ], 8, ["onClick"])
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode(unref(Pe), { class: "sr-only" }, {
                  default: withCtx(() => [
                    createTextVNode(" 用戶 ")
                  ]),
                  _: 1
                }),
                createVNode(unref(Ie), {
                  class: "block",
                  type: "button",
                  title: "用戶中心"
                }, {
                  default: withCtx(() => {
                    var _a, _b;
                    return [
                      unref(isLogin) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center justify-center cursor-pointer"
                      }, [
                        createVNode("img", {
                          class: "w-6 h-6 rounded-full",
                          src: _imports_0$1
                        }),
                        createVNode("span", { class: "ml-2 text-sm font-semibold" }, toDisplayString(`${((_a = unref(info)) == null ? void 0 : _a.firstName) || ""}${((_b = unref(info)) == null ? void 0 : _b.lastName) || ""}`), 1),
                        createVNode(_component_UnoIcon, { class: "i-uil-angle-down" })
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex items-center justify-center h-full cursor-pointer",
                        onClick: ($event) => showAuth.value = true
                      }, [
                        createVNode(_component_UnoIcon, { class: "i-ph-user-circle w-6 h-6" }),
                        createVNode("span", { class: "ml-2 text-sm font-semibold" }, "未登入"),
                        createVNode(_component_UnoIcon, { class: "i-uil-angle-down" })
                      ], 8, ["onClick"]))
                    ];
                  }),
                  _: 1
                }),
                unref(isLogin) ? (openBlock(), createBlock(unref(Ve), {
                  key: 0,
                  class: "absolute ring-1 ring-black mt-3 ring-opacity-5 top-full right-0 z-[999] mt-2 w-32 overflow-hidden rounded-sm bg-white text-sm font-semibold text-gray-700 shadow-md shadow-gray-300/[0.2] outline-none dark:bg-gray-800 dark:text-white dark:shadow-gray-500/[0.2] dark:ring-0"
                }, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(userMenu), (menu, index) => {
                      return openBlock(), createBlock(unref(Ae), { key: index }, {
                        default: withCtx(() => [
                          createVNode("div", {
                            class: "flex items-center w-full cursor-pointer items-center py-2 px-3 hover:bg-gray-200 dark:hover:bg-gray-700/30",
                            onClick: ($event) => clickNav(menu.id)
                          }, [
                            createVNode(_component_UnoIcon, {
                              class: [menu.icon, "mr-3"]
                            }, null, 8, ["class"]),
                            createVNode("span", { class: "truncate" }, toDisplayString(menu.label), 1)
                          ], 8, ["onClick"])
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Layout/Navbar/User.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _imports_0 = "" + __publicAssetsURL("logo.png");
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const app = useState("app");
    const menus = ref([
      { type: "link", text: "新聞", route: "/" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_UIAnchor = _sfc_main$s;
      const _component_UIButton = _sfc_main$r;
      const _component_TemSizeChange = _sfc_main$p;
      const _component_TemThemeChange = _sfc_main$o;
      const _component_LayoutNavbarUser = _sfc_main$n;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-12" }, _attrs))}><div class="h-12 fixed flex items-center w-screen top-0 left-0 backdrop-filter backdrop-blur top-0 flex-none transition-colors duration-300 z-20 border-b border-gray-900/10 dark:border-gray-50/[0.2] bg-white dark:bg-slate-900/[0.7]"><div class="cma"><div class="lg:px-8 lg:mx-0"><div class="relative flex items-center">`);
      ssrRenderSlot(_ctx.$slots, "title", {}, () => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          tag: "a",
          class: "flex-none mr-3 overflow-hidden font-bold text-gray-900 md:w-auto text-md dark:text-gray-200",
          to: "/"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="sr-only"${_scopeId}>home</span><span class="flex items-center"${_scopeId}><img class="w-18 mr-2"${ssrRenderAttr("src", _imports_0)}${_scopeId}><span class="leading-7 mt-[1px]"${_scopeId}>${ssrInterpolate(unref(app).name)}</span></span>`);
            } else {
              return [
                createVNode("span", { class: "sr-only" }, "home"),
                createVNode("span", { class: "flex items-center" }, [
                  createVNode("img", {
                    class: "w-18 mr-2",
                    src: _imports_0
                  }),
                  createVNode("span", { class: "leading-7 mt-[1px]" }, toDisplayString(unref(app).name), 1)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      }, _push, _parent);
      _push(`<div class="relative ml-auto flex lt-lg:hidden"><nav class="flex items-center text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300" role="navigation"><ul class="flex items-center space-x-8"><!--[-->`);
      ssrRenderList(unref(menus), (item, i) => {
        _push(`<li>`);
        if (item.type === "link") {
          _push(ssrRenderComponent(_component_UIAnchor, {
            to: item.route ? item.route : void 0,
            href: item.href ? item.href : void 0,
            class: "capitalize hover:no-underline hover:text-slate-900 hover:dark:text-white"
          }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.text)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.text), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else if (item.type === "button") {
          _push(ssrRenderComponent(_component_UIButton, {
            text: item.text,
            size: "xs",
            class: "font-extrabold capitalize",
            to: item.route ? item.route : void 0,
            href: item.href ? item.href : void 0
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav><div class="flex space-x-4 border-l ml-6 pl-6 border-gray-900/10 dark:border-gray-50/[0.2]">`);
      _push(ssrRenderComponent(_component_TemSizeChange, null, null, _parent));
      _push(ssrRenderComponent(_component_TemThemeChange, null, null, _parent));
      _push(ssrRenderComponent(_component_LayoutNavbarUser, null, null, _parent));
      _push(`</div></div><div class="lg:hidden ml-auto"><div class="text-sm md:text-base flex space-x-2 md:space-x-4 border-l pl-4 md:pl-6 border-gray-900/10 dark:border-gray-50/[0.2]">`);
      _push(ssrRenderComponent(_component_TemSizeChange, null, null, _parent));
      _push(ssrRenderComponent(_component_TemThemeChange, null, null, _parent));
      _push(`</div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Layout/Navbar.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a;
    return props ? h$1(component, props, slots) : (_a = slots.default) == null ? void 0 : _a.call(slots);
  } };
};
const layouts = {
  blog: () => import('./_nuxt/blog-9fae3b72.mjs').then((m2) => m2.default || m2),
  default: () => import('./_nuxt/default-dacc9f7f.mjs').then((m2) => m2.default || m2)
};
const LayoutLoader = /* @__PURE__ */ defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r2) => r2.default || r2);
    return () => h$1(LayoutComponent, props.layoutProps, context.slots);
  }
});
const __nuxt_component_3 = /* @__PURE__ */ defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => unref(props.name) ?? route.meta.layout ?? "default");
    const layoutRef = ref();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => h$1(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h$1(
            // @ts-expect-error seems to be an issue in vue types
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value,
              name: layout.value,
              shouldProvide: !props.name,
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = /* @__PURE__ */ defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? void 0 : _b.call(_a);
      }
      return h$1(
        // @ts-expect-error seems to be an issue in vue types
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const __nuxt_component_4$2 = /* @__PURE__ */ defineComponent({
  name: "NuxtLoadingIndicator",
  props: {
    throttle: {
      type: Number,
      default: 200
    },
    duration: {
      type: Number,
      default: 2e3
    },
    height: {
      type: Number,
      default: 3
    },
    color: {
      type: [String, Boolean],
      default: "repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)"
    }
  },
  setup(props, { slots }) {
    const indicator = useLoadingIndicator({
      duration: props.duration,
      throttle: props.throttle
    });
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const router = useRouter();
    globalMiddleware.unshift(indicator.start);
    router.onError(() => {
      indicator.finish();
    });
    router.beforeResolve((to, from) => {
      if (to === from || to.matched.every((comp, index) => {
        var _a, _b, _c;
        return comp.components && ((_a = comp.components) == null ? void 0 : _a.default) === ((_c = (_b = from.matched[index]) == null ? void 0 : _b.components) == null ? void 0 : _c.default);
      })) {
        indicator.finish();
      }
    });
    router.afterEach((_to, _from, failure) => {
      if (failure) {
        indicator.finish();
      }
    });
    nuxtApp.hook("page:finish", indicator.finish);
    nuxtApp.hook("vue:error", indicator.finish);
    return () => h$1("div", {
      class: "nuxt-loading-indicator",
      style: {
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        pointerEvents: "none",
        width: "auto",
        height: `${props.height}px`,
        opacity: indicator.isLoading.value ? 1 : 0,
        background: props.color || void 0,
        backgroundSize: `${100 / indicator.progress.value * 100}% auto`,
        transform: `scaleX(${indicator.progress.value}%)`,
        transformOrigin: "left",
        transition: "transform 0.1s, height 0.4s, opacity 0.4s",
        zIndex: 999999
      }
    }, slots);
  }
});
function useLoadingIndicator(opts) {
  const progress = ref(0);
  const isLoading = ref(false);
  computed(() => 1e4 / opts.duration);
  let _timer = null;
  let _throttle = null;
  function start() {
    clear();
    progress.value = 0;
    if (opts.throttle && false) {
      _throttle = setTimeout(() => {
        isLoading.value = true;
      }, opts.throttle);
    } else {
      isLoading.value = true;
    }
  }
  function finish() {
    progress.value = 100;
    _hide();
  }
  function clear() {
    clearInterval(_timer);
    clearTimeout(_throttle);
    _timer = null;
    _throttle = null;
  }
  function _hide() {
    clear();
  }
  return {
    progress,
    isLoading,
    start,
    finish,
    clear
  };
}
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r2) => {
    var _a;
    return ((_a = route.params[r2.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m2) => {
    var _a;
    return ((_a = m2.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const RouteProvider = /* @__PURE__ */ defineComponent({
  name: "RouteProvider",
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key]
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h$1(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_2$4 = /* @__PURE__ */ defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, expose }) {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    return () => {
      return h$1(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(routeProps, props.pageKey);
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive,
              h$1(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).finally(done));
                }
              }, {
                // @ts-expect-error seems to be an issue in vue types
                default: () => h$1(RouteProvider, {
                  key,
                  vnode: routeProps.Component,
                  route: routeProps.route,
                  renderKey: key,
                  trackRootNodes: hasTransition,
                  vnodeRef: pageRef
                })
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _toArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: _toArray(prop.onAfterLeave)
  }));
  return defu(..._props);
}
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "NavbarMobile",
  __ssrInlineRender: true,
  setup(__props) {
    useState("app");
    const menus = ref([
      { type: "link", text: "首頁", icon: "i-uil-home-alt", route: "/" },
      { type: "link", text: "分類", icon: "i-uil-create-dashboard", route: "/news/categories" },
      { type: "link", text: "收藏", icon: "i-uil-heart", route: "/my/collections" },
      { type: "link", text: "個人", icon: "i-uil-user", route: "/my" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_UnoIcon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "md:hidden h-15 fixed flex items-center w-screen bottom-0 left-0 flex-none transition-colors duration-300 z-20 bg-white border-t border-gray-900/10 dark:bg-gray-900 dark:border-gray-700" }, _attrs))}><div class="flex justify-around w-full"><!--[-->`);
      ssrRenderList(unref(menus), (menu, index) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: index,
          class: "text-center px-2",
          to: menu.route
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UnoIcon, {
                class: ["mx-auto text-xl", menu.icon]
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-xs -mt-1 transform scale-90"${_scopeId}>${ssrInterpolate(menu.text)}</p>`);
            } else {
              return [
                createVNode(_component_UnoIcon, {
                  class: ["mx-auto text-xl", menu.icon]
                }, null, 8, ["class"]),
                createVNode("p", { class: "text-xs -mt-1 transform scale-90" }, toDisplayString(menu.text), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Layout/NavbarMobile.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const __nuxt_component_0$2 = /* @__PURE__ */ defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  // eslint-disable-next-line vue/require-prop-types
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_2, { slots, attrs }) {
    const mounted = ref(false);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "Form",
  __ssrInlineRender: true,
  emits: ["submit"],
  setup(__props, { emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(_attrs)}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<button type="submit" hidden></button></form>`);
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = {
  __name: "Text",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
    center: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "md"
    },
    id: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    },
    isPhone: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "captcha"],
  setup(__props, { emit }) {
    const props = __props;
    const defaultStyle2 = computed(
      () => props.disabled ? `
  block w-full border cursor-not-allowed
  duration-200
  border-gray-600/[0.3] bg-gray-100
  text-opacity-50
  dark:border-gray-50/[0.2] dark:bg-gray-800` : `
  block w-full border
  duration-200
  bg-transparent border-gray-600/[0.3] focus:bg-gray-200
  dark:border-gray-50/[0.2] dark:focus:bg-gray-800`
    );
    const labelSizeStyles = reactive({
      lg: "text-base",
      md: "text-sm",
      sm: "text-xs",
      xs: "text-xs"
    });
    const inputSizeStyles = reactive({
      lg: "h-12 px-4 text-lg rounded-lg",
      md: "h-10 px-4 text-base rounded",
      sm: "h-8 px-4 text-sm rounded",
      xs: "h-7 px-4 text-xs rounded"
    });
    const labelSize = computed(
      () => labelSizeStyles[props.size] || labelSizeStyles.md
    );
    const inputSize = computed(
      () => inputSizeStyles[props.size] || inputSizeStyles.md
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="${ssrRenderClass([unref(labelSize), "flex items-center mb-2 empty:hidden"])}">`);
      if (!!__props.label) {
        _push(`<label${ssrRenderAttr("for", __props.id)} class="${ssrRenderClass([[{ "cursor-pointer": __props.id }], "block font-bold tracking-wide"])}">${ssrInterpolate(__props.label)}</label>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "label", {}, null, _push, _parent);
      _push(`</div><div class="relative model flex"><input${ssrRenderAttr("id", __props.id)} type="text" class="${ssrRenderClass([{ "text-center": __props.center }, unref(defaultStyle2), unref(inputSize)])}"${ssrRenderAttr("placeholder", __props.placeholder)}${ssrRenderAttr("value", __props.modelValue || __props.value)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""}><div class="absolute transform -translate-y-1/2 right-2 top-1/2">`);
      ssrRenderSlot(_ctx.$slots, "symbol", {}, null, _push, _parent);
      _push(`</div>`);
      if (__props.isPhone) {
        _push(`<div class="flex cursor-pointer items-center justify-center rounded bg-blue-500 text-light-200 opacity-80 hover:opacity-100 duration-150 ml-4 text-sm truncate w-20"> 發送 </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form/Text.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const __nuxt_component_2$3 = _sfc_main$j;
const _sfc_main$i = {
  __name: "Password",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "md"
    },
    id: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    const props = __props;
    const showPw = ref$1(true);
    const defaultStyle2 = computed(
      () => props.disabled ? `
  block w-full border cursor-not-allowed
  duration-200
  border-gray-600/[0.3] bg-gray-100
  dark:border-gray-50/[0.2] dark:bg-gray-800` : `
  block w-full border
  duration-200 
  bg-transparent border-gray-600/[0.3] focus:bg-gray-200
  dark:border-gray-50/[0.2] dark:focus:bg-gray-800`
    );
    const labelSizeStyles = reactive({
      lg: "text-base",
      md: "text-sm",
      sm: "text-xs",
      xs: "text-xs"
    });
    const inputSizeStyles = reactive({
      lg: "h-12 px-4 text-lg rounded-lg",
      md: "h-10 px-4 text-base rounded",
      sm: "h-8 px-4 text-sm rounded",
      xs: "h-7 px-4 text-xs rounded"
    });
    const labelSize = computed(
      () => labelSizeStyles[props.size] || labelSizeStyles.md
    );
    const inputSize = computed(
      () => inputSizeStyles[props.size] || inputSizeStyles.md
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="${ssrRenderClass([unref(labelSize), "flex items-center mb-2"])}"><label${ssrRenderAttr("for", __props.id)} class="${ssrRenderClass([[{ "cursor-pointer": __props.id }], "block font-bold tracking-wide"])}">${ssrInterpolate(__props.label)}</label>`);
      ssrRenderSlot(_ctx.$slots, "label", {}, null, _push, _parent);
      _push(`</div><div class="flex items-center"><div class="relative model flex-1"><input${ssrRenderAttr("id", __props.id)} class="${ssrRenderClass([unref(defaultStyle2), unref(inputSize)])}"${ssrRenderAttr("type", unref(showPw) ? "password" : "text")}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrRenderAttr("value", __props.modelValue || __props.value)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} autocomplete="on"><div class="absolute flex transform -translate-y-1/2 icon top-1/2 right-2 cursor-pointer">`);
      _push(ssrRenderComponent(_component_UnoIcon, {
        style: unref(showPw) ? null : { display: "none" },
        class: ["i-ion-eye-outline", { disabled: __props.disabled }]
      }, null, _parent));
      _push(ssrRenderComponent(_component_UnoIcon, {
        style: !unref(showPw) ? null : { display: "none" }
      }, null, _parent));
      _push(`</div></div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form/Password.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const __nuxt_component_2$2 = _sfc_main$i;
const defaultStyle$1 = `
  block w-full border outline-none font-bold
  bg-blue-500 text-light-200
  opacity-80 hover:opacity-100 duration-150
`;
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "Submit",
  __ssrInlineRender: true,
  props: {
    text: {
      type: String,
      default: ""
    },
    center: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "md"
    }
  },
  setup(__props) {
    const props = __props;
    const sizeStyles = reactive({
      lg: "h-12 leading-12 px-4 text-lg rounded-lg",
      md: "h-10 leading-10 px-4 text-base rounded",
      sm: "h-8 leading-8 px-4 text-sm rounded",
      xs: "h-7 leading-7 px-4 text-xs rounded"
    });
    const selectSize = computed(() => sizeStyles[props.size] || sizeStyles.md);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="${ssrRenderClass([[{ "text-center": __props.center }, unref(selectSize), defaultStyle$1], "cursor-pointer"])}">${ssrInterpolate(__props.text)}</div></div>`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form/Submit.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "LoginForm",
  __ssrInlineRender: true,
  emits: ["register", "forgot", "close"],
  setup(__props, { emit }) {
    const loginStorage = storage.get("loginData");
    const loginForm = reactive({
      phone: (loginStorage == null ? void 0 : loginStorage.phone) || "",
      password: (loginStorage == null ? void 0 : loginStorage.password) || "",
      rememberMe: !!(loginStorage == null ? void 0 : loginStorage.rememberMe)
    });
    const login = async () => {
      const { user } = useBaseStore();
      await user.login({
        phone: loginForm.phone,
        password: loginForm.password,
        rememberMe: loginForm.rememberMe
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      const _component_UIForm = _sfc_main$k;
      const _component_UIFormText = __nuxt_component_2$3;
      const _component_UIFormPassword = __nuxt_component_2$2;
      const _component_UIFormSubmit = _sfc_main$h;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col justify-center p-12" }, _attrs))} data-v-5132e79f><div class="flex items-center justify-between mb-7" data-v-5132e79f><div class="text-xl font-bold text-gray-800 dark:text-gray-200" data-v-5132e79f> 登入帳號 </div>`);
      _push(ssrRenderComponent(_component_UnoIcon, {
        class: "i-ion-ios-close-circle-outline text-2xl cursor-pointer",
        onClick: ($event) => _ctx.$emit("close")
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UIForm, { onSubmit: login }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIFormText, {
              id: "account",
              modelValue: unref(loginForm).phone,
              "onUpdate:modelValue": ($event) => unref(loginForm).phone = $event,
              label: "手機號碼",
              class: "mb-3",
              placeholder: "輸入手機號碼"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormPassword, {
              id: "password",
              modelValue: unref(loginForm).password,
              "onUpdate:modelValue": ($event) => unref(loginForm).password = $event,
              label: "密碼",
              placeholder: "長度至少為8,英數組合"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex items-center justify-between py-4 mb-2 text-sm" data-v-5132e79f${_scopeId}><div data-v-5132e79f${_scopeId}><label class="flex items-center cursor-pointer check" data-v-5132e79f${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(loginForm).rememberMe) ? ssrLooseContain(unref(loginForm).rememberMe, null) : unref(loginForm).rememberMe) ? " checked" : ""} type="checkbox" name="checkbox-forced-colors-checked" data-v-5132e79f${_scopeId}>`);
            if (unref(loginForm).rememberMe) {
              _push2(ssrRenderComponent(_component_UnoIcon, { class: "i-ion-checkbox-outline" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_UnoIcon, { class: "i-ion-android-checkbox-outline-blank" }, null, _parent2, _scopeId));
            }
            _push2(`<span class="ml-2" data-v-5132e79f${_scopeId}>記住我</span></label></div><span class="cursor-pointer" data-v-5132e79f${_scopeId}>忘記密碼</span></div>`);
            _push2(ssrRenderComponent(_component_UIFormSubmit, {
              class: "mb-7",
              text: "送出",
              center: true,
              onClick: login
            }, null, _parent2, _scopeId));
            _push2(`<div class="text-sm font-bold tracking-wide text-center cursor-pointer" data-v-5132e79f${_scopeId}> 註冊新帳號 </div>`);
          } else {
            return [
              createVNode(_component_UIFormText, {
                id: "account",
                modelValue: unref(loginForm).phone,
                "onUpdate:modelValue": ($event) => unref(loginForm).phone = $event,
                label: "手機號碼",
                class: "mb-3",
                placeholder: "輸入手機號碼"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormPassword, {
                id: "password",
                modelValue: unref(loginForm).password,
                "onUpdate:modelValue": ($event) => unref(loginForm).password = $event,
                label: "密碼",
                placeholder: "長度至少為8,英數組合"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode("div", { class: "flex items-center justify-between py-4 mb-2 text-sm" }, [
                createVNode("div", null, [
                  createVNode("label", { class: "flex items-center cursor-pointer check" }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(loginForm).rememberMe = $event,
                      type: "checkbox",
                      name: "checkbox-forced-colors-checked"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelCheckbox, unref(loginForm).rememberMe]
                    ]),
                    unref(loginForm).rememberMe ? (openBlock(), createBlock(_component_UnoIcon, {
                      key: 0,
                      class: "i-ion-checkbox-outline"
                    })) : (openBlock(), createBlock(_component_UnoIcon, {
                      key: 1,
                      class: "i-ion-android-checkbox-outline-blank"
                    })),
                    createVNode("span", { class: "ml-2" }, "記住我")
                  ])
                ]),
                createVNode("span", {
                  class: "cursor-pointer",
                  onClick: ($event) => emit("forgot")
                }, "忘記密碼", 8, ["onClick"])
              ]),
              createVNode(_component_UIFormSubmit, {
                class: "mb-7",
                text: "送出",
                center: true,
                onClick: login
              }),
              createVNode("div", {
                class: "text-sm font-bold tracking-wide text-center cursor-pointer",
                onClick: ($event) => _ctx.$emit("register")
              }, " 註冊新帳號 ", 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Auth/LoginForm.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-5132e79f"]]);
const _sfc_main$f = {
  __name: "Select",
  __ssrInlineRender: true,
  props: [
    "modelValue",
    "label",
    "placeholder",
    "options",
    "disabled",
    "selected"
  ],
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    const props = __props;
    const defaultStyle2 = computed(
      () => props.disabled ? `
  block w-full border cursor-not-allowed
  duration-200
  border-gray-600/[0.3] bg-gray-100
  text-opacity-50
  dark:border-gray-50/[0.2] dark:bg-gray-800` : `
  block w-full border
  duration-200
  bg-transparent border-gray-600/[0.3] focus:bg-gray-200
  dark:border-gray-50/[0.2] dark:focus:bg-gray-800`
    );
    const labelSizeStyles = reactive({
      lg: "text-base",
      md: "text-sm",
      sm: "text-xs",
      xs: "text-xs"
    });
    const inputSizeStyles = reactive({
      lg: "h-12 px-4 text-lg rounded-lg",
      md: "h-10 px-4 text-base rounded",
      sm: "h-8 px-4 text-sm rounded",
      xs: "h-7 px-4 text-xs rounded"
    });
    const labelSize = computed(
      () => labelSizeStyles[props.size] || labelSizeStyles.md
    );
    const inputSize = computed(
      () => inputSizeStyles[props.size] || inputSizeStyles.md
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-20ac6568><div class="${ssrRenderClass([unref(labelSize), "flex items-center mb-2 empty:hidden"])}" data-v-20ac6568>`);
      if (!!__props.label) {
        _push(`<label${ssrRenderAttr("for", _ctx.id)} class="${ssrRenderClass([[{ "cursor-pointer": _ctx.id }], "block font-bold tracking-wide"])}" data-v-20ac6568>${ssrInterpolate(__props.label)}</label>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "label", {}, null, _push, _parent);
      _push(`</div><div class="relative model flex" data-v-20ac6568><select${ssrRenderAttr("value", __props.modelValue)} class="${ssrRenderClass([{ "text-center": _ctx.center }, unref(defaultStyle2), unref(inputSize)])}" data-v-20ac6568><!--[-->`);
      ssrRenderList(__props.options, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-20ac6568>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select></div></div>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form/Select.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const __nuxt_component_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-20ac6568"]]);
const defaultStyle = `
  block w-full border
  duration-200 
  bg-transparent border-gray-600/[0.3] focus:bg-gray-200
  dark:border-gray-50/[0.2] dark:focus:bg-gray-800
`;
const _sfc_main$e = {
  __name: "Captcha",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    length: {
      type: Number,
      default: 6
    },
    getCaptcha: {
      type: Function,
      default: () => {
      }
    }
  },
  emits: ["update:modelValue", "captcha"],
  setup(__props, { emit }) {
    ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mb-1 form-group form-group__captcha" }, _attrs))}><label${ssrRenderAttr("for", __props.id)} class="block mb-2 font-bold tracking-wide cursor-pointer text-sm">${ssrInterpolate(__props.label)}</label><div class="flex"><input${ssrRenderAttr("placeholder", __props.placeholder)} class="${ssrRenderClass([defaultStyle, "h-10 px-4 text-base rounded"])}" type="text"${ssrRenderAttr("value", __props.modelValue)}></div></div>`);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form/Captcha.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const __nuxt_component_4$1 = _sfc_main$e;
const _sfc_main$d = {
  __name: "Date",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "md"
    },
    id: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    const props = __props;
    const defaultStyle2 = computed(
      () => props.disabled ? `
  block w-full border cursor-not-allowed
  duration-200
  border-gray-600/[0.3] bg-gray-100
  text-opacity-50
  dark:border-gray-50/[0.2] dark:bg-gray-800` : `
  block w-full border
  duration-200 
  bg-transparent border-gray-600/[0.3] focus:bg-gray-200
  dark:border-gray-50/[0.2] dark:focus:bg-gray-800`
    );
    const labelSizeStyles = reactive({
      lg: "text-base",
      md: "text-sm",
      sm: "text-xs",
      xs: "text-xs"
    });
    const inputSizeStyles = reactive({
      lg: "h-12 px-4 text-lg rounded-lg",
      md: "h-10 px-4 text-base rounded",
      sm: "h-8 px-4 text-sm rounded",
      xs: "h-7 px-4 text-xs rounded"
    });
    const labelSize = computed(
      () => labelSizeStyles[props.size] || labelSizeStyles.md
    );
    const inputSize = computed(
      () => inputSizeStyles[props.size] || inputSizeStyles.md
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "form-group form-group_select" }, _attrs))} data-v-85ac86be><div class="${ssrRenderClass([unref(labelSize), "flex items-center mb-2"])}" data-v-85ac86be><label${ssrRenderAttr("for", __props.id)} class="${ssrRenderClass([[{ "cursor-pointer": __props.id }], "block font-bold tracking-wide"])}" data-v-85ac86be>${ssrInterpolate(__props.label)}</label>`);
      ssrRenderSlot(_ctx.$slots, "label", {}, null, _push, _parent);
      _push(`</div><div class="model relative" data-v-85ac86be><input${ssrRenderAttr("id", __props.id)} type="date" class="${ssrRenderClass([unref(defaultStyle2), unref(inputSize)])}"${ssrRenderAttr("placeholder", __props.placeholder)}${ssrRenderAttr("value", props.modelValue || __props.value)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} data-v-85ac86be></div></div>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form/Date.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-85ac86be"]]);
const _sfc_main$c = {
  __name: "Radio",
  __ssrInlineRender: true,
  props: {
    id: {
      type: String,
      default: ""
    },
    modelValue: {
      type: Number,
      default: NaN
    },
    label: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: () => []
    },
    border: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    const props = __props;
    const defaultStyle2 = computed(
      () => props.disabled ? `
  w-full border cursor-not-allowed
  duration-200
  border-gray-600/[0.3] bg-gray-100
  text-opacity-50
  dark:border-gray-50/[0.2] dark:bg-gray-800` : `
  w-full border
  duration-200 
  bg-transparent border-gray-600/[0.3] focus:bg-gray-200
  dark:border-gray-50/[0.2] dark:focus:bg-gray-800`
    );
    const inputSizeStyles = reactive({
      lg: "h-12 px-4 text-lg rounded-lg",
      md: "h-10 px-4 text-base rounded",
      sm: "h-8 px-4 text-sm rounded",
      xs: "h-7 px-4 text-xs rounded"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "form-group form-group_input__radio" }, _attrs))} data-v-e8c98730><label${ssrRenderAttr("for", __props.id)} class="block mb-2 font-bold tracking-wide cursor-pointer text-sm" data-v-e8c98730>${ssrInterpolate(__props.label)}</label><div role="radiogroup" class="${ssrRenderClass([[unref(defaultStyle2), unref(inputSizeStyles).md], "flex flex-wrap space-x-3"])}" data-v-e8c98730><!--[-->`);
      ssrRenderList(__props.options, (option, index) => {
        _push(`<div class="flex items-center py-3" data-v-e8c98730><div class="bg-white dark:bg-gray-100 rounded-full w-4 h-4 flex flex-shrink-0 justify-center items-center relative" data-v-e8c98730><input${ssrRenderAttr("id", option.value)}${ssrIncludeBooleanAttr(__props.modelValue === option.value || index === 0) ? " checked" : ""}${ssrRenderAttr("value", option.value)} type="radio" name="radio" class="checkbox appearance-none border rounded-full border-gray-400 absolute cursor-pointer w-full h-full checked:border-none" data-v-e8c98730><div class="check-icon hidden border-4 border-indigo-700 rounded-full w-full h-full z-1" data-v-e8c98730></div></div><label${ssrRenderAttr("for", option.value)} class="ml-2 text-sm leading-4 font-normal text-gray-800 dark:text-gray-100" data-v-e8c98730>${ssrInterpolate(option.label)}</label></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form/Radio.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-e8c98730"]]);
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "RegisterForm",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ["cancel", "close"],
  setup(__props, { emit }) {
    const cancel = () => {
      emit("cancel");
    };
    const close = () => {
      emit("close");
    };
    const genderOptions = ref([
      { value: 13, label: "男性" },
      { value: 14, label: "女性" }
    ]);
    const registerForm = reactive({
      firstName: "",
      lastName: "",
      birthday: "",
      area: "",
      phone: "",
      password: "",
      passwordConfirm: "",
      gender: genderOptions.value[0].value,
      verifyCode: ""
    });
    const { user } = useBaseStore();
    const $alert = useState("alert");
    const $loading = useState("loading");
    const getCaptcha = async () => {
      $loading.value = true;
      const { error, message, data } = await useHttpFetchPost(
        "/auth/register-captcha",
        {
          body: { area: registerForm.area, phone: registerForm.phone }
        }
      );
      $loading.value = false;
      if (error) {
        const $alert2 = useState("alert");
        $alert2.value = {
          type: "error",
          title: "驗證錯誤",
          text: message,
          center: true
        };
      }
      if (data)
        $alert.value = { type: "success", title: "發送成功", center: true };
    };
    const openMemberRule = (path) => {
      const $showAuth = useState("showAuth");
      const router = useRouter();
      $showAuth.value = false;
      router.push(path);
    };
    const options = [
      "+1",
      "+1264",
      "+1268",
      "+1441",
      "+1473",
      "+1758",
      "+1767",
      "+1876",
      "+20",
      "+212",
      "+233",
      "+234",
      "+237",
      "+243",
      "+248",
      "+249",
      "+250",
      "+254",
      "+256",
      "+261",
      "+297",
      "+30",
      "+32",
      "+33",
      "+34",
      "+351",
      "+352",
      "+353",
      "+354",
      "+358",
      "+380",
      "+381",
      "+389",
      "+39",
      "+40",
      "+41",
      "+43",
      "+44",
      "+45",
      "+46",
      "+47",
      "+49",
      "+502",
      "+503",
      "+504",
      "+505",
      "+507",
      "+509",
      "+52",
      "+54",
      "+55",
      "+57",
      "+58",
      "+591",
      "+595",
      "+598",
      "+60",
      "+61",
      "+62",
      "+64",
      "+65",
      "+66",
      "+674",
      "+675",
      "+676",
      "+679",
      "+7",
      "+7",
      "+81",
      "+82",
      "+852",
      "+853",
      "+86",
      "+880",
      "+886",
      "+90",
      "+91",
      "+92",
      "+93",
      "+94",
      "+960",
      "+962",
      "+964",
      "+965",
      "+966",
      "+967",
      "+967",
      "+971",
      "+973",
      "+975",
      "+975",
      "+995",
      "+998"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      const _component_UIForm = _sfc_main$k;
      const _component_UIFormText = __nuxt_component_2$3;
      const _component_UIFormSelect = __nuxt_component_2$1;
      const _component_UIFormCaptcha = __nuxt_component_4$1;
      const _component_UIFormPassword = __nuxt_component_2$2;
      const _component_UIFormDate = __nuxt_component_4;
      const _component_UIFormRadio = __nuxt_component_5;
      const _component_UIFormSubmit = _sfc_main$h;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-12" }, _attrs))}><div class="flex items-center justify-between mb-7"><div class="text-xl font-bold text-gray-800 dark:text-gray-200">註冊</div>`);
      _push(ssrRenderComponent(_component_UnoIcon, {
        class: "i-ion-ios-close-circle-outline text-2xl cursor-pointer",
        onClick: close
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UIForm, {
        onSubmit: ($event) => unref(user).register(unref(registerForm))
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex space-x-4 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIFormText, {
              id: "firstName",
              modelValue: unref(registerForm).firstName,
              "onUpdate:modelValue": ($event) => unref(registerForm).firstName = $event,
              label: "姓氏",
              class: "flex-1"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormText, {
              id: "lastName",
              modelValue: unref(registerForm).lastName,
              "onUpdate:modelValue": ($event) => unref(registerForm).lastName = $event,
              label: "名字",
              class: "flex-1"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><div class="${ssrRenderClass([_ctx.labelSize, "flex items-center mb-2"])}"${_scopeId}><label${ssrRenderAttr("for", _ctx.phone)} class="${ssrRenderClass([[{ "cursor-pointer": "phone" }], "block font-bold tracking-wide"])}"${_scopeId}>${ssrInterpolate("手機")}</label></div><div class="flex flex-wrap"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIFormSelect, {
              class: "mr-2 w-24",
              id: "phone",
              options,
              modelValue: unref(registerForm).area,
              "onUpdate:modelValue": ($event) => unref(registerForm).area = $event
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormText, {
              id: "phone",
              modelValue: unref(registerForm).phone,
              "onUpdate:modelValue": ($event) => unref(registerForm).phone = $event,
              class: "mb-3 flex-1",
              "is-phone": true,
              onCaptcha: getCaptcha
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_component_UIFormCaptcha, {
              modelValue: unref(registerForm).verifyCode,
              "onUpdate:modelValue": ($event) => unref(registerForm).verifyCode = $event,
              class: "mb-3",
              label: "驗證碼",
              placeholder: "請輸入手機驗證碼"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormPassword, {
              id: "password",
              modelValue: unref(registerForm).password,
              "onUpdate:modelValue": ($event) => unref(registerForm).password = $event,
              label: "密碼",
              class: "mb-3",
              placeholder: "長度至少為8,英數組合"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormPassword, {
              id: "password",
              modelValue: unref(registerForm).passwordConfirm,
              "onUpdate:modelValue": ($event) => unref(registerForm).passwordConfirm = $event,
              label: "確認密碼",
              class: "mb-3",
              placeholder: "再次輸入密碼"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormDate, {
              id: "birthday",
              modelValue: unref(registerForm).birthday,
              "onUpdate:modelValue": ($event) => unref(registerForm).birthday = $event,
              label: "生日",
              class: "mb-3"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormRadio, {
              modelValue: unref(registerForm).gender,
              "onUpdate:modelValue": ($event) => unref(registerForm).gender = $event,
              class: "mb-10",
              label: "性別",
              options: unref(genderOptions)
            }, null, _parent2, _scopeId));
            _push2(`<div class="text-center text-sm mb-5"${_scopeId}> 繼續使用代表您同意與接受 鍵結科技 的 <span class="text-blue-300 cursor-pointer"${_scopeId}> 《會員條款》 </span></div>`);
            _push2(ssrRenderComponent(_component_UIFormSubmit, {
              class: "mb-7",
              text: "送出",
              center: true,
              onClick: ($event) => unref(user).register(unref(registerForm))
            }, null, _parent2, _scopeId));
            _push2(`<div class="text-sm font-bold tracking-wide text-center cursor-pointer"${_scopeId}> 已有帳號，前往登入 </div>`);
          } else {
            return [
              createVNode("div", { class: "flex space-x-4 mb-3" }, [
                createVNode(_component_UIFormText, {
                  id: "firstName",
                  modelValue: unref(registerForm).firstName,
                  "onUpdate:modelValue": ($event) => unref(registerForm).firstName = $event,
                  label: "姓氏",
                  class: "flex-1"
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(_component_UIFormText, {
                  id: "lastName",
                  modelValue: unref(registerForm).lastName,
                  "onUpdate:modelValue": ($event) => unref(registerForm).lastName = $event,
                  label: "名字",
                  class: "flex-1"
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ]),
              createVNode("div", null, [
                createVNode("div", {
                  class: ["flex items-center mb-2", _ctx.labelSize]
                }, [
                  createVNode("label", {
                    for: _ctx.phone,
                    class: ["block font-bold tracking-wide", [{ "cursor-pointer": "phone" }]],
                    textContent: "手機"
                  }, null, 8, ["for"])
                ], 2),
                createVNode("div", { class: "flex flex-wrap" }, [
                  createVNode(_component_UIFormSelect, {
                    class: "mr-2 w-24",
                    id: "phone",
                    options,
                    modelValue: unref(registerForm).area,
                    "onUpdate:modelValue": ($event) => unref(registerForm).area = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UIFormText, {
                    id: "phone",
                    modelValue: unref(registerForm).phone,
                    "onUpdate:modelValue": ($event) => unref(registerForm).phone = $event,
                    class: "mb-3 flex-1",
                    "is-phone": true,
                    onCaptcha: getCaptcha
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ]),
              createVNode(_component_UIFormCaptcha, {
                modelValue: unref(registerForm).verifyCode,
                "onUpdate:modelValue": ($event) => unref(registerForm).verifyCode = $event,
                class: "mb-3",
                label: "驗證碼",
                placeholder: "請輸入手機驗證碼"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormPassword, {
                id: "password",
                modelValue: unref(registerForm).password,
                "onUpdate:modelValue": ($event) => unref(registerForm).password = $event,
                label: "密碼",
                class: "mb-3",
                placeholder: "長度至少為8,英數組合"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormPassword, {
                id: "password",
                modelValue: unref(registerForm).passwordConfirm,
                "onUpdate:modelValue": ($event) => unref(registerForm).passwordConfirm = $event,
                label: "確認密碼",
                class: "mb-3",
                placeholder: "再次輸入密碼"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormDate, {
                id: "birthday",
                modelValue: unref(registerForm).birthday,
                "onUpdate:modelValue": ($event) => unref(registerForm).birthday = $event,
                label: "生日",
                class: "mb-3"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormRadio, {
                modelValue: unref(registerForm).gender,
                "onUpdate:modelValue": ($event) => unref(registerForm).gender = $event,
                class: "mb-10",
                label: "性別",
                options: unref(genderOptions)
              }, null, 8, ["modelValue", "onUpdate:modelValue", "options"]),
              createVNode("div", { class: "text-center text-sm mb-5" }, [
                createTextVNode(" 繼續使用代表您同意與接受 鍵結科技 的 "),
                createVNode("span", {
                  class: "text-blue-300 cursor-pointer",
                  onClick: ($event) => openMemberRule("/member-rule")
                }, " 《會員條款》 ", 8, ["onClick"])
              ]),
              createVNode(_component_UIFormSubmit, {
                class: "mb-7",
                text: "送出",
                center: true,
                onClick: ($event) => unref(user).register(unref(registerForm))
              }, null, 8, ["onClick"]),
              createVNode("div", {
                class: "text-sm font-bold tracking-wide text-center cursor-pointer",
                onClick: cancel
              }, " 已有帳號，前往登入 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Auth/RegisterForm.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {
  __name: "SelectArea",
  __ssrInlineRender: true,
  props: ["modelValue", "label", "placeholder", "options"],
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "form-group form-group_select" }, _attrs))} data-v-24226c81><label data-v-24226c81>${ssrInterpolate(__props.label)}</label><select${ssrRenderAttr("value", __props.modelValue)} data-v-24226c81><!--[-->`);
      ssrRenderList(__props.options, (option) => {
        _push(`<option data-v-24226c81>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select></div>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form/SelectArea.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-24226c81"]]);
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "ForgotForm",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ["cancel", "close"],
  setup(__props, { emit }) {
    const cancel = () => {
      emit("cancel");
    };
    const forgotForm = reactive({
      phone: "",
      password: "",
      passwordConfirm: "",
      verifyCode: ""
    });
    const { user } = useBaseStore();
    const $alert = useState("alert");
    const $loading = useState("loading");
    const getCaptcha = async () => {
      $loading.value = true;
      const { error, message, data } = await useHttpFetchPost(
        "/auth/forgot-captcha",
        {
          body: { phone: forgotForm.phone }
        }
      );
      $loading.value = false;
      if (error) {
        const $alert2 = useState("alert");
        $alert2.value = {
          type: "error",
          title: "驗證錯誤",
          text: message,
          center: true
        };
      }
      if (data)
        $alert.value = { type: "success", title: "發送成功", center: true };
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      const _component_UIForm = _sfc_main$k;
      const _component_UIFormSelectArea = __nuxt_component_2;
      const _component_UIFormText = __nuxt_component_2$3;
      const _component_UIFormCaptcha = __nuxt_component_4$1;
      const _component_UIFormPassword = __nuxt_component_2$2;
      const _component_UIFormSubmit = _sfc_main$h;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-12" }, _attrs))}><div class="flex items-center justify-between mb-7"><div class="text-xl font-bold text-gray-800 dark:text-gray-200"> 忘記密碼 </div>`);
      _push(ssrRenderComponent(_component_UnoIcon, {
        class: "i-ion-ios-close-circle-outline text-2xl cursor-pointer",
        onClick: cancel
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UIForm, {
        onSubmit: ($event) => unref(user).forgot(unref(forgotForm))
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIFormSelectArea, {
              id: "area",
              modelValue: _ctx.registerForm.area,
              "onUpdate:modelValue": ($event) => _ctx.registerForm.area = $event,
              label: "國際區碼",
              class: "mb-3"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormText, {
              id: "phone",
              modelValue: unref(forgotForm).phone,
              "onUpdate:modelValue": ($event) => unref(forgotForm).phone = $event,
              label: "手機",
              class: "mb-3",
              "is-phone": true,
              onCaptcha: getCaptcha
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormCaptcha, {
              modelValue: unref(forgotForm).verifyCode,
              "onUpdate:modelValue": ($event) => unref(forgotForm).verifyCode = $event,
              class: "mb-3",
              label: "驗證碼",
              placeholder: "請輸入手機驗證碼"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormPassword, {
              id: "password",
              modelValue: unref(forgotForm).password,
              "onUpdate:modelValue": ($event) => unref(forgotForm).password = $event,
              label: "新密碼",
              class: "mb-3",
              placeholder: "長度至少為8,英數組合"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormPassword, {
              id: "password",
              modelValue: unref(forgotForm).passwordConfirm,
              "onUpdate:modelValue": ($event) => unref(forgotForm).passwordConfirm = $event,
              label: "確認密碼",
              class: "mb-10",
              placeholder: "再次輸入密碼"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormSubmit, {
              class: "mb-7",
              text: "送出",
              center: true,
              onClick: ($event) => unref(user).forgot(unref(forgotForm))
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIFormSelectArea, {
                id: "area",
                modelValue: _ctx.registerForm.area,
                "onUpdate:modelValue": ($event) => _ctx.registerForm.area = $event,
                label: "國際區碼",
                class: "mb-3"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormText, {
                id: "phone",
                modelValue: unref(forgotForm).phone,
                "onUpdate:modelValue": ($event) => unref(forgotForm).phone = $event,
                label: "手機",
                class: "mb-3",
                "is-phone": true,
                onCaptcha: getCaptcha
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormCaptcha, {
                modelValue: unref(forgotForm).verifyCode,
                "onUpdate:modelValue": ($event) => unref(forgotForm).verifyCode = $event,
                class: "mb-3",
                label: "驗證碼",
                placeholder: "請輸入手機驗證碼"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormPassword, {
                id: "password",
                modelValue: unref(forgotForm).password,
                "onUpdate:modelValue": ($event) => unref(forgotForm).password = $event,
                label: "新密碼",
                class: "mb-3",
                placeholder: "長度至少為8,英數組合"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormPassword, {
                id: "password",
                modelValue: unref(forgotForm).passwordConfirm,
                "onUpdate:modelValue": ($event) => unref(forgotForm).passwordConfirm = $event,
                label: "確認密碼",
                class: "mb-10",
                placeholder: "再次輸入密碼"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormSubmit, {
                class: "mb-7",
                text: "送出",
                center: true,
                onClick: ($event) => unref(user).forgot(unref(forgotForm))
              }, null, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Auth/ForgotForm.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "Popup",
  __ssrInlineRender: true,
  setup(__props) {
    const type = ref("login");
    const $showAuth = useState("showAuth", () => false);
    const $bodyLock = useState("body.lock");
    const close = () => {
      $showAuth.value = false;
    };
    watch(
      () => $showAuth.value,
      (val) => {
        $bodyLock.value = val;
        if (!val) {
          setTimeout(() => {
            type.value = "login";
          }, 400);
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AuthLoginForm = __nuxt_component_0$1;
      const _component_AuthRegisterForm = _sfc_main$b;
      const _component_AuthForgotForm = _sfc_main$9;
      ssrRenderTeleport(_push, (_push2) => {
        _push2(ssrRenderComponent(unref(fe), {
          show: unref($showAuth),
          appear: ""
        }, {
          default: withCtx((_2, _push3, _parent2, _scopeId) => {
            if (_push3) {
              _push3(ssrRenderComponent(unref(oe), {
                as: "template",
                enter: "duration-150 linear",
                "enter-from": "opacity-0",
                "enter-to": "opacity-100",
                leave: "duration-150 linear",
                "leave-from": "opacity-100",
                "leave-to": "opacity-0"
              }, {
                default: withCtx((_22, _push4, _parent3, _scopeId2) => {
                  if (_push4) {
                    _push4(`<div class="fixed top-0 left-0 w-full h-full z-20" data-v-97a7d60f${_scopeId2}><div class="absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50" data-v-97a7d60f${_scopeId2}></div><div class="absolute overflow-x-hidden overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 rounded-lg max-w-11/12 backdrop-filter backdrop-blur w-xl left-1/2 top-1/2 max-h-4/5 bg-light-100/95 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-100/[0.15] shadow" data-v-97a7d60f${_scopeId2}><div data-v-97a7d60f${_scopeId2}>`);
                    if (unref(type) === "login") {
                      _push4(ssrRenderComponent(_component_AuthLoginForm, {
                        onRegister: ($event) => type.value = "register",
                        onForgot: ($event) => type.value = "forgot",
                        onClose: close
                      }, null, _parent3, _scopeId2));
                    } else if (unref(type) === "register") {
                      _push4(ssrRenderComponent(_component_AuthRegisterForm, {
                        onCancel: ($event) => type.value = "login",
                        onClose: close
                      }, null, _parent3, _scopeId2));
                    } else if (unref(type) === "forgot") {
                      _push4(ssrRenderComponent(_component_AuthForgotForm, {
                        onCancel: ($event) => type.value = "login",
                        onClose: close
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push4(`<!---->`);
                    }
                    _push4(`</div></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "fixed top-0 left-0 w-full h-full z-20" }, [
                        createVNode("div", {
                          class: "absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50",
                          onClick: close
                        }),
                        createVNode("div", { class: "absolute overflow-x-hidden overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 rounded-lg max-w-11/12 backdrop-filter backdrop-blur w-xl left-1/2 top-1/2 max-h-4/5 bg-light-100/95 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-100/[0.15] shadow" }, [
                          createVNode("div", null, [
                            unref(type) === "login" ? (openBlock(), createBlock(_component_AuthLoginForm, {
                              key: 0,
                              onRegister: ($event) => type.value = "register",
                              onForgot: ($event) => type.value = "forgot",
                              onClose: close
                            }, null, 8, ["onRegister", "onForgot"])) : unref(type) === "register" ? (openBlock(), createBlock(_component_AuthRegisterForm, {
                              key: 1,
                              onCancel: ($event) => type.value = "login",
                              onClose: close
                            }, null, 8, ["onCancel"])) : unref(type) === "forgot" ? (openBlock(), createBlock(_component_AuthForgotForm, {
                              key: 2,
                              onCancel: ($event) => type.value = "login",
                              onClose: close
                            }, null, 8, ["onCancel"])) : createCommentVNode("", true)
                          ])
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(oe), {
                  as: "template",
                  enter: "duration-150 linear",
                  "enter-from": "opacity-0",
                  "enter-to": "opacity-100",
                  leave: "duration-150 linear",
                  "leave-from": "opacity-100",
                  "leave-to": "opacity-0"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "fixed top-0 left-0 w-full h-full z-20" }, [
                      createVNode("div", {
                        class: "absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50",
                        onClick: close
                      }),
                      createVNode("div", { class: "absolute overflow-x-hidden overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 rounded-lg max-w-11/12 backdrop-filter backdrop-blur w-xl left-1/2 top-1/2 max-h-4/5 bg-light-100/95 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-100/[0.15] shadow" }, [
                        createVNode("div", null, [
                          unref(type) === "login" ? (openBlock(), createBlock(_component_AuthLoginForm, {
                            key: 0,
                            onRegister: ($event) => type.value = "register",
                            onForgot: ($event) => type.value = "forgot",
                            onClose: close
                          }, null, 8, ["onRegister", "onForgot"])) : unref(type) === "register" ? (openBlock(), createBlock(_component_AuthRegisterForm, {
                            key: 1,
                            onCancel: ($event) => type.value = "login",
                            onClose: close
                          }, null, 8, ["onCancel"])) : unref(type) === "forgot" ? (openBlock(), createBlock(_component_AuthForgotForm, {
                            key: 2,
                            onCancel: ($event) => type.value = "login",
                            onClose: close
                          }, null, 8, ["onCancel"])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Auth/Popup.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_8 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-97a7d60f"]]);
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "Message",
  __ssrInlineRender: true,
  setup(__props) {
    const $message = useState("message", () => "");
    const show = ref(false);
    const reset = () => {
      $message.value = "";
    };
    const close = () => {
      show.value = false;
      setTimeout(() => {
        reset();
      }, 150);
    };
    watch(
      () => $message.value,
      (val) => {
        show.value = !!val;
        setTimeout(() => {
          close();
        }, 4e3);
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      ssrRenderTeleport(_push, (_push2) => {
        _push2(ssrRenderComponent(unref(fe), {
          show: unref(show),
          appear: ""
        }, {
          default: withCtx((_2, _push3, _parent2, _scopeId) => {
            if (_push3) {
              _push3(ssrRenderComponent(unref(oe), {
                as: "template",
                enter: "duration-150 linear",
                "enter-from": "opacity-0",
                "enter-to": "opacity-100",
                leave: "duration-300 linear",
                "leave-from": "",
                "leave-to": "-translate-y-16"
              }, {
                default: withCtx((_22, _push4, _parent3, _scopeId2) => {
                  if (_push4) {
                    _push4(`<div class="py-2 px-5 fb fixed overflow-x-hidden overflow-y-auto transform -translate-x-1/2 rounded-lg lg:max-w-7/12 max-w-11/12 left-1/2 top-4 z-30 bg-light-100/95 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-100/[0.15] shadow" data-v-f827ccb2${_scopeId2}>`);
                    if (unref($message)) {
                      _push4(`<div class="pl-[0.075em] tracking-wide" data-v-f827ccb2${_scopeId2}>${ssrInterpolate(unref($message))}</div>`);
                    } else {
                      _push4(`<!---->`);
                    }
                    _push4(ssrRenderComponent(_component_UnoIcon, {
                      class: "i-ion-ios-close-circle-outline ml-3 p-1 text-xl cursor-pointer",
                      onClick: close
                    }, null, _parent3, _scopeId2));
                    _push4(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "py-2 px-5 fb fixed overflow-x-hidden overflow-y-auto transform -translate-x-1/2 rounded-lg lg:max-w-7/12 max-w-11/12 left-1/2 top-4 z-30 bg-light-100/95 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-100/[0.15] shadow" }, [
                        unref($message) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "pl-[0.075em] tracking-wide"
                        }, toDisplayString(unref($message)), 1)) : createCommentVNode("", true),
                        createVNode(_component_UnoIcon, {
                          class: "i-ion-ios-close-circle-outline ml-3 p-1 text-xl cursor-pointer",
                          onClick: close
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(oe), {
                  as: "template",
                  enter: "duration-150 linear",
                  "enter-from": "opacity-0",
                  "enter-to": "opacity-100",
                  leave: "duration-300 linear",
                  "leave-from": "",
                  "leave-to": "-translate-y-16"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "py-2 px-5 fb fixed overflow-x-hidden overflow-y-auto transform -translate-x-1/2 rounded-lg lg:max-w-7/12 max-w-11/12 left-1/2 top-4 z-30 bg-light-100/95 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-100/[0.15] shadow" }, [
                      unref($message) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "pl-[0.075em] tracking-wide"
                      }, toDisplayString(unref($message)), 1)) : createCommentVNode("", true),
                      createVNode(_component_UnoIcon, {
                        class: "i-ion-ios-close-circle-outline ml-3 p-1 text-xl cursor-pointer",
                        onClick: close
                      })
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Global/Message.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_9 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-f827ccb2"]]);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "Alert",
  __ssrInlineRender: true,
  setup(__props) {
    const $alert = useState("alert", () => {
      return {
        type: "",
        title: "",
        text: "",
        center: false,
        action: () => {
        }
      };
    });
    const show = ref(false);
    const $bodyLock = useState("body.lock");
    watch(
      () => show.value,
      (val) => {
        $bodyLock.value = val;
      }
    );
    watch(
      () => $alert.value,
      (val) => {
        if (val.title || val.text)
          show.value = true;
      }
    );
    const reset = () => {
      $alert.value = {
        type: "",
        title: "",
        text: "",
        center: false,
        action: () => {
        }
      };
    };
    const close = async () => {
      show.value = false;
      if ($alert.value.action)
        $alert.value.action();
      setTimeout(() => {
        reset();
      }, 150);
    };
    const imgTypes = {
      error: "/delete.png",
      info: "/alert.png",
      idea: "/idea.png",
      success: "/check.png"
    };
    const imgType = computed(() => {
      return imgTypes[$alert.value.type] || "/alert.png";
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(ssrRenderComponent(unref(fe), {
          show: unref(show),
          appear: ""
        }, {
          default: withCtx((_2, _push3, _parent2, _scopeId) => {
            if (_push3) {
              _push3(ssrRenderComponent(unref(oe), {
                as: "template",
                enter: "duration-150 linear",
                "enter-from": "opacity-0",
                "enter-to": "opacity-100",
                leave: "duration-150 linear",
                "leave-from": "opacity-100",
                "leave-to": "opacity-0"
              }, {
                default: withCtx((_22, _push4, _parent3, _scopeId2) => {
                  if (_push4) {
                    _push4(`<div class="fixed top-0 left-0 w-full h-full z-30" data-v-ea4bae02${_scopeId2}><div class="absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50" data-v-ea4bae02${_scopeId2}></div><div class="${ssrRenderClass([[{ "text-center": unref($alert).center }], "p-12 min-w-xs md:min-w-sm absolute overflow-x-hidden overflow-y-auto transform -translate-x-1/2 -translate-y-7/12 rounded-lg max-w-11/12 backdrop-filter backdrop-blur left-1/2 top-1/2 max-h-4/5 bg-light-100/95 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-100/[0.15] shadow"])}" data-v-ea4bae02${_scopeId2}><img class="mx-auto mb-6 w-26"${ssrRenderAttr("src", unref(imgType))} data-v-ea4bae02${_scopeId2}>`);
                    if (unref($alert).title) {
                      _push4(`<div class="${ssrRenderClass([{ "pb-4": unref($alert).text }, "text-lg pl-[0.1em] tracking-widest font-bold text-center"])}" data-v-ea4bae02${_scopeId2}>${ssrInterpolate(unref($alert).title)}</div>`);
                    } else {
                      _push4(`<!---->`);
                    }
                    if (unref($alert).text) {
                      _push4(`<div data-v-ea4bae02${_scopeId2}>${ssrInterpolate(unref($alert).text)}</div>`);
                    } else {
                      _push4(`<!---->`);
                    }
                    _push4(`</div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "fixed top-0 left-0 w-full h-full z-30" }, [
                        createVNode("div", {
                          class: "absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50",
                          onClick: close
                        }),
                        createVNode("div", {
                          class: ["p-12 min-w-xs md:min-w-sm absolute overflow-x-hidden overflow-y-auto transform -translate-x-1/2 -translate-y-7/12 rounded-lg max-w-11/12 backdrop-filter backdrop-blur left-1/2 top-1/2 max-h-4/5 bg-light-100/95 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-100/[0.15] shadow", [{ "text-center": unref($alert).center }]]
                        }, [
                          createVNode("img", {
                            class: "mx-auto mb-6 w-26",
                            src: unref(imgType)
                          }, null, 8, ["src"]),
                          unref($alert).title ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: ["text-lg pl-[0.1em] tracking-widest font-bold text-center", { "pb-4": unref($alert).text }]
                          }, toDisplayString(unref($alert).title), 3)) : createCommentVNode("", true),
                          unref($alert).text ? (openBlock(), createBlock("div", { key: 1 }, toDisplayString(unref($alert).text), 1)) : createCommentVNode("", true)
                        ], 2)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(oe), {
                  as: "template",
                  enter: "duration-150 linear",
                  "enter-from": "opacity-0",
                  "enter-to": "opacity-100",
                  leave: "duration-150 linear",
                  "leave-from": "opacity-100",
                  "leave-to": "opacity-0"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "fixed top-0 left-0 w-full h-full z-30" }, [
                      createVNode("div", {
                        class: "absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50",
                        onClick: close
                      }),
                      createVNode("div", {
                        class: ["p-12 min-w-xs md:min-w-sm absolute overflow-x-hidden overflow-y-auto transform -translate-x-1/2 -translate-y-7/12 rounded-lg max-w-11/12 backdrop-filter backdrop-blur left-1/2 top-1/2 max-h-4/5 bg-light-100/95 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-100/[0.15] shadow", [{ "text-center": unref($alert).center }]]
                      }, [
                        createVNode("img", {
                          class: "mx-auto mb-6 w-26",
                          src: unref(imgType)
                        }, null, 8, ["src"]),
                        unref($alert).title ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: ["text-lg pl-[0.1em] tracking-widest font-bold text-center", { "pb-4": unref($alert).text }]
                        }, toDisplayString(unref($alert).title), 3)) : createCommentVNode("", true),
                        unref($alert).text ? (openBlock(), createBlock("div", { key: 1 }, toDisplayString(unref($alert).text), 1)) : createCommentVNode("", true)
                      ], 2)
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Global/Alert.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_10 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-ea4bae02"]]);
const _sfc_main$5 = {
  name: "EosIconsLoading"
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24"
  }, _attrs))}><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"></path><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"></animateTransform></path></svg>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Icon/Loading.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Loading",
  __ssrInlineRender: true,
  setup(__props) {
    const $loading = useState("loading", () => false);
    const $bodyLock = useState("body.lock");
    watch(
      () => $loading.value,
      (val) => {
        $bodyLock.value = val;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_IconLoading = __nuxt_component_0;
      ssrRenderTeleport(_push, (_push2) => {
        _push2(ssrRenderComponent(unref(fe), {
          show: unref($loading),
          appear: ""
        }, {
          default: withCtx((_2, _push3, _parent2, _scopeId) => {
            if (_push3) {
              _push3(ssrRenderComponent(unref(oe), {
                as: "template",
                enter: "duration-150 linear",
                "enter-from": "opacity-0",
                "enter-to": "opacity-100",
                leave: "duration-150 linear",
                "leave-from": "opacity-100",
                "leave-to": "opacity-0"
              }, {
                default: withCtx((_22, _push4, _parent3, _scopeId2) => {
                  if (_push4) {
                    _push4(`<div class="fixed top-0 left-0 w-full h-full z-20" data-v-f01b506f${_scopeId2}><div class="absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50" data-v-f01b506f${_scopeId2}></div>`);
                    _push4(ssrRenderComponent(_component_IconLoading, { class: "absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl" }, null, _parent3, _scopeId2));
                    _push4(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "fixed top-0 left-0 w-full h-full z-20" }, [
                        createVNode("div", { class: "absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50" }),
                        createVNode(_component_IconLoading, { class: "absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl" })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(oe), {
                  as: "template",
                  enter: "duration-150 linear",
                  "enter-from": "opacity-0",
                  "enter-to": "opacity-100",
                  leave: "duration-150 linear",
                  "leave-from": "opacity-100",
                  "leave-to": "opacity-0"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "fixed top-0 left-0 w-full h-full z-20" }, [
                      createVNode("div", { class: "absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50" }),
                      createVNode(_component_IconLoading, { class: "absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl" })
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Global/Loading.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_11 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-f01b506f"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Popup",
  __ssrInlineRender: true,
  setup(__props) {
    const $tip = useState("tip.data", () => {
      return {
        id: 0,
        title: "",
        content: "",
        publishDate: ""
      };
    });
    const $show = useState("tip.show", () => false);
    const close = () => {
      $show.value = false;
    };
    const isCollection = ref(false);
    const collection = async (id) => {
      const { data, error } = await useHttpFetchPost("/tip/collection", {
        body: { id }
      });
      if (!error)
        isCollection.value = true;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      ssrRenderTeleport(_push, (_push2) => {
        _push2(ssrRenderComponent(unref(fe), {
          show: unref($show),
          appear: ""
        }, {
          default: withCtx((_2, _push3, _parent2, _scopeId) => {
            if (_push3) {
              _push3(ssrRenderComponent(unref(oe), {
                as: "template",
                enter: "duration-150 linear",
                "enter-from": "opacity-0",
                "enter-to": "opacity-100",
                leave: "duration-150 linear",
                "leave-from": "opacity-100",
                "leave-to": "opacity-0"
              }, {
                default: withCtx((_22, _push4, _parent3, _scopeId2) => {
                  if (_push4) {
                    _push4(`<div class="fixed top-0 left-0 w-full h-full z-20" data-v-b8baa62a${_scopeId2}><div class="absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50" data-v-b8baa62a${_scopeId2}></div><div class="px-10 pb-8 max-w-[44em] w-11/12 absolute overflow-x-hidden overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 rounded-lg backdrop-filter backdrop-blur left-1/2 top-1/2 max-h-4/5 bg-light-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-100/[0.15] shadow" data-v-b8baa62a${_scopeId2}>`);
                    if (unref($tip).title) {
                      _push4(`<div class="sticky top-0 pt-7 pb-2 flex flex-wrap justify-between text-lg pl-[0.1em] tracking-widest font-bold bg-light-100 dark:bg-gray-800" data-v-b8baa62a${_scopeId2}>${ssrInterpolate(unref($tip).title)} <div class="flex items-center space-x-3" data-v-b8baa62a${_scopeId2}><div class="cursor-pointer flex items-center" data-v-b8baa62a${_scopeId2}>`);
                      _push4(ssrRenderComponent(_component_UnoIcon, {
                        style: !unref(isCollection) ? null : { display: "none" },
                        class: "i-ion-heart-outline w-6"
                      }, null, _parent3, _scopeId2));
                      _push4(ssrRenderComponent(_component_UnoIcon, {
                        style: unref(isCollection) ? null : { display: "none" },
                        class: "i-ion-heart-sharp text-red-600 w-6"
                      }, null, _parent3, _scopeId2));
                      _push4(`</div>`);
                      _push4(ssrRenderComponent(_component_UnoIcon, {
                        class: "i-ion-ios-close-circle-outline text-2xl w-6 cursor-pointer",
                        onClick: close
                      }, null, _parent3, _scopeId2));
                      _push4(`</div></div>`);
                    } else {
                      _push4(`<!---->`);
                    }
                    _push4(`<div class="text-sm opacity-60 relative" data-v-b8baa62a${_scopeId2}>${ssrInterpolate(unref($tip).publishDate)}</div>`);
                    if (unref($tip).content) {
                      _push4(`<div class="py-4 relative" data-v-b8baa62a${_scopeId2}>${unref($tip).content}</div>`);
                    } else {
                      _push4(`<!---->`);
                    }
                    _push4(`</div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "fixed top-0 left-0 w-full h-full z-20" }, [
                        createVNode("div", {
                          class: "absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50",
                          onClick: close
                        }),
                        createVNode("div", { class: "px-10 pb-8 max-w-[44em] w-11/12 absolute overflow-x-hidden overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 rounded-lg backdrop-filter backdrop-blur left-1/2 top-1/2 max-h-4/5 bg-light-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-100/[0.15] shadow" }, [
                          unref($tip).title ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "sticky top-0 pt-7 pb-2 flex flex-wrap justify-between text-lg pl-[0.1em] tracking-widest font-bold bg-light-100 dark:bg-gray-800"
                          }, [
                            createTextVNode(toDisplayString(unref($tip).title) + " ", 1),
                            createVNode("div", { class: "flex items-center space-x-3" }, [
                              createVNode("div", {
                                class: "cursor-pointer flex items-center",
                                onClick: ($event) => collection(unref($tip).id)
                              }, [
                                withDirectives(createVNode(_component_UnoIcon, { class: "i-ion-heart-outline w-6" }, null, 512), [
                                  [vShow, !unref(isCollection)]
                                ]),
                                withDirectives(createVNode(_component_UnoIcon, { class: "i-ion-heart-sharp text-red-600 w-6" }, null, 512), [
                                  [vShow, unref(isCollection)]
                                ])
                              ], 8, ["onClick"]),
                              createVNode(_component_UnoIcon, {
                                class: "i-ion-ios-close-circle-outline text-2xl w-6 cursor-pointer",
                                onClick: close
                              })
                            ])
                          ])) : createCommentVNode("", true),
                          createVNode("div", { class: "text-sm opacity-60 relative" }, toDisplayString(unref($tip).publishDate), 1),
                          unref($tip).content ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "py-4 relative",
                            innerHTML: unref($tip).content
                          }, null, 8, ["innerHTML"])) : createCommentVNode("", true)
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(oe), {
                  as: "template",
                  enter: "duration-150 linear",
                  "enter-from": "opacity-0",
                  "enter-to": "opacity-100",
                  leave: "duration-150 linear",
                  "leave-from": "opacity-100",
                  "leave-to": "opacity-0"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "fixed top-0 left-0 w-full h-full z-20" }, [
                      createVNode("div", {
                        class: "absolute top-0 left-0 w-full h-full cursor-pointer backdrop-filter backdrop-blur-sm bg-dark-900/50",
                        onClick: close
                      }),
                      createVNode("div", { class: "px-10 pb-8 max-w-[44em] w-11/12 absolute overflow-x-hidden overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 rounded-lg backdrop-filter backdrop-blur left-1/2 top-1/2 max-h-4/5 bg-light-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-100/[0.15] shadow" }, [
                        unref($tip).title ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "sticky top-0 pt-7 pb-2 flex flex-wrap justify-between text-lg pl-[0.1em] tracking-widest font-bold bg-light-100 dark:bg-gray-800"
                        }, [
                          createTextVNode(toDisplayString(unref($tip).title) + " ", 1),
                          createVNode("div", { class: "flex items-center space-x-3" }, [
                            createVNode("div", {
                              class: "cursor-pointer flex items-center",
                              onClick: ($event) => collection(unref($tip).id)
                            }, [
                              withDirectives(createVNode(_component_UnoIcon, { class: "i-ion-heart-outline w-6" }, null, 512), [
                                [vShow, !unref(isCollection)]
                              ]),
                              withDirectives(createVNode(_component_UnoIcon, { class: "i-ion-heart-sharp text-red-600 w-6" }, null, 512), [
                                [vShow, unref(isCollection)]
                              ])
                            ], 8, ["onClick"]),
                            createVNode(_component_UnoIcon, {
                              class: "i-ion-ios-close-circle-outline text-2xl w-6 cursor-pointer",
                              onClick: close
                            })
                          ])
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "text-sm opacity-60 relative" }, toDisplayString(unref($tip).publishDate), 1),
                        unref($tip).content ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "py-4 relative",
                          innerHTML: unref($tip).content
                        }, null, 8, ["innerHTML"])) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Tip/Popup.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_12 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-b8baa62a"]]);
async function userController() {
  const isLogin = useState("isLogin", () => false);
  const route = useRoute();
  const router = useRouter();
  isLogin.value = false;
  const token = storage.get("token");
  if (token) {
    const { user, tip } = useBaseStore();
    const { token: userToken } = storeToRefs(user);
    userToken.value = token;
    const userInfo = await user.get();
    isLogin.value = true;
    tip.get();
    return {
      token,
      info: userInfo
    };
  }
  const $alert = useState("alert");
  if (route.meta.middleware && route.meta.middleware.includes("auth") && !isLogin.value) {
    setTimeout(() => {
      $alert.value = {
        type: "info",
        title: "請重新登入",
        action: () => {
          router.push("/");
        }
      };
    }, 500);
  }
  return { token };
}
function InitApp() {
  const app = {
    name: "BondingTechs 鍵結科技",
    author: {
      name: "Bryan",
      link: "#"
    }
  };
  useState("app", () => app);
  const size = sizeController();
  const user = userController();
  return {
    app,
    size,
    user
  };
}
const useDictStore = defineStore("dict", {
  state: () => ({
    data: null
  }),
  actions: {
    async get() {
      if (this.data)
        return this.data;
      const { data: dictData } = await useHttpFetchPost("/dict/data");
      this.data = dictData;
    },
    reset() {
      this.data = [];
    }
  }
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    InitApp();
    const locale = useState("locale.i18n");
    const app = useAppConfig();
    useHead({
      title: app.name,
      titleTemplate: "%s",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Nuxt 3 Awesome Starter"
        }
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }]
    });
    const dictStore = useDictStore();
    dictStore.get();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Html = Html;
      const _component_Body = Body;
      const _component_LayoutNavbar = _sfc_main$m;
      const _component_NuxtLayout = __nuxt_component_3;
      const _component_NuxtLoadingIndicator = __nuxt_component_4$2;
      const _component_NuxtPage = __nuxt_component_2$4;
      const _component_LayoutNavbarMobile = _sfc_main$l;
      const _component_ClientOnly = __nuxt_component_0$2;
      const _component_AuthPopup = __nuxt_component_8;
      const _component_GlobalMessage = __nuxt_component_9;
      const _component_GlobalAlert = __nuxt_component_10;
      const _component_GlobalLoading = __nuxt_component_11;
      const _component_TipPopup = __nuxt_component_12;
      _push(ssrRenderComponent(_component_Html, mergeProps({ lang: unref(locale) }, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Body, { class: "bg-white text-gray-800 antialiased transition-colors duration-300 dark:bg-gray-900 dark:text-gray-200" }, {
              default: withCtx((_22, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_LayoutNavbar, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_NuxtLayout, { class: "lt-lg:pb-14" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLoadingIndicator, null, null, _parent4, _scopeId3));
                        _push4(`<div class="relative"${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_NuxtPage, null, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode(_component_NuxtLoadingIndicator),
                          createVNode("div", { class: "relative" }, [
                            createVNode(_component_NuxtPage)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_LayoutNavbarMobile, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_ClientOnly, null, {}, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_LayoutNavbar),
                    createVNode(_component_NuxtLayout, { class: "lt-lg:pb-14" }, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLoadingIndicator),
                        createVNode("div", { class: "relative" }, [
                          createVNode(_component_NuxtPage)
                        ])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_LayoutNavbarMobile),
                    createVNode(_component_ClientOnly, null, {
                      default: withCtx(() => [
                        createVNode(_component_AuthPopup),
                        createVNode(_component_GlobalMessage),
                        createVNode(_component_GlobalAlert),
                        createVNode(_component_GlobalLoading),
                        createVNode(_component_TipPopup)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Body, { class: "bg-white text-gray-800 antialiased transition-colors duration-300 dark:bg-gray-900 dark:text-gray-200" }, {
                default: withCtx(() => [
                  createVNode(_component_LayoutNavbar),
                  createVNode(_component_NuxtLayout, { class: "lt-lg:pb-14" }, {
                    default: withCtx(() => [
                      createVNode(_component_NuxtLoadingIndicator),
                      createVNode("div", { class: "relative" }, [
                        createVNode(_component_NuxtPage)
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_LayoutNavbarMobile),
                  createVNode(_component_ClientOnly, null, {
                    default: withCtx(() => [
                      createVNode(_component_AuthPopup),
                      createVNode(_component_GlobalMessage),
                      createVNode(_component_GlobalAlert),
                      createVNode(_component_GlobalLoading),
                      createVNode(_component_TipPopup)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    (_error.stack || "").split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n");
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = /* @__PURE__ */ defineAsyncComponent(() => import('./_nuxt/error-404-06e4edc6.mjs').then((r2) => r2.default || r2));
    const _Error = /* @__PURE__ */ defineAsyncComponent(() => import('./_nuxt/error-500-0352c428.mjs').then((r2) => r2.default || r2));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ErrorComponent = _sfc_main$1;
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = /* @__PURE__ */ defineAsyncComponent(() => import('./_nuxt/island-renderer-a0a9bbfc.mjs').then((r2) => r2.default || r2));
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p2 = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p2);
        return false;
      }
    });
    const { islandContext } = nuxtApp.ssrContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RootComponent = _sfc_main;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.hooks.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);

export { htmlTag as A, _imports_0$1 as B, _sfc_main$s as C, defineNuxtRouteMiddleware as D, useAppConfig as E, _export_sfc as _, __nuxt_component_0$3 as a, __nuxt_component_1 as b, createError as c, useHttpPost as d, entry$1 as default, useState as e, useRouter as f, useHttpFetchPost as g, useBaseStore as h, _sfc_main$k as i, __nuxt_component_2$1 as j, __nuxt_component_2$3 as k, __nuxt_component_4$1 as l, emailRegex as m, useRoute as n, idCardRegex as o, phoneRegex as p, __nuxt_component_4 as q, __nuxt_component_5 as r, storeToRefs as s, __nuxt_component_0$2 as t, useHead as u, passwordRegex as v, __nuxt_component_2$2 as w, fe as x, oe as y, __nuxt_component_2$4 as z };
//# sourceMappingURL=server.mjs.map
