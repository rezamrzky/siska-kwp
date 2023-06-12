<script lang="ts">
	import { goto } from '$app/navigation';
	import { currencyToString, formatDate, number3DigitFormat } from '$lib/Functions';
	import { userId } from '$lib/dPegawai';
	import exportExcel from '$lib/exportExcel';
	import type { PageData } from './$types';

	export let data: PageData;

	let filteredBillsActive = data.billsActive;
	// console.log(filteredBillsActive);
	let filteredBillsPayment = data.billsPayment;

	let totalActiveBill = 0;

	const period = data.period;

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
	let datePointer = new Date(data.period.lastYear, data.period.lastMonth);
	const lastDate = new Date(data.period.lastYear, data.period.lastMonth);
	const firstDate = new Date(data.period.firstYear, data.period.firstMonth);

	// console.log('dPointer: ' + datePointer);

	let sumPreTax = 0;
	let sumPPN = 0;
	let sumPPh = 0;
	let sumPraTax = 0;

	dateFiltered();

	let userDepartment = data.user.staff.department;

	function detaillHandler(id: number) {
		goto('./' + id + '/detail');
	}

	function dateFiltered() {
		// filteredBillsActive = billsActive;
		filteredBillsActive = data.billsActive.filter((bill: any) => {
			const date = new Date(bill.date);
			// console.log('bill month: '+date.getMonth())
			// console.log(date.getMonth() === datePointer.getMonth())

			return date.getMonth() === datePointer.getMonth() && date.getFullYear() === datePointer.getFullYear();
		});

		filteredBillsPayment = data.billsPayment.filter((bill: any) => {
			const date = new Date(bill.date);
			// console.log('bill month: '+date.getMonth())
			// console.log(date.getMonth() === datePointer.getMonth())

			return date.getMonth() === datePointer.getMonth() && date.getFullYear() === datePointer.getFullYear();
		});

		totalActiveBill = 0;
		filteredBillsActive.forEach((bill: { total_before_tax: number }) => {
			totalActiveBill += +bill.total_before_tax;
		});

		sumPreTax = 0;
		sumPPN = 0;
		sumPPh = 0;
		sumPraTax = 0;

		filteredBillsPayment.forEach(
			(payment: { ppn10: any; pph23: any; total_after_tax: any; total_before_tax: number }) => {
				sumPreTax += +payment.total_before_tax;
				sumPPN += +payment.ppn10;
				sumPPh += +payment.pph23;
				sumPraTax += +payment.total_after_tax;
			}
		);
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
		const fileName = 'tagihan-fd-'+monthString[datePointer.getMonth()]+String(datePointer.getFullYear())
		exportExcel(fileName, filteredBillsActive, filteredBillsPayment)
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black ml-2">
		<h1>REKAP TAGIHAN</h1>
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
			<button class="btn btn-wide font-bold btn-sm btn-success ml-2" on:click={excelHandler}> EXCEL</button>
		{/if}
	</div>
	<div class="font-['Helvetica Neue] w-full text-xl text-primary font-black ml-2">
		<h1>TAGIHAN AKTIF</h1>
	</div>
	<div class="overflow-x-auto w-full mt-2">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>Tanggal Tagihan</th>
					<th>Uraian</th>
					<th>Jumlah Sebelum Pajak</th>
					<th />
				</tr>
			</thead>
			<tbody class="text-slate-300">
				<!-- row -->
				{#each filteredBillsActive as bill}
				{#each Array(10) as _}
					<tr class="text-center" on:click={() => fetch('main/events/detail')}>
						<td> {number3DigitFormat(bill.id)} </td>
						<td> {formatDate(bill.date)} </td>
						<td> {bill.note} </td>
						<td>{currencyToString(bill.total_before_tax)}</td>
						<td>
							<button
								class="flex-none btn btn-outline font-bold btn-xs btn-white"
								on:click={() => detaillHandler(bill.id)}
							>
								!</button
							>
						</td>
					</tr>
					{/each}
				{/each}
			</tbody>
			<tfoot class="sticky bottom-0 text-slate-100">
				<tr class="text-center">
					<th />
					<th />
					<th>Total</th>
					<th>{currencyToString(totalActiveBill)}</th>
					<th />
				</tr>
			</tfoot>
		</table>
	</div>
	<div class="font-['Helvetica Neue] w-full text-xl text-primary font-black ml-2">
		<h1>PEMBAYARAN TAGIHAN</h1>
	</div>
	<div class="overflow-x-auto w-full mt-2">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>Tanggal Bayar</th>
					<th>Uraian</th>
					<th>Jumlah Sebelum Pajak</th>
					<th>PPN 10%</th>
					<th>PAJAK 23</th>
					<th>Jumlah Setelah Pajak</th>
					<th />
				</tr>
			</thead>
			<tbody class="text-slate-300">
				<!-- row -->
				{#each filteredBillsPayment as payment}
				{#each Array(20) as _}
					<tr class="text-center" on:click={() => fetch('main/events/detail')}>
						<td> {number3DigitFormat(payment.id)} </td>
						<td> {formatDate(payment.fd_bill_payment[0].date)} </td>
						<td> {payment.note} </td>
						<td>{currencyToString(payment.total_before_tax)}</td>
						<td>{currencyToString(payment.ppn10)}</td>
						<td>{currencyToString(payment.pph23)}</td>
						<td>{currencyToString(payment.total_after_tax)}</td>
						<td>
							<button
								class="flex-none btn btn-outline font-bold btn-xs btn-white"
								on:click={() => detaillHandler(payment.id)}
							>
								!</button
							>
						</td>
					</tr>
					{/each}
				{/each}
			</tbody>
			<tfoot class="sticky bottom-0 text-slate-100">
				<tr class="text-center">
					<th />
					<th />
					<th>Total</th>
					<th>{currencyToString(sumPreTax)}</th>
					<th>{currencyToString(sumPPN)}</th>
					<th>{currencyToString(sumPPh)}</th>
					<th>{currencyToString(sumPraTax)}</th>
					<th />
				</tr>
			</tfoot>
		</table>
	</div>
</main>
