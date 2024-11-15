import { b as __nuxt_component_1 } from '../server.mjs';
import { _ as _sfc_main$1 } from './Row-af39bd36.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
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
  __name: "tips",
  __ssrInlineRender: true,
  setup(__props) {
    const list = ref([]);
    const pagination = ref({});
    const loading = ref(true);
    const loaded = computed(
      () => {
        var _a, _b, _c;
        return ((_a = pagination.value) == null ? void 0 : _a.total) <= ((_b = pagination.value) == null ? void 0 : _b.size) * ((_c = pagination.value) == null ? void 0 : _c.page);
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      const _component_TipRow = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-4" }, _attrs))}><div class="flex items-center sticky mb-4"><div class="lg:hidden mr-2 flex items-center cursor-pointer">`);
      _push(ssrRenderComponent(_component_UnoIcon, { class: "i-ic-round-arrow-back-ios text-sm lg:text-base" }, null, _parent));
      _push(`</div><h1 class="text-lg lg:text-xl font-bold">\u5C0F\u77E5\u8B58\u5217\u8868</h1></div><div class="list">`);
      _push(ssrRenderComponent(_component_TipRow, { list: unref(list) }, null, _parent));
      if (!unref(loading)) {
        _push(`<!--[--><div style="${ssrRenderStyle(!unref(loaded) ? null : { display: "none" })}" class="dark:text-gray-400 block border-t py-4 mt-3 font-bold text-center text-xs text-gray-500 border-gray-200 dark:border-gray-800 duration-300 border-b hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"><p>\u8F09\u5165\u66F4\u591A</p></div><div style="${ssrRenderStyle(unref(loaded) ? null : { display: "none" })}" class="text-center pt-8 text-xs font-bold tracking-widest opacity-50"> \u7121\u66F4\u591A\u8CC7\u6599... </div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/my/tips.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tips-f0001185.mjs.map
