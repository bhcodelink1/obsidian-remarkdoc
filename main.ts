import { Plugin, Editor, MarkdownView,  Notice,  getFrontMatterInfo,  parseYaml, TFile } from 'obsidian';
import {createDocxFile} from './assets/modules/createDocx';
import {getFileFromPath, getDefaultCss, getDefaultGdocCss} from './assets/modules/utilities';
import {createPdfFile} from './assets/modules/createHtmlPdf'
import {createGdocFile} from './assets/modules/createHtmlGdoc'
import {docxModal} from './assets/modules/filenameModal'
import {WritingSettingTab} from './assets/modules/writingSettingsClass';
import {WritingPluginSettings} from './assets/modules/interfaces';



const DEFAULT_SETTINGS: WritingPluginSettings = {
	docxFont: '',
	docxSpacing: '',
	cssFile:'',
	docxTableBorder: '',
	cssFont: '', 
	cssSpacing: '',
	cssParaIndent: '',
	gdoccssFont: '',
	gdoccssSpacing: '',
	gdoccssParaIndent: '',
	gdoccssFile: ''
}


export default class DocumentExporterPlugin extends Plugin {
	settings: WritingPluginSettings;


	async onload() {
		await this.loadSettings();

		this.addSettingTab(new WritingSettingTab(this.app, this));


		this.addCommand({
			id: "convert-docx",
			name: "Convert the current document to a docx word file",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				// add await here?
				this.markdownToDocx(editor)
				.then()
				.catch((error) => {
                  // Catch any errors that escape the try-catch (shouldn't happen, but safety net)
                  new Notice('An unexpected error occurred while creating the DOCX file');
                })
			},
		  });

