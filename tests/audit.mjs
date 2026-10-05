import {chromium} from '@playwright/test';
import lighthouse from 'lighthouse';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--remote-debugging-port=9223']});
try {const report=await lighthouse(process.env.QA_BASE_URL || 'http://127.0.0.1:3000',{port:9223,output:'json',logLevel:'error'});await writeFile(new URL('../qa/lighthouse-mobile.json',import.meta.url),report.report);console.log(JSON.stringify(Object.fromEntries(Object.entries(report.lhr.categories).map(([key,c])=>[key,c.score]))));} finally {await browser.close()}
