import { Plugin, Editor, MarkdownView, PluginSettingTab, SuggestModal, Setting, App, Workspace, Notice, Events, getFrontMatterInfo, editorInfoField, parseYaml, stringifyYaml, TFile, htmlToMarkdown } from 'obsidian';
import {createDocxFile} from './assets/modules/createDocx';
import {getFileFromPath, getDocumentStyle, fetchAllZoteroDataToFile, fetchUpdatedZoteroDataToFile} from './assets/modules/utilities'
import {CslData, WritingPluginSettings} from './assets/modules/interfaces';
import {createBibliographyFunction} from './assets/modules/bibliography'
import {createPdfFile} from './assets/modules/createHtmlPdf'
import {createGdocFile} from './assets/modules/createHtmlGdoc'
import {docxModal} from './assets/modules/filenameModal'

import {CitationModal} from './assets/modules/citationModalClass';
// Remember to rename these classes and interfaces!
import {WritingSettingTab} from './assets/modules/writingSettingsClass';
import * as mammoth from "mammoth";


const DEFAULT_SETTINGS: WritingPluginSettings = {
	zoteroPath: 'zoteroLibrary/',
	zoteroFile: 'MyLibrary.json',
	defaultLocale: 'locales-en-US.xml',
	defaultStyle: 'vancouver.csl',
	docxStyle: '',
	cssFile:''
}

var ALL_CITATIONS : CslData[] = []

export default class MyPlugin extends Plugin {
	settings: WritingPluginSettings;



