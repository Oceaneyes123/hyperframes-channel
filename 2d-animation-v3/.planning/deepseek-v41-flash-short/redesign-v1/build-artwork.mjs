import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { parseVectorAsset } from '../../../workflow/vector-assets.ts';

const output = 'docs/projects/deepseek-v41-flash/artwork/redesign-v1';
mkdirSync(output, { recursive: true });
const paint = (fill = 'none', stroke = 'none', strokeWidth = 0, opacity = 1) => ({ fill, stroke, strokeWidth, opacity });
const R = (x,y,width,height,fill='surface',radius=12,stroke='none',strokeWidth=0,opacity=1) => ({ kind:'rect',x,y,width,height,radius,...paint(fill,stroke,strokeWidth,opacity) });
const E = (cx,cy,rx,ry,fill='ink',stroke='none',strokeWidth=0,opacity=1) => ({ kind:'ellipse',cx,cy,rx,ry,...paint(fill,stroke,strokeWidth,opacity) });
const P = (d,fill='none',stroke='ink',strokeWidth=4,opacity=1) => ({ kind:'path',d,...paint(fill,stroke,strokeWidth,opacity) });
const G = (x,y,scale,children,rotation=0) => ({ kind:'group',x,y,scale,rotation,blend:'normal',children,...paint() });
const L = (id,role,nodes) => ({id,role,nodes});
const line = (x,y,w,color='line',h=5) => R(x,y,w,h,color,h/2);
const check = (x,y,s=1,color='ink') => G(x,y,s,[P('M0 12L12 24 39 0','none',color,6)]);
const sparkle = (x,y,s=1) => G(x,y,s,[P('M0 -16Q0 0 16 0Q0 0 0 16Q0 0 -16 0Q0 0 0 -16Z','accent','none')]);
function plant(x,y,s=1) { return G(x,y,s,[P('M45 118Q35 55 22 20M46 118Q62 55 85 10M46 118L48 30','none','ink',4),E(22,32,14,30,'mint','ink',2),G(70,30,1,[E(0,0,14,33,'mint','ink',2)],32),E(48,48,12,25,'mint','ink',2),P('M14 108H77L67 170H25Z','accent','ink',3),line(20,120,50,'paper',3)]); }
function mirror(x,y,s=1) { return G(x,y,s,[P('M0 260V90A90 90 0 0 1 180 0V260Z','paper','ink',8),P('M12 247V92A78 78 0 0 1 168 0V247Z','mint','none'),P('M30 192L113 45M68 225L149 78','none','surface',14,.7),R(-12,260,205,15,'ink',4),R(12,288,160,13,'paper',3),R(20,302,8,75,'ink',2),R(150,302,8,75,'ink',2)]); }
function chair(x,y,s=1) { return G(x,y,s,[E(90,215,78,16,'ink','none',0,.12),R(82,139,16,68,'ink',4),R(30,193,121,13,'ink',7),R(16,62,148,95,'accent',26,'ink',4),R(7,130,166,28,'accent',10,'ink',4),R(2,103,18,44,'ink',8),R(158,103,18,44,'ink',8),line(37,87,104,'paper',3)]); }
function owner(x,y,s=1,calm=false) { return G(x,y,s,[
 E(112,399,112,20,'ink','none',0,.1),P('M46 231Q4 243 2 312L29 358H72L67 285H162L169 360H214L231 309Q223 247 176 232Z','accent','ink',4),
 P('M72 203H153L164 240L118 278L64 236Z','paper','ink',3),P('M76 151H153V219Q111 246 77 217Z','paper','ink',3),
 P('M54 71Q49 1 116 0Q185 -1 191 82L180 167L157 163L64 160Z','ink','ink',3),
 E(119,105,59,76,'paper','ink',3),P('M61 86Q101 96 111 47Q131 85 176 76Q174 3 119 7Q59 4 61 86Z','ink','none'),
 E(58,119,10,17,'paper','ink',3),E(178,119,9,17,'paper','ink',3),
 P(calm?'M81 103Q91 96 102 103M136 103Q146 96 155 103':'M79 96L101 88M136 89L158 97','none','ink',4),
 E(94,115,3,5),E(146,115,3,5),P('M121 113L116 136H125','none','muted',3),
 P(calm?'M102 150Q119 168 138 150':'M104 156Q119 143 136 153','none','ink',3),
 E(79,138,9,5,'accent','none',0,.25),E(158,138,9,5,'accent','none',0,.25),
 P('M63 259L72 365H168L166 259L147 279H89Z','ink','ink',3),R(93,307,55,40,'mint',5),line(101,318,37,'ink',3),
 P(calm?'M28 291Q43 340 77 327L130 311L145 332Q72 380 32 350L5 313Z':'M16 285Q25 230 43 203L63 211Q47 261 59 307L83 331L63 351Q15 333 16 285Z','paper','ink',4),
 P(calm?'M195 284L214 335L155 365L140 346L178 317L169 295Z':'M190 283L211 238L192 204L212 190Q244 225 237 251L217 321Z','paper','ink',4),
 ]); }
