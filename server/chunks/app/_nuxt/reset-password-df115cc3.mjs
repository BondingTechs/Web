import { f as useRouter, e as useState, t as passwordRegex, g as useHttpFetchPost, b as __nuxt_component_1, i as _sfc_main$j, v as __nuxt_component_2 } from '../server.mjs';
import { defineComponent, reactive, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "reset-password",
  __ssrInlineRender: true,
  setup(__props) {
    const form = reactive({
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: ""
    });
    const router = useRouter();
    const $loading = useState("loading");
    const $alert = useState("alert");
    const submit = async () => {
      const { oldPassword, newPassword, newPasswordConfirm } = form;
      if (!passwordRegex.test(newPassword)) {
        return $alert.value = {
          type: "error",
          text: "\u5BC6\u78BC\u9808\u70BA\u82F1\u6578\u6DF7\u54088\u4F4D\u6578\u4EE5\u4E0A",
          center: true
        };
      }
      if (!oldPassword.length || !newPassword.length || !newPasswordConfirm.length) {
        return $alert.value = {
          type: "error",
          text: "\u6B04\u4F4D\u4E0D\u80FD\u7559\u7A7A",
          center: true
        };
      }
      if (newPassword !== newPasswordConfirm) {
        return $alert.value = {
          type: "error",
          text: "\u5BC6\u78BC\u4E0D\u4E00\u81F4",
          center: true
        };
      }
      $loading.value = true;
      const { error, message } = await useHttpFetchPost("/user/reset-password", {
        body: form
      });
      $loading.value = false;
      if (error && message) {
        return $alert.value = {
          type: "error",
          text: message,
          center: true
        };
      }
      return $alert.value = {
        type: "success",
        title: "\u4FEE\u6539\u6210\u529F",
        action: () => router.go(-1)
      };
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UnoIcon = __nuxt_component_1;
      const _component_UIForm = _sfc_main$j;
      const _component_UIFormPassword = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex items-center justify-between sticky"><div class="flex items-center space-x-2"><div class="flex items-center cursor-pointer">`);
      _push(ssrRenderComponent(_component_UnoIcon, { class: "i-ic-round-arrow-back-ios text-sm lg:text-base" }, null, _parent));
      _push(`</div><h1 class="text-xl font-bold">\u4FEE\u6539\u5BC6\u78BC</h1></div><div class="group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm"><span class="lg:pr-2 duration-150 pr-1"> \u9001\u51FA </span>`);
      _push(ssrRenderComponent(_component_UnoIcon, { class: "i-ic-round-arrow-forward-ios" }, null, _parent));
      _push(`</div></div><div class="py-3">`);
      _push(ssrRenderComponent(_component_UIForm, { onSubmit: submit }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIFormPassword, {
              id: "old-password",
              modelValue: unref(form).oldPassword,
              "onUpdate:modelValue": ($event) => unref(form).oldPassword = $event,
              class: "mb-3",
              label: "\u820A\u5BC6\u78BC",
              placeholder: "\u8ACB\u8F38\u5165\u820A\u5BC6\u78BC"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormPassword, {
              id: "new-password",
              modelValue: unref(form).newPassword,
              "onUpdate:modelValue": ($event) => unref(form).newPassword = $event,
              class: "mb-3",
              label: "\u65B0\u5BC6\u78BC",
              placeholder: "\u9577\u5EA6\u81F3\u5C11\u70BA8,\u82F1\u6578\u7D44\u5408"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UIFormPassword, {
              id: "new-password-confirm",
              modelValue: unref(form).newPasswordConfirm,
              "onUpdate:modelValue": ($event) => unref(form).newPasswordConfirm = $event,
              label: "\u78BA\u8A8D\u5BC6\u78BC",
              placeholder: "\u518D\u6B21\u8F38\u5165\u65B0\u5BC6\u78BC"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIFormPassword, {
                id: "old-password",
                modelValue: unref(form).oldPassword,
                "onUpdate:modelValue": ($event) => unref(form).oldPassword = $event,
                class: "mb-3",
                label: "\u820A\u5BC6\u78BC",
                placeholder: "\u8ACB\u8F38\u5165\u820A\u5BC6\u78BC"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormPassword, {
                id: "new-password",
                modelValue: unref(form).newPassword,
                "onUpdate:modelValue": ($event) => unref(form).newPassword = $event,
                class: "mb-3",
                label: "\u65B0\u5BC6\u78BC",
                placeholder: "\u9577\u5EA6\u81F3\u5C11\u70BA8,\u82F1\u6578\u7D44\u5408"
              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(_component_UIFormPassword, {
                id: "new-password-confirm",
                modelValue: unref(form).newPasswordConfirm,
                "onUpdate:modelValue": ($event) => unref(form).newPasswordConfirm = $event,
                label: "\u78BA\u8A8D\u5BC6\u78BC",
                placeholder: "\u518D\u6B21\u8F38\u5165\u65B0\u5BC6\u78BC"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/my/account/reset-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=reset-password-df115cc3.mjs.map
