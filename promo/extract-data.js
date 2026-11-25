// Pull the fields the promo video needs out of index.html → promo/data.js
// Usage: node promo/extract-data.js
const fs=require("fs"),path=require("path");
const root=path.join(__dirname,"..");
const s=fs.readFileSync(path.join(root,"index.html"),"utf8");
const a=s.indexOf("const DATA = ["), b=s.indexOf("/* ================= I18N");
const {DATA}=new Function("const P=x=>x;"+s.slice(a,b)+";return {DATA};")();
// which Noble Phantasm to feature (default: the first one)
const NP_PICK={berserker:1};
const out=DATA.map(d=>({id:d.id,no:d.no,tier:d.tier,cls:d.cls,clsCn:d.clsCn,servant:d.servant,master:d.master,
  img:d.img,c:d.c,c2:d.c2,np:(n=>n?[n[0],n[1]]:null)(d.nps[NP_PICK[d.id]||0]),hi:d.ov[0],line:d.ov[1]}));
fs.writeFileSync(path.join(__dirname,"data.js"),"window.PROMO="+JSON.stringify(out,null,1)+";\n");
console.log(out.length+" characters → promo/data.js");
