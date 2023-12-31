import { b as __nuxt_component_1 } from '../server.mjs';
import { defineComponent, mergeProps, createVNode, resolveDynamicComponent, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderVNode, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Title",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "xl"
    },
    color: {
      type: String,
      default: ""
    },
    darkColor: {
      type: String,
      default: ""
    },
    tag: {
      type: String,
      default: "h2"
    },
    previous: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-wrap items-center justify-between py-3" }, _attrs))}><div class="flex items-center flex-1 space-x-1 lg:space-x-2">`);
      if (__props.previous) {
        _push(`<div class="flex items-center cursor-pointer">`);
        _push(ssrRenderComponent(_component_UnoIcon, { class: "i-uil-angle-left text-xl" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.tag), {
        class: [`
          lg:text-${__props.size}
          text-
          ${__props.color ? `text-${__props.color}` : ""}
          ${__props.darkColor ? `dark:text-${__props.darkColor}` : ""}
        `, "flex-1 font-bold ellipsis ellipsis-1"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.title), 1)
            ];
          }
        }),
        _: 1
      }), _parent);
      _push(`</div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Title.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Title-d6104910.mjs.map
