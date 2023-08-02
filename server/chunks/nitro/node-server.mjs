globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, isEvent, createEvent, getRequestHeader, splitCookiesString, eventHandler, setHeaders, sendRedirect, proxyRequest, setResponseStatus, setResponseHeader, getRequestHeaders, createError, getHeaders, readBody, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers as Headers$1 } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { klona } from 'klona';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, decodePath, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import unstorage_47drivers_47fs from 'unstorage/drivers/fs';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import axios from 'axios';
import gracefulShutdown from 'http-graceful-shutdown';

const defineAppConfig = (config) => config;

const appConfig0 = defineAppConfig({
  name: "BondingTechs \u9375\u7D50\u79D1\u6280",
  link: "/"
});

const inlineAppConfig = {};

const appConfig = defuFn(appConfig0, inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "apiBase": "https://admin.bondingtechs.com/api/app",
    "naiveUI": {
      "themeOverrides": ""
    }
  }
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"/Users/kurou/project/bonding-old/project/web/.data/kv","ignore":["**/node_modules/**","**/.git/**"]}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          const promise = useStorage().setItem(cacheKey, entry).catch((error) => {
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event && event.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && entry.value) {
      _resolvePromise.catch((error) => {
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function _captureError(error, type) {
  console.error(`[nitro] [${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : value;
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

const config$1 = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config$1.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const script = "const w=window,de=document.documentElement,knownColorSchemes=[\"dark\",\"light\"],preference=window.localStorage.getItem(\"color-mode\")||\"system\";let value=preference===\"system\"?getColorScheme():preference;const forcedColorMode=de.getAttribute(\"data-color-mode-forced\");forcedColorMode&&(value=forcedColorMode),addColorScheme(value),w[\"__NUXT_COLOR_MODE__\"]={preference,value,getColorScheme,addColorScheme,removeColorScheme};function addColorScheme(e){const o=\"\"+e+\"\",t=\"\";de.classList?de.classList.add(o):de.className+=\" \"+o,t&&de.setAttribute(\"data-\"+t,e)}function removeColorScheme(e){const o=\"\"+e+\"\",t=\"\";de.classList?de.classList.remove(o):de.className=de.className.replace(new RegExp(o,\"g\"),\"\"),t&&de.removeAttribute(\"data-\"+t)}function prefersColorScheme(e){return w.matchMedia(\"(prefers-color-scheme\"+e+\")\")}function getColorScheme(){if(w.matchMedia&&prefersColorScheme(\"\").media!==\"not all\"){for(const e of knownColorSchemes)if(prefersColorScheme(\":\"+e).matches)return e}return\"light\"}\n";

const _LeOLdCpUGt = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _LeOLdCpUGt
];

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(html);
});

const assets = {
  "/alert.png": {
    "type": "image/png",
    "etag": "\"e59-u8F3WhkCqZ5q0QozS6HqSS5+kZY\"",
    "mtime": "2023-08-02T05:55:36.648Z",
    "size": 3673,
    "path": "../public/alert.png"
  },
  "/check.png": {
    "type": "image/png",
    "etag": "\"1760-M/vvzqiL9wj0QCydFZ2TgyxpMxs\"",
    "mtime": "2023-08-02T05:55:36.649Z",
    "size": 5984,
    "path": "../public/check.png"
  },
  "/delete.png": {
    "type": "image/png",
    "etag": "\"1694-sWT+0R3lGg58+lRofgj/JiAhDpo\"",
    "mtime": "2023-08-02T05:55:36.650Z",
    "size": 5780,
    "path": "../public/delete.png"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n6vWsB/0mrFhK058ZiXDlZ73uYI\"",
    "mtime": "2023-08-02T05:55:36.649Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/favicon.png": {
    "type": "image/png",
    "etag": "\"2907-Zc8VR6UG1qaqZ5IjEdejQ+ZQ308\"",
    "mtime": "2023-08-02T05:55:36.648Z",
    "size": 10503,
    "path": "../public/favicon.png"
  },
  "/idea.png": {
    "type": "image/png",
    "etag": "\"fb9-BLDaO/q3GSU5wcRYZVcNFGtev3E\"",
    "mtime": "2023-08-02T05:55:36.647Z",
    "size": 4025,
    "path": "../public/idea.png"
  },
  "/logo.png": {
    "type": "image/png",
    "etag": "\"4f52-gxOib78RrRRu8ABV4I+eEa11Ios\"",
    "mtime": "2023-08-02T05:55:36.651Z",
    "size": 20306,
    "path": "../public/logo.png"
  },
  "/user.png": {
    "type": "image/png",
    "etag": "\"2064-ctE0Mb3jVvODWHvo10XwJm+FCZA\"",
    "mtime": "2023-08-02T05:55:36.650Z",
    "size": 8292,
    "path": "../public/user.png"
  },
  "/_nuxt/404.0be60800.js": {
    "type": "application/javascript",
    "etag": "\"af3-Cv7qPieFOlkB3PM+Ie1Evtf8O0A\"",
    "mtime": "2023-08-02T05:55:36.561Z",
    "size": 2803,
    "path": "../public/_nuxt/404.0be60800.js"
  },
  "/_nuxt/Editor.6dbe434a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"57e9-pdg2yynAD4RjlP28bIcl62XcQfk\"",
    "mtime": "2023-08-02T05:55:36.588Z",
    "size": 22505,
    "path": "../public/_nuxt/Editor.6dbe434a.css"
  },
  "/_nuxt/Editor.8a1be88e.js": {
    "type": "application/javascript",
    "etag": "\"7c9-MDZDB/LdZhN3xwILwahfu9/y2f0\"",
    "mtime": "2023-08-02T05:55:36.588Z",
    "size": 1993,
    "path": "../public/_nuxt/Editor.8a1be88e.js"
  },
  "/_nuxt/Filter.vue.b0ed8366.js": {
    "type": "application/javascript",
    "etag": "\"110-zyZomkaph08MNrQxvmjVvjBC/qg\"",
    "mtime": "2023-08-02T05:55:36.588Z",
    "size": 272,
    "path": "../public/_nuxt/Filter.vue.b0ed8366.js"
  },
  "/_nuxt/Header.9f1b2ca3.js": {
    "type": "application/javascript",
    "etag": "\"c6-U2SyePjc4s1msck0O8FL79oZH+8\"",
    "mtime": "2023-08-02T05:55:36.589Z",
    "size": 198,
    "path": "../public/_nuxt/Header.9f1b2ca3.js"
  },
  "/_nuxt/Row.67848543.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"38-jVeFLtOw99m2/TDBc3ZzNH8V+7M\"",
    "mtime": "2023-08-02T05:55:36.588Z",
    "size": 56,
    "path": "../public/_nuxt/Row.67848543.css"
  },
  "/_nuxt/Row.b0d19a64.js": {
    "type": "application/javascript",
    "etag": "\"778-bHTUX/A+OMdb2sYcddY7BN1dXb8\"",
    "mtime": "2023-08-02T05:55:36.589Z",
    "size": 1912,
    "path": "../public/_nuxt/Row.b0d19a64.js"
  },
  "/_nuxt/Row.vue.21a237bd.js": {
    "type": "application/javascript",
    "etag": "\"d17-OUFt/4i2+KqCD4F+68PpyLMbXBI\"",
    "mtime": "2023-08-02T05:55:36.589Z",
    "size": 3351,
    "path": "../public/_nuxt/Row.vue.21a237bd.js"
  },
  "/_nuxt/RowLoading.814d0167.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18e-FB00mqCR99KEJDmpdlfEaTHvMrY\"",
    "mtime": "2023-08-02T05:55:36.590Z",
    "size": 398,
    "path": "../public/_nuxt/RowLoading.814d0167.css"
  },
  "/_nuxt/RowLoading.dad17bc5.js": {
    "type": "application/javascript",
    "etag": "\"571-r8Nxj65uHDdlzByvOPzaItJsWh8\"",
    "mtime": "2023-08-02T05:55:36.590Z",
    "size": 1393,
    "path": "../public/_nuxt/RowLoading.dad17bc5.js"
  },
  "/_nuxt/Title.vue.47a3962d.js": {
    "type": "application/javascript",
    "etag": "\"3fa-upNf+98JPa2YlwFosgIX1jqvSdA\"",
    "mtime": "2023-08-02T05:55:36.589Z",
    "size": 1018,
    "path": "../public/_nuxt/Title.vue.47a3962d.js"
  },
  "/_nuxt/Wrapper.b653da80.js": {
    "type": "application/javascript",
    "etag": "\"1de-y4lXK3lycLk2GAEqft24xoXKnh4\"",
    "mtime": "2023-08-02T05:55:36.589Z",
    "size": 478,
    "path": "../public/_nuxt/Wrapper.b653da80.js"
  },
  "/_nuxt/_articleSlug_.1f14dbe5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"163-rxfHDyxJnx3T+fPZJ5Mdm9pBD54\"",
    "mtime": "2023-08-02T05:55:36.590Z",
    "size": 355,
    "path": "../public/_nuxt/_articleSlug_.1f14dbe5.css"
  },
  "/_nuxt/_articleSlug_.3ce9fb35.js": {
    "type": "application/javascript",
    "etag": "\"d257-4Lb8ZqX6LVr6B+semrN7ZWb6DaY\"",
    "mtime": "2023-08-02T05:55:36.591Z",
    "size": 53847,
    "path": "../public/_nuxt/_articleSlug_.3ce9fb35.js"
  },
  "/_nuxt/_categorySlug_.330bd3b4.js": {
    "type": "application/javascript",
    "etag": "\"bed-oWWwecGHmCl3TYv3z5P5BDVlZ0Y\"",
    "mtime": "2023-08-02T05:55:36.593Z",
    "size": 3053,
    "path": "../public/_nuxt/_categorySlug_.330bd3b4.js"
  },
  "/_nuxt/_categorySlug_.42b28087.js": {
    "type": "application/javascript",
    "etag": "\"85a-cs1cncxQwrnRXK1FrJMQ9M/Y80w\"",
    "mtime": "2023-08-02T05:55:36.594Z",
    "size": 2138,
    "path": "../public/_nuxt/_categorySlug_.42b28087.js"
  },
  "/_nuxt/auth.0225f0ca.js": {
    "type": "application/javascript",
    "etag": "\"e0-gFfk3vYqV9rQRgH6O2AhrocSFwg\"",
    "mtime": "2023-08-02T05:55:36.596Z",
    "size": 224,
    "path": "../public/_nuxt/auth.0225f0ca.js"
  },
  "/_nuxt/blog.e1197ac2.js": {
    "type": "application/javascript",
    "etag": "\"a83-L6/Ebc5FhVmrFCw/3pe1uOe4tpA\"",
    "mtime": "2023-08-02T05:55:36.594Z",
    "size": 2691,
    "path": "../public/_nuxt/blog.e1197ac2.js"
  },
  "/_nuxt/categories.6fe8dcd2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"60-c30FKhBqojcbkNE+vZpye02iHPU\"",
    "mtime": "2023-08-02T05:55:36.594Z",
    "size": 96,
    "path": "../public/_nuxt/categories.6fe8dcd2.css"
  },
  "/_nuxt/categories.9162fd81.js": {
    "type": "application/javascript",
    "etag": "\"651-tkgmWYKHCNAuPwOwwNLDnQjlKvU\"",
    "mtime": "2023-08-02T05:55:36.594Z",
    "size": 1617,
    "path": "../public/_nuxt/categories.9162fd81.js"
  },
  "/_nuxt/change-phone.e9dd273d.js": {
    "type": "application/javascript",
    "etag": "\"c52-qEMtuYLAP2uJFHcxCHy77mwwKiQ\"",
    "mtime": "2023-08-02T05:55:36.596Z",
    "size": 3154,
    "path": "../public/_nuxt/change-phone.e9dd273d.js"
  },
  "/_nuxt/collections.7af4ae37.js": {
    "type": "application/javascript",
    "etag": "\"9c9-rJYz9oUM4d62hSSU9U3tvPwUNwY\"",
    "mtime": "2023-08-02T05:55:36.596Z",
    "size": 2505,
    "path": "../public/_nuxt/collections.7af4ae37.js"
  },
  "/_nuxt/default.8dd4a553.js": {
    "type": "application/javascript",
    "etag": "\"bb-8iHg3hsq70w3GmbR0xrhNNzSQsI\"",
    "mtime": "2023-08-02T05:55:36.596Z",
    "size": 187,
    "path": "../public/_nuxt/default.8dd4a553.js"
  },
  "/_nuxt/email-binding.82eb1fe2.js": {
    "type": "application/javascript",
    "etag": "\"695-Pbsog4NG55TkhJ7FEEAbgUq2N1U\"",
    "mtime": "2023-08-02T05:55:36.596Z",
    "size": 1685,
    "path": "../public/_nuxt/email-binding.82eb1fe2.js"
  },
  "/_nuxt/email-verify.28e1e19b.js": {
    "type": "application/javascript",
    "etag": "\"2e9-/jb73D/Tw1nhyeOY/t/9XYOeaWM\"",
    "mtime": "2023-08-02T05:55:36.596Z",
    "size": 745,
    "path": "../public/_nuxt/email-verify.28e1e19b.js"
  },
  "/_nuxt/entry.abb81c9a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f98a-lQpBpAL529mRFg0PgVwweFiROv8\"",
    "mtime": "2023-08-02T05:55:36.610Z",
    "size": 63882,
    "path": "../public/_nuxt/entry.abb81c9a.css"
  },
  "/_nuxt/entry.e1c28201.js": {
    "type": "application/javascript",
    "etag": "\"5af9b-9bER8y1Lj/Nv86jaP20rJ/hEssU\"",
    "mtime": "2023-08-02T05:55:36.604Z",
    "size": 372635,
    "path": "../public/_nuxt/entry.e1c28201.js"
  },
  "/_nuxt/error-404.0cd4f3dd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-xSUIdUjWxTJYnmfP1riaGwPeEHA\"",
    "mtime": "2023-08-02T05:55:36.598Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.0cd4f3dd.css"
  },
  "/_nuxt/error-404.61fae749.js": {
    "type": "application/javascript",
    "etag": "\"8ad-KH5+uwX1+ysbKHY1grqxKf40XFo\"",
    "mtime": "2023-08-02T05:55:36.597Z",
    "size": 2221,
    "path": "../public/_nuxt/error-404.61fae749.js"
  },
  "/_nuxt/error-500.2a0ee54a.js": {
    "type": "application/javascript",
    "etag": "\"756-gn1G7jByOvNtkBLuX8q5wLokVqo\"",
    "mtime": "2023-08-02T05:55:36.602Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.2a0ee54a.js"
  },
  "/_nuxt/error-500.748cb764.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-LfCvP8U7J9Fa9L8g6sKzV6Rcp+A\"",
    "mtime": "2023-08-02T05:55:36.602Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.748cb764.css"
  },
  "/_nuxt/history.9d7bcab9.js": {
    "type": "application/javascript",
    "etag": "\"9b9-b/QfsJJKJTGb1x7zyGp1V1bHLUo\"",
    "mtime": "2023-08-02T05:55:36.602Z",
    "size": 2489,
    "path": "../public/_nuxt/history.9d7bcab9.js"
  },
  "/_nuxt/identity-verify.40ade001.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c-X7830q9uGgjKaHX9sMbMEtiWtHw\"",
    "mtime": "2023-08-02T05:55:36.607Z",
    "size": 44,
    "path": "../public/_nuxt/identity-verify.40ade001.css"
  },
  "/_nuxt/identity-verify.5f0e84e3.js": {
    "type": "application/javascript",
    "etag": "\"d26-I/FND+y/QJ+ihWT9QjuCltMKi84\"",
    "mtime": "2023-08-02T05:55:36.610Z",
    "size": 3366,
    "path": "../public/_nuxt/identity-verify.5f0e84e3.js"
  },
  "/_nuxt/index.090b782c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2e-EBs76Hi6aSSrjeNzR/qn6enhfz4\"",
    "mtime": "2023-08-02T05:55:36.609Z",
    "size": 46,
    "path": "../public/_nuxt/index.090b782c.css"
  },
  "/_nuxt/index.4f5670af.js": {
    "type": "application/javascript",
    "etag": "\"1475-2fM43JHbZ8AkLfEWJB47L0TSwiM\"",
    "mtime": "2023-08-02T05:55:36.609Z",
    "size": 5237,
    "path": "../public/_nuxt/index.4f5670af.js"
  },
  "/_nuxt/index.78aa373c.js": {
    "type": "application/javascript",
    "etag": "\"186e3-UqhCEdzE8d7GmNxnqt3MtJaQNDs\"",
    "mtime": "2023-08-02T05:55:36.611Z",
    "size": 100067,
    "path": "../public/_nuxt/index.78aa373c.js"
  },
  "/_nuxt/index.d17be6e4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2b60-FGa845uynvZs7IkrspzEdT5xxaU\"",
    "mtime": "2023-08-02T05:55:36.609Z",
    "size": 11104,
    "path": "../public/_nuxt/index.d17be6e4.css"
  },
  "/_nuxt/index.f5ab9668.js": {
    "type": "application/javascript",
    "etag": "\"615-wFKw+cx3Oo6AJR0IGKs0IXXG4IA\"",
    "mtime": "2023-08-02T05:55:36.611Z",
    "size": 1557,
    "path": "../public/_nuxt/index.f5ab9668.js"
  },
  "/_nuxt/index.fb9fbf1b.js": {
    "type": "application/javascript",
    "etag": "\"74b-PEVapobRPIp01f8ougIMxQIlEHs\"",
    "mtime": "2023-08-02T05:55:36.613Z",
    "size": 1867,
    "path": "../public/_nuxt/index.fb9fbf1b.js"
  },
  "/_nuxt/member-rule.f402e06c.js": {
    "type": "application/javascript",
    "etag": "\"24ff-qv5lX1fR18ryp1TC8Rouko1DpMI\"",
    "mtime": "2023-08-02T05:55:36.611Z",
    "size": 9471,
    "path": "../public/_nuxt/member-rule.f402e06c.js"
  },
  "/_nuxt/my.59a4bb37.js": {
    "type": "application/javascript",
    "etag": "\"765-XfQaveSBgKjsL+lHUFsFWxDBD5o\"",
    "mtime": "2023-08-02T05:55:36.619Z",
    "size": 1893,
    "path": "../public/_nuxt/my.59a4bb37.js"
  },
  "/_nuxt/my.f9e076ed.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"c2-48ITAeYyDgSkF81bwcYZiOQlJCM\"",
    "mtime": "2023-08-02T05:55:36.613Z",
    "size": 194,
    "path": "../public/_nuxt/my.f9e076ed.css"
  },
  "/_nuxt/reset-password.96369b22.js": {
    "type": "application/javascript",
    "etag": "\"8ad-Z0urbn1HOICnUKzR0PFA+kvSsUU\"",
    "mtime": "2023-08-02T05:55:36.619Z",
    "size": 2221,
    "path": "../public/_nuxt/reset-password.96369b22.js"
  },
  "/_nuxt/tips.580fc5a4.js": {
    "type": "application/javascript",
    "etag": "\"629-GwJam2gpMh4jL4Fbsby50Rl2Ueg\"",
    "mtime": "2023-08-02T05:55:36.613Z",
    "size": 1577,
    "path": "../public/_nuxt/tips.580fc5a4.js"
  },
  "/_nuxt/vue-quill.esm-bundler.b9ec1876.js": {
    "type": "application/javascript",
    "etag": "\"3ea85-/EOUrAChd7B9cwzqXI8XHdbHnFk\"",
    "mtime": "2023-08-02T05:55:36.621Z",
    "size": 256645,
    "path": "../public/_nuxt/vue-quill.esm-bundler.b9ec1876.js"
  },
  "/assets/gem/gem.gltf": {
    "type": "model/gltf+json",
    "etag": "\"110749-1GN9iIUMOjMyfvoL74c4OkTP8W8\"",
    "mtime": "2023-08-02T05:55:36.658Z",
    "size": 1115977,
    "path": "../public/assets/gem/gem.gltf"
  },
  "/assets/gem/roughness.jpeg": {
    "type": "image/jpeg",
    "etag": "\"8da04-G+tH2LcY/L0u0+bny8RdV9AZ54Q\"",
    "mtime": "2023-08-02T05:55:36.650Z",
    "size": 580100,
    "path": "../public/assets/gem/roughness.jpeg"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    if (!event.handled) {
      event.node.res.statusCode = 304;
      event.node.res.end();
    }
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const config = useRuntimeConfig();
const request = axios.create({
  baseURL: config.public.apiBase,
  timeout: 5e3
});
request.interceptors.request.use(
  (req) => {
    return req;
  }
);
request.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  (error) => {
    var _a, _b;
    return Promise.reject((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) != null ? _b : error);
  }
);
const request$1 = request;

const _N9vgvX = defineEventHandler(async (event) => {
  var _a, _b;
  const headers = getHeaders(event);
  const { authorization } = headers;
  const method = event.req.method;
  const isMultipart = ((_a = headers["content-type"]) == null ? void 0 : _a.split("/").shift()) === "multipart";
  if (method === "POST" && !isMultipart) {
    const body = await readBody(event);
    if (body == null ? void 0 : body.server)
      request$1.server = true;
    else
      (_b = request$1) == null ? true : delete _b.server;
  }
  if (authorization)
    request$1.defaults.headers.Authorization = authorization;
  else
    request$1.defaults.headers.Authorization = "";
});

const _lazy_C83hTe = () => import('../_type_-captcha.post.mjs');
const _lazy_4b9b63 = () => import('../forgot.post.mjs');
const _lazy_GcFOtU = () => import('../login.post.mjs');
const _lazy_QwfCYX = () => import('../refresh.post.mjs');
const _lazy_bawgUu = () => import('../register.post.mjs');
const _lazy_5RLLTG = () => import('../info.post.mjs');
const _lazy_1YSYMZ = () => import('../upload.post.mjs');
const _lazy_3lrUgM = () => import('../create.post.mjs');
const _lazy_SdjVUU = () => import('../like.post.mjs');
const _lazy_dSpQx5 = () => import('../page.post.mjs');
const _lazy_KYTGYZ = () => import('../data.post.mjs');
const _lazy_wiznS0 = () => import('../agent.post.mjs');
const _lazy_A9SbtR = () => import('../history.post.mjs');
const _lazy_AOBusy = () => import('../info.post2.mjs');
const _lazy_RexJ3b = () => import('../collections.post.mjs');
const _lazy_xa4aO4 = () => import('../history.post2.mjs');
const _lazy_uC6rqN = () => import('../tips.post.mjs');
const _lazy_xfGsNT = () => import('../article.post.mjs');
const _lazy_WfYHF9 = () => import('../categories.post.mjs');
const _lazy_mmpVVf = () => import('../collection.post.mjs');
const _lazy_LjGqra = () => import('../like.post2.mjs');
const _lazy_KlDX7L = () => import('../list.post.mjs');
const _lazy_kqeIPl = () => import('../page.post2.mjs');
const _lazy_U8LvP5 = () => import('../collection.post2.mjs');
const _lazy_eew2Hq = () => import('../info.post3.mjs');
const _lazy_EjHYX9 = () => import('../today.post.mjs');
const _lazy_BM2WtC = () => import('../change-phone.post.mjs');
const _lazy_dpNJOn = () => import('../email-binding.post.mjs');
const _lazy_sK0ty0 = () => import('../email-verify.post.mjs');
const _lazy_TCTbda = () => import('../identity-verify.post.mjs');
const _lazy_4BOZ5H = () => import('../logout.post.mjs');
const _lazy_srvnSI = () => import('../person.post.mjs');
const _lazy_czhJAl = () => import('../reset-password.post.mjs');
const _lazy_BhKWOr = () => import('../update.post.mjs');
const _lazy_iYKhCV = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _N9vgvX, lazy: false, middleware: true, method: undefined },
  { route: '/api/auth/:type-captcha', handler: _lazy_C83hTe, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/forgot', handler: _lazy_4b9b63, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_GcFOtU, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/refresh', handler: _lazy_QwfCYX, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/register', handler: _lazy_bawgUu, lazy: true, middleware: false, method: "post" },
  { route: '/api/category/info', handler: _lazy_5RLLTG, lazy: true, middleware: false, method: "post" },
  { route: '/api/comm/upload', handler: _lazy_1YSYMZ, lazy: true, middleware: false, method: "post" },
  { route: '/api/comment/create', handler: _lazy_3lrUgM, lazy: true, middleware: false, method: "post" },
  { route: '/api/comment/like', handler: _lazy_SdjVUU, lazy: true, middleware: false, method: "post" },
  { route: '/api/comment/page', handler: _lazy_dSpQx5, lazy: true, middleware: false, method: "post" },
  { route: '/api/dict/data', handler: _lazy_KYTGYZ, lazy: true, middleware: false, method: "post" },
  { route: '/api/ip/agent', handler: _lazy_wiznS0, lazy: true, middleware: false, method: "post" },
  { route: '/api/ip/history', handler: _lazy_A9SbtR, lazy: true, middleware: false, method: "post" },
  { route: '/api/ip/info', handler: _lazy_AOBusy, lazy: true, middleware: false, method: "post" },
  { route: '/api/my/collections', handler: _lazy_RexJ3b, lazy: true, middleware: false, method: "post" },
  { route: '/api/my/history', handler: _lazy_xa4aO4, lazy: true, middleware: false, method: "post" },
  { route: '/api/my/tips', handler: _lazy_uC6rqN, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/article', handler: _lazy_xfGsNT, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/categories', handler: _lazy_WfYHF9, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/collection', handler: _lazy_mmpVVf, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/like', handler: _lazy_LjGqra, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/list', handler: _lazy_KlDX7L, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/page', handler: _lazy_kqeIPl, lazy: true, middleware: false, method: "post" },
  { route: '/api/tip/collection', handler: _lazy_U8LvP5, lazy: true, middleware: false, method: "post" },
  { route: '/api/tip/info', handler: _lazy_eew2Hq, lazy: true, middleware: false, method: "post" },
  { route: '/api/tip/today', handler: _lazy_EjHYX9, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/change-phone', handler: _lazy_BM2WtC, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/email-binding', handler: _lazy_dpNJOn, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/email-verify', handler: _lazy_sK0ty0, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/identity-verify', handler: _lazy_TCTbda, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/logout', handler: _lazy_4BOZ5H, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/person', handler: _lazy_srvnSI, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/reset-password', handler: _lazy_czhJAl, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/update', handler: _lazy_BhKWOr, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_iYKhCV, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_iYKhCV, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((_err) => {
      console.error("Error while capturing another error", _err);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    }
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const _localFetch = createFetch(localCall, globalThis.fetch);
  const localFetch = (...args) => {
    return _localFetch(...args).then(
      (response) => normalizeFetchResponse(response)
    );
  };
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (envContext?.waitUntil) {
          envContext.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  for (const plugin of plugins) {
    try {
      plugin(app);
    } catch (err) {
      captureError(err, { tags: ["plugin"] });
      throw err;
    }
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT, 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  gracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((err) => {
          console.error(err);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const listener = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, request$1 as r, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