	async onload() {

		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file) => {
				if (file instanceof TFile) {
					if (file.extension=='docx') {
						menu.addItem((item) => {
							item
							  .setTitle('Convert to Markdown')
							  .setIcon('document')
							  .onClick(async () => {
								console.log('converting!');
								// load file into binary
								const fileBuffer = await this.app.vault.readBinary(file)
								// use mammoth js to convert binary to html
								mammoth.convertToHtml({arrayBuffer: fileBuffer})
									.then(function(result){
										console.log('file loaded into arraybuffer')
										var htmlstring = result.value; // The generated HTML
										var messages = result.messages;// Any messages, such as warnings during conversion
										console.log(messages)
										console.log('converted to html')
										
										// convert html to markdown
										var output = htmlToMarkdown(htmlstring )
										console.log('converted to markdown')
										var destfilename = file.path
										destfilename = destfilename.replace('.docx', '.md')
										console.log(destfilename)
										// use obsidian apis to export to md in directory of original file
										this.app.vault.create( destfilename,  output);
										// notice of completion
										new Notice('file saved');
									})
									.catch(function(error) {
										console.error(error);
									});

							  });
						  });
					}
				}
			})
		  );




		await this.loadSettings();
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new WritingSettingTab(this.app, this));

		this.addCommand({
			id: 'convert-hard-breaks',
			name: 'Convert soft breaks to hard breaks',
			editorCallback: (editor: Editor, view: MarkdownView) => {

			const searchRegex = /[\n]/g
			const replaceString = '  \n'
			const documentText = editor.getValue();
			const rresult = documentText.match(searchRegex);
			if (rresult) {
				editor.setValue(documentText.replace(searchRegex, replaceString));

				}

			}
		});


		this.addCommand({
			id: 'insert-comment',
			name: 'Insert a comment at cursor',
			editorCallback: (editor: Editor) => {
			  const sel = editor.getSelection();
			  if (sel.length>0){
				editor.replaceRange(
					'==',
					editor.getCursor("from")
				  );
				editor.replaceRange(
					'==%% Comment %%',
					editor.getCursor("to")
				  );
			  } else {
				editor.replaceRange(
					'%% Comment %%',
					editor.getCursor()
				  );
			  }

			},
		  });

		this.addRibbonIcon('message-circle', 'Add Comment', () => {
			const editor = this.app.workspace.getActiveViewOfType(MarkdownView).editor;
			if (editor){
				const sel = editor.getSelection();
			  if (sel.length>0){
				editor.replaceRange(
					'==',
					editor.getCursor("from")
				  );
				editor.replaceRange(
					'==%% Comment %%',
					editor.getCursor("to")
				  );
			  } else {
				editor.replaceRange(
					'%% Comment %%',
					editor.getCursor()
				  );
			  }
			}

		  });

		this.addCommand({
			id: "convert-docx",
			name: "Convert the current document to a docx word file",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				this.markdownToDocx(editor)
			},
		  });

		  this.addCommand({
			id: "download-zotero",
			name: "Download your zotero library locally",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				this.downloadZoteroLibrary(editor)
			},
		  });

		  this.addCommand({
			id: "update-zotero",
			name: "Update your zotero library locally",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				this.updateZoteroLibrary(editor)
			},
		  });



		  this.addCommand({
			id: "create-bibliography",
			name: "Create bibliography and output file",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				this.createBibliography(editor)
			},
		});

		this.addCommand({
			id: "add-reference",
			name: "Find and add references",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				this.addReference(editor)
			},
		});

		this.addCommand({
			id: "convert-pdf",
			name: "Convert the current document to a pdf ready html file",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				this.markdownToPdf(editor)
			},
		});

		this.addCommand({
			id: "convert-gdoc",
			name: "Convert the current document to a gdoc ready html file",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				this.markdownToGdocHtml(editor)
			},
		});
		

		this.addCommand({
			id: "merge-files",
			name: "Merge multiple files based on links",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				this.combineFiles(editor)
			},			
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


	async downloadZoteroLibrary(editor: Editor) {
		

		await fetchAllZoteroDataToFile(this.settings)
		//error handling, what if the fetch fails? should have an error pathway

		await this.saveData(this.settings);
	}

	async updateZoteroLibrary(editor: Editor) {
		

		await fetchUpdatedZoteroDataToFile(this.settings)
		//error handling, what if the fetch fails? should have an error pathway
		
		
	}	  


	async addReference(editor: Editor) {

		// get settings filenames
		const zoteroPath= this.settings.zoteroPath
		const zoteroFile= this.settings.zoteroFile


		const dataSourceLoc = zoteroPath+zoteroFile
		const refFilepath = this.app.vault.getAbstractFileByPath(dataSourceLoc)
	
		if (!refFilepath) {
			new Notice("No active file.");
			return;
		}
		console.log("Found active file: ", refFilepath.path);
		if (refFilepath instanceof TFile){
			this.app.vault.cachedRead(refFilepath)
				.then(dataSource => {

					ALL_CITATIONS  = JSON.parse(dataSource) as CslData[];
					var cm = new CitationModal(this.app)
					cm.ALL_CITATIONS = ALL_CITATIONS
					cm.open();
					
					console.log(ALL_CITATIONS)
				})
				.catch(error=>console.log(error))
				.finally(()=>console.log("FINISH"))

		}

	}

	addDocxFrontMatter(editor: Editor) {
		var fulldoc = editor.getDoc().getValue();
		var frontmatter = getFrontMatterInfo(fulldoc)
		var frontmattertext = frontmatter.frontmatter
		var frontmatteryaml = parseYaml(frontmattertext)
		// const frontmatterContent = "" 
		if ('docxfilename' in frontmatteryaml){
			
			} else {
				const file = this.app.workspace.getActiveFile();
				if (file){
				this.app.fileManager.processFrontMatter(file, (frontmatter) => {
					// add front matter here - create dictionary with information
					
					// frontmatter['docxfilename'] = result;
				})
			}
		}
	}


	async markdownToDocx(editor: Editor) {


		var fulldoc = editor.getDoc().getValue();
		var frontmatter = getFrontMatterInfo(fulldoc)
		var frontmattertext = frontmatter.frontmatter
		var frontmatteryaml = parseYaml(frontmattertext)
		var dividertext = "---"


		var body = fulldoc.replace(dividertext, "")
		 body = body.replace(frontmattertext, "")
		 body = body.replace(dividertext, "")

		// var styleDef = getDocumentStyle(this.settings)
		var currentSettings = this.settings

		if ('docxstyling' in frontmatteryaml){
			var docxstyling : object = frontmatteryaml['docxstyling']
		} else {
			var docxstyling : object = {}
		}
		
		  

		// if front matter exists - get that 
		var destfilename = 'export.docx'

		if (frontmatteryaml!=null){


			if ('docxfilename' in frontmatteryaml){
				destfilename = frontmatteryaml['docxfilename']
				// await createDocxFile(styleDef, body, destfilename) 
				await createDocxFile(currentSettings, docxstyling, body, destfilename) 

			} else {
				let noticestring = 'adding a frontmatter property "docxfilename" and a filename.'
				new Notice(noticestring);
				new docxModal(this.app, (result) => {
					console.log(result)
					destfilename = result;
					const file = this.app.workspace.getActiveFile();
					if (file){
					this.app.fileManager.processFrontMatter(file, (frontmatter) => {
						frontmatter['docxfilename'] = result;
					// createDocxFile(styleDef, body, destfilename) 
					createDocxFile(currentSettings,docxstyling, body, destfilename) 
					});
				}
				  }).open();
				

			}
		} else {
			let noticestring = 'adding a frontmatter property "docxfilename" and a filename.'
			new Notice(noticestring);
			
			new docxModal(this.app, (result) => {
				console.log(result)
				destfilename = result;
				const file = this.app.workspace.getActiveFile();
				if (file){
				this.app.fileManager.processFrontMatter(file, (frontmatter) => {
					frontmatter['docxfilename'] = result;
				// createDocxFile(styleDef, body, destfilename) 
				createDocxFile(currentSettings,docxstyling, body, destfilename) 
				});
			}
			  }).open();
		}

		

	}


	async createBibliography(editor: Editor){
		


		const zoteroPath= this.settings.zoteroPath
		const zoteroFile= this.settings.zoteroFile
		const defaultLocale= this.settings.defaultLocale
		const defaultStyle= this.settings.defaultStyle


		
		//get data source
		const dataSourceLoc = zoteroPath + zoteroFile
		var dataSourceload = await getFileFromPath(dataSourceLoc)
		var dataSource : CslData[] =[]
		if (dataSourceload!="") {
			dataSource = JSON.parse(dataSourceload)
		}
		console.log(dataSource)
		//get locale
		const localeFile = zoteroPath + defaultLocale
		var localecontent = await getFileFromPath(localeFile)


		// default cslfilename

		var cslfilename = zoteroPath + defaultStyle
		
		//get markdown file
		const file = this.app.workspace.getActiveFile();
		var fulldoc = editor.getDoc().getValue();

		var dividertext = "---"

		var frontmatter = getFrontMatterInfo(fulldoc)
		var frontmattertext = frontmatter.frontmatter
		var fmc = parseYaml(frontmattertext)

		

		var body = fulldoc.replace(dividertext, "")
		body = body.replace(frontmattertext, "")
		body = body.replace(dividertext, "")

		// if there is a csl file in frontmatter, get it
		if (fmc){
			if ('csl' in fmc) {
				cslfilename = fmc['csl']
			}
	}


		const path:string = file.path;
		const basefilename = path.replace(/\.[^/.]+$/, "")
		const destfilename = basefilename + '_citation.md'

		// get csl

		var cslcontent = await getFileFromPath(cslfilename)

		
		body = createBibliographyFunction(body, localecontent, cslcontent, dataSource )
		body = '---\n' + frontmattertext + '\n---\n' + body
		this.app.vault.create( destfilename,  body);	
		let noticestring = 'File ' + destfilename + ' was created with a bibliography and added to vault'
		new Notice(noticestring);
		
	}


	
	async markdownToPdf(editor: Editor) {

		const file = this.app.workspace.getActiveFile();

		var fulldoc = editor.getDoc().getValue();

		var dividertext = "---"

		var frontmatter = getFrontMatterInfo(fulldoc)
		var frontmattertext = frontmatter.frontmatter
		var fmc = parseYaml(frontmattertext)

		

		var body = fulldoc.replace(dividertext, "")
		body = body.replace(frontmattertext, "")
		body = body.replace(dividertext, "")
		const zoteroPath= this.settings.zoteroPath
		const cssfilename = this.settings.cssFile

		var exportCssFilename = zoteroPath + cssfilename

		if (fmc['css']){
			exportCssFilename = fmc['css']
		}


		const filename:string = file.basename;
		const path:string = file.path;
		const basefilename = path.replace(/\.[^/.]+$/, "")
		const destfilename = basefilename + '.html'


		// body = formatsupersubscript(body)


		var csscontent = await getFileFromPath(exportCssFilename)

		await createPdfFile(filename, csscontent, body, destfilename)
		

	}

	async markdownToGdocHtml(editor: Editor) {

		const file = this.app.workspace.getActiveFile();

		var fulldoc = editor.getDoc().getValue();

		var dividertext = "---"

		var frontmatter = getFrontMatterInfo(fulldoc)
		var frontmattertext = frontmatter.frontmatter
		var fmc = parseYaml(frontmattertext)

		

		var body = fulldoc.replace(dividertext, "")
		body = body.replace(frontmattertext, "")
		body = body.replace(dividertext, "")
		const zoteroPath= this.settings.zoteroPath
		const cssfilename = this.settings.cssFile

		var exportCssFilename = zoteroPath + cssfilename

		if (fmc['css']){
			exportCssFilename = fmc['css']
		}


		const filename:string = file.basename;
		const path:string = file.path;
		const basefilename = path.replace(/\.[^/.]+$/, "")
		const destfilename = basefilename + '.html'


		// body = formatsupersubscript(body)


		var csscontent = await getFileFromPath(exportCssFilename)

		await createGdocFile(filename, csscontent, body, destfilename)
		

	}

	async combineFiles(editor: Editor) {

		var fulldoc = editor.getDoc().getValue();

		// Combined regex pattern for extracting link text
		
		// Combined regex pattern for extracting link text and URLs
		const combinedPattern = /!\[\[([^\|\]]+)(\|[^\]]+)?\]\]|\[\[([^\|\]]+)(\|[^\]]+)?\]\]|!\[([^\]]+)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)/g;

		// Find all matches and extract the text within the links or URLs
		const matches = [];
		let match;
		while ((match = combinedPattern.exec(fulldoc)) !== null) {
			// Extracting text from the captured groups
			const wikilinkText = match[1] || match[3];
			const transcludedWikilinkText = match[5];
			const markdownURL = match[8];
			const transcludedMarkdownURL = match[6];

			if (wikilinkText) {
				matches.push(wikilinkText);
			} else if (transcludedWikilinkText) {
				matches.push(transcludedWikilinkText);
			} else if (markdownURL) {
				matches.push(markdownURL);
			} else if (transcludedMarkdownURL) {
				matches.push(transcludedMarkdownURL);
			}
		}
		// console.log(matches);

		var finaltextarray = []

		for (const match of matches) {
			console.log(match)
			const matchmarkdown = match + '.md'
			const file = this.app.vault.getFileByPath(matchmarkdown);
			var text = await this.app.vault.cachedRead(file);
			const frontmatter = getFrontMatterInfo(text)
			const frontmattertext = frontmatter.frontmatter
			const dividertext = "---"
			text = text.replace(dividertext, "")
		    text = text.replace(frontmattertext, "")
		    text = text.replace(dividertext, "")
			finaltextarray.push(text);
			// console.log(finaltextarray);


		};
		
		var finaltext = ""
		for (const doctext of finaltextarray){
			console.log(doctext)
			finaltext = finaltext + doctext
		}

		const file = this.app.workspace.getActiveFile();
		const path:string = file.basename
		const outputfile = path + "_merged.md"

		this.app.vault.create( outputfile,  finaltext);

	}

	async removeTransclude (editor: Editor) {



	}

	async addTransclude (editor: Editor) {


	}

}

