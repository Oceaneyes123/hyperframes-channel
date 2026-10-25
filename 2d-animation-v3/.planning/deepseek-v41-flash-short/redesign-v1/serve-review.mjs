import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';
import {mediaResponse} from '../../../server/media-response.ts';

const root=resolve('.planning/deepseek-v41-flash-short/redesign-v1');
const receipt=JSON.parse(readFileSync(join(root,'motion-review-receipt.json'),'utf8'));
const files=new Map([['/',['index.html','text/html; charset=utf-8']],['/review.mp4',['review.mp4','video/mp4']],['/before-review.mp4',['before-review.mp4','video/mp4']],['/settled-contact.png',['settled-contact.png','image/png']]].map(([url,[path,type]])=>[url,{bytes:readFileSync(join(receipt.output,path)),type}]));
const sample=files.get('/review.mp4');
const range=mediaResponse(new Request('http://127.0.0.1/review.mp4',{headers:{range:'bytes=10-19'}}),sample.bytes,sample.type);
assert.equal(range.status,206);assert.equal(range.headers.get('Content-Length'),'10');
assert.equal((await range.arrayBuffer()).byteLength,10);
createServer(async(request,response)=>{
 if(!['GET','HEAD'].includes(request.method)){response.writeHead(405);response.end();return;}
 const file=files.get(new URL(request.url,'http://127.0.0.1:3035').pathname);
 if(!file){response.writeHead(404);response.end();return;}
 const headers=new Headers();if(request.headers.range)headers.set('range',request.headers.range);
 const result=mediaResponse(new Request('http://127.0.0.1:3035',{method:request.method,headers}),file.bytes,file.type);
 response.writeHead(result.status,Object.fromEntries(result.headers));
 response.end(request.method==='HEAD'?undefined:Buffer.from(await result.arrayBuffer()));
}).listen(3035,'127.0.0.1',()=>console.log('Review player: http://127.0.0.1:3035/ (existing V3 byte-range helper)'));
