import{g as v,h,M as w,S as y,K as l,o as k,c as S,a as e,b as a,t as $,k as i,w as V,T as B,L as C,H as F,N as U,Q as E}from"./entry.863f1561.js";const I={class:"flex items-center justify-between sticky"},N={class:"flex items-center space-x-2"},T={class:"text-xl font-bold"},H=e("span",{class:"lg:pr-2 duration-150 pr-1"}," 送出 ",-1),R={class:"py-3"},K=v({__name:"email-binding",setup(j){const n=h({email:""}),{user:r}=w(),{info:g}=y(r),c=l("loading"),m=l("alert"),u=l("message"),d=async()=>{const{email:s}=n;if(!s.length)return u.value="欄位不能留空";if(!B.test(s))return u.value="信箱格式錯誤";c.value=!0;const{error:t,message:o}=await C("/user/email-binding",{body:{email:s}});return c.value=!1,t&&o?m.value={type:"error",text:o,center:!0}:(r.updateField({emailStatus:18}),m.value={type:"success",title:"已發送驗證信，請至信箱查收"})};return(s,t)=>{var _,p;const o=F,x=E,b=U;return k(),S("div",null,[e("div",I,[e("div",N,[e("div",{class:"flex items-center cursor-pointer",onClick:t[0]||(t[0]=f=>s.$router.go(-1))},[a(o,{class:"i-ic-round-arrow-back-ios text-sm lg:text-base"})]),e("h1",T,$((p=(_=i(g))==null?void 0:_.email)!=null&&p.length?"修改":"綁定")+"Email ",1)]),e("div",{class:"group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm",onClick:d},[H,a(o,{class:"i-ic-round-arrow-forward-ios"})])]),e("div",R,[a(b,{onSubmit:d},{default:V(()=>[a(x,{id:"email",modelValue:i(n).email,"onUpdate:modelValue":t[1]||(t[1]=f=>i(n).email=f),label:"Email",class:"mb-3",placeholder:"example@domain.com"},null,8,["modelValue"])]),_:1})])])}}});export{K as default};