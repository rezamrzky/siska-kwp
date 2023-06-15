import { Workbook } from "exceljs";
import {saveAs } from 'file-saver';

export default async function exportReportExcel(fileName: string, report: any) {
    
    const wb = new Workbook();

    const ws = wb.addWorksheet('Sheet 1')

    ws.columns = [
        {key: 'id', header: 'No'},
        {key: 'created_date', header: 'Tanggal', width: 20},
        {key: 'note', header: 'Uraian', width: 20},
        {key: 'payment_total', header: 'DEBIT', width: 20},
        {key: 'modal_total', header: 'KREDIT', width: 20},
        {key: 'saldo', header: 'SALDO', width: 20},
    ];

    report.forEach((rpt: any) => {
        ws.addRow(rpt)
    });

    ws.getRow(1).eachCell((cell) => {
		cell.font = { bold: true };
        // cell.alignment.wrapText = true;
	});

    // ws2.getColumn('G').eachCell((cell) => {
    //     cell.style.numFmt = '#,##0.00';
    // })

    const buf = await wb.xlsx.writeBuffer();
	saveAs(new Blob([buf]), `${fileName}.xlsx`);
}