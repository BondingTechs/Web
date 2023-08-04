import { e as useState, f as useRouter, p as phoneRegex, g as useHttpFetchPost, h as useBaseStore, b as __nuxt_component_1, i as _sfc_main$j, j as __nuxt_component_2$2, k as __nuxt_component_2$1, l as __nuxt_component_4$1 } from '../server.mjs';
import { defineComponent, reactive, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
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
      const _component_UIForm = _sfc_main$j;
      const _component_UIFormSelect = __nuxt_component_2$2;
      const _component_UIFormText = __nuxt_component_2$1;
      const _component_UIFormCaptcha = __nuxt_component_4$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between sticky"><div class="flex items-center space-x-2"><div class="flex items-center cursor-pointer">`);
      _push(ssrRenderComponent(_component_UnoIcon, { class: "i-ic-round-arrow-back-ios text-sm lg:text-base" }, null, _parent));
      _push(`</div><h1 class="text-xl font-bold">\u4FEE\u6539\u865F\u78BC</h1></div><div class="group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm"><span class="pr-1 duration-150"> \u9001\u51FA </span>`);
      _push(ssrRenderComponent(_component_UnoIcon, { class: "i-ic-round-arrow-forward-ios" }, null, _parent));
      _push(`</div></div><div class="py-3">`);
      _push(ssrRenderComponent(_component_UIForm, { onSubmit: submit }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><div class="flex items-center mb-2"${_scopeId}><label for="phone" class="${ssrRenderClass([[{ "cursor-pointer": "phone" }], "block font-bold tracking-wide"])}"${_scopeId}>${ssrInterpolate("\u624B\u6A5F")}</label></div><div class="flex flex-wrap"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIFormSelect, {
              class: "mr-2 w-24",
              id: "phone",
              options,
              selected: unref(form).area,
              modelValue: unref(form).area,
              "onUpdate:modelValue": ($event) => unref(form).area = $event
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormText, {
              id: "phone",
              modelValue: unref(form).phone,
              "onUpdate:modelValue": ($event) => unref(form).phone = $event,
              class: "mb-3 flex-1",
              "is-phone": true,
              onCaptcha: getCaptcha
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_component_UIFormCaptcha, {
              id: "captcha",
              modelValue: unref(form).verifyCode,
              "onUpdate:modelValue": ($event) => unref(form).verifyCode = $event,
              class: "mb-10",
              label: "\u9A57\u8B49\u78BC",
              placeholder: "\u8ACB\u8F38\u5165\u624B\u6A5F\u9A57\u8B49\u78BC"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { class: "flex items-center mb-2" }, [
                  createVNode("label", {
                    for: "phone",
                    class: ["block font-bold tracking-wide", [{ "cursor-pointer": "phone" }]],
                    textContent: "\u624B\u6A5F"
                  })
                ]),
                createVNode("div", { class: "flex flex-wrap" }, [
                  createVNode(_component_UIFormSelect, {
                    class: "mr-2 w-24",
                    id: "phone",
                    options,
                    selected: unref(form).area,
                    modelValue: unref(form).area,
                    "onUpdate:modelValue": ($event) => unref(form).area = $event
                  }, null, 8, ["selected", "modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_UIFormText, {
                    id: "phone",
                    modelValue: unref(form).phone,
                    "onUpdate:modelValue": ($event) => unref(form).phone = $event,
                    class: "mb-3 flex-1",
                    "is-phone": true,
                    onCaptcha: getCaptcha
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ]),
              createVNode(_component_UIFormCaptcha, {
                id: "captcha",
                modelValue: unref(form).verifyCode,
                "onUpdate:modelValue": ($event) => unref(form).verifyCode = $event,
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
//# sourceMappingURL=change-phone-9f10bf99.mjs.map
