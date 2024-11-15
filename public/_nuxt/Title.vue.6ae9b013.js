import{f as n,o as t,c as s,a as r,b as i,D as c,i as d,w as f,d as u,t as x,n as m,l as g,r as p,E as y}from"./entry.d14bdab2.js";const k={class:"flex flex-wrap items-center justify-between py-3"},C={class:"flex items-center flex-1 space-x-1 lg:space-x-2"},S=n({__name:"Title",props:{title:{type:String,default:""},size:{type:String,default:"xl"},color:{type:String,default:""},darkColor:{type:String,default:""},tag:{type:String,default:"h2"},previous:{type:Boolean,default:!1}},setup(e){return(l,a)=>{const o=y;return t(),s("div",k,[r("div",C,[e.previous?(t(),s("div",{key:0,class:"flex items-center cursor-pointer",onClick:a[0]||(a[0]=$=>l.$router.go(-1))},[i(o,{class:"i-uil-angle-left text-xl"})])):c("",!0),(t(),d(g(e.tag),{class:m([`
          lg:text-${e.size}
          text-
          ${e.color?`text-${e.color}`:""}
          ${e.darkColor?`dark:text-${e.darkColor}`:""}
        `,"flex-1 font-bold ellipsis ellipsis-1"])},{default:f(()=>[u(x(e.title),1)]),_:1},8,["class"]))]),p(l.$slots,"default")])}}});export{S as _};
