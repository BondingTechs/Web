import{_ as B}from"./Filter.vue.b2c800fc.js";import{_ as C}from"./Title.vue.40eb46a1.js";import{_ as N}from"./Header.b68d7e43.js";import{_ as S}from"./Row.9786dd3a.js";import{_ as A,a as R,b as T}from"./Wrapper.66d3ec69.js";import{d as V,N as H,r as y,R as f,o as u,f as P,w as r,V as x,g as n,h as o,c as b,n as D,a as E}from"./entry.bfc9bcac.js";import"./RowLoading.d4e7a80a.js";const F=E("p",null,"載入更多",-1),I=[F],O={key:1,class:"text-center pt-8 text-xs font-bold tracking-widest opacity-50"},Q=V({__name:"[categorySlug]",async setup(U){let e,i;const v=H(),{categorySlug:s}=v.params,d=y(null),{data:h}=([e,i]=f(()=>x(`category-slug-${s}`,"/category/info",{async:!0,body:{slug:s}})),e=await e,i(),e);d.value=h.value.data;const{data:t}=([e,i]=f(()=>x(`category-video-news-${s}`,"/news/list",{async:!0,body:{category:s,type:"video",size:8}})),e=await e,i(),e),c=y(!1),g=async()=>{c.value=!0;const m=t.value.pagination.page,l=t.value.pagination.size,{data:a}=await $fetch("/api/news/page",{method:"POST",body:{category:s,type:"normal",size:l,page:m+1}}),_=(a==null?void 0:a.list)??[];setTimeout(()=>{_.length&&(t.value.list.push(..._),t.value.pagination=a.pagination??t.value.pagination),c.value=!1},300)};return(m,l)=>{const a=B,_=C,k=N,w=S,z=R,L=T,$=A;return u(),P($,null,{default:r(()=>[n(k,{class:"z-10 sticky border-b bg-white border-gray-900/10 top-12 dark:bg-gray-900 dark:border-gray-700 lg:-mx-0 lg:px-0 -mx-4 px-4"},{default:r(()=>{var p;return[n(_,{tag:"h1",title:(p=o(d))==null?void 0:p.name,class:"capitalize"},{default:r(()=>[n(a)]),_:1},8,["title"])]}),_:1}),n(L,null,{default:r(()=>[n(z,null,{default:r(()=>[n(w,{tag:"h3",list:o(t).list??[],infinite:!0,loading:o(c),onLoad:g},null,8,["list","loading"]),o(t).pagination.total>o(t).pagination.size*o(t).pagination.page?(u(),b("div",{key:0,class:D(["block py-4 mt-3 text-xs font-bold text-center text-gray-500 duration-300 border-t border-b border-gray-300 dark:text-gray-400 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",{hidden:o(c)}]),onClick:l[0]||(l[0]=p=>g())},I,2)):(u(),b("div",O," 無更多資料... "))]),_:1})]),_:1})]),_:1})}}});export{Q as default};