import {  Notice, TFile } from 'obsidian';
import {convertWikiToMarkdownPdf} from './utilities'


import {unified} from 'unified'

import remarkParse from "remark-parse";


import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeDocument from 'rehype-document';
import remarkGfm from 'remark-gfm';
import supersub from 'remark-supersub' 
import remarkCallout from "@r4ai/remark-callout"

import remarkBreaks from 'remark-breaks'
import juice from "juice";



	export async function createGdocFile(filename : string, csscontent : string, body : string, destfilename : string, currentFile: TFile) {
		const processor = unified()
		.use(remarkParse)
		.use(remarkCallout)
		.use(remarkBreaks)
		.use(supersub)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeStringify)
		.use(rehypeDocument, {title: filename, style: csscontent, js: "https://unpkg.com/pagedjs/dist/paged.polyfill.js"})


		const bodyclean = await convertWikiToMarkdownPdf(body, currentFile)

		const doc = await processor.process(bodyclean);

		var doctext:string  = String(doc);

		const inlined = juice(doctext);

		this.app.vault.create( destfilename,  inlined);


		let noticestring = 'File ' + destfilename + ' was created as an html file and added to vault'
		new Notice(noticestring);


	}