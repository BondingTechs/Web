globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { eventHandler, setHeaders, sendRedirect, defineEventHandler, handleCacheHeaders, createEvent, getRequestHeader, getRequestHeaders, setResponseHeader, createError, getHeaders, useBody, createApp, createRouter as createRouter$1, lazyEventHandler, toNodeListener } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ohmyfetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, withLeadingSlash, withoutTrailingSlash, joinURL } from 'ufo';
import { createStorage } from 'unstorage';
import defu from 'defu';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import axios from 'axios';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routeRules":{"/__nuxt_error":{"cache":false}},"envPrefix":"NUXT_"},"public":{"naiveUI":{}}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config$1 = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config$1;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
const timingMiddleware = eventHandler((event) => {
  const start = globalTiming.start();
  const _end = event.res.end;
  event.res.end = function(chunk, encoding, cb) {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!event.res.headersSent) {
      event.res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(event.res, chunk, encoding, cb);
    return this;
  }.bind(event.res);
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
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

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(createRouter({ routes: config.nitro.routeRules }));
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(event, routeRules.redirect.to, routeRules.redirect.statusCode);
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(path);
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      if (validate(entry)) {
        useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      const url = event.req.originalUrl || event.req.url;
      const friendlyName = decodeURI(parseURL(url).pathname).replace(/[^a-zA-Z0-9]/g, "").substring(0, 16);
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
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    let _resSendBody;
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
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
    const headers = event.res.getHeaders();
    headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
    headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || new Date().toUTCString();
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
    if (cacheControl.length) {
      headers["cache-control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
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

const script = "const w=window,de=document.documentElement,knownColorSchemes=[\"dark\",\"light\"],preference=window.localStorage.getItem(\"color-mode\")||\"system\";let value=preference===\"system\"?getColorScheme():preference;const forcedColorMode=de.getAttribute(\"data-color-mode-forced\");forcedColorMode&&(value=forcedColorMode),addColorScheme(value),w[\"__NUXT_COLOR_MODE__\"]={preference,value,getColorScheme,addColorScheme,removeColorScheme};function addColorScheme(e){const o=\"\"+e+\"\",t=\"\";de.classList?de.classList.add(o):de.className+=\" \"+o,t&&de.setAttribute(\"data-\"+t,e)}function removeColorScheme(e){const o=\"\"+e+\"\",t=\"\";de.classList?de.classList.remove(o):de.className=de.className.replace(new RegExp(o,\"g\"),\"\"),t&&de.removeAttribute(\"data-\"+t)}function prefersColorScheme(e){return w.matchMedia(\"(prefers-color-scheme\"+e+\")\")}function getColorScheme(){if(w.matchMedia&&prefersColorScheme(\"\").media!==\"not all\"){for(const e of knownColorSchemes)if(prefersColorScheme(\":\"+e).matches)return e}return\"light\"}\n";

const _LeOLdCpUGt = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _LeOLdCpUGt
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
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

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.res.statusCode = errorObject.statusCode !== 200 && errorObject.statusCode || 500;
  if (errorObject.statusMessage) {
    event.res.statusMessage = errorObject.statusMessage;
  }
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
  if (isJsonRequest(event)) {
    event.res.setHeader("Content-Type", "application/json");
    event.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery("/__nuxt_error", errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    event.res.setHeader("Content-Type", "text/html;charset=UTF-8");
    event.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  if (res.status && res.status !== 200) {
    event.res.statusCode = res.status;
  }
  if (res.statusText) {
    event.res.statusMessage = res.statusText;
  }
  event.res.end(await res.text());
});

const assets = {
  "/alert.png": {
    "type": "image/png",
    "etag": "\"e59-u8F3WhkCqZ5q0QozS6HqSS5+kZY\"",
    "mtime": "2023-07-18T09:53:47.139Z",
    "size": 3673,
    "path": "../public/alert.png"
  },
  "/check.png": {
    "type": "image/png",
    "etag": "\"1760-M/vvzqiL9wj0QCydFZ2TgyxpMxs\"",
    "mtime": "2023-07-18T09:53:47.119Z",
    "size": 5984,
    "path": "../public/check.png"
  },
  "/delete.png": {
    "type": "image/png",
    "etag": "\"1694-sWT+0R3lGg58+lRofgj/JiAhDpo\"",
    "mtime": "2023-07-18T09:53:47.118Z",
    "size": 5780,
    "path": "../public/delete.png"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n6vWsB/0mrFhK058ZiXDlZ73uYI\"",
    "mtime": "2023-07-18T09:53:47.118Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/favicon.png": {
    "type": "image/png",
    "etag": "\"2907-Zc8VR6UG1qaqZ5IjEdejQ+ZQ308\"",
    "mtime": "2023-07-18T09:53:47.117Z",
    "size": 10503,
    "path": "../public/favicon.png"
  },
  "/idea.png": {
    "type": "image/png",
    "etag": "\"fb9-BLDaO/q3GSU5wcRYZVcNFGtev3E\"",
    "mtime": "2023-07-18T09:53:47.117Z",
    "size": 4025,
    "path": "../public/idea.png"
  },
  "/logo.png": {
    "type": "image/png",
    "etag": "\"4f52-gxOib78RrRRu8ABV4I+eEa11Ios\"",
    "mtime": "2023-07-18T09:53:47.116Z",
    "size": 20306,
    "path": "../public/logo.png"
  },
  "/user.png": {
    "type": "image/png",
    "etag": "\"2064-ctE0Mb3jVvODWHvo10XwJm+FCZA\"",
    "mtime": "2023-07-18T09:53:47.115Z",
    "size": 8292,
    "path": "../public/user.png"
  },
  "/_nuxt/404.43838b15.js": {
    "type": "application/javascript",
    "etag": "\"af3-OBEa7Z2laZfp+3GgMzijxA18Q4w\"",
    "mtime": "2023-07-18T09:53:47.113Z",
    "size": 2803,
    "path": "../public/_nuxt/404.43838b15.js"
  },
  "/_nuxt/Alert.17d057d1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d-JG+DdH/N3fFssAMzzY0CcM+Ckw0\"",
    "mtime": "2023-07-18T09:53:47.112Z",
    "size": 61,
    "path": "../public/_nuxt/Alert.17d057d1.css"
  },
  "/_nuxt/Alert.1cc33f58.js": {
    "type": "application/javascript",
    "etag": "\"735-JEBA5eGsUMqYvi+MHj8edUCUWuQ\"",
    "mtime": "2023-07-18T09:53:47.112Z",
    "size": 1845,
    "path": "../public/_nuxt/Alert.1cc33f58.js"
  },
  "/_nuxt/Editor.3a7ccaee.js": {
    "type": "application/javascript",
    "etag": "\"7cd-vJNW7QdFm5IPlySG2M4+sX9b67M\"",
    "mtime": "2023-07-18T09:53:47.111Z",
    "size": 1997,
    "path": "../public/_nuxt/Editor.3a7ccaee.js"
  },
  "/_nuxt/Editor.42d46a6e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"57f0-kHguQWcJz6AEDJOm+nvEHr4lsJ4\"",
    "mtime": "2023-07-18T09:53:47.110Z",
    "size": 22512,
    "path": "../public/_nuxt/Editor.42d46a6e.css"
  },
  "/_nuxt/Filter.vue_vue_type_script_setup_true_lang.0a78805a.js": {
    "type": "application/javascript",
    "etag": "\"14c-wTqt7djusXdOwlCqNFClsPSfAc0\"",
    "mtime": "2023-07-18T09:53:47.109Z",
    "size": 332,
    "path": "../public/_nuxt/Filter.vue_vue_type_script_setup_true_lang.0a78805a.js"
  },
  "/_nuxt/Header.1d8a3c67.js": {
    "type": "application/javascript",
    "etag": "\"c6-iHAedloAPgG4ElplcWVwzShK5YA\"",
    "mtime": "2023-07-18T09:53:47.108Z",
    "size": 198,
    "path": "../public/_nuxt/Header.1d8a3c67.js"
  },
  "/_nuxt/Loading.3aa882a9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d-LX8fqpVz4AB91vf0Ie5h9uybtK8\"",
    "mtime": "2023-07-18T09:53:47.107Z",
    "size": 61,
    "path": "../public/_nuxt/Loading.3aa882a9.css"
  },
  "/_nuxt/Loading.5964ce43.js": {
    "type": "application/javascript",
    "etag": "\"3e5-NLO+SByUFozC0x8WMqUULC2huWk\"",
    "mtime": "2023-07-18T09:53:47.107Z",
    "size": 997,
    "path": "../public/_nuxt/Loading.5964ce43.js"
  },
  "/_nuxt/Message.019921e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3d-z4oLKrmudp8Yy+5LM+i5WBkoTII\"",
    "mtime": "2023-07-18T09:53:47.106Z",
    "size": 61,
    "path": "../public/_nuxt/Message.019921e9.css"
  },
  "/_nuxt/Message.1a378f31.js": {
    "type": "application/javascript",
    "etag": "\"499-Byny7PuvFcxXDszZMyv8bTMQZTQ\"",
    "mtime": "2023-07-18T09:53:47.106Z",
    "size": 1177,
    "path": "../public/_nuxt/Message.1a378f31.js"
  },
  "/_nuxt/Row.67848543.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"38-jVeFLtOw99m2/TDBc3ZzNH8V+7M\"",
    "mtime": "2023-07-18T09:53:47.105Z",
    "size": 56,
    "path": "../public/_nuxt/Row.67848543.css"
  },
  "/_nuxt/Row.9fd416a8.js": {
    "type": "application/javascript",
    "etag": "\"778-oSEskPOZQt5vobXIMcP4prbp+r0\"",
    "mtime": "2023-07-18T09:53:47.104Z",
    "size": 1912,
    "path": "../public/_nuxt/Row.9fd416a8.js"
  },
  "/_nuxt/Row.vue_vue_type_script_setup_true_lang.7d30251f.js": {
    "type": "application/javascript",
    "etag": "\"d3a-bhbQz5o9bP4RqNmC0vaJ6VsIFbs\"",
    "mtime": "2023-07-18T09:53:47.104Z",
    "size": 3386,
    "path": "../public/_nuxt/Row.vue_vue_type_script_setup_true_lang.7d30251f.js"
  },
  "/_nuxt/RowLoading.461791a4.js": {
    "type": "application/javascript",
    "etag": "\"570-BEtK/zJVQAEkfu2+R4lnrH9RXdw\"",
    "mtime": "2023-07-18T09:53:47.103Z",
    "size": 1392,
    "path": "../public/_nuxt/RowLoading.461791a4.js"
  },
  "/_nuxt/RowLoading.814d0167.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18e-FB00mqCR99KEJDmpdlfEaTHvMrY\"",
    "mtime": "2023-07-18T09:53:47.102Z",
    "size": 398,
    "path": "../public/_nuxt/RowLoading.814d0167.css"
  },
  "/_nuxt/Title.vue_vue_type_script_setup_true_lang.5777533e.js": {
    "type": "application/javascript",
    "etag": "\"3f5-Y1krIkzEXiG2BB6LEk3REi9j7Q4\"",
    "mtime": "2023-07-18T09:53:47.101Z",
    "size": 1013,
    "path": "../public/_nuxt/Title.vue_vue_type_script_setup_true_lang.5777533e.js"
  },
  "/_nuxt/Wrapper.05f4891a.js": {
    "type": "application/javascript",
    "etag": "\"1de-ARIOqZkxMo6+H4E2RyBUr2iFQcw\"",
    "mtime": "2023-07-18T09:53:47.101Z",
    "size": 478,
    "path": "../public/_nuxt/Wrapper.05f4891a.js"
  },
  "/_nuxt/_articleSlug_.1f14dbe5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"163-rxfHDyxJnx3T+fPZJ5Mdm9pBD54\"",
    "mtime": "2023-07-18T09:53:47.100Z",
    "size": 355,
    "path": "../public/_nuxt/_articleSlug_.1f14dbe5.css"
  },
  "/_nuxt/_articleSlug_.6c064704.js": {
    "type": "application/javascript",
    "etag": "\"d28e-73ydAAPMmD4ArhH+onaX3CwHSAY\"",
    "mtime": "2023-07-18T09:53:47.099Z",
    "size": 53902,
    "path": "../public/_nuxt/_articleSlug_.6c064704.js"
  },
  "/_nuxt/_categorySlug_.2561ada2.js": {
    "type": "application/javascript",
    "etag": "\"cc7-lB+gt3FdSgWEcuzSo4hruD9eU7c\"",
    "mtime": "2023-07-18T09:53:47.097Z",
    "size": 3271,
    "path": "../public/_nuxt/_categorySlug_.2561ada2.js"
  },
  "/_nuxt/_categorySlug_.b56ccafc.js": {
    "type": "application/javascript",
    "etag": "\"8f3-+YdlYOl4Lp/8X/zCWRNcCVYNutg\"",
    "mtime": "2023-07-18T09:53:47.096Z",
    "size": 2291,
    "path": "../public/_nuxt/_categorySlug_.b56ccafc.js"
  },
  "/_nuxt/auth.324470cf.js": {
    "type": "application/javascript",
    "etag": "\"e1-MedQFHm8eUdFmIhNP2PoNsHn00s\"",
    "mtime": "2023-07-18T09:53:47.095Z",
    "size": 225,
    "path": "../public/_nuxt/auth.324470cf.js"
  },
  "/_nuxt/blog.6fe8dcd2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"60-c30FKhBqojcbkNE+vZpye02iHPU\"",
    "mtime": "2023-07-18T09:53:47.094Z",
    "size": 96,
    "path": "../public/_nuxt/blog.6fe8dcd2.css"
  },
  "/_nuxt/blog.cd10ad79.js": {
    "type": "application/javascript",
    "etag": "\"a87-zzDK/bAY369kz2JBk61NB9P4mGE\"",
    "mtime": "2023-07-18T09:53:47.093Z",
    "size": 2695,
    "path": "../public/_nuxt/blog.cd10ad79.js"
  },
  "/_nuxt/categories.29f6a361.js": {
    "type": "application/javascript",
    "etag": "\"651-HWzdC0OSOM2WKCk50vONLLHb/io\"",
    "mtime": "2023-07-18T09:53:47.092Z",
    "size": 1617,
    "path": "../public/_nuxt/categories.29f6a361.js"
  },
  "/_nuxt/categories.6fe8dcd2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"60-c30FKhBqojcbkNE+vZpye02iHPU\"",
    "mtime": "2023-07-18T09:53:47.091Z",
    "size": 96,
    "path": "../public/_nuxt/categories.6fe8dcd2.css"
  },
  "/_nuxt/change-phone.5c60d142.js": {
    "type": "application/javascript",
    "etag": "\"cc9-WB8tEBdw5qEXcqKcFZi11W5Xdxk\"",
    "mtime": "2023-07-18T09:53:47.090Z",
    "size": 3273,
    "path": "../public/_nuxt/change-phone.5c60d142.js"
  },
  "/_nuxt/collections.69dc2b4e.js": {
    "type": "application/javascript",
    "etag": "\"a57-H/cB59/BHdY+OEWHCFFkxSgMBr8\"",
    "mtime": "2023-07-18T09:53:47.088Z",
    "size": 2647,
    "path": "../public/_nuxt/collections.69dc2b4e.js"
  },
  "/_nuxt/default.8bdf4c23.js": {
    "type": "application/javascript",
    "etag": "\"b6-biSsZeEtDGLNXcPlC8/K7Qx64GA\"",
    "mtime": "2023-07-18T09:53:47.086Z",
    "size": 182,
    "path": "../public/_nuxt/default.8bdf4c23.js"
  },
  "/_nuxt/email-binding.a6f5f8fd.js": {
    "type": "application/javascript",
    "etag": "\"6f3-YgXJNHIlNk9IOiYov4BFNtBAZxw\"",
    "mtime": "2023-07-18T09:53:47.086Z",
    "size": 1779,
    "path": "../public/_nuxt/email-binding.a6f5f8fd.js"
  },
  "/_nuxt/email-verify.822d8324.js": {
    "type": "application/javascript",
    "etag": "\"302-FSeprWFWusGn90Z6a0BdFGP/Rk8\"",
    "mtime": "2023-07-18T09:53:47.085Z",
    "size": 770,
    "path": "../public/_nuxt/email-verify.822d8324.js"
  },
  "/_nuxt/en-US.5829c3d6.js": {
    "type": "application/javascript",
    "etag": "\"c1-mFamTCl7WNL49gcRn4s5iBCgEHA\"",
    "mtime": "2023-07-18T09:53:47.084Z",
    "size": 193,
    "path": "../public/_nuxt/en-US.5829c3d6.js"
  },
  "/_nuxt/entry.1b84bc2e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"252fa-KDTzGV8ImCHgp20lMvuO9/UXIXw\"",
    "mtime": "2023-07-18T09:53:47.083Z",
    "size": 152314,
    "path": "../public/_nuxt/entry.1b84bc2e.css"
  },
  "/_nuxt/entry.a49dae57.js": {
    "type": "application/javascript",
    "etag": "\"644cb-+MGj98gzq5b2rPwbvhwurqAyadY\"",
    "mtime": "2023-07-18T09:53:47.080Z",
    "size": 410827,
    "path": "../public/_nuxt/entry.a49dae57.js"
  },
  "/_nuxt/error-404.95a75cd1.js": {
    "type": "application/javascript",
    "etag": "\"8a8-utKY5p3JDMP5TdQuHyaBb63X/ZI\"",
    "mtime": "2023-07-18T09:53:47.074Z",
    "size": 2216,
    "path": "../public/_nuxt/error-404.95a75cd1.js"
  },
  "/_nuxt/error-404.dfdebc1f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-TySzBJMzcOOue3FcAGXOsPB/jtI\"",
    "mtime": "2023-07-18T09:53:47.074Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.dfdebc1f.css"
  },
  "/_nuxt/error-500.070cfe24.js": {
    "type": "application/javascript",
    "etag": "\"756-KnFCzM7hUYKzy/IaQv6B2Ey9Ygc\"",
    "mtime": "2023-07-18T09:53:47.073Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.070cfe24.js"
  },
  "/_nuxt/error-500.3e50ac36.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-zW53+6jUfsJkZINkhx/9SNadPR8\"",
    "mtime": "2023-07-18T09:53:47.072Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.3e50ac36.css"
  },
  "/_nuxt/error-component.ffaae37a.js": {
    "type": "application/javascript",
    "etag": "\"475-A+SaxmM2S47apBsc8nUZx1f0Blg\"",
    "mtime": "2023-07-18T09:53:47.072Z",
    "size": 1141,
    "path": "../public/_nuxt/error-component.ffaae37a.js"
  },
  "/_nuxt/history.eb0bf333.js": {
    "type": "application/javascript",
    "etag": "\"a47-F3/Y0nAjoP1R8FhHfvRhj1iHfvA\"",
    "mtime": "2023-07-18T09:53:47.071Z",
    "size": 2631,
    "path": "../public/_nuxt/history.eb0bf333.js"
  },
  "/_nuxt/identity-verify.40ade001.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2c-X7830q9uGgjKaHX9sMbMEtiWtHw\"",
    "mtime": "2023-07-18T09:53:47.070Z",
    "size": 44,
    "path": "../public/_nuxt/identity-verify.40ade001.css"
  },
  "/_nuxt/identity-verify.663dd972.js": {
    "type": "application/javascript",
    "etag": "\"e17-MaWach4PAjdQ8o1dQvLdVDpat10\"",
    "mtime": "2023-07-18T09:53:47.069Z",
    "size": 3607,
    "path": "../public/_nuxt/identity-verify.663dd972.js"
  },
  "/_nuxt/index.46716130.js": {
    "type": "application/javascript",
    "etag": "\"17c20-7sWOvUE2Fl+SCSFnkubqthcoECg\"",
    "mtime": "2023-07-18T09:53:47.068Z",
    "size": 97312,
    "path": "../public/_nuxt/index.46716130.js"
  },
  "/_nuxt/index.4bc92a47.js": {
    "type": "application/javascript",
    "etag": "\"158f-c1XzkK2hlKzLK41QmlUXRDUEhU0\"",
    "mtime": "2023-07-18T09:53:47.065Z",
    "size": 5519,
    "path": "../public/_nuxt/index.4bc92a47.js"
  },
  "/_nuxt/index.64d40c1f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2bdb-+BZ8QJoA+1OiPnQTPOc9+Oz3qrA\"",
    "mtime": "2023-07-18T09:53:47.065Z",
    "size": 11227,
    "path": "../public/_nuxt/index.64d40c1f.css"
  },
  "/_nuxt/index.7c8b7c89.js": {
    "type": "application/javascript",
    "etag": "\"645-ghU+tPd/eEIvZvugjC+1uWmEmQA\"",
    "mtime": "2023-07-18T09:53:47.064Z",
    "size": 1605,
    "path": "../public/_nuxt/index.7c8b7c89.js"
  },
  "/_nuxt/index.9d4d68aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2e-diaixvmDv5W0Ri7FHcszuLKY3S0\"",
    "mtime": "2023-07-18T09:53:47.063Z",
    "size": 46,
    "path": "../public/_nuxt/index.9d4d68aa.css"
  },
  "/_nuxt/index.b65e04b0.js": {
    "type": "application/javascript",
    "etag": "\"7f1-xadatjfjXasZk7gp+s1diL82IsU\"",
    "mtime": "2023-07-18T09:53:47.062Z",
    "size": 2033,
    "path": "../public/_nuxt/index.b65e04b0.js"
  },
  "/_nuxt/member-rule.9f5e9661.js": {
    "type": "application/javascript",
    "etag": "\"4806-URgAPBRZkaM+z/rvbbBp5c7t4Cs\"",
    "mtime": "2023-07-18T09:53:47.061Z",
    "size": 18438,
    "path": "../public/_nuxt/member-rule.9f5e9661.js"
  },
  "/_nuxt/my.1b38eee1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"bd-TgvpHxw+/vSKI1b2iFJBXdlDvXU\"",
    "mtime": "2023-07-18T09:53:47.060Z",
    "size": 189,
    "path": "../public/_nuxt/my.1b38eee1.css"
  },
  "/_nuxt/my.6a07ef21.js": {
    "type": "application/javascript",
    "etag": "\"75f-eXT49uFLyZLJ3XMiIdAwK+iOYos\"",
    "mtime": "2023-07-18T09:53:47.059Z",
    "size": 1887,
    "path": "../public/_nuxt/my.6a07ef21.js"
  },
  "/_nuxt/reset-password.85006204.js": {
    "type": "application/javascript",
    "etag": "\"959-LJmliO5L8es/HomdH+XG59vVpeE\"",
    "mtime": "2023-07-18T09:53:47.058Z",
    "size": 2393,
    "path": "../public/_nuxt/reset-password.85006204.js"
  },
  "/_nuxt/tips.231166b9.js": {
    "type": "application/javascript",
    "etag": "\"67b-a7LUM1x5hHkiFKNqPAsqDVs0JO0\"",
    "mtime": "2023-07-18T09:53:47.057Z",
    "size": 1659,
    "path": "../public/_nuxt/tips.231166b9.js"
  },
  "/_nuxt/vue-quill.esm-bundler.77d027a4.js": {
    "type": "application/javascript",
    "etag": "\"3e8a7-Ol2KaJVmCZhnOBdDZtrafHpI3FU\"",
    "mtime": "2023-07-18T09:53:47.056Z",
    "size": 256167,
    "path": "../public/_nuxt/vue-quill.esm-bundler.77d027a4.js"
  },
  "/assets/gem/gem.gltf": {
    "type": "model/gltf+json",
    "etag": "\"110749-1GN9iIUMOjMyfvoL74c4OkTP8W8\"",
    "mtime": "2023-07-18T09:53:47.138Z",
    "size": 1115977,
    "path": "../public/assets/gem/gem.gltf"
  },
  "/assets/gem/roughness.jpeg": {
    "type": "image/jpeg",
    "etag": "\"8da04-G+tH2LcY/L0u0+bny8RdV9AZ54Q\"",
    "mtime": "2023-07-18T09:53:47.125Z",
    "size": 580100,
    "path": "../public/assets/gem/roughness.jpeg"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = [];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  const encodingHeader = String(event.req.headers["accept-encoding"] || "");
  const encodings = encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort().concat([""]);
  if (encodings.length > 1) {
    event.res.setHeader("Vary", "Accept-Encoding");
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
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end();
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end();
      return;
    }
  }
  if (asset.type && !event.res.getHeader("Content-Type")) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.getHeader("ETag")) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.getHeader("Last-Modified")) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding && !event.res.getHeader("Content-Encoding")) {
    event.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size && !event.res.getHeader("Content-Length")) {
    event.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const request = axios.create({
  baseURL: "https://admin.bondingtechs.com/api/app",
  timeout: 5e3
});
request.interceptors.request.use(
  (req) => {
    return req;
  }
);
request.interceptors.response.use(
  (response) => {
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
    const body = await useBody(event);
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

const _lazy_BhKWOr = () => import('../update.post.mjs');
const _lazy_czhJAl = () => import('../reset-password.post.mjs');
const _lazy_srvnSI = () => import('../person.post.mjs');
const _lazy_4BOZ5H = () => import('../logout.post.mjs');
const _lazy_TCTbda = () => import('../identity-verify.post.mjs');
const _lazy_sK0ty0 = () => import('../email-verify.post.mjs');
const _lazy_dpNJOn = () => import('../email-binding.post.mjs');
const _lazy_BM2WtC = () => import('../change-phone.post.mjs');
const _lazy_EjHYX9 = () => import('../today.post.mjs');
const _lazy_eew2Hq = () => import('../info.post.mjs');
const _lazy_U8LvP5 = () => import('../collection.post.mjs');
const _lazy_kqeIPl = () => import('../page.post.mjs');
const _lazy_KlDX7L = () => import('../list.post.mjs');
const _lazy_LjGqra = () => import('../like.post.mjs');
const _lazy_mmpVVf = () => import('../collection.post2.mjs');
const _lazy_WfYHF9 = () => import('../categories.post.mjs');
const _lazy_xfGsNT = () => import('../article.post.mjs');
const _lazy_uC6rqN = () => import('../tips.post.mjs');
const _lazy_xa4aO4 = () => import('../history.post.mjs');
const _lazy_RexJ3b = () => import('../collections.post.mjs');
const _lazy_KYTGYZ = () => import('../data.post.mjs');
const _lazy_dSpQx5 = () => import('../page.post2.mjs');
const _lazy_SdjVUU = () => import('../like.post2.mjs');
const _lazy_3lrUgM = () => import('../create.post.mjs');
const _lazy_1YSYMZ = () => import('../upload.post.mjs');
const _lazy_5RLLTG = () => import('../info.post2.mjs');
const _lazy_bawgUu = () => import('../register.post.mjs');
const _lazy_QwfCYX = () => import('../refresh.post.mjs');
const _lazy_GcFOtU = () => import('../login.post.mjs');
const _lazy_4b9b63 = () => import('../forgot.post.mjs');
const _lazy_C83hTe = () => import('../_type_-captcha.post.mjs');
const _lazy_iYKhCV = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _N9vgvX, lazy: false, middleware: true, method: undefined },
  { route: '/api/user/update', handler: _lazy_BhKWOr, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/reset-password', handler: _lazy_czhJAl, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/person', handler: _lazy_srvnSI, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/logout', handler: _lazy_4BOZ5H, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/identity-verify', handler: _lazy_TCTbda, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/email-verify', handler: _lazy_sK0ty0, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/email-binding', handler: _lazy_dpNJOn, lazy: true, middleware: false, method: "post" },
  { route: '/api/user/change-phone', handler: _lazy_BM2WtC, lazy: true, middleware: false, method: "post" },
  { route: '/api/tip/today', handler: _lazy_EjHYX9, lazy: true, middleware: false, method: "post" },
  { route: '/api/tip/info', handler: _lazy_eew2Hq, lazy: true, middleware: false, method: "post" },
  { route: '/api/tip/collection', handler: _lazy_U8LvP5, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/page', handler: _lazy_kqeIPl, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/list', handler: _lazy_KlDX7L, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/like', handler: _lazy_LjGqra, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/collection', handler: _lazy_mmpVVf, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/categories', handler: _lazy_WfYHF9, lazy: true, middleware: false, method: "post" },
  { route: '/api/news/article', handler: _lazy_xfGsNT, lazy: true, middleware: false, method: "post" },
  { route: '/api/my/tips', handler: _lazy_uC6rqN, lazy: true, middleware: false, method: "post" },
  { route: '/api/my/history', handler: _lazy_xa4aO4, lazy: true, middleware: false, method: "post" },
  { route: '/api/my/collections', handler: _lazy_RexJ3b, lazy: true, middleware: false, method: "post" },
  { route: '/api/dict/data', handler: _lazy_KYTGYZ, lazy: true, middleware: false, method: "post" },
  { route: '/api/comment/page', handler: _lazy_dSpQx5, lazy: true, middleware: false, method: "post" },
  { route: '/api/comment/like', handler: _lazy_SdjVUU, lazy: true, middleware: false, method: "post" },
  { route: '/api/comment/create', handler: _lazy_3lrUgM, lazy: true, middleware: false, method: "post" },
  { route: '/api/comm/upload', handler: _lazy_1YSYMZ, lazy: true, middleware: false, method: "post" },
  { route: '/api/category/info', handler: _lazy_5RLLTG, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/register', handler: _lazy_bawgUu, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/refresh', handler: _lazy_QwfCYX, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_GcFOtU, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/forgot', handler: _lazy_4b9b63, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/:type-captcha', handler: _lazy_C83hTe, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_iYKhCV, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_iYKhCV, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(h.route.replace(/:\w+|\*\*/g, "_"));
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, request$1 as r, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
