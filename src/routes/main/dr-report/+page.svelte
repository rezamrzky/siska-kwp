<script lang="ts">
	import { goto } from '$app/navigation';
	import { currencyToString, formatDate, number3DigitFormat } from '$lib/Functions';
	import { userId } from '$lib/dPegawai';
	import type { PageData } from './$types';
	import exportReportExcel from '$lib/exportReportExcel';

	export let data: PageData;
	$: ({ report } = data);

	$: monthString = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember'
	];

	let filteredReport = data.report;
	let prevSaldo = 0;

	let datePointer = new Date(data.period.lastYear, data.period.lastMonth);
	const lastDate = new Date(data.period.lastYear, data.period.lastMonth);
	const firstDate = new Date(data.period.firstYear, data.period.firstMonth);

	dateFiltered();

	function dateFiltered() {
		let prevReport;
		// filteredBillsActive = billsActive;
		filteredReport = data.report.filter((report: any) => {
			const date = new Date(report.created_date);
			// console.log('bill month: '+date.getMonth())
			// console.log(date.getMonth() === datePointer.getMonth())

			return (
				date.getMonth() === datePointer.getMonth() &&
				date.getFullYear() === datePointer.getFullYear()
			);
		});

		if (datePointer.getTime() !== firstDate.getTime()) {
			let tempDate: Date;
			if (datePointer.getMonth() - 1 > 0) {
				tempDate = new Date(datePointer.getFullYear(), datePointer.getMonth() - 1);
			} else {
				tempDate = new Date(datePointer.getFullYear() - 1, 11);
			}
			prevReport = data.report.filter((report: any) => {
					const date = new Date(report.created_date);
					// console.log('bill month: '+date.getMonth())
					// console.log(date.getMonth() === datePointer.getMonth())

					return (
						date.getMonth() === tempDate.getMonth() &&
						date.getFullYear() === tempDate.getFullYear()
					);
				});

				prevSaldo = prevReport[prevReport.length - 1].saldo;
		} else {
			prevSaldo = 0;
		}

		// totalActiveBill = 0;
		// filteredReport.forEach((bill: { total_before_tax: number }) => {
		// 	totalActiveBill += +bill.total_before_tax;
		// });

		// sumPreTax = 0;
		// sumPPN = 0;
		// sumPPh = 0;
		// sumPraTax = 0;

		// filteredBillsPayment.forEach(
		// 	(payment: { ppn10: any; pph23: any; total_after_tax: any; total_before_tax: number }) => {
		// 		sumPreTax += +payment.total_before_tax;
		// 		sumPPN += +payment.ppn10;
		// 		sumPPh += +payment.pph23;
		// 		sumPraTax += +payment.total_after_tax;
		// 	}
		// );
	}

	function prevDatePointer() {
		let tempDate;
		if (datePointer.getMonth() - 1 > 0) {
			tempDate = new Date(datePointer.getFullYear(), datePointer.getMonth() - 1);
		} else {
			tempDate = new Date(datePointer.getFullYear() - 1, 11);
		}

		// console.log('tempDate: '+tempDate)

		// if(tempDate.getTime() < datePointer.getTime() && tempDate.getTime() >= lastDate.getTime()){
		datePointer = tempDate;
		dateFiltered();
		// }
	}

	function nextDatePointer() {
		let tempDate;
		if (datePointer.getMonth() + 1 < 12) {
			tempDate = new Date(datePointer.getFullYear(), datePointer.getMonth() + 1);
		} else {
			tempDate = new Date(datePointer.getFullYear() + 1, 0);
		}

		// console.log('tempDate: '+tempDate)

		// if(tempDate.getTime() < datePointer.getTime() && tempDate.getTime() >= lastDate.getTime()){
		datePointer = tempDate;
		dateFiltered();
		// }
	}

	function excelHandler() {
		const fileName =
			'laporan-dr-' + monthString[datePointer.getMonth()] + String(datePointer.getFullYear());
		exportReportExcel(fileName, filteredReport);
	}

	let userDepartment = data.user.staff.department;
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black ml-2">
		<h1 class="flex gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-8 h-8 rounded-full bg-primary text-slate-50"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
				/>
			</svg>LAPORAN BELANJA DINING ROOM</h1>
	</div>
	<div class="mt-2 flex w-full">
		<button
			class="btn btn-outline font-bold btn-sm btn-primary"
			disabled={datePointer.getTime() === firstDate.getTime()}
			on:click={prevDatePointer}
		>
			&#8249;</button
		>
		<button class="btn btn-outline font-bold btn-sm btn-primary ml-2"
			>{monthString[datePointer.getMonth()]} {datePointer.getFullYear()}</button
		>
		<button
			class="btn btn-outline font-bold btn-sm btn-primary ml-2"
			disabled={datePointer.getTime() === lastDate.getTime()}
			on:click={nextDatePointer}
		>
			&#8250;</button
		>
		<div class="grow" />
		{#if userDepartment === 'Ekonomi PWP'}
			<button
				class="btn font-bold btn-sm btn-primary ml-2"
				on:click={() => goto('./dr-report/add-fund')}>+ MODAL</button
			>
			<button class="btn font-bold btn-sm btn-success ml-2" on:click={excelHandler}>EXCEL</button>
		{/if}
	</div>
	<div class="overflow-x-auto w-full mt-2">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>Tanggal</th>
					<th>Deskripsi</th>
					<th>Jumlah Debit</th>
					<th>Jumlah Kredit</th>
					<th>Saldo</th>
					<th />
				</tr>
			</thead>
			<tbody class="text-slate-300">
				<!-- row -->
				<tr class="text-center">
					<th />
					<th />
					<th />
					<th />
					<th />
					<td>{currencyToString(prevSaldo)}</td>
					<th />
				</tr>
				{#each filteredReport as item}
					<tr class="text-center">
						<td> {number3DigitFormat(item.id)} </td>
						<td> {formatDate(item.created_date)} </td>
						<td> {item.note} </td>
						<td>{item.action !== 1 ? currencyToString(item.payment_total) : '-'}</td>
						<td>{item.action === 1 ? currencyToString(item.modal_total) : '-'}</td>
						<td>{currencyToString(item.saldo)}</td>
						<td>
							{#if item.actions === -1}
								<button
									class="flex-none btn btn-outline font-bold btn-xs btn-white"
									on:click={() =>
										goto('./restock/' + item.dr_restock_payment.dr_restock.id + '/detail')}
								>
									!</button
								>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot class="text-slate-100">
				<tr class="text-center">
					<th />
					<th />
					<th />
					<th />
					<th>SALDO</th>
					<th>{currencyToString(filteredReport[filteredReport.length - 1].saldo)}</th>
					<th />
				</tr>
			</tfoot>
		</table>
	</div>
</main>
