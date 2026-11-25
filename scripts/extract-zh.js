// Extract the translatable Chinese content from index.html into a JSON file.
// Usage: node scripts/extract-zh.js index.html i18n/zh.json
const fs=require("fs");const s=fs.readFileSync(process.argv[2],"utf8");
const a=s.indexOf("const DATA = ["), b=s.indexOf("/* ================= I18N");
const {DATA,GROUPS}=new Function("const P=x=>x;"+s.slice(a,b)+";return {DATA,GROUPS};")();
const chars={};
for(const d of DATA){
  const o={tier:d.tier,clsCn:d.clsCn,servant:d.servant,master:d.master};
  if(d.clsShort) o.clsShort=d.clsShort;
  if(d.servantSub) o.servantSub=d.servantSub;
  if(d.title) o.title=d.title;
  o.facts=d.facts;
  o.statNotes=d.stats.map(x=>x[2]||null);
  if(d.statNote) o.statNote=d.statNote;
  o.profileLbl=d.profileLbl; o.profile=d.profile; o.skillsLbl=d.skillsLbl;
  o.skills=d.skills.map(([n,sub,r,desc])=>[n,sub,desc]);
  o.nps=d.nps.map(([n,en,types,r,desc])=>[n,types,desc]);
  if(d.script){o.scriptLbl=d.scriptLbl;o.script=d.script;}
  o.ov=d.ov;
  chars[d.id]=o;
}
const groups=GROUPS.map(g=>({title:g.title,paren:g.paren,short:g.short}));
fs.writeFileSync(process.argv[3],JSON.stringify({groups,chars},null,1));
console.log(Object.keys(chars).length, fs.statSync(process.argv[3]).size);
