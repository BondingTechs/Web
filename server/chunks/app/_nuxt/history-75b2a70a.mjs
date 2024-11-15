import { g as useHttpFetchPost, b as __nuxt_component_1 } from '../server.mjs';
import { _ as __nuxt_component_6 } from './Row-54aece4a.mjs';
import { _ as _sfc_main$1 } from './Row-af39bd36.mjs';
import { defineComponent, ref, computed, withAsyncContext, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
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
import './RowLoading-6b7db892.mjs';

const size = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "history",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const list = ref([]);
    const pagination = ref({});
    const types = ref([
      { label: "\u65B0\u805E", value: "article" },
      { label: "\u5C0F\u77E5\u8B58", value: "tip" }
    ]);
    const type = ref("article");
    const loading = ref(true);
    const loaded = computed(
      () => pagination.value.total <= pagination.value.size * pagination.value.page
    );
    try {
      const { data } = ([__temp, __restore] = withAsyncContext(() => useHttpFetchPost("/my/history", {
        body: { size, type: type.value }
      })), __temp = await __temp, __restore(), __temp);
      list.value = data.list;
      pagination.value = data.pagination;
      loading.value = false;
    } catch {
    }
    const reset = () => {
      list.value = [];
      pagination.value = {};
    };
    watch(type, async (val) => {
      loading.value = true;
      reset();
      const { data } = await useHttpFetchPost("/my/history", {
        body: { size, type: val }
      });
      list.value = data.list;
      pagination.value = data.pagination;
      loading.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_UnoIcon = __nuxt_component_1;
      const _component_ArticleLoopRow = __nuxt_component_6;
      const _component_TipRow = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center sticky mb-3"><div class="lg:hidden mr-2 flex items-center cursor-pointer">`);
      _push(ssrRenderComponent(_component_UnoIcon, { class: "i-ic-round-arrow-back-ios text-sm lg:text-base" }, null, _parent));
      _push(`</div><h1 class="text-lg lg:text-xl font-bold">\u700F\u89BD\u7D00\u9304</h1></div><div class="flex flex-wrap items-center space-x-4 text-sm mb-3"><!--[-->`);
      ssrRenderList(unref(types), (item, index) => {
        _push(`<div class="${ssrRenderClass([{ "bg-gray-200 dark:bg-opacity-10": unref(type) === item.value }, "cursor-pointer h-8 leading-8 px-5 border border-gray-200 dark-border-opacity-20 rounded-full duration-200"])}">${ssrInterpolate(item.label)}</div>`);
      });
      _push(`<!--]--></div><div class="py-3">`);
      if (unref(type) === "article") {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_ArticleLoopRow, {
          tag: "h3",
          list: (_a = unref(list)) != null ? _a : [],
          infinite: true,
          loading: unref(loading)
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(type) === "tip") {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_TipRow, {
          list: (_b = unref(list)) != null ? _b : []
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/my/history.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=history-75b2a70a.mjs.map
