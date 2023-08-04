import{d as C,C as h,D as V,u as i,E as f,G as $,o as k,c as U,a as o,g as r,w as F,m as g,p as I,H as B,n as S,h as a,I as R,J as A,K as E,L as H}from"./entry.c5c9e8cb.js";const L={class:"flex items-center justify-between sticky"},N={class:"flex items-center space-x-2"},T=o("h1",{class:"text-xl font-bold"},"修改號碼",-1),j=o("span",{class:"pr-1 duration-150"}," 送出 ",-1),z={class:"py-3"},D={class:"flex items-center mb-2"},G={class:"flex flex-wrap"},P=C({__name:"change-phone",setup(J){{const{user:n}=h(),{isLogin:e}=V(n),s=i("showAuth");e.value||(s.value=!0,f().replace("/"))}const t=$({area:"+886",phone:"",verifyCode:""}),p=i("message"),u=i("alert"),m=i("loading"),x=async()=>{if(!t.phone.length)return p.value="尚未輸入手機號碼";if(!R.test(t.phone))return p.value="號碼格式錯誤";m.value=!0;const{data:n,error:e,message:s}=await g("/auth/change-captcha",{body:{area:t.area,phone:t.phone}});m.value=!1,e&&s&&(u.value={type:"error",text:s,center:!0}),n&&(u.value={type:"success",title:"發送成功，請留意手機簡訊"})},v=f(),_=async()=>{const n=i("loading");n.value=!0;const{data:e,error:s,message:c}=await g("/user/change-phone",{body:t});if(n.value=!1,s&&c&&(u.value={type:"error",text:c,center:!0}),e){u.value={type:"success",title:"修改成功",action:()=>v.go(-1)};const{user:d}=h();d.updateField({phone:t.phone})}},b=["+1","+1264","+1268","+1441","+1473","+1758","+1767","+1876","+20","+212","+233","+234","+237","+243","+248","+249","+250","+254","+256","+261","+297","+30","+32","+33","+34","+351","+352","+353","+354","+358","+380","+381","+389","+39","+40","+41","+43","+44","+45","+46","+47","+49","+502","+503","+504","+505","+507","+509","+52","+54","+55","+57","+58","+591","+595","+598","+60","+61","+62","+64","+65","+66","+674","+675","+676","+679","+7","+7","+81","+82","+852","+853","+86","+880","+886","+90","+91","+92","+93","+94","+960","+962","+964","+965","+966","+967","+967","+971","+973","+975","+975","+995","+998"];return(n,e)=>{const s=I,c=A,d=E,w=H,y=B;return k(),U("div",null,[o("div",L,[o("div",N,[o("div",{class:"flex items-center cursor-pointer",onClick:e[0]||(e[0]=l=>n.$router.go(-1))},[r(s,{class:"i-ic-round-arrow-back-ios text-sm lg:text-base"})]),T]),o("div",{class:"group rounded-full cursor-pointer bg-green-500 text-white font-bold px-4 lg:h-9 lg:leading-9 h-7 leading-7 flex items-center lg:text-base text-sm",onClick:_},[j,r(s,{class:"i-ic-round-arrow-forward-ios"})])]),o("div",z,[r(y,{onSubmit:_},{default:F(()=>[o("div",null,[o("div",D,[o("label",{for:"phone",class:S(["block font-bold tracking-wide",[{"cursor-pointer":"phone"}]]),textContent:"手機"})]),o("div",G,[r(c,{class:"mr-2 w-24",id:"phone",options:b,selected:a(t).area,modelValue:a(t).area,"onUpdate:modelValue":e[1]||(e[1]=l=>a(t).area=l)},null,8,["selected","modelValue"]),r(d,{id:"phone",modelValue:a(t).phone,"onUpdate:modelValue":e[2]||(e[2]=l=>a(t).phone=l),class:"mb-3 flex-1","is-phone":!0,onCaptcha:x},null,8,["modelValue"])])]),r(w,{id:"captcha",modelValue:a(t).verifyCode,"onUpdate:modelValue":e[3]||(e[3]=l=>a(t).verifyCode=l),class:"mb-10",label:"驗證碼",placeholder:"請輸入手機驗證碼"},null,8,["modelValue"])]),_:1})])])}}});export{P as default};
