import{f as w,h as a,g as p,p as T,v as L,y as M,G as A,cg as B,B as H,o as b,c as f,n,j as r,a as d,t as N,r as g,D as Q,b as x,w as D,ch as I,ca as q,_ as O}from"./entry.d14bdab2.js";const P=["for","textContent"],$={class:"relative model"},j={class:"absolute transform -translate-y-1/2 right-2 top-1/2"},G=w({__name:"Editor",props:{modelValue:{type:String,default:""},label:{type:String,default:""},placeholder:{type:String,default:""},size:{type:String,default:"md"},id:{type:String,default:""}},emits:["update:modelValue"],async setup(t,{emit:y}){let l,i;const s=t,v=y,h=a(()=>`
  w-full border
  duration-200
  bg-transparent border-gray-600/[0.3] focus:bg-gray-200
  dark:border-gray-50/[0.2] dark:focus:bg-gray-800`),c=p({lg:"text-base",md:"text-sm",sm:"text-xs",xs:"text-xs"}),u=p({lg:"text-lg rounded-lg",md:"text-base rounded",sm:"text-sm rounded",xs:"text-xs rounded"}),S=a(()=>c[s.size]||c.md),C=a(()=>u[s.size]||u.md),o=T(null),V={theme:"bubble"},k=()=>{o.value&&v("update:modelValue",o.value.getHTML())},m=()=>{o.value?o.value.setHTML(s.modelValue||""):setTimeout(()=>{m()},300)};L(()=>s.modelValue,e=>{e||o.value.setHTML(e)}),M(()=>{m()});{const{vueApp:e}=I();if(!e.component("QuillEditor")){const{QuillEditor:_}=([l,i]=A(()=>B(()=>import("./vue-quill.esm-bundler.a5f8f705.js"),["./vue-quill.esm-bundler.a5f8f705.js","./entry.d14bdab2.js","./entry.240b9ab7.css"],import.meta.url)),l=await l,i(),l);e.component("QuillEditor",_)}}return(e,_)=>{const z=H("quill-editor"),E=q;return b(),f("div",null,[t.label?(b(),f("div",{key:0,class:n(["fic mb-2",r(S)])},[d("label",{for:t.id,class:n(["block font-bold tracking-wide",[{"cursor-pointer":t.id}]]),textContent:N(t.label)},null,10,P),g(e.$slots,"label",{},void 0,!0)],2)):Q("",!0),d("div",$,[x(E,null,{default:D(()=>[x(z,{ref_key:"editor",ref:o,theme:"bubble",placeholder:t.placeholder,class:n([r(h),r(C)]),options:V,onTextChange:k},null,8,["placeholder","class"])]),_:1}),d("div",j,[g(e.$slots,"symbol",{},void 0,!0)])])])}}});const F=O(G,[["__scopeId","data-v-ab5ce173"]]);export{F as _};