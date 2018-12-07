const hrstart = process.hrtime();
const fg = require('fast-glob');
const _=require ('lodash');
const sqlite = require('sqlite-sync');
const HummusRecipe = require('hummus-recipe');
console.log("Generation begin: \nRaw files " + fg.sync('raw/*.pdf').length );
_.forEach(fg.sync('raw/*.pdf'),function(value){
sqlite.connect('vto.db');
let rows = sqlite.run("select * from fine where field2 = ?", [value.slice(-10,-4)]);
sqlite.close();

const pdfDoc = new HummusRecipe(value, 'clean/'+ rows[0].field2 + ".pdf");
pdfDoc
        // edit 1st page
        .editPage(1)
        .text('Sõiduauto omanik: '+ rows[0].field6 + " " + rows[0].field5, 70, 160, {
            color: '000000',
            font: 'Arial',
            fontSize: 9
            })
            .text('Isikukood: '+ rows[0].field4, 70, 175, {
                color: '000000',
                font: 'Arial',
                fontSize: 9
                })
                .text('Elukoht: '+ rows[0].field7, 70, 190, {
                    color: '000000',
                    font: 'Arial',
                    fontSize: 9
                    })
                    .text('Maksja: '+ rows[0].field6 + " " + rows[0].field5, 70, 570, {
                        color: '000000',
                        font: 'Arial',
                        fontSize: 11
                        })
                        .text('Maksja isiku/registrikood: ' + rows[0].field4, 70, 590, {
                            color: '000000',
                            font: 'Arial',
                            fontSize: 11
                            })
                .endPage().endPDF();
        })

        const hrend = process.hrtime(hrstart);
        console.log('Parsed files: '+ fg.sync('clean/*.pdf').length)
        console.log("Execution time (hr): ", hrend[0], hrend[1]/1000000);

