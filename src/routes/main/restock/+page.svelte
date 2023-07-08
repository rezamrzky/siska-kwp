<script lang="ts">
	import { goto } from '$app/navigation';
	import { currencyToString, formatDate, number3DigitFormat } from '$lib/Functions';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({restocks} = data)

	$: searchedName = '';

	let userDepartment = data.user.staff.department;
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<!-- <div class="flex"> -->
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black py-5 flex ">
		<h1 class="flex gap-2 grow">
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
					d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
				/>
			</svg>BELANJA DINING ROOM</h1>
		{#if userDepartment == 'Dining Room'}
			<button
				class="btn font-bold btn-sm btn-primary"
				on:click={() => {
					goto('./restock/add');
				}}
			>
				+ Tambah</button
			>
		{/if}
	</div>
	<!-- <div class="flex-none w-1/3">
			<div class="stats shadow text-center mx-auto w-full h-2/3 mt-5">
				<div class="stat">
					<div class="stat-title text-sm">Pemesanan Aktif</div>
					<div class="stat-value text-lg">13</div>
				</div>

				<div class="stat">
					<div class="stat-title text-sm">Pembayaran Aktif</div>
					<div class="stat-value text-lg">18</div>
				</div>
			</div>
		</div> -->
	<!-- <div class="grow" />
	</div> -->
	<div>
		<input
			bind:value={searchedName}
			type="text"
			placeholder="Cari Uraian"
			class="input input-bordered input-primary w-full max-w-xs input-sm bg-slate-50 text-slate-700 my-2 ml-2"
		/>
	</div>
	<div class="overflow-x-auto w-full">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>Tanggal </th>
					<th>Uraian</th>
					<th>Jumlah <br> Pembayaran</th>
					<th>Status</th>
					<th />
				</tr>
			</thead>
			<tbody class="text-slate-200">
				<!-- row -->
				{#each restocks as restock}
				{#if restock.note.toLowerCase().includes(searchedName.toLowerCase())}
					<tr class="text-center" on:click={() => fetch('main/events/detail')}>
						<td> {number3DigitFormat(restock.id)} </td>
						<td> {formatDate(restock.created_at)} </td>
						<td>{restock.note}</td>
						<td> {restock.dr_restock_payment[0]?currencyToString(restock.dr_restock_payment[0].total):'-'} </td>
						<td class="font-semibold {restock.status==='Selesai'?"text-success":"text-warning"}">{restock.status}</td>
						<td>
							<button
								class="flex-none btn btn-outline font-bold btn-xs btn-white"
								on:click={() => {
									goto('./restock/'+restock.id+'/detail');
								}}
							>
								!</button
							>
						</td>
					</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</main>
