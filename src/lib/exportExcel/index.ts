import { Workbook } from "exceljs";
import {saveAs } from 'file-saver';

export default async function exportExcel(fileName: string, billsActive: any, billsPaid: any) {
    
    const wb = new Workbook();

    const ws1 = wb.addWorksheet('Piutang')

    ws1.columns = [
        {key: 'id', header: 'Nomor'},
        {key: 'date', header: 'Tanggal Tagihan', width: 20 },
        {key: 'note', header: 'Uraian', width: 20},
        {key: 'total_before_tax', header: 'Jumlah Sebelum Pajak', width: 20}
    ];

    billsActive.forEach((bill: any) => {
        ws1.addRow(bill)
    });

    ws1.getRow(1).eachCell((cell) => {
		cell.font = { bold: true };
	});

    const ws2 = wb.addWorksheet('Pembayaran')

    ws2.columns = [
        {key: 'id', header: 'No'},
        {key: 'date', header: 'Tanggal Pembayaran', width: 20},
        {key: 'note', header: 'Uraian', width: 20},
        {key: 'total_before_tax', header: 'Jumlah Sebelum Pajak', width: 20},
        {key: 'ppn10', header: 'PPN 11%', width: 20},
        {key: 'pph23', header: 'PPh 23 2%', width: 20},
        {key: 'total_after_tax', header: 'Jumlah Setelah Pajak', width: 20},
    ];

    billsPaid.forEach((bill: any) => {
        ws2.addRow(bill)
    });

    ws2.getRow(1).eachCell((cell) => {
		cell.font = { bold: true };
        // cell.alignment.wrapText = true;
	});

    // ws2.getColumn('G').eachCell((cell) => {
    //     cell.style.numFmt = '#,##0.00';
    // })

    const buf = await wb.xlsx.writeBuffer();
	saveAs(new Blob([buf]), `${fileName}.xlsx`);
}