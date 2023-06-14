<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDate, number3DigitFormat } from '$lib/Functions';
	import { userId } from '$lib/dPegawai';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ ingredients } = data);

	$: searchedName = '';

	let username1 = data.user.staff.department;
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black mx-2 flex">
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
					d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
				/>
			</svg> STOK BAHAN BAKU
		</h1>
		{#if username1 === 'Dining Room'}
			<button
				class="btn btn-outline font-bold btn-sm btn-primary"
				on:click={() => goto('./inventory/add-ingredient')}
			>
				+ Bahan Baku</button
			>
		{/if}
	</div>
	<div class="mt-2 flex w-full">
		<input
			bind:value={searchedName}
			type="text"
			placeholder="Cari Nama Bahan Baku"
			class="input input-bordered input-primary w-full max-w-xs input-sm bg-slate-50 text-slate-700"
		/>
		<div class="grow" />
		<button
			class="btn font-bold btn-sm btn-primary ml-2"
			on:click={() => goto('./inventory/history')}
		>
			STOK LOG</button
		>
		{#if username1 === 'Dining Room'}
			<button
				class="btn font-bold btn-sm btn-warning ml-2"
				on:click={() => goto('./inventory/items-out')}
			>
				- STOK</button
			>
		{/if}
	</div>
	<div class="overflow-x-auto w-full mt-2">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>Nama</th>
					<th class="text-right">Stok</th>
					<th />
					<th>Updated At</th>
					<!-- {#if username2 == '4'}
						<th />
					{/if} -->
					<th />
				</tr></thead
			>
			<tbody class="text-slate-200">
				<!-- row -->
				{#each ingredients as ingredient}
					{#if ingredient.name.toLowerCase().includes(searchedName.toLowerCase())}
						<tr>
							<td class="text-center"> {number3DigitFormat(ingredient.id)} </td>
							<td class="text-center">{ingredient.name}</td>
							<td class="text-right"> {ingredient.stock?ingredient.stock:0} </td>
							<td class="text-left"> {ingredient.unit} </td>
							<td class="text-center">{formatDate(ingredient.stock_date)}</td>
							<td class="text-right">
								<button
									class="flex-none btn btn-outline font-bold btn-xs btn-white"
									on:click={() => goto('./inventory/'+ingredient.id+'/detail')}>!</button
								>
							</td>
							<!-- {#if username2 == '4'}
						<td class="text-right">
							<button class="flex-none btn btn-outline font-bold btn-xs btn-white">
								<a href="./events/detail">+</a></button
							>
							<button class="flex-none btn btn-outline font-bold btn-xs btn-white">
								<a href="./events/detail">-</a></button
							>
							<button class="flex-none btn btn-outline font-bold btn-xs btn-white">
								<a href="./events/detail">#</a></button
							>
						</td>
					{/if} -->
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</main>
