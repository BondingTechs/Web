import { e as useState, f as useRouter, b as __nuxt_component_1, i as _sfc_main$j, k as __nuxt_component_2$1, _ as _export_sfc, g as useHttpFetchPost, h as useBaseStore } from '../server.mjs';
import { useSSRContext, defineComponent, reactive, withCtx, unref, createVNode, ref, computed } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderSlot, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
import 'cookie-es';
import 'ohash';
import 'store';
import 'axios';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Image",
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
    const imageData = ref("");
    const labelSizeStyles = reactive({
      lg: "text-base",
      md: "text-sm",
      sm: "text-xs",
      xs: "text-xs"
    });
    const labelSize = computed(() => labelSizeStyles.md);
    useState("message");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-d10ebd38><div class="${ssrRenderClass([unref(labelSize), "flex items-center mb-2"])}" data-v-d10ebd38><label${ssrRenderAttr("for", __props.id)} class="${ssrRenderClass([[{ "cursor-pointer": __props.id }], "block font-bold tracking-wide"])}" data-v-d10ebd38>${ssrInterpolate(__props.label)}</label>`);
      ssrRenderSlot(_ctx.$slots, "label", {}, null, _push, _parent);
      _push(`</div><div class="${ssrRenderClass([{ model: !unref(imageData) }, "relative border border-gray-300 border-opacity-40 rounded dark:bg-white/[0.05] bg-gray-100"])}" data-v-d10ebd38>`);
      if (unref(imageData).length > 0) {
        _push(`<div data-v-d10ebd38><img class="preview w-full h-full"${ssrRenderAttr("src", unref(imageData))} data-v-d10ebd38></div>`);
      } else {
        _push(`<div class="p-c text-xs" data-v-d10ebd38> \u9EDE\u64CA\u4E0A\u50B3\u5716\u7247 </div>`);
      }
      _push(`<input${ssrRenderAttr("id", __props.id)} type="file" accept="image/*" class="absolute w-full h-full cursor-pointer opacity-0 top-0 left-0"${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} data-v-d10ebd38></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form/Image.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d10ebd38"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "identity-verify",
  __ssrInlineRender: true,
  setup(__props) {
    const form = reactive({
      idCard: "",
      positive: null
    });
    const $loading = useState("loading");
    const $alert = useState("alert");
    const router = useRouter();
    const submit = async () => {
      $loading.value = true;
      const { error, message } = await useHttpFetchPost("/user/identity-verify", {
        body: form,
        multipart: true
      });
      $loading.value = false;
      if (error && message) {
        return $alert.value = {
          type: "error",
          text: message,
          center: true
        };
      }
      const { user } = useBaseStore();
      user.updateField({ identityStatus: 21, idCard: form.idCard });
      return $alert.value = {
        type: "success",
        text: "\u9001\u51FA\u6210\u529F\uFF0C\u7B49\u5F85\u7BA1\u7406\u54E1\u5BE9\u6838",
        center: true,
        action: () => router.push("/my/account")
      };
    };
    const verify = () => {
      if (!form.positive) {
        return $alert.value = {
          type: "error",
          text: "\u5C1A\u672A\u4E0A\u50B3\u7167\u7247",
          center: true
        };
      }
      submit();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      const _component_UIForm = _sfc_main$j;
      const _component_UIFormText = __nuxt_component_2$1;
      const _component_UIFormImage = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between sticky"><div class="flex items-center space-x-2"><div class="flex items-center cursor-pointer">`);
      _push(ssrRenderComponent(_component_UnoIcon, { class: "i-ic-round-arrow-back-ios text-sm lg:text-base" }, null, _parent));
      _push(`</div><h1 class="text-xl font-bold">\u8EAB\u4EFD\u9A57\u8B49</h1></div><div class="group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm"><span class="lg:pr-2 duration-150 pr-1"> \u9001\u51FA </span>`);
      _push(ssrRenderComponent(_component_UnoIcon, { class: "i-ic-round-arrow-forward-ios" }, null, _parent));
      _push(`</div></div><div class="py-3">`);
      _push(ssrRenderComponent(_component_UIForm, {
        class: "max-w-[28em]",
        onSubmit: verify
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIFormText, {
              modelValue: unref(form).idCard,
              "onUpdate:modelValue": ($event) => unref(form).idCard = $event,
              label: "\u8EAB\u5206\u8B49/\u8B77\u7167",
              class: "mb-5",
              require: true
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormImage, {
              id: "positive",
              modelValue: unref(form).positive,
              "onUpdate:modelValue": ($event) => unref(form).positive = $event,
              label: "\u7167\u7247",
              class: "mb-5",
              require: true
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIFormText, {
                modelValue: unref(form).idCard,
                "onUpdate:modelValue": ($event) => unref(form).idCard = $event,
                label: "\u8EAB\u5206\u8B49/\u8B77\u7167",
                class: "mb-5",
                require: true
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormImage, {
                id: "positive",
                modelValue: unref(form).positive,
                "onUpdate:modelValue": ($event) => unref(form).positive = $event,
                label: "\u7167\u7247",
                class: "mb-5",
                require: true
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/my/account/identity-verify.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=identity-verify-ddb0125f.mjs.map
