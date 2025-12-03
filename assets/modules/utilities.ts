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