function laptop(x,y,s=1,dark=false) { return G(x,y,s,[R(8,8,344,230,'ink',18),R(18,18,324,199,dark?'ink':'surface',10,'muted',2),E(180,12,2,2,'muted'),R(32,33,296,18,'mint',4),R(32,66,68,133,'paper',4),...Array.from({length:5},(_,i)=>line(41,79+i*23,45,'line',4)),R(114,66,201,133,'paper',5),R(128,81,171,24,'mint',4),...Array.from({length:3},(_,i)=>line(128,122+i*24,148-i*17,'line',5)),P('M8 224H352L389 257Q389 269 369 269H-9Q-30 267 -29 257Z','paper','ink',5),R(131,238,101,8,'muted',3)]); }
function phone(x,y,s=1) { return G(x,y,s,[R(0,0,150,267,'ink',25),R(8,9,134,246,'surface',19),R(47,10,56,12,'ink',6),R(22,45,105,50,'mint',10),line(33,60,77,'ink',5),line(33,75,55,'muted',4),R(41,109,86,62,'accent',10),line(53,123,60,'paper',5),line(53,139,50,'paper',4),R(22,188,107,35,'paper',9,'line',2),E(75,242,4,4,'muted')]); }
function ticket(x,y,s=1,rotation=0) { return G(x,y,s,[R(7,10,260,139,'ink',15,'none',0,.08),R(0,0,260,139,'surface',15,'ink',3),E(29,31,11,11,'accent'),line(54,25,150,'ink',7),line(22,59,210,'line',7),line(22,80,178,'line',7),line(22,101,116,'line',7),P('M46 139L35 166L91 139Z','surface','ink',3)],rotation); }
function browser(x,y,w,h) { return [R(x+8,y+12,w,h,'ink',22,'none',0,.12),R(x,y,w,h,'surface',22,'ink',3),R(x,y,w,44,'paper',20),line(x,y+43,w,'line',2),...[0,1,2].map(i=>E(x+24+i*21,y+22,5,5,i===0?'accent':'line')),R(x+105,y+12,w-156,20,'surface',8)]; }
function binder(x,y,s=1) { return G(x,y,s,[R(9,12,300,352,'ink',13,'none',0,.1),R(0,0,300,352,'mint',13,'ink',3),R(24,10,270,331,'surface',9),R(0,0,26,352,'ink',10),R(74,39,176,25,'mint',6),...Array.from({length:4},(_,i)=>G(64,95+i*53,1,[E(0,0,10,10,'mint'),check(-7,-7,.3),line(27,-5,156,'ink',5),line(27,9,122,'line',4)])),R(66,309,173,10,'accent',3)]); }
function node(x,y,s=1,kind='trigger') {return G(x,y,s,[R(5,8,118,118,'ink',22,'none',0,.09),R(0,0,118,118,'surface',22,'ink',3),kind==='trigger'?P('M68 22L35 65H59L49 96L85 49H62Z','accent','none'):kind==='http'?G(59,58,1,[E(0,0,31,31,'none','accent',4),E(0,0,13,31,'none','accent',3),P('M-30 0H30M-24 -19H24M-24 19H24','none','accent',3)]):check(39,42,1,'accent'),E(0,59,5,5,'surface','ink',3),E(118,59,5,5,'surface','ink',3)]);}
function hand(x,y,s=1) { return G(x,y,s,[P('M36 264L13 185Q2 156 20 150Q34 145 46 173L57 197L55 53Q57 27 73 30Q90 29 91 54L93 135L97 20Q99 -3 115 0Q131 1 132 24L133 137L140 45Q143 23 159 27Q175 32 170 54L164 147L177 94Q183 74 197 81Q214 88 204 115L184 203Q173 235 161 264Z','paper','ink',4),R(32,250,142,66,'accent',5,'ink',4),line(47,264,110,'paper',3)]); }
const assets=[];
function asset(id,purpose,compositions,layers) { assets.push(parseVectorAsset({schemaVersion:1,id:`${id}@1`,source:'Original HyperFrames Working Studio artwork, authored for the DeepSeek redesign, 2026-10-24.',license:'CC0-1.0',attribution:'Original artwork authored for HyperFrames V3; dedicated to CC0.',width:1000,height:1000,purpose,tags:['deepseek','business','working-studio','layered'],compositions,layers})); }

