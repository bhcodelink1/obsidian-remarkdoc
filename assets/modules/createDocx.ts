import {  Notice, TFile } from 'obsidian';
import {WritingPluginSettings} from './interfaces';

import {convertWikiToMarkdown} from './utilities'

import {unified} from 'unified'

import remarkParse from "remark-parse";


import remarkGfm from 'remark-gfm';
import supersub from 'remark-supersub';

import remarkBreaks from 'remark-breaks';
import remarkCallout from "@r4ai/remark-callout";


import { toDocx } from "@m2d/core";
import { imagePlugin } from "@m2d/image";
import { tablePlugin } from "@m2d/table";
import { listPlugin, createLevels } from "@m2d/list";
import { htmlPlugin } from "@m2d/html";
import { ShadingType,AlignmentType,BorderStyle,convertMillimetersToTwip, VerticalAlign, ILevelsOptions, LevelFormat, convertInchesToTwip, ISectionOptions, ISectionPropertiesOptions } from "docx"
import type { IDocxProps } from "@m2d/core"
import type { TableProps, RowProps, ICellProps, IFirstRowCellProps, ITableAlignments, CellProps } from "@m2d/table"
import type { IListPluginOptions } from "@m2d/list"




function defineTextStyle(currentSettings: WritingPluginSettings, docxstyling: object, formatType: string, defaultFontSize:number): [string, number, number, boolean, boolean]  {
        // handle missing value ie ''
      var documentfont = "Palatino Linotype"
        if (currentSettings.docxFont) {
            if (currentSettings.docxFont!=''){
              documentfont=currentSettings.docxFont
            }
          }

        var lineSpacing = 240
        if (currentSettings.docxSpacing) {
          if (currentSettings.docxSpacing!=''){
            let spacingnum = Number(currentSettings.docxSpacing);
            lineSpacing = spacingnum*240

          }
        }

        var smallCaps = false
        var allCaps = false

        var fontSize = defaultFontSize*2
        if (formatType in docxstyling){
          const formatStyle = docxstyling[formatType]
          if ('font' in formatStyle){
            documentfont = formatStyle['font']
          }
          if ('fontSize' in formatStyle){
            let fontSizeStyle = Number(formatStyle['fontSize'])
            fontSize = 2 * fontSizeStyle
          }
          if ('spacing' in formatStyle){
            let spacingnumstyle = Number(formatStyle['spacing'])
            lineSpacing = spacingnumstyle*240
          }
          if ('smallCaps' in formatStyle){
              smallCaps = formatStyle['smallCaps']
          }
          if ('allCaps' in formatStyle){
              allCaps = formatStyle['allCaps']
          }
          
        }

    return [documentfont, fontSize, lineSpacing, smallCaps, allCaps]
}


