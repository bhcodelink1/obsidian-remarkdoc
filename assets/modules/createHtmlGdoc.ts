import {  Notice, TFile } from 'obsidian';
import {convertWikiToMarkdownPdf} from './utilities'


import {unified} from 'unified'

import remarkParse from "remark-parse";

import rehypeRaw from 'rehype-raw';
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
		.use(remarkBreaks)
		.use(remarkCallout)
		.use(supersub)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeStringify)
		.use(rehypeDocument, {title: filename, style: csscontent})


		var bodyclean = await convertWikiToMarkdownPdf(body, currentFile)
		const regex = /(?!<^#.*)\n(?=[\n])/g;
    	const replacement = "\n<p></p>\n"
		bodyclean = bodyclean.replace(regex, replacement);

		const doc = await processor.process(bodyclean);

		var doctext:string  = String(doc);

		const inlined = juice(doctext);

		this.app.vault.create( destfilename,  inlined);


		let noticestring = 'File ' + destfilename + ' was created as an html file and added to vault'
		new Notice(noticestring);


	}