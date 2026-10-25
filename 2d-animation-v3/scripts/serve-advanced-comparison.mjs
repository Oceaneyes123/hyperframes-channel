import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {mediaResponse} from '../server/media-response.ts';
const root=resolve(process.argv[2]??'.data/advanced-comparison-1792951012849/review-1792951368998');
createServer(async(request,response)=>{
 if(!['GET','HEAD'].includes(request.method)){response.writeHead(405).end();return;}
 const name=new URL(request.url,'http://127.0.0.1:3107').pathname.slice(1)||'index.html';
 if(!/^(index\.html|[AB](?:-section-[123])?\.mp4|[AB]-frame-(351|931|1306)\.png)$/.test(name)){response.writeHead(404).end();return;}
 const headers=new Headers();if(request.headers.range)headers.set('range',request.headers.range);
 try{const result=mediaResponse(new Request('http://127.0.0.1:3107/'+name,{method:request.method,headers}),readFileSync(join(root,name)),name.endsWith('.mp4')?'video/mp4':name.endsWith('.png')?'image/png':'text/html');response.writeHead(result.status,Object.fromEntries(result.headers));response.end(Buffer.from(await result.arrayBuffer()));}catch{response.writeHead(404).end();}
}).listen(3107,'127.0.0.1',()=>console.log('Paired review: http://127.0.0.1:3107 (human acceptance pending)'));