// function setDocumentConfig (documentfont : string, lineSpacing : number) {
function setDocumentConfig (currentSettings: WritingPluginSettings, docxstyling: object) {


    const [titlefont, titlefontsize, titlespacing, titleSmallCaps, titleallCaps] = defineTextStyle(currentSettings, docxstyling, 'title', 16)
    const [heading1font, heading1fontsize, heading1spacing, heading1SmallCaps, heading1allCaps] = defineTextStyle(currentSettings, docxstyling, 'heading1', 16)
    const [heading2font, heading2fontsize, heading2spacing, heading2SmallCaps, heading2allCaps] = defineTextStyle(currentSettings, docxstyling, 'heading2', 14)
    const [heading3font, heading3fontsize, heading3spacing, heading3SmallCaps, heading3allCaps] = defineTextStyle(currentSettings, docxstyling, 'heading3', 14)
    const [heading4font, heading4fontsize, heading4spacing, heading4SmallCaps, heading4allCaps] = defineTextStyle(currentSettings, docxstyling, 'heading4', 13)
    const [heading5font, heading5fontsize, heading5spacing, heading5SmallCaps, heading5allCaps] = defineTextStyle(currentSettings, docxstyling, 'heading5', 13)
    const [heading6font, heading6fontsize, heading6spacing, heading6SmallCaps, heading6allCaps] = defineTextStyle(currentSettings, docxstyling, 'heading6', 12)
    const [bodyfont, bodyfontsize, bodyspacing, bodySmallCaps, bodyallCaps] = defineTextStyle(currentSettings, docxstyling, 'body', 12)

    const docxprops : IDocxProps = {
            styles: {
              default: {
                document: {
                  paragraph: {
                    spacing: { 
                      line: bodyspacing
                    },
                    indent: {
                        firstLine: 0
                    }
                  },
                  run: {
                    font: bodyfont,
                    size: bodyfontsize,
                    color: "000000",
                    // smallCaps: bodySmallCaps,
                    allCaps: bodyallCaps
                  },
                },
              },
              paragraphStyles : [

                {
                  id: "Normalnew",
                  name: "Normal",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                    font: bodyfont,
                    size: bodyfontsize,
                    color: "000000",
                    // smallCaps: bodySmallCaps,
                    allCaps: bodyallCaps
                    },
                  paragraph: {
                    spacing: {
                      line: bodyspacing
                      },
                    indent: {
                        firstLine: 0
                    }
                    }
                },
                
                {
                  id: "Title",
                  name: "Title",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                    font: titlefont,
                    size: titlefontsize,
                    color: "000000",
                    // smallCaps: titleSmallCaps,
                    allCaps: titleallCaps
                  },
                  paragraph: {
                    spacing: {
                      line: titlespacing
                    },
                  alignment: "center",
                  indent: {
                      firstLine: 0
                  }
                  }
                },
                
                
                {
                  id: "Heading1",
                  name: "Heading 1",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                    font: heading1font,
                    size: heading1fontsize,
                    color: "000000",
                    // smallCaps: heading1SmallCaps,
                    allCaps: heading1allCaps
                  },
                  paragraph: {
                    spacing: {
                      line: heading1spacing
                    },
                  indent: {
                      firstLine: 0
                  }
                  }
                },
                
                
                {
                  id: "Heading2",
                  name: "Heading 2",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                    font: heading2font,
                    size: heading2fontsize,
                    bold: true,
                    color: "000000",
                    // smallCaps: heading2SmallCaps,
                    allCaps: heading2allCaps
                  },
                  paragraph: {
                    spacing: {
                      line: heading2spacing
                    },
                  indent: {
                      firstLine: 0
                  }
                  }
                },
                
                
                {
                  id: "Heading3",
                  name: "Heading 3",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                    font: heading3font,
                    size: heading3fontsize,
                    color: "000000",
                    // smallCaps: heading3SmallCaps,
                    allCaps: heading3allCaps
                  },
                  paragraph: {
                    spacing: {
                      line: heading3spacing
                    },
                  indent: {
                      firstLine: 0
                  }
                  }
                },
                
                {
                  id: "Heading4",
                  name: "Heading 4",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                    font: heading4font,
                    size: heading4fontsize,
                    italics : true,
                    color: "000000",
                    // smallCaps: heading4SmallCaps,
                    allCaps: heading4allCaps
                  },
                  paragraph: {
                    spacing: {
                      line: heading4spacing
                    },
                  indent: {
                      firstLine: 0
                  }
                  }
                },
                
                {
                  id: "Heading5",
                  name: "Heading 5",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                    font: heading5font,
                    size: heading5fontsize,
                    bold : true,
                    color: "000000",
                    // smallCaps: heading5SmallCaps,
                    allCaps: heading5allCaps
                  },
                  paragraph: {
                    spacing: {
                      line: heading5spacing
                    },
                  indent: {
                      firstLine: 0
                  }
                  }
                },
                
                {
                  id: "Heading6",
                  name: "Heading 6",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                    font: heading6font,
                    size: heading6fontsize,
                    italics: true,
                    color: "000000",
                    // smallCaps: heading6SmallCaps,
                    allCaps: heading6allCaps
                  },
                  paragraph: {
                    spacing: {
                      line: heading6spacing
                    },
                  indent: {
                      firstLine: 0
                  }
                  }
                },
                
                {
                  id: "ListParagraph",
                  name: "List Paragraph",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                    font: bodyfont,
                    size: bodyfontsize,
                    color: "000000",
                    // smallCaps: bodySmallCaps,
                    allCaps: bodyallCaps
                  },
                  paragraph: {
                    spacing: {
                      line: bodyspacing,
                      before: 0,
                      after: 0
                    },
                  indent: {
                      firstLine: 0
                  }
                  }
                },
                
                {
                  id: "BlockText",
                  name: "Block Text",
                  basedOn: "Normal",
                  next: "Normal",
                  quickFormat: true,
                  run: {
                    font: bodyfont,
                    size: bodyfontsize,
                    color: "000000",
                    // smallCaps: bodySmallCaps,
                    allCaps: bodyallCaps
                  },
                  paragraph: {
                    spacing: {
                      line: bodyspacing
                    },
                  indent: {
                      firstLine: 0
                  }
                  }
                }

              ]
                
          }
        
          };

  return docxprops
}

// function setTableConfig (tableFont : string, tableFontSize: number,  tableHeaderColor: string, lineSpacing : number, borderColor: string) {