asset('salon-working-studio','Recognizable salon and expressive owner overwhelmed by inquiry pressure; calm variant uses the same room and hides inquiry layers.',['editorial-illustration','visual-metaphor'],[
 L('architecture','background',[R(20,80,960,790,'paper',35),P('M20 80H980V665H20Z','mint','none'),R(40,100,920,22,'ink',4),R(55,136,890,8,'surface',3),R(55,153,890,3,'surface',1),R(80,180,202,288,'surface',100,'ink',4),R(99,198,164,248,'mint',80),P('M103 358L235 215M123 409L246 275','none','surface',12),R(35,664,930,11,'ink',2),P('M21 675H980L940 947H60Z','paper','none'),...[0,1,2,3].map(i=>P(`M${140+i*240} 675L${35+i*300} 947`,'none','line',2)),line(40,770,920,'line',2),line(48,859,900,'line',2)]),
 L('salon-furniture','detail',[mirror(735,178,.75),chair(705,466,.85),R(71,508,256,13,'ink',3),R(85,521,16,138,'ink',3),R(286,521,15,138,'ink',3),R(90,475,14,32,'accent',5),R(112,464,16,44,'ink',4),R(136,479,19,29,'paper',4,'ink',2),plant(795,621,.9),R(385,160,226,7,'ink',3),R(395,133,28,27,'accent',4),R(434,116,22,44,'paper',4,'ink',2),R(471,126,20,34,'ink',4),R(510,138,70,21,'surface',3),E(630,200,54,54,'surface','ink',4),P('M630 162V201L651 215','none','ink',4),E(630,200,4,4,'accent')]),
 L('owner','subject',[owner(305,279,1.3)]),
 L('reception','detail',[E(465,884,355,42,'ink','none',0,.1),P('M92 739H776L860 779H146Z','ink','ink',3),P('M146 779H860V930H146Z','accent','ink',4),R(165,800,672,8,'paper',2),R(179,820,6,83,'paper',2),R(206,820,6,83,'paper',2),R(233,820,6,83,'paper',2),R(730,820,6,83,'paper',2),R(757,820,6,83,'paper',2),R(784,820,6,83,'paper',2),laptop(372,581,.65),R(178,701,124,34,'paper',7,'ink',3),R(197,687,117,21,'mint',5,'ink',3),R(222,670,103,18,'surface',4,'ink',3)]),
 L('inquiries','packet',[ticket(31,312,.82,-9),ticket(659,316,.88,8),ticket(69,578,.7,-6),sparkle(871,292,1.3),P('M276 356Q301 339 311 344M277 382Q303 368 313 371M688 502L669 519M712 523L699 542','none','accent',6)]),
 L('phone','detail',[phone(793,712,.55)]),
 L('calm-owner','subject',[owner(305,279,1.3,true)]),
]);

asset('faq-research-desk','Overhead research desk collects fabricated booking inquiries against the owner-approved FAQ.',['editorial-illustration'],[
 L('desk','background',[R(20,20,960,960,'mint',40),P('M20 799L979 544M21 851L980 596','none','paper',2),E(868,164,93,93,'ink','none',0,.07),E(854,151,85,85,'surface','ink',4),E(854,151,60,60,'ink'),P('M929 115Q986 100 980 154Q974 196 934 183','none','ink',12),P('M843 94Q816 70 841 45M869 87Q849 64 874 34','none','muted',4),plant(35,27,.7)]),
 L('reference','subject',[G(494,233,1.25,[binder(0,0)],7),R(651,208,124,32,'accent',3),line(665,217,92,'paper',5)]),
 L('question-one','packet',[ticket(59,288,1.08,-7)]),
 L('question-two','packet',[ticket(81,510,1.02,4)]),
 L('tools','detail',[G(264,812,1,[R(0,0,385,27,'ink',5),P('M385 0L438 14L385 27Z','paper','ink',3),R(15,0,38,27,'accent',2)],-15),R(71,730,100,26,'accent',3),R(686,729,187,111,'paper',4,'ink',2),line(705,750,112,'line',5),line(705,771,140,'line',5),line(705,792,100,'line',5),P('M334 427Q431 421 481 370M349 630Q445 643 496 580','none','ink',3)]),
 L('owner-mark','subject',[G(712,654,.85,[E(50,50,50,50,'ink'),check(30,39,1,'paper')]),hand(398,702,.6)]),
]);

