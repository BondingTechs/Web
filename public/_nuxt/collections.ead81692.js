import{f as F,p as u,h as N,G as V,J as y,v as A,o as i,c,a as n,b as m,F as b,C as E,j as e,D as x,T as f,U as k,E as L,n as R,t as S}from"./entry.d14bdab2.js";import{_ as T}from"./Row.0e45151c.js";import{_ as U}from"./Row.vue.93cf23b0.js";import"./RowLoading.957c2494.js";const j={class:"flex items-center sticky mb-3"},G={class:"flex flex-wrap items-center space-x-4 text-sm mb-3"},H=["onClick"],I={class:"py-3"},J={key:0},M={key:1},P={class:"text-center pt-8 text-xs font-bold tracking-widest opacity-50"},h=10,Y=F({__name:"collections",async setup(q){let p,g;const l=u([]),o=u({}),w=u([{label:"新聞",value:"article"},{label:"小知識",value:"tip"}]),r=u("article"),a=u(!0),_=N(()=>o.value.total<=o.value.size*o.value.page);try{const{data:s}=([p,g]=V(()=>y("/my/collections",{body:{size:h,type:r.value}})),p=await p,g(),p);l.value=s.list,o.value=s.pagination,a.value=!1}catch{}const C=()=>{l.value=[],o.value={}};A(r,async s=>{a.value=!0,C();const{data:t}=await y("/my/collections",{body:{size:h,type:s}});l.value=t.list,o.value=t.pagination,a.value=!1});const z=async()=>{if(_.value||a.value)return;a.value=!0;const s=o.value.page,t=o.value.size,{data:v}=await y("/my/collections",{body:{size:t,page:s}});l.value.push(...v.list),o.value=v.pagination,a.value=!1};return(s,t)=>{const v=L,$=T,B=U;return i(),c("div",null,[n("div",j,[n("div",{class:"lg:hidden mr-2 flex items-center cursor-pointer",onClick:t[0]||(t[0]=d=>s.$router.go(-1))},[m(v,{class:"i-ic-round-arrow-back-ios text-sm lg:text-base"})]),t[2]||(t[2]=n("h1",{class:"text-lg lg:text-xl font-bold"},"我的收藏",-1))]),n("div",G,[(i(!0),c(b,null,E(e(w),(d,D)=>(i(),c("div",{key:D,class:R(["cursor-pointer h-8 leading-8 px-5 border border-gray-200 dark-border-opacity-20 rounded-full duration-200",{"bg-gray-200 dark:bg-opacity-10":e(r)===d.value}]),onClick:K=>r.value=d.value},S(d.label),11,H))),128))]),n("div",I,[e(r)==="article"?(i(),c("div",J,[m($,{tag:"h3",list:e(l)??[],infinite:!0,loading:e(a)},null,8,["list","loading"])])):e(r)==="tip"?(i(),c("div",M,[m(B,{list:e(l)??[]},null,8,["list"])])):x("",!0),e(a)?x("",!0):(i(),c(b,{key:2},[f(n("div",{class:"dark:text-gray-400 block border-t py-4 mt-3 font-bold text-center text-xs text-gray-500 border-gray-200 dark:border-gray-800 duration-300 border-b hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",onClick:t[1]||(t[1]=d=>z())},t[3]||(t[3]=[n("p",null,"載入更多",-1)]),512),[[k,!e(_)]]),f(n("div",P," 無更多資料... ",512),[[k,e(_)]])],64))])])}}});export{Y as default};
