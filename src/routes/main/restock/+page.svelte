<script lang="ts">
	import { goto } from '$app/navigation';
	import { currencyToString, formatDate, number3DigitFormat } from '$lib/Functions';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({restocks} = data)

	let userDepartment = data.user.staff.department;
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<!-- <div class="flex"> -->
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black py-5 flex ">
		<h1 class="grow">BELANJA DINING ROOM</h1>
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
	
	<div class="overflow-x-auto w-full">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>Tanggal </th>
					<th>Uraian</th>
					<th>Jumlah</th>
					<th>Status</th>
					<th />
				</tr>
			</thead>
			<tbody class="text-slate-200">
				<!-- row -->
				{#each restocks as restock}
					<tr class="text-center" on:click={() => fetch('main/events/detail')}>
						<td> {number3DigitFormat(restock.id)} </td>
						<td> {formatDate(restock.created_at)} </td>
						<td>{restock.note}</td>
						<td> {currencyToString(restock.total)} </td>
						<td>{restock.status}</td>
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
				{/each}
			</tbody>
		</table>
	</div>
</main>
