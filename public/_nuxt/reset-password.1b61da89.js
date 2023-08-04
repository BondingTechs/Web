import{d as _,C as x,D as g,u as i,E as w,G as v,o as b,c as h,a as t,g as a,w as P,O as V,m as y,p as C,H as k,h as l,P as U}from"./entry.c5c9e8cb.js";const $={class:"flex items-center justify-between sticky"},B={class:"flex items-center space-x-2"},F=t("h1",{class:"text-xl font-bold"},"修改密碼",-1),I=t("span",{class:"lg:pr-2 duration-150 pr-1"}," 送出 ",-1),R={class:"py-3"},E=_({__name:"reset-password",setup(S){{const{user:u}=x(),{isLogin:e}=g(u),o=i("showAuth");e.value||(o.value=!0,w().replace("/"))}const s=v({oldPassword:"",newPassword:"",newPasswordConfirm:""}),f=w(),m=i("loading"),d=i("alert"),p=async()=>{const{oldPassword:u,newPassword:e,newPasswordConfirm:o}=s;if(!V.test(e))return d.value={type:"error",text:"密碼須為英數混合8位數以上",center:!0};if(!u.length||!e.length||!o.length)return d.value={type:"error",text:"欄位不能留空",center:!0};if(e!==o)return d.value={type:"error",text:"密碼不一致",center:!0};m.value=!0;const{error:r,message:c}=await y("/user/reset-password",{body:s});return m.value=!1,r&&c?d.value={type:"error",text:c,center:!0}:d.value={type:"success",title:"修改成功",action:()=>f.go(-1)}};return(u,e)=>{const o=C,r=U,c=k;return b(),h("div",null,[t("div",$,[t("div",B,[t("div",{class:"flex items-center cursor-pointer",onClick:e[0]||(e[0]=n=>u.$router.go(-1))},[a(o,{class:"i-ic-round-arrow-back-ios text-sm lg:text-base"})]),F]),t("div",{class:"group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm",onClick:p},[I,a(o,{class:"i-ic-round-arrow-forward-ios"})])]),t("div",R,[a(c,{onSubmit:p},{default:P(()=>[a(r,{id:"old-password",modelValue:l(s).oldPassword,"onUpdate:modelValue":e[1]||(e[1]=n=>l(s).oldPassword=n),class:"mb-3",label:"舊密碼",placeholder:"請輸入舊密碼"},null,8,["modelValue"]),a(r,{id:"new-password",modelValue:l(s).newPassword,"onUpdate:modelValue":e[2]||(e[2]=n=>l(s).newPassword=n),class:"mb-3",label:"新密碼",placeholder:"長度至少為8,英數組合"},null,8,["modelValue"]),a(r,{id:"new-password-confirm",modelValue:l(s).newPasswordConfirm,"onUpdate:modelValue":e[3]||(e[3]=n=>l(s).newPasswordConfirm=n),label:"確認密碼",placeholder:"再次輸入新密碼"},null,8,["modelValue"])]),_:1})])])}}});export{E as default};
