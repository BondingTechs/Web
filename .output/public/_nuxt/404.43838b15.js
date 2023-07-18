import{q as z,o as c,l as v,z as p,a as m,A as b,e as g,c as y,h,B as k,t as l,k as _,u as a,C as B,D as C,j as f,f as $,E as N,F as j}from"./entry.a49dae57.js";const E={},D={class:"flex-1 relative py-8"};function F(t,e){return c(),v("div",D,[p(t.$slots,"default")])}const w=z(E,[["render",F]]),U=["href"],V=m({__name:"Button",props:{text:{type:String,default:""},type:{type:String,default:"primary"},size:{type:String,default:"md"},to:{type:[String,Object],default:void 0},href:{type:String,default:void 0}},setup(t){const e=t,o=`
  cursor-pointer
  border transition-color duration-300
  focus:outline-none focus:ring-1 focus:ring-offset-1 focus:dark:ring-offset-gray-50 focus:dark:ring-gray-400 focus:ring-gray-600/[0.6] focus:ring-offset-gray-800/[0.6]
  flex items-center justify-center font-semibold
`,n=b({none:"",primary:"text-white bg-primary-500 hover:bg-primary-400 border-primary-500",secondary:"text-slate-800 bg-gray-200 border-gray-200 hover:bg-gray-300 dark:text-white dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700",opposite:"text-white bg-gray-800 hover:bg-white hover:text-gray-800 hover:border-gray-900 dark:text-gray-800 dark:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:border-white"}),s=b({lg:"h-13 px-8 text-lg rounded-lg",md:"h-10 px-6 text-base rounded",sm:"h-9 px-4 text-sm rounded",xs:"h-6 px-3 text-xs rounded"}),r=g(()=>n[e.type]||n.primary),d=g(()=>s[e.size]||s.lg),u=i=>{const x=B();e.to&&x.push(e.to),e.href||i.preventDefault()};return(i,x)=>{const S=C;return t.to?(c(),y(S,{key:0,tag:"a",to:t.to,class:_(`${o} ${a(r)} ${a(d)}`)},{default:h(()=>[p(i.$slots,"default",{},()=>[k(l(t.text),1)])]),_:3},8,["to","class"])):(c(),v("a",{key:1,class:_(`${o} ${a(r)} ${a(d)}`),href:t.href,onClick:u},[p(i.$slots,"default",{},()=>[k(l(t.text),1)])],10,U))}}}),q={class:"text-center mb-6 leading-3"},A={class:"font-bold text-8xl block"},H={class:"block italic"},L=m({__name:"Error",props:{code:{type:Number,default:400},wrap:{type:Boolean,default:!1}},setup(t){const e=t,o=w,n={400:"Bad Request",401:"Unauthorized",403:"Forbidden",404:"Not Found"},s=g(()=>{const{code:r}=e;return{code:r,message:n[r.toString()]||"Unknown Error"}});return(r,d)=>{const u=V;return c(),y(N(e.wrap?a(o):"div"),{class:_(e.wrap?"flex flex-col items-center justify-center":"")},{default:h(()=>[f("h1",q,[f("span",A,l(a(s).code),1),f("span",H,l(a(s).message),1)]),$(u,{text:"Home",to:"/",size:"sm"})]),_:1},8,["class"])}}});function P(t){return t.replace(/\w\S*/g,e=>e.charAt(0).toUpperCase()+e.substr(1).toLowerCase())}const W=m({__name:"404",setup(t){const e=o=>o;return j(()=>({title:P(e("pages.404.title"))})),(o,n)=>{const s=L,r=w;return c(),y(r,{class:"flex flex-col items-center justify-center"},{default:h(()=>[$(s,{code:404})]),_:1})}}});export{W as default};