asset('inquiry-intake-console','Editable Google Sheets row and n8n Google Sheets Trigger to HTTP Request. Interface reconstruction without live-run claims.',['interface-demonstration','illustrated-workflow'],[
 L('sheets-shell','background',[...browser(36,20,928,431),R(57,80,41,50,'mint',5,'ink',2),P('M66 94H88V117H66ZM66 102H88M77 94V117','none','ink',2),line(121,97,219,'ink',8),line(121,119,151,'muted',5),line(59,151,864,'line',2),R(58,168,862,31,'paper',3),...Array.from({length:6},(_,i)=>R(79+i*136,178,71,6,'muted',3)),R(58,216,864,185,'surface',0,'line',2),...Array.from({length:5},(_,i)=>line(58,251+i*36,864,'line',1)),...Array.from({length:5},(_,i)=>R(98+i*164,216,1,185,'line',0)),R(59,217,38,184,'paper',0),...[0,1,2,3].map(i=>line(70,234+i*36,12,'muted',3)),R(59,417,180,18,'mint',3)]),
 L('new-row','packet',[R(98,252,821,36,'mint',0,'accent',3),R(110,263,121,7,'ink',3),R(274,263,232,7,'ink',3),R(610,262,129,10,'accent',4)]),
 L('n8n-shell','background',[...browser(36,511,928,416),R(36,555,112,371,'ink',0),...[0,1,2,3,4].map(i=>G(62,591+i*51,1,[E(0,0,6,6,'mint'),line(19,-3,37,'muted',6)])),R(149,556,815,371,'paper',0),R(177,584,360,15,'line',4),R(797,575,135,34,'accent',7),...Array.from({length:6},(_,i)=>G(193+i*139,650,1,Array.from({length:6},(_,j)=>E(0,j*43,1.5,1.5,'line')))),P('M344 769C384 769 384 769 428 769M547 769C588 769 588 769 631 769M750 769C790 769 793 769 824 769','none','accent',5)]),
 L('trigger','subject',[node(226,710,1,'trigger')]),
 L('request','subject',[node(429,710,1,'http')]),
 L('validation','subject',[node(632,710,1,'check')]),
 L('row-packet','packet',[P('M494 454V492M484 479L494 492L504 479','none','accent',6),E(827,769,12,12,'accent'),check(843,854,.8,'ink')]),
]);

asset('deepseek-processing-studio','Cinematic cutaway: two input packets enter a model processor and emerge as an editable structured draft.',['technical-cutaway','visual-metaphor'],[
 L('stage','background',[R(15,15,970,970,'ink',44),E(504,465,349,349,'none','muted',1,.45),E(504,465,284,284,'none','muted',2,.5),P('M17 695L983 695M17 811L983 811M87 984L295 695M913 984L705 695','none','muted',2,.3),E(504,625,255,53,'muted','none',0,.2),...Array.from({length:14},(_,i)=>E(59+(i*71)%879,56+(i*107)%595,2,2,'mint','none',0,.5))]),
 L('input-one','packet',[R(54,143,332,136,'surface',16),R(76,162,69,8,'accent',3),line(76,187,271,'ink',7),line(76,212,232,'line',7),line(76,237,166,'line',7)]),
 L('input-two','packet',[R(613,143,332,136,'paper',16),R(635,162,69,8,'accent',3),line(635,187,271,'ink',7),line(635,212,232,'line',7),line(635,237,166,'line',7)]),
 L('rails','detail',[P('M218 280V319Q218 357 318 357H369M780 280V319Q780 357 680 357H629','none','mint',7),P('M499 617V694M489 678L499 694L509 678','none','mint',7),...Array.from({length:4},(_,i)=>R(349+i*99,416,11,11,'mint',3))]),
 L('processor','subject',[P('M322 390L504 327L687 390V552L504 625L322 552Z','muted','mint',3),P('M322 390L504 453L687 390L504 327Z','surface','mint',3),P('M504 453V625','none','mint',3),P('M364 391L504 345L644 391L504 438Z','ink','none'),E(504,389,42,15,'accent'),P('M371 473L457 505M371 493L457 525M552 507L638 475M552 527L638 495','none','mint',4),...Array.from({length:4},(_,i)=>R(409+i*62,312,11,20,'mint',2)),sparkle(718,456,1.5)]),
 L('draft','subject',[R(99,719,802,214,'surface',20,'mint',3),R(117,737,11,176,'accent',5),line(152,748,147,'line',6),line(152,785,642,'ink',8),line(152,823,534,'ink',8),line(152,862,572,'line',7),line(152,895,433,'line',7)]),
 L('field-markers','detail',[E(848,789,18,18,'mint'),check(838,782,.5,'ink'),E(848,836,18,18,'mint'),check(838,829,.5,'ink')]),
]);

