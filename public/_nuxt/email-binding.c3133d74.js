import{d as w,C as x,D as h,u as a,E as y,G as $,o as k,c as C,a as o,g as n,t as S,h as r,w as V,M as B,m as E,p as F,H as U,K as I}from"./entry.c5c9e8cb.js";const R={class:"flex items-center justify-between sticky"},A={class:"flex items-center space-x-2"},D={class:"text-xl font-bold"},H=o("span",{class:"lg:pr-2 duration-150 pr-1"}," 送出 ",-1),N={class:"py-3"},G=w({__name:"email-binding",setup(T){{const{user:t}=x(),{isLogin:e}=h(t),s=a("showAuth");e.value||(s.value=!0,y().replace("/"))}const l=$({email:""}),{user:i}=x(),{info:v}=h(i),c=a("loading"),u=a("alert"),m=a("message"),d=async()=>{const{email:t}=l;if(!t.length)return m.value="欄位不能留空";if(!B.test(t))return m.value="信箱格式錯誤";c.value=!0;const{error:e,message:s}=await E("/user/email-binding",{body:{email:t}});return c.value=!1,e&&s?u.value={type:"error",text:s,center:!0}:(i.updateField({emailStatus:18}),u.value={type:"success",title:"已發送驗證信，請至信箱查收"})};return(t,e)=>{var _,f;const s=F,p=I,b=U;return k(),C("div",null,[o("div",R,[o("div",A,[o("div",{class:"flex items-center cursor-pointer",onClick:e[0]||(e[0]=g=>t.$router.go(-1))},[n(s,{class:"i-ic-round-arrow-back-ios text-sm lg:text-base"})]),o("h1",D,S((f=(_=r(v))==null?void 0:_.email)!=null&&f.length?"修改":"綁定")+"Email ",1)]),o("div",{class:"group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm",onClick:d},[H,n(s,{class:"i-ic-round-arrow-forward-ios"})])]),o("div",N,[n(b,{onSubmit:d},{default:V(()=>[n(p,{id:"email",modelValue:r(l).email,"onUpdate:modelValue":e[1]||(e[1]=g=>r(l).email=g),label:"Email",class:"mb-3",placeholder:"example@domain.com"},null,8,["modelValue"])]),_:1})])])}}});export{G as default};
