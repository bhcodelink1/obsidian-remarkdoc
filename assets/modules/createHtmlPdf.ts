import {  Notice } from 'obsidian';



import {unified} from 'unified'

import remarkParse from "remark-parse";


import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeDocument from 'rehype-document';
import remarkGfm from 'remark-gfm';
import supersub from 'remark-supersub' 

import remarkBreaks from 'remark-breaks'




	export async function createPdfFile(filename : string, csscontent : string, body : string, destfilename : string) {
		const processor = unified()
		.use(remarkParse)
		.use(remarkBreaks)
		.use(supersub)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeStringify)
		.use(rehypeDocument, {title: filename, style: csscontent, js: "https://unpkg.com/pagedjs/dist/paged.polyfill.js"})



		const doc = await processor.process(body);
		console.log("file contents below")

		var doctext:string  = String(doc);


		this.app.vault.create( destfilename,  doctext);


		let noticestring = 'File ' + destfilename + ' was created as an html file and added to vault'
		new Notice(noticestring);


	}