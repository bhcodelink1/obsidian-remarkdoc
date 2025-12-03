import { TFile} from 'obsidian';
// import { WritingPluginSettings} from './interfaces';


// var documentfile = require('./docxstyle_template.json');


export function formatsupersubscript(body: string) {
		body = body.replace(/<sup>/g, '^')
		body = body.replace(/<\/sup>/g, '^')


		body = body.replace(/<sub>/g, '~')
		body = body.replace(/<\/sub>/g, '~')

		return body
	}


export async function getFileFromPath(filepathstring: string) {

		const filepath = this.app.vault.getAbstractFileByPath(filepathstring)

		var filecontents : string = ""
		if (!filepath) {
			// new Notice("No active file.");
			return;
		}
		// console.log("Found active file: ", refFilepath.path);
		if (filepath instanceof TFile){
			filecontents = await this.app.vault.cachedRead(filepath);
		}

		return filecontents

	}

export function getFrontmatterAndBody(file:TFile, body:string) : [any, string] {
	var fmc = this.app.metadataCache.getFileCache(file)?.frontmatter;
	var outputfmc: any;
	if(fmc){
		let end = fmc.position.end.line + 1 // accont for ending ---
		body = body.split("\n").slice(end).join("\n")
		outputfmc = fmc
	} else{
		body = body.split("\n").join("\n")
		// fmc = {'contents':'None'}
		outputfmc = {'contents':'None'}

	}

	return [outputfmc, body]

}

export function getDefaultCss() : string {

	let defaultCSS = `@media print {
		html {
		font-family: "Times New Roman", Times, serif  !important; 
		}

		.frontmatter {display: none}

		body {
		font-family: "Times New Roman", Times, serif; 
		font-size: 12pt;

		}

		h1 {
		color : black;
		font-family: "Times New Roman", Times, serif !important; 
		font-size: 15pt !important;
		font-weight: bold !important;
			text-indent: 0em !important;

		}

		h2 {
		color : black;
		font-family: "Times New Roman", Times, serif !important; 
		font-size: 14pt !important;
		font-weight: bold !important;
			text-indent: 0em !important;

		}


		h3 {
		color : black;
		font-family: "Times New Roman", Times, serif !important; 
		font-size: 13pt !important;
		font-weight: italic !important;
			text-indent: 0em !important;

		}

		h4 {
		color : black;
		font-family: "Times New Roman", Times, serif !important; 
		font-size: 12pt !important;
			text-indent: 0em !important;

		}


		ul {
		font-family: "Times New Roman", Times, serif; 
		font-size: 12pt;

		}

		li {
		font-family: "Times New Roman", Times, serif; 
		font-size: 12pt;
			color: black !important;


		}

		li::before {
			position: relative;  
			color: black !important;


		}


		li p {
			margin-top: 0;
			margin-bottom: 0;
			padding-top: 0;
			padding-bottom: 0;
			display:inline;
		}

		ol li::before {
			position: relative;  
				width: 20px !important;   

			color: black !important;


		}




		a {
		font-family: "Times New Roman", Times, serif !important; 
		font-size: 12pt;
		color: black !important;
		}

		p {
		font-family: "Times New Roman", Times, serif; 
		font-size: 12pt;

		}

		table {
			border-collapse: collapse;
			border-spacing: 0;
			width: auto;
			border-top: 2.27px solid black;
			border-bottom: 2.27px solid black;
			overflow-x: auto;	
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
		}
		th,
		td {
			border: 0 none;
			padding: 0.51rem;
			line-height: 1.1;
		}
		table > tbody > tr:first-child > td,
		table > tbody > tr:first-child > th {
			border-top: 1.36px solid black;
		}
		table > tbody > tr:last-child > td,
		table > tbody > tr:last-child > th {
			border-bottom: 1.36px solid black;
		}
		thead th {
			background-color: white !important;
			font-weight: 700;    
			padding: 8px 9px 5px 9px;
		}
		tr:nth-child(even) {
			background-color: #ebecf1 ;
		}
		tbody tr:hover td {
			background-color: #f5f1da;
		}`
		return defaultCSS
		}

// function to update spacing of styledef
// Function to update the spacing line value globally
// function updateSpacingLineValue(document: Document, newLineValue: number): void {
// 	document.paragraphStyles.forEach(style => {
// 	  if (style.paragraph) {
// 		style.paragraph.spacing.line = newLineValue;
// 	  }
// 	});
//   }

// function updateFontValue(document: Document, newFontValue: string): void {
// 	document.paragraphStyles.forEach(style => {
// 		style.run.font = newFontValue;
// 	});
//   }
  

// export function getDocumentStyle(settings:WritingPluginSettings): Document {
// 	// const documentfile = './docxstyle_template.json'
// 	const documentstyle : Document = documentfile
// 	if (settings.docxFont) {
// 		if (settings.docxFont!=''){
// 			const font=settings.docxFont
// 			updateFontValue(documentstyle, font)
// 		}
// 	}

// 	if (settings.docxSpacing) {
// 		if (settings.docxSpacing!=''){
// 			let spacingnum = Number(settings.docxSpacing);
// 			const spacing = spacingnum*240
// 			updateSpacingLineValue(documentstyle, spacing)
// 		}
// 	}
  
// 	return documentstyle;
//   }

// add a styledef function here
// create a definition for a style object in interfaces
// pass in settings - spacing and font for now
// pass in frontmatter
// test: if frontmatter exists - then if docxstyle exists - load docxstyle else, load default file and update with setting on spacing and font
// export function getStyleDefinition()


