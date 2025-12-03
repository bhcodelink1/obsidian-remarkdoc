# Obsidian docx, pdf, and google docs exporter using Remark/unified

## Approach
This app enables exporting markdown to docx (ie MS Word), pdf, and google docs, without the use of pandoc. To achieve this goal, the app uses the unified and remark library with plugins.  
  
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
  
## How to use
### To export to docx

Use the command from the command palette: Convert the current document to a docx word file to export the file in the editor to docx.  
  
In plugin settings, global configuration of font and spacing for the document can be set.  
  
The output file name can be specified by adding a **docxfilename** frontmatter item to a document with the path and file included. For example:  
  
```yml  
docxfilename: Documents/word_document.docx  
```  

If a filename is not added, then a prompt will ask for the filename, and it will be added to the frontmatter.  
  
More granular document styling can be set by adding a **docxstyling** frontmatter item to a document as follows (defaults have been included):  
  
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

This plugin will export a markdown file to html, which can be then exported from the browser to pdf. This approach is taken so that both ipad and desktop users can export without pandoc. 

In settings, a global path to a css file can be provided. A css file with formatting should be added by the user to their obsidian vault.  A sample css is provided in the github repository with the name "sample_template.css", and this is used as the default if no file is set in settings.

Document specific css files can be specified using a **css** frontmatter item. For example:
   
```yml
css: CSSFiles/css_template.css
```
  
To run the export, use the command palette to pick the command: "Convert the current document to a pdf ready html file". A new html file will appear in the same directory as the file being edited. This file can be opened in the browser, and can be exported to a pdf using "print to pdf" or the share sheet on iPadOs.

### To export to google doc
This plugin will export a markdown file to html, which can be then converted to a google doc. This approach is taken so that both ipad and desktop users can export without pandoc, and the user doesn't have to create a google api token. 

To run the export, use the command palette to pick the command: "Convert the current document to a gdoc ready html file". A new html file will appear in the same directory as the file being edited. This file should then be loaded into google drive. From there, it can be opened in google docs, and it will be converted to a google doc file.

### Creating a template 
Because frontmatter can be used as a template for styling at the document level, a good approach is to set up a template file with configuration frontmatter keys. 

The following can be added to a template that can be imported to markdown files.


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
css: 
docxfilename: 
```




### TO DO:
x add default css to repo
x add code to load default css if not in settings
x show what a default template might look like in readme
double check google doc export
test image export for docx
test image export for pdf