function setTableConfig (currentSettings: WritingPluginSettings, docxstyling : object) {
  //get settings defaults
  // get body settings as secondary defaults
    // handle missing value ie ''

  var tableHeaderColor = "#ffffff";
  var tableFontSize = 18; 
  var tableFont = "Gill Sans MT";
  var borderColor =  "#000000"; 
  var lineSpacing = 240


        if (currentSettings.docxFont) {
            if (currentSettings.docxFont!=''){
              tableFont=currentSettings.docxFont
            }
          }

        if (currentSettings.docxSpacing) {
          if (currentSettings.docxSpacing!=''){
            let spacingnum = Number(currentSettings.docxSpacing);
            lineSpacing = spacingnum*240

          }
        }

        if (currentSettings.docxTableBorder) {
          if (currentSettings.docxTableBorder!=''){
            borderColor = currentSettings.docxTableBorder

          }
        }


  if ('table' in docxstyling){
          const tableStyle = docxstyling['table']
          if ('headerShading' in tableStyle) {
            tableHeaderColor = tableStyle['headerShading']
          }
          if ('tableFontSize' in tableStyle) {
            let tableFontSizestyle = Number(tableStyle['tableFontSize'])
            tableFontSize = 2*tableFontSizestyle
          }
          if ('tableFont' in tableStyle) {
            tableFont = tableStyle['tableFont']
          }
          if ('tableBorderColor' in tableStyle) {
            borderColor = tableStyle['tableBorderColor']
          }

          if ('tableSpacing' in tableStyle) {
            let spacingnum = tableStyle['tableSpacing']
            lineSpacing = spacingnum*240
          }

        }
  const border = {  style: BorderStyle.SINGLE, color: borderColor, size: 1 };
  const tableProperties : TableProps =   {margins: {
                top: convertMillimetersToTwip(0),
                right: convertMillimetersToTwip(0),
                bottom: convertMillimetersToTwip(0),
                left: convertMillimetersToTwip(0),
              },
              borders: {
                  top: border,
                  right: border,
                  bottom: border,
                  left: border,
                  insideHorizontal: border,
                  insideVertical: border,
                }
              };

  const cellProperties : ICellProps = { 
              data: {
                    size: tableFontSize, 
                    font: tableFont,
                    spacing: { before: lineSpacing, after: lineSpacing },
                    indent: 0
                  }

            };
  
  const firstRowCellProperties : IFirstRowCellProps = {
              shading: { type: ShadingType.SOLID,fill:tableHeaderColor },
              data: {
                    // alignment: "center",
                    bold: true,
              //       color: "#000000",
                    size: tableFontSize, 
                    font: tableFont,
                  }
              };

  const tableAlignments: ITableAlignments =  {
                defaultHorizontalAlign: AlignmentType.CENTER,
                defaultVerticalAlign: VerticalAlign.CENTER,
                preferMdData: true,
              };
// can header be set to false?
  // const tableRowProperties : RowProps = {}
  // const firstRowProperties : RowProps = {}

    
  const tableConfig  = {
          tableProps: tableProperties,
          // rowProps : tableRowProperties,
          cellProps : cellProperties, 
          firstRowCellProps: firstRowCellProperties,
          alignments: tableAlignments
            };

  return tableConfig
}


// set in the config functions
// font, size, and spacing vars - eventually indent
// in table config also shading
// another function to check settings, then frontmatter, and if neither, default
function setBulletsConfig(currentSettings: WritingPluginSettings, docxstyling:object) {
  //get settings defaults
  // get body settings as secondary defaults
  // handle missing value ie ''
  // fontName: string, initialFontSize: number, indentIncrement: number
  var fontName = 'Palatino Linotype';
  var initialFontSize = 12;
  var initialIndent = 0;
  var indentIncrement = 0.25


  if (currentSettings.docxFont) {
            if (currentSettings.docxFont!=''){
              fontName=currentSettings.docxFont
            }
          }

  if ('bullets' in docxstyling){
          const bulletsStyle = docxstyling['bullets']
          if ('fontName' in bulletsStyle) {
            fontName = bulletsStyle['fontName']
          }
          if ('initialFontSize' in bulletsStyle) {
            initialFontSize = bulletsStyle['initialFontSize']
          }
          if ('initialIndent' in bulletsStyle) {
            initialIndent = bulletsStyle['initialIndent']
          }
          if ('indentIncrement' in bulletsStyle) {
            indentIncrement = bulletsStyle['indentIncrement']
          }
        }

  const bulletsLevelsConfig = [
      {level:0 , 
      format: LevelFormat.BULLET, 
      text: "●",
      alignment: AlignmentType.START,
      style: { 
          run: {
                  font: fontName,
                  size: initialFontSize*2
                },
          paragraph: {
            indent: {left: convertInchesToTwip( initialIndent)}
            // spacing: {
            //   line: 240
            // }
          }
          }
        },
      {level:1 , 
      format: LevelFormat.BULLET, 
      text: "●",
      alignment: AlignmentType.START,
      style: { 
          run: {
                  font: fontName,
                  size: (initialFontSize-1)*2
                },
          paragraph: {
            indent: {left: convertInchesToTwip( initialIndent+ (1 * indentIncrement))}
            // spacing: {
            //   line: 240
            // }
          }
          }
        },
      {level:2 , 
        format: LevelFormat.BULLET, 
      text: "●",
      alignment: AlignmentType.START,
      style: { 
          run: {
                  font: fontName,
                  size: (initialFontSize-2)*2
                },
          paragraph: {
            indent: {left: convertInchesToTwip( initialIndent+ (2 * indentIncrement))}
            // spacing: {
            //   line: 240
            // }
          }
          }
        },
      {level:3 , 
        format: LevelFormat.BULLET, 
        text: "●",
        alignment: AlignmentType.START,
        style: { 
            run: {
                  font: fontName,
                  size: (initialFontSize-2)*2
                  },
            paragraph: {
              indent: {left: convertInchesToTwip( initialIndent+ (3 * indentIncrement))}
              // spacing: {
              //   line: 240
              // }
            }
          }
      },
      {level:4 , 
      format: LevelFormat.BULLET,  
      text: "●",
      alignment: AlignmentType.START,
      style: { 
          run: {
                  font: fontName,
                  size: (initialFontSize-2)*2
                },
          paragraph: {
            indent: {left: convertInchesToTwip( initialIndent+ (4 * indentIncrement))}
            // spacing: {
            //   line: 240
            // }
          }
          }
      }]

return bulletsLevelsConfig
  
}

