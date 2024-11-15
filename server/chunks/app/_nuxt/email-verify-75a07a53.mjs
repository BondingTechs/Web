import { defineComponent, useSSRContext } from 'vue';
import { n as useRoute, f as useRouter, e as useState } from '../server.mjs';
import { ssrRenderAttrs } from 'vue/server-renderer';
import '../../nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'axios';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'store';
import '@vue/runtime-core';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "email-verify",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    useState("loading");
    useState("alert");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between sticky"><div class="flex items-center space-x-2"><h1 class="text-xl font-bold">\u4FE1\u7BB1\u9A57\u8B49</h1></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/my/account/email-verify.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=email-verify-75a07a53.mjs.map
