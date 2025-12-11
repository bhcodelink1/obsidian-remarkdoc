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

		containerEl.createEl('h1', {text: 'Settings for the writing plugin.'});

		new Setting(containerEl)
			.setName('Font to use in pdf html export')
			.setDesc('Global font setting for exports to pdf ready html.')
			.addText(text => text
				.setPlaceholder('Palatino Linotype')
				.setValue(this.plugin.settings.cssFont)
				.onChange(async (value) => {
					console.log('Default pdf font: ' + value);
					this.plugin.settings.cssFont = value;
					await this.plugin.saveSettings();
				}));
		
				
		new Setting(containerEl)
				.setName('Spacing to use in pdf html export')
				.setDesc('Global spacing setting for exports to pdf ready html.')
				.addDropdown((dropdown) => {
					dropdown
					.addOption("1", "single spaced")
					.addOption("2", "double spaced")
					.setValue(this.plugin.settings.cssSpacing)
					.onChange(async (value) => {
							console.log('Default pdf spacing: ' + value);
							this.plugin.settings.cssSpacing = value;
							await this.plugin.saveSettings();
				});
				});

		new Setting(containerEl)
				.setName('Paragraph indent to use in pdf html export')
				.setDesc('Global indent setting for new paragraphs in exports to pdf ready html.')
				.addDropdown((dropdown) => {
					dropdown
					.addOption("0", "None")
					.addOption("1", "One tab")
					.setValue(this.plugin.settings.cssParaIndent)
					.onChange(async (value) => {
							console.log('Default pdf indent: ' + value);
							this.plugin.settings.cssParaIndent = value;
							await this.plugin.saveSettings();
				});
				});
		

		new Setting(containerEl)
			.setName('Default css file for pdf conversion to use')
			.setDesc('File within Vault that will be used as default css definition for pdf conversion.')
			.addText(text => text
				.setPlaceholder('default.css')
				.setValue(this.plugin.settings.cssFile)
				.onChange(async (value) => {
					console.log('Default css style: ' + value);
					this.plugin.settings.cssFile = value;
					await this.plugin.saveSettings();
				}));
		
		
		new Setting(containerEl)
			.setName('Font to use in docx export')
			.setDesc('Global font setting for exports to microsoft word.')
			.addText(text => text
				.setPlaceholder('Palatino Linotype')
				.setValue(this.plugin.settings.docxFont)
				.onChange(async (value) => {
					console.log('Default word font: ' + value);
					this.plugin.settings.docxFont = value;
					await this.plugin.saveSettings();
				}));
		
				
		new Setting(containerEl)
				.setName('Spacing to use in docx export')
				.setDesc('Global spacing setting for exports to microsoft word.')
				.addDropdown((dropdown) => {
					dropdown
					.addOption("1", "single spaced")
					.addOption("2", "double spaced")
					.setValue(this.plugin.settings.docxSpacing)
					.onChange(async (value) => {
							console.log('Default word spacing: ' + value);
							this.plugin.settings.docxSpacing = value;
							await this.plugin.saveSettings();
				});
				});
		new Setting(containerEl)
				.setName('Color for table borders to use in docx export')
				.setDesc('Global table border color setting for exports to microsoft word.')
				.addDropdown((dropdown) => {
					dropdown
					.addOption("#000000", "Black")
					.addOption("#ffffff", "White")
					.setValue(this.plugin.settings.docxTableBorder)
					.onChange(async (value) => {
							console.log('Default table border: ' + value);
							this.plugin.settings.docxTableBorder = value;
							await this.plugin.saveSettings();
				});
				});

	}

}

