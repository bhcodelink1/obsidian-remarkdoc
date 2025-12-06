import { TFile} from 'obsidian';



export function convertWikiToMarkdown(text : string, currentFile: TFile) {
  // Use a regular expression to find all wiki-style links
  return text.replace(/\[\[(.*?)\]\]/g, function(match, p1) {
	  // Replace with Markdown-style links
	  const embeddedFile = this.app.metadataCache.getFirstLinkpathDest(p1, currentFile)
	  console.log('file path is ' + embeddedFile.path)
	  let imagefilepath: string | undefined
	  var plencode = ""
	  if(embeddedFile) {
		  imagefilepath = this.app.vault.getResourcePath(embeddedFile)
		  
		  // const absolutePath = this.app.vault.adapter.getFullPath(embeddedFile)
		  console.log("resource path to file is " + imagefilepath)
		  // console.log("absolute path to file is " + absolutePath)
		  // plencode = encodeURIComponent(absolutePath)
		  plencode = imagefilepath ?? ""
	  };
	  console.log("image path obtained")
	  // console.log("image path is " + imagefilepath)
	  
	  
	  // console.log("path to file is " + p1)

	  const outputtext = ['[](', plencode, ')'].join("")
	  return outputtext;
  });
}



// Note: `this` here is your plugin instance (or something that has `app`)

async function shrinkPng(arrayBuffer: ArrayBuffer, maxWidth = 800) {
    const blob = new Blob([arrayBuffer], { type: "image/png" });
    const img = await createImageBitmap(blob);

    const scale = maxWidth / img.width;
    const canvas = document.createElement("canvas");
    canvas.width = maxWidth;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert to JPEG or a compressed PNG
    const newBlob: Blob = await new Promise(res =>
        canvas.toBlob(res, "image/jpeg", 0.85)  // JPEG = MUCH smaller
    );

    return newBlob.arrayBuffer();
}


