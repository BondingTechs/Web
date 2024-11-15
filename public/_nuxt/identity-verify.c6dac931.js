import{f as h,p as S,g as C,h as I,I as y,o as _,c as g,a as t,n as v,t as V,r as $,j as n,J as k,_ as F,k as U,b as m,w as q,E as B,L as D,K as z,O as R}from"./entry.d14bdab2.js";const j=["for","textContent"],E={key:0},L=["src"],N={key:1,class:"p-c text-xs"},A=["id","required"],H=h({__name:"Image",props:{modelValue:{type:String,default:""},label:{type:String,default:""},id:{type:String,default:""},required:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(i,{emit:o}){const p=o,r=S(""),x=C({lg:"text-base",md:"text-sm",sm:"text-xs",xs:"text-xs"}),b=I(()=>x.md),f=y("message"),u=async s=>{const a=new FormData;a.append("file",s);const{data:c,error:d,message:l}=await k("/comm/upload",{body:a,multipart:!0});return d?f.value=l:c},e=async s=>{const a=s.target;if(a.files&&a.files[0]){const c=await u(a.files[0]);p("update:modelValue",c);const d=new FileReader;d.onload=l=>{var w;r.value=((w=l.target)==null?void 0:w.result)||""},d.readAsDataURL(a.files[0])}};return(s,a)=>(_(),g("div",null,[t("div",{class:v(["flex items-center mb-2",n(b)])},[t("label",{for:i.id,class:v(["block font-bold tracking-wide",[{"cursor-pointer":i.id}]]),textContent:V(i.label)},null,10,j),$(s.$slots,"label",{},void 0,!0)],2),t("div",{class:v(["relative border border-gray-300 border-opacity-40 rounded dark:bg-white/[0.05] bg-gray-100",{model:!n(r)}])},[n(r).length>0?(_(),g("div",E,[t("img",{class:"preview w-full h-full",src:n(r)},null,8,L)])):(_(),g("div",N," 點擊上傳圖片 ")),t("input",{id:i.id,type:"file",accept:"image/*",class:"absolute w-full h-full cursor-pointer opacity-0 top-0 left-0",required:i.required,onChange:e},null,40,A)],2)]))}});const J=F(H,[["__scopeId","data-v-d10ebd38"]]),K={class:"flex items-center justify-between sticky"},O={class:"flex items-center space-x-2"},P={class:"py-3"},G=h({__name:"identity-verify",setup(i){const o=C({idCard:"",positive:null}),p=y("loading"),r=y("alert"),x=U(),b=async()=>{p.value=!0;const{error:u,message:e}=await k("/user/identity-verify",{body:o,multipart:!0});if(p.value=!1,u&&e)return r.value={type:"error",text:e,center:!0};const{user:s}=z();return s.updateField({identityStatus:21,idCard:o.idCard}),r.value={type:"success",text:"送出成功，等待管理員審核",center:!0,action:()=>x.push("/my/account")}},f=()=>{if(!o.positive)return r.value={type:"error",text:"尚未上傳照片",center:!0};b()};return(u,e)=>{const s=B,a=R,c=J,d=D;return _(),g("div",null,[t("div",K,[t("div",O,[t("div",{class:"flex items-center cursor-pointer",onClick:e[0]||(e[0]=l=>u.$router.go(-1))},[m(s,{class:"i-ic-round-arrow-back-ios text-sm lg:text-base"})]),e[3]||(e[3]=t("h1",{class:"text-xl font-bold"},"身份驗證",-1))]),t("div",{class:"group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm",onClick:f},[e[4]||(e[4]=t("span",{class:"lg:pr-2 duration-150 pr-1"}," 送出 ",-1)),m(s,{class:"i-ic-round-arrow-forward-ios"})])]),t("div",P,[m(d,{class:"max-w-[28em]",onSubmit:f},{default:q(()=>[m(a,{modelValue:n(o).idCard,"onUpdate:modelValue":e[1]||(e[1]=l=>n(o).idCard=l),label:"身分證/護照",class:"mb-5",require:!0},null,8,["modelValue"]),m(c,{id:"positive",modelValue:n(o).positive,"onUpdate:modelValue":e[2]||(e[2]=l=>n(o).positive=l),label:"照片",class:"mb-5",require:!0},null,8,["modelValue"])]),_:1})])])}}});export{G as default};