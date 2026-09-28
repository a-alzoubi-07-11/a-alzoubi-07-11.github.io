const ALLOWED_ORIGIN="https://a-alzoubi-07-11.github.io";
function reply(body,status,origin){
 const headers={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"};
 if(origin===ALLOWED_ORIGIN){headers["Access-Control-Allow-Origin"]=ALLOWED_ORIGIN;headers["Vary"]="Origin"}
 return new Response(JSON.stringify(body),{status,headers});
}
export default {async fetch(request,env){
 const url=new URL(request.url),origin=request.headers.get("Origin")||"";
 if(origin!==ALLOWED_ORIGIN)return reply({error:"Origin not allowed"},403,null);
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":ALLOWED_ORIGIN,"Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Max-Age":"86400","Vary":"Origin"}});
 if(request.method!=="GET"||url.pathname!=="/count")return reply({error:"Not found"},404,origin);
 try{
  const key="total-visits";
  let total=Number.parseInt(await env.COUNTERS.get(key)||"0",10);
  if(!Number.isSafeInteger(total)||total<0)total=0;
  if(url.searchParams.get("increment")==="1"){total++;await env.COUNTERS.put(key,String(total))}
  return reply({total},200,origin);
 }catch(error){return reply({error:"Counter storage is not configured"},503,origin)}
}};