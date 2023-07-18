import { u as useState, h as useRouter, i as phoneRegex, j as useHttpFetchPost, k as useBaseStore, b as __nuxt_component_1, _ as _export_sfc } from '../server.mjs';
import { _ as _sfc_main$3 } from './Form.3e3fa813.mjs';
import { defineComponent, reactive, withCtx, createVNode, useSSRContext, computed, unref, ref, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderSlot, ssrRenderList } from 'vue/server-renderer';
import { _ as _sfc_main$4 } from './Text.045e0b5f.mjs';
import 'ohmyfetch';
import 'hookable';
import 'unctx';
import 'destr';
import 'ufo';
import 'h3';
import 'vue-router';
import 'cookie-es';
import 'is-https';
import '@intlify/core-base';
import 'ohash';
import 'store';
import 'defu';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'axios';

const _sfc_main$2 = {
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
    const defaultStyle = computed(
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
      _push(`</div><div class="relative model flex" data-v-20ac6568><select${ssrRenderAttr("value", __props.modelValue)} class="${ssrRenderClass([{ "text-center": _ctx.center }, unref(defaultStyle), unref(inputSize)])}" data-v-20ac6568><!--[-->`);
      ssrRenderList(__props.options, (option) => {
        _push(`<option${ssrRenderAttr("value", option)} data-v-20ac6568>${ssrInterpolate(option)}</option>`);
      });
      _push(`<!--]--></select></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form/Select.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-20ac6568"]]);
const _sfc_main$1 = {
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
    const defaultStyle = `
  block w-full border
  duration-200 
  bg-transparent border-gray-600/[0.3] focus:bg-gray-200
  dark:border-gray-50/[0.2] dark:focus:bg-gray-800
`;
    ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mb-1 form-group form-group__captcha" }, _attrs))}><label${ssrRenderAttr("for", __props.id)} class="block mb-2 font-bold tracking-wide cursor-pointer text-sm">${ssrInterpolate(__props.label)}</label><div class="flex"><input${ssrRenderAttr("placeholder", __props.placeholder)} class="${ssrRenderClass([defaultStyle, "h-10 px-4 text-base rounded"])}" type="text"${ssrRenderAttr("value", __props.modelValue)}></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UI/Form/Captcha.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "change-phone",
  __ssrInlineRender: true,
  setup(__props) {
    const form = reactive({
      area: "+886",
      phone: "",
      verifyCode: ""
    });
    const $message = useState("message");
    const $alert = useState("alert");
    const $loading = useState("loading");
    const getCaptcha = async () => {
      if (!form.phone.length)
        return $message.value = "\u5C1A\u672A\u8F38\u5165\u624B\u6A5F\u865F\u78BC";
      if (!phoneRegex.test(form.phone))
        return $message.value = "\u865F\u78BC\u683C\u5F0F\u932F\u8AA4";
      $loading.value = true;
      const { data, error, message } = await useHttpFetchPost(
        "/auth/change-captcha",
        {
          body: { area: form.area, phone: form.phone }
        }
      );
      $loading.value = false;
      if (error && message) {
        $alert.value = {
          type: "error",
          text: message,
          center: true
        };
      }
      if (data)
        $alert.value = { type: "success", title: "\u767C\u9001\u6210\u529F\uFF0C\u8ACB\u7559\u610F\u624B\u6A5F\u7C21\u8A0A" };
    };
    const router = useRouter();
    const submit = async () => {
      const $loading2 = useState("loading");
      $loading2.value = true;
      const { data, error, message } = await useHttpFetchPost(
        "/user/change-phone",
        { body: form }
      );
      $loading2.value = false;
      if (error && message) {
        $alert.value = {
          type: "error",
          text: message,
          center: true
        };
      }
      if (data) {
        $alert.value = {
          type: "success",
          title: "\u4FEE\u6539\u6210\u529F",
          action: () => router.go(-1)
        };
        const { user } = useBaseStore();
        user.updateField({ phone: form.phone });
      }
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
      const _component_UIForm = _sfc_main$3;
      const _component_UIFormSelect = __nuxt_component_2;
      const _component_UIFormText = _sfc_main$4;
      const _component_UIFormCaptcha = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between sticky"><div class="flex items-center space-x-2"><div class="flex items-center cursor-pointer">`);
      _push(ssrRenderComponent(_component_UnoIcon, { class: "i-ic-round-arrow-back-ios text-sm lg:text-base" }, null, _parent));
      _push(`</div><h1 class="text-xl font-bold">\u4FEE\u6539\u865F\u78BC</h1></div><div class="group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm"><span class="pr-1 duration-150"> \u9001\u51FA </span>`);
      _push(ssrRenderComponent(_component_UnoIcon, { class: "i-ic-round-arrow-forward-ios" }, null, _parent));
      _push(`</div></div><div class="py-3">`);
      _push(ssrRenderComponent(_component_UIForm, { onSubmit: submit }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><div class="${ssrRenderClass([_ctx.labelSize, "flex items-center mb-2"])}"${_scopeId}><label${ssrRenderAttr("for", _ctx.phone)} class="${ssrRenderClass([[{ "cursor-pointer": "phone" }], "block font-bold tracking-wide"])}"${_scopeId}>${ssrInterpolate("\u624B\u6A5F")}</label></div><div class="flex flex-wrap"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIFormSelect, {
              class: "mr-2 w-24",
              id: "phone",
              options,
              selected: form.area,
              modelValue: form.area,
              "onUpdate:modelValue": ($event) => form.area = $event
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormText, {
              id: "phone",
              modelValue: form.phone,
              "onUpdate:modelValue": ($event) => form.phone = $event,
              class: "mb-3 flex-1",
              "is-phone": true,
              onCaptcha: getCaptcha
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_component_UIFormCaptcha, {
              id: "captcha",
              modelValue: form.verifyCode,
              "onUpdate:modelValue": ($event) => form.verifyCode = $event,
              class: "mb-10",
              label: "\u9A57\u8B49\u78BC",
              placeholder: "\u8ACB\u8F38\u5165\u624B\u6A5F\u9A57\u8B49\u78BC"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", {
                  class: ["flex items-center mb-2", _ctx.labelSize]
                }, [
                  createVNode("label", {
                    for: _ctx.phone,
                    class: ["block font-bold tracking-wide", [{ "cursor-pointer": "phone" }]],
                    textContent: "\u624B\u6A5F"
                  }, null, 8, ["for"])
                ], 2),
                createVNode("div", { class: "flex flex-wrap" }, [
                  createVNode(_component_UIFormSelect, {
                    class: "mr-2 w-24",
                    id: "phone",
                    options,
                    selected: form.area,
                    modelValue: form.area,
                    "onUpdate:modelValue": ($event) => form.area = $event
                  }, null, 8, ["selected", "modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UIFormText, {
                    id: "phone",
                    modelValue: form.phone,
                    "onUpdate:modelValue": ($event) => form.phone = $event,
                    class: "mb-3 flex-1",
                    "is-phone": true,
                    onCaptcha: getCaptcha
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ]),
              createVNode(_component_UIFormCaptcha, {
                id: "captcha",
                modelValue: form.verifyCode,
                "onUpdate:modelValue": ($event) => form.verifyCode = $event,
                class: "mb-10",
                label: "\u9A57\u8B49\u78BC",
                placeholder: "\u8ACB\u8F38\u5165\u624B\u6A5F\u9A57\u8B49\u78BC"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/my/account/change-phone.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=change-phone.abed6f11.mjs.map