asset('owner-review-console','Large review interface, edited draft, unresolved-information tray and human hand; no automatic-send or verified execution claim.',['interface-demonstration'],[
 L('workspace','background',[R(17,100,966,798,'mint',35),E(521,868,398,46,'ink','none',0,.1),plant(25,637,.9),R(853,167,77,74,'accent',5),line(866,183,49,'paper',5),line(866,201,40,'paper',5),line(866,219,32,'paper',5)]),
 L('monitor','subject',[R(111,153,750,536,'ink',27),R(124,168,724,485,'surface',16),R(124,168,724,53,'paper',16),E(146,193,5,5,'accent'),E(165,193,5,5,'line'),E(184,193,5,5,'line'),R(127,221,146,429,'ink',0),...Array.from({length:5},(_,i)=>G(148,262+i*57,1,[E(0,0,6,6,'mint'),line(18,-3,75,'muted',5)])),P('M442 687H545L563 761H424Z','ink','none'),R(361,759,265,17,'ink',8),E(489,671,5,5,'muted')]),
 L('draft','packet',[R(297,250,522,248,'paper',12,'line',2),R(315,268,115,20,'mint',5),line(315,312,457,'ink',7),line(315,339,428,'line',7),line(315,366,454,'line',7),R(309,391,425,31,'mint',3),line(316,404,401,'ink',7),line(315,444,361,'line',7),line(315,470,393,'line',7)]),
 L('review-controls','subject',[R(298,524,256,77,'mint',12,'ink',3),check(321,548,.8),R(574,524,245,77,'paper',12,'ink',3),P('M592 551L607 566L625 548M607 566V539','none','ink',4)]),
 L('unresolved','packet',[R(564,706,366,168,'paper',16,'ink',3),E(599,741,14,14,'accent'),P('M599 732V744M599 750V752','none','paper',3),line(628,737,259,'ink',7),line(588,783,292,'line',7),line(588,810,234,'line',7),R(780,837,108,9,'accent',3)]),
 L('human-hand','subject',[hand(296,572,.95)]),
]);

asset('booking-test-bench','Contrasting test cases: FAQ-covered question yields a draft; unknown facts return to owner. No accuracy statistics.',['visual-comparison'],[
 L('bench','background',[R(18,50,469,900,'mint',30),R(513,50,469,900,'paper',30,'ink',3),P('M500 87V913','none','line',3)]),
 L('booking','subject',[ticket(55,153,1.45),G(103,446,1,[R(0,0,292,244,'surface',16,'ink',3),R(0,0,292,56,'ink',14),...[0,1,2,3].flatMap(i=>[0,1,2].map(j=>R(25+i*65,84+j*47,43,31,i===2&&j===1?'accent':'mint',5))),R(64,-13,12,31,'accent',5),R(216,-13,12,31,'accent',5)]),E(248,811,64,64,'ink'),check(221,794,1.4,'paper')]),
 L('unknown','subject',[ticket(547,153,1.45),G(618,440,.8,[owner(0,0,1,true)]),E(747,811,64,64,'accent'),P('M726 802Q727 775 749 777Q775 780 767 801L749 816V826M749 842V845','none','paper',7)]),
 L('routes','detail',[P('M248 374V408M238 395L248 408L258 395M747 374V408M737 395L747 408L757 395','none','ink',5),sparkle(433,752,1.1)]),
]);

