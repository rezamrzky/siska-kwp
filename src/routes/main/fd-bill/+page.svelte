<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDate, number3DigitFormat } from '$lib/Functions';
	import { userId } from '$lib/dPegawai';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ user } = data);
	$: ({ bills } = data);
	$: filteredBills = bills;

	let tabsStatus = ['tab-active', '', '', ''];
	let activeId = 0;

	const userDepartment = data.user.staff.department;
	console.log('userDepartment: ' + userDepartment);
	console.log('staff name: ' + data.user.staff.name);

	function tabsStatusHandle(index: number) {
		if (index !== activeId) {
			tabsStatus[index] = 'tab-active';
			tabsStatus[activeId] = '';
			activeId = index;
		}

		switch (index) {
			case 1: {
				filteredBills = bills.filter((akun: { status: string }) => akun.status === 'Aktif');
				break;
			}
			case 2: {
				filteredBills = bills.filter((akun: { status: string }) => akun.status === 'Lunas');
				break;
			}
			case 3: {
				filteredBills = bills.filter((akun: { status: string }) => akun.status === 'Selesai');
				break;
			}
			default: {
				filteredBills = bills;
				break;
			}
		}
	}

	const sortSymbol = ['\u{2193}', '\u{2191}', '\u{2195}'];

	let headSymbol = {'id': sortSymbol[1], 'date':sortSymbol[2]}
	let sortBy = { col: 'id', ascending: false };

	$: sort = (column: string) => {
		if (sortBy.col == column) {
			sortBy.ascending = !sortBy.ascending;
			if(sortBy.ascending){
				headSymbol[column as keyof typeof headSymbol] = sortSymbol[0];
			} else {
				headSymbol[column as keyof typeof headSymbol] = sortSymbol[1];
			}
		} else {
			const prevCol = sortBy.col;
			sortBy.col = column;
			sortBy.ascending = true;
			headSymbol[column as keyof typeof headSymbol] = sortSymbol[0];
			headSymbol[prevCol as keyof typeof headSymbol] = sortSymbol[2]
		}

		// Modifier to sorting function for ascending or descending
		let sortModifier = sortBy.ascending ? 1 : -1;

		let sort = (a: any, b: any) =>
			a[column] < b[column] ? -1 * sortModifier : a[column] > b[column] ? 1 * sortModifier : 0;

		bills = bills.sort(sort);
	};

	function detailHandler(id: number) {
		goto('./fd-bill/'+id+'/detail');
	}

	function tambahHandler() {
		goto('./fd-bill/add');
	}

	function rekapHandler() {
		goto('./fd-bill/summary');
	}

	function statusColor(status: string): string {
			switch (status) {
				case 'Aktif': {
					return 'text-warning';
				}
				case 'Lunas': {
					return 'text-success';
				}
				default: {
					return 'text-primary';
				}
			}
		}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black pt-5 flex">
		<h1 class="grow flex gap-2">
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
					d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
				/>
			</svg>TAGIHAN FOOD & DRINK
		</h1>
		<button class="btn font-bold btn-sm btn-primary w-1/4" on:click={rekapHandler}>
			Rekap Tagihan</button
		>
	</div>
	{#if userDepartment === 'Ekonomi PWP'}
		<button
			class="btn btn-outline font-bold btn-sm btn-primary w-1/4 my-2"
			on:click={tambahHandler}
		>
			+ Tambah</button
		>
	{/if}
	<div class="tabs tabs-boxed mb-2 bg-slate-200 justify-center">
		<a class="tab {tabsStatus[0]} text-slate-500" on:click={() => tabsStatusHandle(0)}>Semua</a>
		<a class="tab {tabsStatus[1]} text-slate-500" on:click={() => tabsStatusHandle(1)}>Aktif</a>
		<a class="tab {tabsStatus[2]} text-slate-500" on:click={() => tabsStatusHandle(2)}>Lunas</a>
		<a class="tab {tabsStatus[3]} text-slate-500" on:click={() => tabsStatusHandle(3)}>Selesai</a>
	</div>
	<div class="overflow-x-auto w-full">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th on:click={() => sort('id')}>Nomor {headSymbol.id}</th>
					<th on:click={() => sort('date')}>Tanggal Tagihan {headSymbol.date} </th>
					<th>Uraian</th>
					<th>Status</th>
					<th>Tanggal Bayar</th>
					<th />
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				{#each filteredBills as bill}
					<tr class="text-center text-slate-200" on:click={() => fetch('main/events/detail')}>
						<td> {number3DigitFormat(bill.id)} </td>
						<td> {formatDate(bill.date)} </td>
						<td> {bill.note} </td>
						<td class="{statusColor(bill.status)} font-semibold">{bill.status}</td>
						<td>99/99/9999</td>
						<td>
							<button
								class="flex-none btn btn-outline font-bold btn-xs btn-white"
								on:click={() => detailHandler(bill.id)}
							>
								!</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
