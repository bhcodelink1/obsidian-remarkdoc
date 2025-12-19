# Obsidian docx, pdf, and google docs exporter using Remark/unified

## Approach
This app enables exporting markdown files in obisigian to docx (ie MS Word), pdf, and google docs, without the use of pandoc. To achieve this goal, the app uses the unified and remark libraries to parse markdown to an Abstract Syntax Tree (AST) and then to the destination files.  
  
https://unifiedjs.com  
https://unifiedjs.com/explore/package/remark/  
  
Unified and remark parse markdown, and convert it to an abstract syntax tree (AST).  
  
docx.js is used to create docx files.  
https://docx.js.org/#/  
  
The mdast2docx library is used to convert the AST to docx and connects to docx.js. This module also parses images, tables, and lists.  
https://github.com/md2docx/mdast2docx  
    
The module can be configured to specify docx formatting on output. 
  
To export to pdf, the plugin generates an html file that can be printed to pdf using the export to pdf capability of a browser on the device. Pagination and page formatting are configurable using css.  
  
The paged.js script is used to create print ready pdf files.  
  
https://pagedjs.org  
  
To export to google docs without the need for a google api key, an html file is generated that can be imported into google drive, and will be converted to a formatted google docs file. This approach also preserves table settings, unlike direct imports of docx files.  
  
This plugin was built to be usable on both desktop/laptop computers (e.g. mac) as well as on an iPad, and does not have a dependency on pandoc.  

NOTE: Images should be local and png images, stored in the vault with links in the document. Images linked via external links/URL can yield unpredictable results on iPad. 

Sample CSS templates are provided in the repository.
  
## How to use
### To export to docx

Use the command from the command palette: *Convert the current document to a docx word file* to export the file in the editor to docx.  
  
In plugin settings, global configuration of font and spacing for the document can be set.  
  
The output file name can be specified by adding a **docxfilename** frontmatter item to a document with the obsisian vault relative path and filename included. For example:  
  
```yml  
docxfilename: Documents/word_document.docx  
```  

If a filename is not added, then a prompt will ask for the filename, and it will be added to the frontmatter.  
  
More granular document styling can be set by adding a **docxstyling** frontmatter item to a document as below (with defaults as an example). smallCaps and all Caps will not both be applied; if both are marked as true, then allCaps will be used.  
  
```yml
docxstyling:  
  title:  
    font: Palatino Linotype  
    fontSize: 16  
    spacing: 1  
    smallCaps: false  
    allCaps: false  
  heading1:  
    font: Palatino Linotype  
    fontSize: 14  
    spacing: 1  
    smallCaps: true  
    allCaps: false  
  heading2:  
    font: Palatino Linotype  
    fontSize: 12  
    spacing: 1  
    smallCaps: true  
    allCaps: false  
  heading3:  
    font: Palatino Linotype  
    fontSize: 12  
    spacing: 1  
    smallCaps: true  
    allCaps: false  
  heading4:  
    font: Palatino Linotype  
    fontSize: 12  
    spacing: 1  
    smallCaps: false  
    allCaps: false  
  heading5:  
    font: Palatino Linotype  
    fontSize: 11  
    spacing: 1  
    smallCaps: false  
    allCaps: false  
  heading6:  
    font: Palatino Linotype  
    fontSize: 11  
    spacing: 1  
    smallCaps: false  
    allCaps: false  
  body:  
    font: Palatino Linotype  
    fontSize: 10  
    spacing: 1  
    smallCaps: false  
    allCaps: false  
  table:  
    headerShading: "#ffffff"  
    tableFontSize: 10  
    tableFont: Palatino Linotype  
    tableSpacing: 1  
    tableBorderColor: "#ffffff"  
  bullets:  
    fontName: Palatino Linotype  
    initialFontSize: 10  
    initialIndent: 0.25  
    indentIncrement: 0.25   
```
  
### To export to pdf

One goal of this plugin is to make it possible to export to pdf with pagination and formatting on both iPad and a computer. Because of limitations on the iPad, direct export to pdf is not possible. As a workaround, this plugin exports markdown files to html. This html file can then be exported from to pdf using native tools on each device. On a computer, a browser (e.g. Safari, chrome) can export to pdf. On the iPad, quick look or other tools (e.g. PDFExpert) can be used to export files to pdf.

#### Configuration for export