export async function convertWikiToMarkdownPdf(
	this: any,
  text: string,
  currentFile: TFile
): Promise<string> {
  const wikiRegex = /\[\[(.*?)\]\]/g;

  let result = "";
  let lastIndex = 0;

  for (const match of text.matchAll(wikiRegex)) {
    const fullMatch = match[0];  // e.g. "[[My Image.png]]"
    const linkText = match[1];   // e.g. "My Image.png"
    const index = match.index ?? 0;

    // Add text before this match
    result += text.slice(lastIndex, index);

    const embeddedFile = this.app.metadataCache.getFirstLinkpathDest(linkText, currentFile);

    let plencode = "";

    if (embeddedFile) {
      console.log("file path is " + embeddedFile.path);
      console.log("file extension is " + embeddedFile.extension);

      if (embeddedFile.extension === "png") {
        console.log("png extension found");

        // Async call — we can await it now
        const arrayBuffer = await this.app.vault.readBinary(embeddedFile);
		let sizeInBytes: number = arrayBuffer.byteLength;
	
		console.log(`The size of the ArrayBuffer is: ${sizeInBytes} bytes`);

		const compressedpng = await shrinkPng(arrayBuffer,400)
        const base64 = btoa(
          String.fromCharCode(...new Uint8Array(compressedpng))
        );

		console.log('The size of the base64 data in characters is:' + base64.length);

        const mimeType = "image/png";
        const base64Data = `data:${mimeType};base64,${base64}`;
        plencode = base64Data;

      } else {
        const imagefilepath: string = this.app.vault.getResourcePath(embeddedFile);
        console.log("resource path to file is " + imagefilepath);
        plencode = imagefilepath ?? "";
      }

      console.log("image path obtained");
    }

    const outputtext = ["[](", plencode, ")"].join("");
    result += outputtext;

    // Move past this match
    lastIndex = index + fullMatch.length;
  }

  // Add any remaining text after the last match
  result += text.slice(lastIndex);

  return result;
}





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
		}
		
				
		[data-callout] {
		border-left: 4px solid #4a90e2;       /* accent bar */
		background-color: #f5f8ff;            /* light blue background */
		padding: 0.75rem 1rem;
		margin: 1rem 0;
		border-radius: 4px;
		font-size: 0.95rem;
		page-break-inside: avoid; 
		text-indent: 0em;    
		line-height:1;        /* better for PDF / printing */
		}

		/* The callout title: <div data-callout-title>Note</div> */
		[data-callout] > [data-callout-title] {
		font-weight: 600;
		margin-bottom: 0.25rem;
		display: flex;
		align-items: center;
		text-indent: 0em; 
		line-height:1;
		}

		/* Optional: style the title text a bit differently */
		[data-callout] > [data-callout-title]::before {
		content: "ⓘ ";
		margin-right: 0.25rem;
		font-size: 1rem;
		line-height:1;
		}

		/* The body: <div data-callout-body> ... </div> */
		[data-callout] > [data-callout-body] {
		margin: 0;
		text-indent: 0em; 
		line-height:1;
		}

		/* Remove extra margin on first/last elements inside the body */
		[data-callout-body] > :first-child {
		margin-top: 0;
		text-indent: 0em; 
		line-height:1;
		}
		[data-callout-body] > :last-child {
		margin-bottom: 0;
		text-indent: 0em; 
		line-height:1;
		}

		/* Example: tweak styling based on data-callout-type */
		[data-callout][data-callout-type="note"] {
		border-left-color: #4a90e2;
		background-color: #f5f8ff;
		text-indent: 0em; 
		line-height:1;
		}

		[data-callout][data-callout-type="warning"] {
		border-left-color: #f5a623;
		background-color: #fff8e6;
		text-indent: 0em; 
		line-height:1;
		}

		[data-callout][data-callout-type="tip"] {
		border-left-color: #2ecc71;
		background-color: #f2fff8;
		text-indent: 0em; 
		line-height:1;
		}
		}
		
		`
		return defaultCSS
		}


	
export function getDefaultGdocCss() : string {

	let defaultCSS = `
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
		}
		
				
		[data-callout] {
		border-left: 4px solid #4a90e2;       /* accent bar */
		background-color: #f5f8ff;            /* light blue background */
		padding: 0.75rem 1rem;
		margin: 1rem 0;
		border-radius: 4px;
		font-size: 0.95rem;
		page-break-inside: avoid; 
		text-indent: 0em;    
		line-height:1;        /* better for PDF / printing */
		}

		/* The callout title: <div data-callout-title>Note</div> */
		[data-callout] > [data-callout-title] {
		font-weight: 600;
		margin-bottom: 0.25rem;
		display: flex;
		align-items: center;
		text-indent: 0em; 
		line-height:1;
		}

		/* Optional: style the title text a bit differently */
		[data-callout] > [data-callout-title]::before {
		content: "ⓘ ";
		margin-right: 0.25rem;
		font-size: 1rem;
		line-height:1;
		}

		/* The body: <div data-callout-body> ... </div> */
		[data-callout] > [data-callout-body] {
		margin: 0;
		text-indent: 0em; 
		line-height:1;
		}

		/* Remove extra margin on first/last elements inside the body */
		[data-callout-body] > :first-child {
		margin-top: 0;
		text-indent: 0em; 
		line-height:1;
		}
		[data-callout-body] > :last-child {
		margin-bottom: 0;
		text-indent: 0em; 
		line-height:1;
		}

		/* Example: tweak styling based on data-callout-type */
		[data-callout][data-callout-type="note"] {
		border-left-color: #4a90e2;
		background-color: #f5f8ff;
		text-indent: 0em; 
		line-height:1;
		}

		[data-callout][data-callout-type="warning"] {
		border-left-color: #f5a623;
		background-color: #fff8e6;
		text-indent: 0em; 
		line-height:1;
		}

		[data-callout][data-callout-type="tip"] {
		border-left-color: #2ecc71;
		background-color: #f2fff8;
		text-indent: 0em; 
		line-height:1;
		}
		
		
		`
		return defaultCSS
		}
