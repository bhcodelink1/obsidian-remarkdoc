import { App, Modal, Setting } from 'obsidian';

export class docxModal extends Modal {
  constructor(app: App, onSubmit: (result: string) => void) {
    super(app);
	this.setTitle('Provide the path and filename for the word document.');

	let name = '';
    new Setting(this.contentEl)
      .setName('path/name.docx')
      .addText((text) =>
        text.onChange((value) => {
          name = value;
        }));

    new Setting(this.contentEl)
      .addButton((btn) =>
        btn
          .setButtonText('Submit')
          .setCta()
          .onClick(() => {
            this.close();
            onSubmit(name);
          }));
  }
}