import{d as h,r as $,C as w,Q as S,u as y,o as f,c as g,a as s,n as b,t as k,q as V,h as o,m as C,_ as I,D as q,g as p,w as F,p as U,G as D,E as B,J as z}from"./entry.b3807717.js";const R=["for","textContent"],E={key:0},N=["src"],j={key:1,class:"p-c text-xs"},A=["id","required"],G=h({__name:"Image",props:{modelValue:{type:String,default:""},label:{type:String,default:""},id:{type:String,default:""},required:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(n,{emit:a}){const r=$(""),d=w({lg:"text-base",md:"text-sm",sm:"text-xs",xs:"text-xs"}),x=S(()=>d.md),v=y("message"),_=async e=>{const t=new FormData;t.append("file",e);const{data:c,error:i,message:m}=await C("/comm/upload",{body:t,multipart:!0});return i?v.value=m:c},u=async e=>{const t=e.target;if(t.files&&t.files[0]){const c=await _(t.files[0]);a("update:modelValue",c);const i=new FileReader;i.onload=m=>{var l;r.value=((l=m.target)==null?void 0:l.result)||""},i.readAsDataURL(t.files[0])}};return(e,t)=>(f(),g("div",null,[s("div",{class:b(["flex items-center mb-2",o(x)])},[s("label",{for:n.id,class:b(["block font-bold tracking-wide",[{"cursor-pointer":n.id}]]),textContent:k(n.label)},null,10,R),V(e.$slots,"label",{},void 0,!0)],2),s("div",{class:b(["relative border border-gray-300 border-opacity-40 rounded dark:bg-white/[0.05] bg-gray-100",{model:!o(r)}])},[o(r).length>0?(f(),g("div",E,[s("img",{class:"preview w-full h-full",src:o(r)},null,8,N)])):(f(),g("div",j," 點擊上傳圖片 ")),s("input",{id:n.id,type:"file",accept:"image/*",class:"absolute w-full h-full cursor-pointer opacity-0 top-0 left-0",required:n.required,onChange:u},null,40,A)],2)]))}});const H=I(G,[["__scopeId","data-v-d10ebd38"]]),J={class:"flex items-center justify-between sticky"},L={class:"flex items-center space-x-2"},P=s("h1",{class:"text-xl font-bold"},"身份驗證",-1),Q=s("span",{class:"lg:pr-2 duration-150 pr-1"}," 送出 ",-1),T={class:"py-3"},M=h({__name:"identity-verify",setup(n){const a=w({idCard:"",positive:null}),r=y("loading"),d=y("alert"),x=q(),v=async()=>{r.value=!0;const{error:u,message:e}=await C("/user/identity-verify",{body:a,multipart:!0});if(r.value=!1,u&&e)return d.value={type:"error",text:e,center:!0};const{user:t}=B();return t.updateField({identityStatus:21,idCard:a.idCard}),d.value={type:"success",text:"送出成功，等待管理員審核",center:!0,action:()=>x.push("/my/account")}},_=()=>{if(!a.positive)return d.value={type:"error",text:"尚未上傳照片",center:!0};v()};return(u,e)=>{const t=U,c=z,i=H,m=D;return f(),g("div",null,[s("div",J,[s("div",L,[s("div",{class:"flex items-center cursor-pointer",onClick:e[0]||(e[0]=l=>u.$router.go(-1))},[p(t,{class:"i-ic-round-arrow-back-ios text-sm lg:text-base"})]),P]),s("div",{class:"group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm",onClick:_},[Q,p(t,{class:"i-ic-round-arrow-forward-ios"})])]),s("div",T,[p(m,{class:"max-w-[28em]",onSubmit:_},{default:F(()=>[p(c,{modelValue:o(a).idCard,"onUpdate:modelValue":e[1]||(e[1]=l=>o(a).idCard=l),label:"身分證/護照",class:"mb-5",require:!0},null,8,["modelValue"]),p(i,{id:"positive",modelValue:o(a).positive,"onUpdate:modelValue":e[2]||(e[2]=l=>o(a).positive=l),label:"照片",class:"mb-5",require:!0},null,8,["modelValue"])]),_:1})])])}}});export{M as default};