asset('service-handover-desk','Tangible setup, test and handover service: demonstration laptop, documented binder, checked test cards and owner meeting.',['editorial-illustration'],[
 L('setting','background',[R(20,80,960,850,'mint',44),P('M20 615H980V931H20Z','paper','none'),E(514,812,394,71,'ink','none',0,.1),R(70,761,864,32,'ink',10),R(109,791,23,168,'ink',5),R(870,791,23,168,'ink',5),plant(48,212,.85),P('M812 141Q826 108 848 141Q878 204 890 255H782Q792 198 812 141Z','accent','ink',3),P('M836 254V470H783','none','ink',8),R(766,469,104,12,'ink',5)]),
 L('demonstration','subject',[laptop(262,414,1.35)]),
 L('documentation','subject',[binder(669,548,.78)]),
 L('test-cards','detail',[R(104,562,199,133,'surface',12,'ink',3),check(124,585,.7),line(170,588,103,'ink',6),check(124,629,.7),line(170,632,103,'ink',6),R(116,721,180,24,'accent',4)]),
 L('meeting','subject',[G(453,133,.7,[owner(0,0,1,true)]),R(373,329,270,19,'accent',5),sparkle(709,415,1.2)]),
]);

asset('service-running-costs','Separate usage-based API and infrastructure costs without invented rates, revenue or savings.',['technical-cutaway','editorial-illustration'],[
 L('desk','background',[R(20,40,960,920,'mint',40),E(498,856,396,53,'ink','none',0,.12),P('M20 794H979','none','paper',4)]),
 L('usage-meter','subject',[R(73,192,420,405,'ink',24),R(94,216,377,128,'surface',12),...Array.from({length:8},(_,i)=>R(117+i*41,244,22,74,i<5?'accent':'line',4)),R(94,368,377,204,'paper',12),...Array.from({length:5},(_,i)=>G(119+i*67,478,1,[R(0,-18*(i%3),32,64+18*(i%3),'mint',4),line(0,63,32,'ink',4)])),E(283,397,8,8,'accent')]),
 L('hosting','subject',[R(557,192,371,405,'surface',24,'ink',4),...[0,1,2].map(i=>G(581,222+i*110,1,[R(0,0,323,85,'paper',10,'ink',3),E(29,42,9,9,'accent'),...Array.from({length:6},(_,j)=>R(69+j*27,26,8,34,'ink',3)),E(290,43,6,6,'mint')]))]),
 L('agreement','packet',[G(144,654,1,[R(8,12,714,233,'ink',16,'none',0,.1),R(0,0,714,233,'paper',16,'ink',3),line(25,30,300,'ink',9),line(25,64,651,'line',6),line(25,91,615,'line',6),line(25,118,650,'line',6),P('M33 191Q68 154 86 186Q99 207 122 169Q135 149 150 177Q173 202 209 170','none','ink',3),P('M475 185Q502 152 521 180Q537 204 550 175Q560 155 579 174Q603 203 640 171','none','ink',3),line(24,207,227,'muted',2),line(467,207,220,'muted',2)]),hand(700,734,.65)]),
]);

for (const item of assets) {
  const path = `${output}/${item.id.replace('@','-v')}.json`;
  writeFileSync(path, JSON.stringify(item,null,2)+'\n');
  assert(readFileSync(path).length < 200_000);
  execFileSync(process.execPath,['scripts/import-graphic-asset.ts','--check',path],{stdio:'pipe'});
  const pack = JSON.parse(readFileSync('workflow/graphic-pack.json','utf8'));
  const existing = pack.find(entry=>entry.asset.id===item.id);
  if (existing) assert.equal(existing.contentHash,createHash('sha256').update(JSON.stringify(item)).digest('hex'),'Existing versions are immutable');
  else {
    // Give the Windows file watcher time to release the previous registry read.
    await new Promise(resolve=>setTimeout(resolve,1500));
    execFileSync(process.execPath,['scripts/import-graphic-asset.ts','--install',path],{stdio:'pipe'});
  }
  console.log(`${item.id}: ${item.layers.length} animation layers`);
}
assert.equal(new Set(assets.map(item=>item.id)).size,8);
