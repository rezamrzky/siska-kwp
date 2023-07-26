<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';
	import type { PageData, SubmitFunction } from './$types';
	import { formatDate, number3DigitFormat } from '$lib/Functions';

	export let data: PageData;
	$: ({ingredient} = data)

	let userDepartment = data.user.staff.department;

	function editBahanBakuHandler() {
		goto('./edit')
	}

	const hapusProdukHandler:SubmitFunction = () => {
		setDialogue('Hapus Produk?', 'Apakah Anda Yakin Menghapus Produk Ini?');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						showMessage('Produk Telah Dihapus!');
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);

		return async ({ result }) => {
			if (result.type === 'success') {
				window.location.reload()
				showMessage('Produk Telah Dihapus!');
			}
		};
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="flex bg-blue-200 p-2 rounded">
		<div class="font-['Helvetica Neue] w-full text-2xl text-primary mx-2">
			<h1 class="font-black">{ingredient.name}</h1>
			<p class="text-sm text-slate-700 font-black align-bottom">Stok: {ingredient.stock} {ingredient.unit}</p>
			<p class="text-sm text-slate-500 align-bottom">diperbarui pada {formatDate(ingredient.stock_date)}</p>
		</div>
		{#if userDepartment === 'Dining Room'}
			<div class="mt-2 flex w-fit flex-col gap-1">
				<button
					class="btn font-bold btn-sm btn-warning flex-none"
					on:click={editBahanBakuHandler}
				>
					Edit</button
				>
			</div>
		{/if}
	</div>
	<!-- <div class="h-auto w-full bg-blue-200 p-2 rounded"> -->
	<div class="font-['Helvetica Neue] w-full text-xl text-primary flex my-2">
		<h1 class="font-black ml-2">DAFTAR PRODUK</h1>
		<div class="flex-grow" />
		<button class="btn font-bold btn-sm btn-primary mr-2" on:click={() => goto('./product/add')}
			>+ Produk</button
		>
	</div>
	<div class="overflow-x-auto max-h-[18rem]">
		<table class="table w-full table-zebra table-compact">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>PRODUK</th>
					<!-- <th> Satuan</th> -->
					<th class="text-right">Stok</th>
					<th />
					<th>Last Update</th>
					{#if userDepartment == 'Dining Room'}
						<th />
					{/if}
				</tr>
			</thead>
			<tbody class="text-slate-200">
				<!-- row -->
				{#each data.ingredient.dr_ingredient_product as product}
				{#if !product.is_blocked}
					<tr>
						<td class="text-center"> {number3DigitFormat(product.id)} </td>
						<td class="text-center"> <b>{product.brand}</b>, {product.quantity} {data.ingredient.unit}</td>
						<td class="text-right">{product.stock}</td>
						<td class="text-center">{product.product_unit}</td>
						<!-- <td class="text-left">{data.ingredient.unit}</td> -->
						<td class="text-center">{formatDate(product.stock_date)}</td>
						{#if userDepartment == 'Dining Room'}
							<td class="text-right">
								<button
									class="flex-none btn btn-outline font-bold btn-xs btn-white"
									on:click={() => goto('./product/'+product.id+'/edit')}>&#9998; edit</button
								>
								<form method="post" action="?/delete">
								<input name="id" type="hidden" value={product.id} />
								<button
									class="flex-none btn btn-outline font-bold btn-xs btn-warning"
									type="submit">&#9746; blok</button
								>
							</form>
							</td>
						{/if}
					</tr>
					{:else}
					<tr class="text-warning">
						<td class="text-center"> {number3DigitFormat(product.id)} </td>
						<td class="text-center"> <b>{product.brand}</b>, {product.quantity} {data.ingredient.unit}</td>
						<td class="text-right">{product.stock}</td>
						<td class="text-center">{product.product_unit}</td>
						<!-- <td class="text-left">{data.ingredient.unit}</td> -->
						<td class="text-center">{formatDate(product.stock_date)}</td>
						<td><b>BLOCKED</b></td>
					</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>

	<div class="font-['Helvetica Neue] w-full text-xl text-primary flex my-2 pt-2">
		<h1 class="font-black ml-2">PRODUK LOG</h1>
		<div class="flex-grow" />
		<!-- <button
			class="btn btn-outline font-bold btn-sm btn-primary mr-2"
			on:click={() => goto('./edit')}>Daftar Lengkap</button
		> -->
	</div>
	<div class="overflow-y-scroll max-h-[18rem]">
		<table class="table w-full table-zebra table-compact">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>Produk</th>
					<th class="text-right">Kuantitas</th>
					<th />
					<th>Tanggal</th>
					<th>Transaksi</th>
				</tr>
			</thead>
			<tbody class="text-slate-200">
				<!-- row -->
				{#each ingredient.dr_stock as stock}
					<tr>
						<td class="text-center"> {number3DigitFormat(stock.product_id)} </td>
						<td class="text-center"> <b>{stock.dr_ingredient_product.brand}</b>,  {stock.dr_ingredient_product.quantity} {data.ingredient.unit}</td>
						<td class="text-right">{stock.quantity}</td>
						<td class="text-left">{stock.dr_ingredient_product.product_unit}</td>
						<td class="text-center"> {formatDate(stock.date)} </td>
						<td class="text-center {stock.action === 1? 'text-success':'text-warning'} font-semibold"> {stock.action === 1? 'MASUK':'KELUAR'} </td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<!-- </div> -->
</main>
