import{f as y,g as w,I as u,k as C,o as V,c as k,a as o,b as r,w as U,J as _,K as $,E as F,L as I,n as B,j as n,M as S,N,O as j,P as E}from"./entry.d14bdab2.js";const P={class:"flex items-center justify-between sticky"},R={class:"flex items-center space-x-2"},z={class:"py-3"},H={class:"flex items-center mb-2"},J={class:"flex flex-wrap"},M=y({__name:"change-phone",setup(K){const t=w({area:"+886",phone:"",verifyCode:""}),p=u("message"),c=u("alert"),m=u("loading"),h=async()=>{if(!t.phone.length)return p.value="尚未輸入手機號碼";if(!S.test(t.phone))return p.value="號碼格式錯誤";m.value=!0;const{data:a,error:e,message:s}=await _("/auth/change-captcha",{body:{area:t.area,phone:t.phone}});m.value=!1,e&&s&&(c.value={type:"error",text:s,center:!0}),a&&(c.value={type:"success",title:"發送成功，請留意手機簡訊"})},x=C(),f=async()=>{const a=u("loading");a.value=!0;const{data:e,error:s,message:i}=await _("/user/change-phone",{body:t});if(a.value=!1,s&&i&&(c.value={type:"error",text:i,center:!0}),e){c.value={type:"success",title:"修改成功",action:()=>x.go(-1)};const{user:d}=$();d.updateField({phone:t.phone})}},g=["+1","+1264","+1268","+1441","+1473","+1758","+1767","+1876","+20","+212","+233","+234","+237","+243","+248","+249","+250","+254","+256","+261","+297","+30","+32","+33","+34","+351","+352","+353","+354","+358","+380","+381","+389","+39","+40","+41","+43","+44","+45","+46","+47","+49","+502","+503","+504","+505","+507","+509","+52","+54","+55","+57","+58","+591","+595","+598","+60","+61","+62","+64","+65","+66","+674","+675","+676","+679","+7","+7","+81","+82","+852","+853","+86","+880","+886","+90","+91","+92","+93","+94","+960","+962","+964","+965","+966","+967","+967","+971","+973","+975","+975","+995","+998"];return(a,e)=>{const s=F,i=N,d=j,v=E,b=I;return V(),k("div",null,[o("div",P,[o("div",R,[o("div",{class:"flex items-center cursor-pointer",onClick:e[0]||(e[0]=l=>a.$router.go(-1))},[r(s,{class:"i-ic-round-arrow-back-ios text-sm lg:text-base"})]),e[4]||(e[4]=o("h1",{class:"text-xl font-bold"},"修改號碼",-1))]),o("div",{class:"group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm",onClick:f},[e[5]||(e[5]=o("span",{class:"pr-1 duration-150"}," 送出 ",-1)),r(s,{class:"i-ic-round-arrow-forward-ios"})])]),o("div",z,[r(b,{onSubmit:f},{default:U(()=>[o("div",null,[o("div",H,[o("label",{for:"phone",class:B(["block font-bold tracking-wide",[{"cursor-pointer":"phone"}]]),textContent:"手機"})]),o("div",J,[r(i,{class:"mr-2 w-24",id:"phone",options:g,selected:n(t).area,modelValue:n(t).area,"onUpdate:modelValue":e[1]||(e[1]=l=>n(t).area=l)},null,8,["selected","modelValue"]),r(d,{id:"phone",modelValue:n(t).phone,"onUpdate:modelValue":e[2]||(e[2]=l=>n(t).phone=l),class:"mb-3 flex-1","is-phone":!0,onCaptcha:h},null,8,["modelValue"])])]),r(v,{id:"captcha",modelValue:n(t).verifyCode,"onUpdate:modelValue":e[3]||(e[3]=l=>n(t).verifyCode=l),class:"mb-10",label:"驗證碼",placeholder:"請輸入手機驗證碼"},null,8,["modelValue"])]),_:1})])])}}});export{M as default};
