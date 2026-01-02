import {  PluginSettingTab,  Setting, App } from 'obsidian';
import MyPlugin from '../../main'



export class WritingSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl).setName('PDF export').setHeading(); 

		new Setting(containerEl).setName('Default across PDF exports');

		new Setting(containerEl)
			.setName('Font to use in PDF HTML export')
			.setDesc('Global font for exports to PDF ready HTML')
			.addText(text => text
				// /skip this is the appropriate text for the element
				.setPlaceholder('Palatino Linotype')
				.setValue(this.plugin.settings.cssFont)
				.onChange(async (value) => {
					this.plugin.settings.cssFont = value;
					await this.plugin.saveSettings();
				}));
		
				
		new Setting(containerEl)
				.setName('Spacing to use in PDF HTML export')
				.setDesc('Global spacing for exports to PDF ready HTML')
				.addDropdown((dropdown) => {
					dropdown
					// /skip this is the appropriate text for the element
					.addOption("100%", "single spaced")
					// /skip this is the appropriate text for the element
					.addOption("200%", "double spaced")
					.setValue(this.plugin.settings.cssSpacing)
					.onChange(async (value) => {
							this.plugin.settings.cssSpacing = value;
							await this.plugin.saveSettings();
				});
				});

		new Setting(containerEl)
				.setName('Paragraph indent to use in PDF HTML export')
				.setDesc('Global indent for new paragraphs in exports to PDF ready HTML')
				.addDropdown((dropdown) => {
					dropdown
					.addOption("0", "None")
					.addOption("1", "One tab")
					.setValue(this.plugin.settings.cssParaIndent)
					.onChange(async (value) => {
							this.plugin.settings.cssParaIndent = value;
							await this.plugin.saveSettings();
				});
				});
		new Setting(containerEl).setName('Alternatively, set a default CSS file to use for PDF exports');

		new Setting(containerEl)
		// /skip this is the appropriate text for the element
			.setName('Default CSS file for PDF conversion to use')
			// /skip this is the appropriate text for the element
			.setDesc('File within vault that will be used as default CSS definition for PDF conversion')
			.addText(text => text
				// /skip this is the appropriate text for the element
				.setPlaceholder('default.css')
				.setValue(this.plugin.settings.cssFile)
				.onChange(async (value) => {
					this.plugin.settings.cssFile = value;
					await this.plugin.saveSettings();
				}));
		// /skip this is the appropriate text for the element
		new Setting(containerEl).setName('Google Doc export').setHeading(); 
		// /skip this is the appropriate text for the element
		new Setting(containerEl).setName('Defaults across Google Doc exports');


		new Setting(containerEl)
		// /skip this is the appropriate text for the element
			.setName('Font to use in gdoc HTML export')
			// /skip this is the appropriate text for the element
			.setDesc('Global font for exports to gdoc ready HTML')
			.addText(text => text
				.setPlaceholder('Arial')
				.setValue(this.plugin.settings.gdoccssFont)
				.onChange(async (value) => {
					this.plugin.settings.gdoccssFont = value;
					await this.plugin.saveSettings();
				}));
		
				
		new Setting(containerEl)
		// /skip this is the appropriate text for the element
				.setName('Spacing to use in gdoc HTML export')
				// /skip this is the appropriate text for the element
				.setDesc('Global spacing for exports to gdoc ready HTML')
				.addDropdown((dropdown) => {
					dropdown
					// /skip this is the appropriate text for the element
					.addOption("100%", "single spaced")
					// /skip this is the appropriate text for the element
					.addOption("200%", "double spaced")
					.setValue(this.plugin.settings.gdoccssSpacing)
					.onChange(async (value) => {
							this.plugin.settings.gdoccssSpacing = value;
							await this.plugin.saveSettings();
				});
				});

		new Setting(containerEl)
		// /skip this is the appropriate text for the element
				.setName('Paragraph indent to use in gdoc HTML export')
				// /skip this is the appropriate text for the element
				.setDesc('Global indent for new paragraphs in exports to gdoc ready HTML')
				.addDropdown((dropdown) => {
					dropdown
					.addOption("0", "None")
					.addOption("1", "One tab")
					.setValue(this.plugin.settings.gdoccssParaIndent)
					.onChange(async (value) => {
							this.plugin.settings.gdoccssParaIndent = value;
							await this.plugin.saveSettings();
				});
				});
// /skip this is the appropriate text for the element
		new Setting(containerEl).setName('Alternatively, set a default CSS file to use for gdoc exports');

		new Setting(containerEl)
		// /skip this is the appropriate text for the element
			.setName('Default CSS file for gdoc conversion to use')
			// /skip this is the appropriate text for the element
			.setDesc('File within vault that will be used as default CSS definition for gdoc conversion')
			.addText(text => text
				// /skip this is the appropriate text for the element
				.setPlaceholder('default.css')
				.setValue(this.plugin.settings.gdoccssFile)
				.onChange(async (value) => {
					this.plugin.settings.gdoccssFile = value;
					await this.plugin.saveSettings();
				}));
		
		// /skip this is the appropriate text for the element
		new Setting(containerEl).setName('Docx export').setHeading(); 
		
		new Setting(containerEl)
		// /skip this is the appropriate text for the element
			.setName('Font to use in Docx export')
			// /skip this is the appropriate text for the element
			.setDesc('Global font for exports to Microsoft Word')
			.addText(text => text
				// /skip this is the appropriate text for the element
				.setPlaceholder('Palatino Linotype')
				.setValue(this.plugin.settings.docxFont)
				.onChange(async (value) => {
					this.plugin.settings.docxFont = value;
					await this.plugin.saveSettings();
				}));
		
				
		new Setting(containerEl)
		// /skip this is the appropriate text for the element
				.setName('Spacing to use in Docx export')
				// /skip this is the appropriate text for the element
				.setDesc('Global spacing for exports to Microsoft Word')
				.addDropdown((dropdown) => {
					dropdown
					// /skip this is the appropriate text for the element
					.addOption("1", "single spaced")
					// /skip this is the appropriate text for the element
					.addOption("2", "double spaced")
					.setValue(this.plugin.settings.docxSpacing)
					.onChange(async (value) => {
							this.plugin.settings.docxSpacing = value;
							await this.plugin.saveSettings();
				});
				});
		new Setting(containerEl)
		// /skip this is the appropriate text for the element
				.setName('Color for table borders to use in Docx export')
				// /skip this is the appropriate text for the element
				.setDesc('Global table border color for exports to Microsoft Word')
				.addDropdown((dropdown) => {
					dropdown
					.addOption("#000000", "Black")
					.addOption("#ffffff", "White")
					.setValue(this.plugin.settings.docxTableBorder)
					.onChange(async (value) => {
							this.plugin.settings.docxTableBorder = value;
							await this.plugin.saveSettings();
				});
				});

	}

}

