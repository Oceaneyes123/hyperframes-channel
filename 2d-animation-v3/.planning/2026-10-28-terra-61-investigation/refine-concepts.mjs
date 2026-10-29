import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {readConfig} from '../../server/config.ts';
import {openVisuals} from '../../server/visual-store.ts';
import {graphicAssetRegistry} from '../../workflow/graphic-assets.ts';
import {creativeFeedback} from '../../server/creative-feedback.ts';

const path=new URL('./receipt.json',import.meta.url),r=JSON.parse(readFileSync(path,'utf8'));
const c=readConfig(),s=openVisuals(c.dataDirectory,c.videosDirectory);
const ink='#203B3A',paper='#F7F3E9',amber='#B9822D',accent='#D9633F';
const part=(color=ink,opacity=1)=>({x:0,y:0,scale:1,opacity,color,reveal:1});
const text=(label,x,y,width,height,color=ink)=>({type:'heading',x,y,width,height,color,label,typography:'inter-heading@1'});
const environment={family:'editorial',color:paper,accent,depth:0.3};
const asset=graphicAssetRegistry['owner-review-console@1'];
try {
 const baseId=s.latest(r.projectId,'concepts');
 const id=s.begin(r.projectId,{kind:'concepts',scriptId:r.scriptId,selectionId:null,baseId,shotIndex:null,instruction:'Current-session authored refinement after phone-size review found repeated primitive layouts and obscured text, and two gateway revisions failed strict component part definitions. Existing curated artwork, semantic diagram and evidence typography only. No concept selection or quality approval.'},'codex-session visual refinement');
 const output={concepts:[
  {title:'A — The Human Review Console',metaphor:'A capable agent can prepare the document while a human retains control of the next action.',teachingApproach:'Open at the recognizable draft-review interface. Carry its document through the launch promise, evidence cutaway and return to review. Drafting and sending have separate authorization. The rendered console is a generic explanatory illustration, not captured Terra behavior.',visualLanguage:'One detailed curated monitor-and-human-hand illustration with a large readable focal document. Warm editorial paper, ink and restrained orange. Sparse Inter typography. Use meaningful layer motion rather than decorating generic boxes.',frame:{background:paper,environment,shapes:[text('Before it sends',8,9,84,8),{type:'graphic-asset@2',x:4,y:27,width:92,height:51.75,color:accent,label:'',asset:{id:asset.id,contentHash:asset.contentHash},parts:Object.fromEntries(asset.layers.map(layer=>[layer,part(ink,layer==='unresolved'?0:1)]))},text('Illustrative',8,84,84,6)]}},
  {title:'B — The Permission Route',metaphor:'A task document follows a route with a separate human decision before an external message.',teachingApproach:'Use one connected diagram: preparing the draft is followed by permission review, and only then a possible send. Extend the same route to distinguish warnings-test boundaries from the separate auto-review protocol. The illustration teaches workflow choices; it is not a log of a real model run.',visualLanguage:'Large portrait-first semantic diagram on editorial paper, recognizable document, person and message icons. Amber emphasizes the review stage. No unrelated arrows or duplicate dashboard cards. Diagram labels carry the mechanism.',frame:{background:paper,environment,shapes:[text('Who authorizes it?',8,7,84,8),{type:'semantic-diagram@1',x:7,y:22,width:86,height:62,color:ink,label:'',diagram:{direction:'down',nodes:[{id:'draft',icon:'document',label:'Draft ready'},{id:'review',icon:'person',label:'Permission review'},{id:'send',icon:'message',label:'External action'}],edges:[{id:'to-review',from:'draft',to:'review',label:''},{id:'after-review',from:'review',to:'send',label:''}]},parts:{draft:part(),review:part(amber),send:part(), 'to-review':part(),'after-review':part(amber)}},text('Illustrative',8,88,84,5)]}},
  {title:'C — The Evidence Close-Up',metaphor:'A documentary evidence page holds the finding and its test conditions together before returning to the original task.',teachingApproach:'Start from the send-button question, move into a close-up of OpenAI’s warnings finding, then reveal separate favorable safety and independent analytics evidence. Keep each protocol separate. Return to the persistent task document for the final authorization judgment.',visualLanguage:'Dark editorial evidence spread with a dominant sourced percentage, a warm accent rule and adjacent conditions. No axis that conflates unlike tests, no fabricated screenshot and no ordinary-use incident counter. Typography is the evidence rather than a subtitle transcript.',frame:{background:ink,environment:{family:'editorial',color:ink,accent,depth:0.18},shapes:[{type:'rect',x:8,y:23,width:18,height:0.7,color:accent,label:''},text('29.6%',8,30,84,15,paper),text('Simulated, max effort\nNo system controls',8,54,84,16,paper)]}},
 ]};
 try{s.complete(r.projectId,id,output,creativeFeedback(c.dataDirectory).snapshot('graphics'));}catch(e){s.fail(r.projectId,id);throw e;}
 const saved=s.read(r.projectId,id);assert.equal(saved.output.concepts.length,3);assert.equal(s.selection(r.projectId),null);
 const latest=JSON.parse(readFileSync(path,'utf8'));
 writeFileSync(path,JSON.stringify({...latest,conceptsId:id,priorConceptsIds:[...(latest.priorConceptsIds??[]),baseId],conceptProvenance:'Current-session refinement using existing validated components; failed gateway proposals preserved'},null,2)+'\n');
 console.log(JSON.stringify({id,titles:saved.output.concepts.map(x=>x.title)}));
}finally{s.close();}
