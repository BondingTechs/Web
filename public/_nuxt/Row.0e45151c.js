import{_ as f,o,c as _,a as e,F as d,C as x,i as l,w as u,l as g,d as h,t as s,b as r,D as y,E as v,e as b}from"./entry.d14bdab2.js";import{_ as w}from"./RowLoading.957c2494.js";const k={class:"grid md:grid-cols-2 gap-5 2xl:grid-cols-4 xl:grid-cols-3"},B={class:"relative h-0 mb-2 overflow-hidden rounded thumbnail"},N=["src"],j={class:"px-2"},C={class:"flex flex-wrap justify-between w-full py-2 mt-auto text-xs text-gray-600 dark:text-gray-400"},V={class:"flex justify-between w-full mb-1",itemprop:"author"},D={class:"flex w-full"},L={class:"mr-2 tracking-wider",itemprop:"create-date"},R={class:"flex ml-auto items-center space-x-4"},S={class:"flex items-center justify-end ml-auto space-x-1"},$={class:"flex items-center ml-auto space-x-1"},A={__name:"Row",props:{list:{type:Array,default:()=>[]},infinite:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},tag:{type:String,default:"h3"},row:{type:Number,default:4},gap:{type:Number,default:2}},setup(n){return(E,F)=>{const a=v,p=b,m=w;return o(),_(d,null,[e("div",k,[(o(!0),_(d,null,x(n.list,t=>(o(),l(p,{key:t.id,to:`/news/${t.categorySlug}/${t.slug}`,class:"relative"},{default:u(()=>{var i,c;return[e("div",B,[e("img",{src:t.thumbnail,class:"absolute top-0 left-0 object-cover w-full h-full"},null,8,N)]),e("div",j,[(o(),l(g(n.tag),{class:"text-base font-bold ellipsis"},{default:u(()=>[h(s(t.title),1)]),_:2},1024)),e("div",C,[e("div",V,[e("p",null,s(t.author),1),e("p",null,s(t.categories),1)]),e("div",D,[e("div",L,s((c=(i=t.publishTime)==null?void 0:i.split(" "))==null?void 0:c.shift()),1),e("div",R,[e("div",S,[r(a,{class:"i-ic-baseline-thumb-up text-green-400"}),e("span",null,s(t.likes),1)]),e("div",$,[r(a,{class:"i-ion-eye-sharp text-green-400"}),e("span",null,s(t.views),1)])])])])])]}),_:2},1032,["to"]))),128))]),n.infinite&&n.loading?(o(),l(m,{key:0,class:"mt-2"})):y("",!0)],64)}}},U=f(A,[["__scopeId","data-v-7b068057"]]);export{U as _};