In settings, a global path to a css file can be provided. A css file with formatting should be added by the user to their obsidian vault.  A sample css is provided in the github repository with the name "sample_template.css", and this is used as the default if no file is set in settings.

Document specific css files can be specified using a **pdfcss** frontmatter item. For example:
   
```yml
pdfcss: CSSFiles/pdf_css_template.css
```

Then exported html will show a print ready, paginated, and formatted, document when viewed in a browser like safari or chrome.

#### How to export: generating the html file

To run the export, use the command palette to pick the command: _Convert the current document to a pdf ready html file_. A new html file will appear in the same directory as the file being edited. 

#### Creating a pdf on a computer
Within obsidian or from the file browser (e.g. windows explorer or mac finder), open the file, which should open the file in the default browser. The file should be viewable, with proper formatting and pagination (because of the paged.js addon: https://pagedjs.org) and the use of the @media tag in the css formatting.

From the browser the file can be exported to a pdf (e.g. on Mac, file > print > pdf> save as pdf).

#### Creating a pdf on an iPad

On an iPad, click the html file from within obsidian or from the files app. when the share sheet appears in the top left, select "Quick Look". A preview of the html file will appear. Click the "Share" symbol  in the top right of the preview. Then click the "Print" button on the share sheet that appears. Finally, on the print dialog box that appears, click the "Share" symbol again in the top right again, and click "Save to Files" on the share sheet that appears. This will then export a formatted, paginated, pdf file to the iPad file system. 


### To export to google doc
Another goal of this plugin is to enable exporting markdown files to google docs and preserve the formatting of text, headers, bullets, and tables. While docx files can be shared to google docs, table formatting can be lost on conversion. Html files preserve formatting much better on conversion. 

Therefore, this plugin will export a markdown file to html, which can be then converted to a google doc. A second advantage of this approach is that the user doesn't have to create a google api token. 

To run the export, use the command palette to pick the command: "Convert the current document to a gdoc ready html file". A new html file will appear in the same directory as the file being edited. This file should then be uploaded to google drive. From there, it can be opened in google docs, and it will be converted to a google doc file. Default formatting is made by the plugin. Formatting can be changed through settings, and also by using a css file imported in settings or in a markdown document. CSS used for formatting google docs should NOT use the @media tag.

Document specific css files can be specified using a **gdoccss** frontmatter item. For example:
   
```yml
gdoccss: CSSFiles/gdoc_css_template.css
```

### Creating a template 
Because frontmatter can added using templates in obsidian, it can be used for styling at the document level. One good approach is to set up a template file with configuration frontmatter keys. 

The following can be added to a template that can be imported to markdown files. Document settings can be set by changing the default values.  Either smallcaps or allcaps should be set, not both; ms word will only use one or the other when both are set.

```yml
docxstyling:  
  title:  
    font: Palatino Linotype  
    fontSize: 16  
    spacing: 1  
    smallCaps: false  
    allCaps: false  
  heading1:  
    font: Palatino Linotype  
    fontSize: 14  
    spacing: 1  
    smallCaps: true  
    allCaps: false  
  heading2:  
    font: Palatino Linotype  
    fontSize: 12  
    spacing: 1  
    smallCaps: true  
    allCaps: false  
  heading3:  
    font: Palatino Linotype  
    fontSize: 12  
    spacing: 1  
    smallCaps: true  
    allCaps: false  
  heading4:  
    font: Palatino Linotype  
    fontSize: 12  
    spacing: 1  
    smallCaps: false  
    allCaps: false  
  heading5:  
    font: Palatino Linotype  
    fontSize: 11  
    spacing: 1  
    smallCaps: false  
    allCaps: false  
  heading6:  
    font: Palatino Linotype  
    fontSize: 11  
    spacing: 1  
    smallCaps: false  
    allCaps: false  
  body:  
    font: Palatino Linotype  
    fontSize: 10  
    spacing: 1  
    smallCaps: false  
    allCaps: false  
  table:  
    headerShading: "#ffffff"  
    tableFontSize: 10  
    tableFont: Palatino Linotype  
    tableSpacing: 1  
    tableBorderColor: "#ffffff"  
  bullets:  
    fontName: Palatino Linotype  
    initialFontSize: 10  
    initialIndent: 0.25  
    indentIncrement: 0.25
pdfcss: enter path to file
gdoccss: enter path to file
docxfilename: enter path to file
```











