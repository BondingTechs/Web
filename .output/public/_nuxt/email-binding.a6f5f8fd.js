import{a as F,A as b,V as v,a0 as h,b as l,o as B,l as E,j as e,f as o,t as y,u as A,h as C,a1 as w,U as $,y as k,W as D,Z as V}from"./entry.a49dae57.js";const S={class:"flex items-center justify-between sticky"},U={class:"flex items-center space-x-2"},I={class:"text-xl font-bold"},j=e("span",{class:"lg:pr-2 duration-150 pr-1"}," \u9001\u51FA ",-1),N={class:"py-3"},H=F({__name:"email-binding",setup(R){const n=b({email:""}),{user:u}=v(),{info:f}=h(u),i=l("loading"),r=l("alert"),c=l("message"),m=async()=>{const{email:s}=n;if(!s.length)return c.value="\u6B04\u4F4D\u4E0D\u80FD\u7559\u7A7A";if(!w.test(s))return c.value="\u4FE1\u7BB1\u683C\u5F0F\u932F\u8AA4";i.value=!0;const{error:t,message:a}=await $("/user/email-binding",{body:{email:s}});return i.value=!1,t&&a?r.value={type:"error",text:a,center:!0}:(u.updateField({emailStatus:18}),r.value={type:"success",title:"\u5DF2\u767C\u9001\u9A57\u8B49\u4FE1\uFF0C\u8ACB\u81F3\u4FE1\u7BB1\u67E5\u6536"})};return(s,t)=>{var d,p;const a=k,g=V,x=D;return B(),E("div",null,[e("div",S,[e("div",U,[e("div",{class:"flex items-center cursor-pointer",onClick:t[0]||(t[0]=_=>s.$router.go(-1))},[o(a,{class:"i-ic-round-arrow-back-ios text-sm lg:text-base"})]),e("h1",I,y((p=(d=A(f))==null?void 0:d.email)!=null&&p.length?"\u4FEE\u6539":"\u7D81\u5B9A")+"Email ",1)]),e("div",{class:"group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm",onClick:m},[j,o(a,{class:"i-ic-round-arrow-forward-ios"})])]),e("div",N,[o(x,{onSubmit:m},{default:C(()=>[o(g,{id:"email",modelValue:n.email,"onUpdate:modelValue":t[1]||(t[1]=_=>n.email=_),label:"Email",class:"mb-3",placeholder:"example@domain.com"},null,8,["modelValue"])]),_:1})])])}}});export{H as default};
