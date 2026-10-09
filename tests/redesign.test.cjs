const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const Module=require('node:module');
function source(file){const filename=path.resolve(file);const mod=new Module(filename,module);mod.filename=filename;mod.paths=Module._nodeModulePaths(path.dirname(filename));mod._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,filename);return mod.exports;}
const {renderRichContent}=source('src/lib/rich-content.ts');
const {inquirySchema}=source('src/lib/validations.ts');
const {listingSchema}=source('src/lib/listing-validation.ts');
const {stringList,bookingPartnerUrl}=source('src/lib/presentation.ts');
const {formatPrice}=source('src/lib/utils.ts');
test('legacy Markdown headings, paragraphs and amenities lists are readable',()=>{const html=renderRichContent('A coastal stay.\r\n\r\n### Your room\r\n- **Air conditioning**\r\n- Private bathroom');assert.match(html,/<h3>Your room<\/h3>/);assert.match(html,/<ul>/);assert.match(html,/<strong>Air conditioning<\/strong>/);assert.doesNotMatch(html,/###/);});
test('existing HTML survives while scripts, event handlers and unsafe URLs do not',()=>{const html=renderRichContent('<h2>Overview</h2><p>Hello <strong>guest</strong></p><script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">bad</a>');assert.match(html,/<h2>Overview<\/h2>/);assert.doesNotMatch(html,/script|onerror|javascript:|alert\(1\)/);});
test('malformed and double-encoded legacy galleries are handled',()=>{assert.deepEqual(stringList('broken'),[]);assert.deepEqual(stringList(JSON.stringify(JSON.stringify(['a.jpg',null,3]))),['a.jpg']);});
test('Google location links are not labelled booking partners',()=>{for(const value of ['https://share.google/abc','https://maps.app.goo.gl/abc','https://www.google.com/travel/search','javascript:alert(1)'])assert.equal(bookingPartnerUrl(value),null);assert.equal(bookingPartnerUrl('https://www.booking.com/hotel/lk/test.html'),'https://www.booking.com/hotel/lk/test.html');});
test('prices retain their currency and empty prices do not imply free rooms',()=>{assert.match(formatPrice(120,'LKR'),/LKR/);assert.match(formatPrice(120,'USD'),/USD/);assert.equal(formatPrice(0,'USD'),'Request a quote');});
test('inquiries reject impossible, past, and reversed dates',()=>{const base={stayId:1,guestName:'Test Guest',guestEmail:'guest@example.com',guestPhone:'+94770000000',checkinDate:'2099-11-10',checkoutDate:'2099-11-12',guestsCount:2};assert.equal(inquirySchema.safeParse(base).success,true);for(const dates of [{checkinDate:'2099-02-30'},{checkinDate:'2020-01-01'},{checkoutDate:'2099-11-10'},{checkoutDate:'2099-11-09'}])assert.equal(inquirySchema.safeParse({...base,...dates}).success,false);});
test('host editing preserves gallery and currency, rejects invalid image protocols',()=>{const base={title:'Coastal house',categoryId:1,locationId:1,pricePerNight:100,currency:'LKR',featuredImage:'/uploads/stays/test.jpg',gallery:['/uploads/stays/room.jpg'],address:'Mirissa Beach Road',whatsappNumber:'+94770000000',shortDesc:'A comfortable coastal stay.',fullContent:'A room with an ocean view and a private bathroom.'};const parsed=listingSchema.parse(base);assert.equal(parsed.currency,'LKR');assert.deepEqual(parsed.gallery,base.gallery);assert.equal(listingSchema.safeParse({...base,gallery:['javascript:bad']}).success,false);});
