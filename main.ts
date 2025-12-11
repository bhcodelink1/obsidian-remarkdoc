import { Plugin, Editor, MarkdownView,  Notice,  getFrontMatterInfo,  parseYaml, TFile } from 'obsidian';
import {createDocxFile} from './assets/modules/createDocx';
import {getFileFromPath, getDefaultCss, getDefaultGdocCss} from './assets/modules/utilities';
import {createPdfFile} from './assets/modules/createHtmlPdf'
import {createGdocFile} from './assets/modules/createHtmlGdoc'
import {docxModal} from './assets/modules/filenameModal'
import {WritingSettingTab} from './assets/modules/writingSettingsClass';
import {WritingPluginSettings} from './assets/modules/interfaces';

// Remember to rename these classes and interfaces!



const DEFAULT_SETTINGS: WritingPluginSettings = {
	docxFont: '',
	docxSpacing: '',
	cssFile:''
}


export default class MyPlugin extends Plugin {
	settings: WritingPluginSettings;


	async onload() {
		await this.loadSettings();

		// This adds a settings tab 
		this.addSettingTab(new WritingSettingTab(this.app, this));


		this.addCommand({
			id: "convert-docx",
			name: "Convert the current document to a docx word file",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				this.markdownToDocx(editor)
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


	}

	onunload() {

	}
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


	async markdownToDocx(editor: Editor) {

		const currentFile: TFile | null = this.app.workspace.getActiveFile();

		var fulldoc = editor.getDoc().getValue();
		var frontmatter = getFrontMatterInfo(fulldoc)
		var frontmattertext = frontmatter.frontmatter
		var frontmatteryaml = parseYaml(frontmattertext)
		var dividertext = "---"


		var body = fulldoc.replace(dividertext, "")
		 body = body.replace(frontmattertext, "")
		 body = body.replace(dividertext, "")


		var currentSettings = this.settings

		if ((frontmatteryaml) && ('docxstyling' in frontmatteryaml)){
			var docxstyling : object = frontmatteryaml['docxstyling']
		} else {
			var docxstyling : object = {}
		}
		
		  

		// if front matter exists - get that 
		var destfilename = 'export.docx'

		if (frontmatteryaml!=null){


			if ('docxfilename' in frontmatteryaml){
				destfilename = frontmatteryaml['docxfilename']

				await createDocxFile(currentSettings, docxstyling, body, destfilename, currentFile) 

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

					createDocxFile(currentSettings,docxstyling, body, destfilename, currentFile) 
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

				createDocxFile(currentSettings,docxstyling, body, destfilename, currentFile) 
				});
			}
			  }).open();
		}

	}

	async markdownToPdf(editor: Editor) {
		
		console.log("function loaded")
		const file = this.app.workspace.getActiveFile();

		var fulldoc = editor.getDoc().getValue();

		var dividertext = "---"

		var frontmatter = getFrontMatterInfo(fulldoc)
		var frontmattertext = frontmatter.frontmatter
		var fmc = parseYaml(frontmattertext)

		

		var body = fulldoc.replace(dividertext, "")
		body = body.replace(frontmattertext, "")
		body = body.replace(dividertext, "")

		var exportCssFilename = ''
		console.log("exportCSSFilename set")

		if ((this.settings.cssFile!='') && (this.settings.cssFile)){
			exportCssFilename = this.settings.cssFile
			console.log("settings css set")
		}

		
		if ((fmc) && ("pdfcss" in fmc)){
			exportCssFilename = fmc['pdfcss']
			console.log("frontmatter css set")
		} 


		const filename:string = file.basename;
		const path:string = file.path;
		const basefilename = path.replace(/\.[^/.]+$/, "")
		const destfilename = basefilename + '.html'

		const cssFont = this.settings.cssFont
		const cssSpacing = this.settings.cssSpacing
		const cssParaIndent = this.settings.cssParaIndent

		var csscontent = ''
		if (exportCssFilename!='') {
			csscontent = await getFileFromPath(exportCssFilename) ?? getDefaultCss(cssFont, cssSpacing, cssParaIndent)
			console.log("using exposrtcssfile value")
		} else {
			csscontent = getDefaultCss(cssFont, cssSpacing, cssParaIndent)
			console.log("using default css value")
		}

		await createPdfFile(filename, csscontent, body, destfilename, file)
		

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
		var exportCssFilename = ''

		if ((this.settings.cssFile!='') && (this.settings.cssFile)){
			exportCssFilename = this.settings.cssFile
		}


		if ((fmc) && ("gdoccss" in fmc)){
			exportCssFilename = fmc['gdoccss']
		} 


		const filename:string = file.basename;
		const path:string = file.path;
		const basefilename = path.replace(/\.[^/.]+$/, "")
		const destfilename = basefilename + '-googledoc.html'

		var csscontent = ''
		if (exportCssFilename!='') {
			csscontent = await getFileFromPath(exportCssFilename) ?? getDefaultGdocCss()
		} else {
			csscontent = getDefaultGdocCss()
		}

		await createGdocFile(filename, csscontent, body, destfilename, file)
		

	}


}