		this.addCommand({
			id: "convert-pdf",
			name: "Convert the current document to a pdf ready html file",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				// add await here?
				this.markdownToPdf(editor)
				.then()
				.catch((error) => {
                  // Catch any errors that escape the try-catch (shouldn't happen, but safety net)
                  new Notice('An unexpected error occurred while creating the DOCX file');
                })
			},
		});

		this.addCommand({
			id: "convert-gdoc",
			name: "Convert the current document to a gdoc ready html file",
			editorCallback: (editor: Editor, view: MarkdownView)  => {
				// add await here?
				this.markdownToGdocHtml(editor)
				.then()
				.catch((error) => {
                  // Catch any errors that escape the try-catch (shouldn't happen, but safety net)
                  new Notice('An unexpected error occurred while creating the DOCX file');
                })
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

		let fulldoc = editor.getDoc().getValue();
		let frontmatter = getFrontMatterInfo(fulldoc)
		let frontmattertext = frontmatter.frontmatter
		let frontmatteryaml = parseYaml(frontmattertext)
		let dividertext = "---"


		let body = fulldoc.replace(dividertext, "")
		 body = body.replace(frontmattertext, "")
		 body = body.replace(dividertext, "")


		let currentSettings = this.settings
		let docxstyling : object = {}
		if ((frontmatteryaml) && ('docxstyling' in frontmatteryaml)){
			docxstyling  = frontmatteryaml['docxstyling']
		} 
		
		let destfilename = 'export.docx'

		if (frontmatteryaml!=null){

//fix line below
			if (('docxfilename' in frontmatteryaml) && (frontmatteryaml['docxfilename']) && ((frontmatteryaml['docxfilename'].trim().length > 0) )) {
				destfilename = frontmatteryaml['docxfilename']

				await createDocxFile(currentSettings, docxstyling, body, destfilename, currentFile) 

			} else {
				let noticestring = 'Adding a frontmatter property "docxfilename" with a filename.'
				new Notice(noticestring);
				new docxModal(this.app, (result) => {
					destfilename = result;
					const file = this.app.workspace.getActiveFile();
					if (file){
						// add await here somewhere?
					this.app.fileManager.processFrontMatter(file, (frontmatter) => {
						frontmatter['docxfilename'] = result;

					createDocxFile(currentSettings,docxstyling, body, destfilename, currentFile) 
					});
					//
				}
				  }).open();
				

			}
		} else {
			let noticestring = 'Adding a frontmatter property "docxfilename" with a filename.'
			new Notice(noticestring);
			
			new docxModal(this.app, (result) => {
				destfilename = result;
				const file = this.app.workspace.getActiveFile();
				if (file){
					// add await here somewhere?
				this.app.fileManager.processFrontMatter(file, (frontmatter) => {
					frontmatter['docxfilename'] = result;

				createDocxFile(currentSettings,docxstyling, body, destfilename, currentFile) 
				});
				///
			}
			  }).open();
		}

	}

	async markdownToPdf(editor: Editor) {
		
		const file = this.app.workspace.getActiveFile();

		let fulldoc = editor.getDoc().getValue();

		let dividertext = "---"

		let frontmatter = getFrontMatterInfo(fulldoc)
		let frontmattertext = frontmatter.frontmatter
		let fmc = parseYaml(frontmattertext)

		

		let body = fulldoc.replace(dividertext, "")
		body = body.replace(frontmattertext, "")
		body = body.replace(dividertext, "")

		let exportCssFilename = ''

		if ((this.settings.cssFile!='') && (this.settings.cssFile)){

			const filepath : string = this.settings.cssFile
			const cssfileexists: TFile | null = this.app.vault.getFileByPath(filepath);
			if (cssfileexists){
			exportCssFilename = this.settings.cssFile
			}
		}
		

		
		if ((fmc) && ("pdfcss" in fmc)){

			const filepathfmc : string = fmc['pdfcss'];
			const cssfileexistsfmc: TFile | null = this.app.vault.getFileByPath(filepathfmc);
			if (cssfileexistsfmc){
			exportCssFilename = fmc['pdfcss']
			}
		} 


		const filename:string = file.basename;
		const path:string = file.path;
		const basefilename = path.replace(/\.[^/.]+$/, "")
		const destfilename = basefilename + '.html'

		const cssFont = this.settings.cssFont
		const cssSpacing = this.settings.cssSpacing
		const cssParaIndent = this.settings.cssParaIndent

		let csscontent = ''
		if (exportCssFilename!='') {
			csscontent = await getFileFromPath(exportCssFilename) ?? getDefaultCss(cssFont, cssSpacing, cssParaIndent)
		} else {
			csscontent = getDefaultCss(cssFont, cssSpacing, cssParaIndent)
		}

		await createPdfFile(filename, csscontent, body, destfilename, file)
		

	}

	async markdownToGdocHtml(editor: Editor) {
		

		const file = this.app.workspace.getActiveFile();

		let fulldoc = editor.getDoc().getValue();

		let dividertext = "---"

		let frontmatter = getFrontMatterInfo(fulldoc)
		let frontmattertext = frontmatter.frontmatter
		let fmc = parseYaml(frontmattertext)

		

		let body = fulldoc.replace(dividertext, "")
		body = body.replace(frontmattertext, "")
		body = body.replace(dividertext, "")
		let exportCssFilename = ''

		if ((this.settings.gdoccssFile!='') && (this.settings.gdoccssFile)){
			const filepath : string = this.settings.gdoccssFile
			const cssfileexists: TFile | null = this.app.vault.getFileByPath(filepath);
			if (cssfileexists){
				exportCssFilename = this.settings.gdoccssFile
			}
		}


		if ((fmc) && ("gdoccss" in fmc)){
			const filepathfmc : string = fmc['gdoccss'];
			const cssfileexistsfmc: TFile | null = this.app.vault.getFileByPath(filepathfmc);
			if (cssfileexistsfmc){
				exportCssFilename = fmc['gdoccss']
			}
		} 


		const filename:string = file.basename;
		const path:string = file.path;
		const basefilename = path.replace(/\.[^/.]+$/, "")
		const destfilename = basefilename + '-googledoc.html'

		const gdoccssFont = this.settings.gdoccssFont
		const gdoccssSpacing = this.settings.gdoccssSpacing
		const gdoccssParaIndent = this.settings.gdoccssParaIndent
		let csscontent = ''
		if (exportCssFilename!='') {
			csscontent = await getFileFromPath(exportCssFilename) ?? getDefaultGdocCss(gdoccssFont, gdoccssSpacing, gdoccssParaIndent)
		} else {
			csscontent = getDefaultGdocCss(gdoccssFont, gdoccssSpacing, gdoccssParaIndent)
		}

		await createGdocFile(filename, csscontent, body, destfilename, file)
		

	}


}