function getPageProperties(docxstyling: object): [number, number, number, number] {
    var topMargin = 1;
    var bottomMargin = 1;
    var leftMargin = 1;
    var rightMargin = 1;

    if ('margin' in docxstyling){
            const margins = docxstyling['margin']
            if ('top' in margins) {
              topMargin = Number(margins['top'])
            }
            if ('bottom' in margins) {
              bottomMargin = Number(margins['bottom'])
            }
            if ('left' in margins) {
              leftMargin = Number(margins['left'])
            }
            if ('right' in margins) {
              rightMargin = Number(margins['right'])
            }
          }


          return [topMargin, bottomMargin, leftMargin, rightMargin]

  }

export async function createDocxFile(currentSettings : WritingPluginSettings, docxstyling: object,  body : string, destfilename : string, currentFile: TFile) {
    // get font and spacing from settings, set defaults if not entered
    
    

    // const docxprops = setDocumentConfig(documentfont, lineSpacing)
    const docxprops = setDocumentConfig(currentSettings, docxstyling)
    
    

    const processor = unified()
      .use(remarkParse)
      .use(remarkBreaks)
      .use(remarkCallout)
      .use(remarkGfm)
      .use(supersub)




    const bodyclean = convertWikiToMarkdown(body, currentFile)
		const doc = await processor.parse(bodyclean);

    // const doc = await processor.parse(body);



    // const tableConfig = setTableConfig (tableFont, tableFontSize, tableHeaderColor , lineSpacing, borderColor);
    const tableConfig = setTableConfig(currentSettings, docxstyling);

    const bulletlevelconfig = setBulletsConfig(currentSettings, docxstyling);

    const listDefaults : IListPluginOptions = {
          // levels:levelconfig,
          bulletLevels:bulletlevelconfig
        };
    
    // const sectionProperties : ISectionPropertiesOptions = {page: {margin: {left: 0}}};
    // const sectionDefaults : ISectionOptions = {properties: sectionProperties};
    // const sectionDefaults : ISectionOptions = {properties: {page: {margin: {left: convertInchesToTwip(-1)}}}};
    const [topMargin, bottomMargin, leftMargin, rightMargin] = getPageProperties(docxstyling);
    (async () => {
      const docxBlob = await toDocx(
        doc,
        docxprops, // docxProps
        {
          // Pass plugins in sectionProps
          properties: {page: {margin: {top: convertInchesToTwip(topMargin), left: convertInchesToTwip(leftMargin), right: convertInchesToTwip(rightMargin), bottom: convertInchesToTwip(bottomMargin)}}},
          plugins: [imagePlugin(), tablePlugin(
            tableConfig
          ), listPlugin(listDefaults), htmlPlugin()],
        }
      );
      
        if (await this.app.vault.exists(destfilename) ){
                  new Notice("ERROR: there is already a file with the specified filename.")
                } else {

                  const buffer = await docxBlob.arrayBuffer()
                  
                  .then((bufftext)=>{

                      this.app.vault.createBinary(destfilename ,  bufftext);
                      let noticestring = 'File ' + destfilename + ' was created as a word file and added to vault'
                      new Notice(noticestring);
                  

                  });
                }




    })();



    


}