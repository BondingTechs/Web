import{g as f,s as c,i as h,A as k,o as d,c as u,a as o,b as p,k as r,F as w,V as _,W as v,G as C,L as g,H as V}from"./entry.c6de3c4f.js";import{_ as $}from"./Row.vue.5bf6d296.js";const z={class:"pb-4"},B={class:"flex items-center sticky mb-4"},F=o("h1",{class:"text-lg lg:text-xl font-bold"},"小知識列表",-1),N={class:"list"},H=o("p",null,"載入更多",-1),M=[H],T={class:"text-center pt-8 text-xs font-bold tracking-widest opacity-50"},G=f({__name:"tips",setup(A){const i=c([]),e=c({}),a=c(!0),l=h(()=>e.value.total<=e.value.size*e.value.page),m=async(n=1,t=10)=>{a.value=!0;const{data:s}=await g("/my/tips",{body:{page:n,size:t}});i.value=s.list,e.value=s.pagination,a.value=!1};k(()=>{m()});const b=async()=>{if(l.value||a.value)return;a.value=!0;const n=e.value.page,t=e.value.size,{data:s}=await g("/my/history",{body:{size:t,page:n}});i.value.push(...s.list),e.value=s.pagination,a.value=!1};return(n,t)=>{const s=V,x=$;return d(),u("div",z,[o("div",B,[o("div",{class:"lg:hidden mr-2 flex items-center cursor-pointer",onClick:t[0]||(t[0]=y=>n.$router.go(-1))},[p(s,{class:"i-ic-round-arrow-back-ios text-sm lg:text-base"})]),F]),o("div",N,[p(x,{list:r(i)},null,8,["list"]),r(a)?C("",!0):(d(),u(w,{key:0},[_(o("div",{class:"dark:text-gray-400 block border-t py-4 mt-3 font-bold text-center text-xs text-gray-500 border-gray-200 dark:border-gray-800 duration-300 border-b hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",onClick:t[1]||(t[1]=y=>b())},M,512),[[v,!r(l)]]),_(o("div",T," 無更多資料... ",512),[[v,r(l)]])],64))])])}}});export{G as default};