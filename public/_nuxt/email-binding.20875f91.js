import{f as v,g as h,K as w,Q as y,I as l,o as k,c as $,a as t,b as a,t as S,j as i,w as V,R as B,J as C,E,L as F,O as I}from"./entry.d14bdab2.js";const U={class:"flex items-center justify-between sticky"},R={class:"flex items-center space-x-2"},j={class:"text-xl font-bold"},N={class:"py-3"},H=v({__name:"email-binding",setup(T){const n=h({email:""}),{user:r}=w(),{info:g}=y(r),c=l("loading"),m=l("alert"),u=l("message"),d=async()=>{const{email:s}=n;if(!s.length)return u.value="欄位不能留空";if(!B.test(s))return u.value="信箱格式錯誤";c.value=!0;const{error:e,message:o}=await C("/user/email-binding",{body:{email:s}});return c.value=!1,e&&o?m.value={type:"error",text:o,center:!0}:(r.updateField({emailStatus:18}),m.value={type:"success",title:"已發送驗證信，請至信箱查收"})};return(s,e)=>{var p,_;const o=E,x=I,b=F;return k(),$("div",null,[t("div",U,[t("div",R,[t("div",{class:"flex items-center cursor-pointer",onClick:e[0]||(e[0]=f=>s.$router.go(-1))},[a(o,{class:"i-ic-round-arrow-back-ios text-sm lg:text-base"})]),t("h1",j,S((_=(p=i(g))==null?void 0:p.email)!=null&&_.length?"修改":"綁定")+"Email ",1)]),t("div",{class:"group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm",onClick:d},[e[2]||(e[2]=t("span",{class:"lg:pr-2 duration-150 pr-1"}," 送出 ",-1)),a(o,{class:"i-ic-round-arrow-forward-ios"})])]),t("div",N,[a(b,{onSubmit:d},{default:V(()=>[a(x,{id:"email",modelValue:i(n).email,"onUpdate:modelValue":e[1]||(e[1]=f=>i(n).email=f),label:"Email",class:"mb-3",placeholder:"example@domain.com"},null,8,["modelValue"])]),_:1})])])}}});export{H as default};