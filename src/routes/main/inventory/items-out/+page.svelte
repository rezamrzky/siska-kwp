<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { number3DigitFormat } from '$lib/Functions';
	import { enhance, type SubmitFunction } from '$app/forms';

	navigationBlocked.set(true);

	export let data: PageData;
	$: ({ products } = data);

	var date = '';
	let listOut: Array<number> = [];
	let valuesArr = new Array<string>(data.products.length)

	let errorMessage = {
		show: false,
		message: ''
	};

	const submitHandler: SubmitFunction = ({cancel}) => {
		errorMessage.show = false;

		if (date === '' || listOut.length < 1) {
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
			cancel()
		} 

		return async ({result}) => {
			if(result.type === 'success'){
				goto('../inventory');
				showMessage('Catatan Stok Keluar Berhasil Ditambahkan!');
				navigationBlocked.set(false)
			}
		}

		// else {
		// 	setDialogue('Catat Stok Keluar?', 'Apakah Anda Yakin mencatatn stok keluar?');
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					goto('../inventory');
		// 					showMessage('Catatan Stok Keluar Berhasil Ditambahkan!');
		// 				}
		// 				case false: {
		// 					console.log('dialog batal cancel');
		// 				}
		// 			}
		// 		}
		// 	}, 200);
		// }
	}

	function cancelHandler() {
		setDialogue('Batal Catat Stok Keluar?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../inventory');
						navigationBlocked.set(false)
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
	}

	function onUsed(index: number) {
		// console.log('dumbArray', dumbArray[index]);
		if (valuesArr[index] !== '') {
			if (!listOut.includes(index)) {
				listOut.push(index);
			}
		} else {
			if (listOut.includes(index)) {
				let id = listOut.indexOf(index);
				listOut.splice(id, 1);
			}
		}
		console.log('listOut', listOut);
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black ml-2">
		<h1>STOK KELUAR</h1>
	</div>

	<form method='POST' action='?/itemsOut' use:enhance={submitHandler}>
	<div class="mt-2 flex w-full bg-blue-200 rounded p-3 justify-center">
		<div class="text-slate-700 text-center w-full">
			<p class="text-sm font-semibold text-center w-full">Tanggal Keluar</p>
			<input
				class="input input-bordered w-1/3 bg-slate-100"
				type="date"
				id="fdateout"
				bind:value={date}
				name="date"
			/>
		</div>
	</div>

	<div class="max-h-[30rem] overflow-y-scroll mt-2">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>Produk</th>
					<th>Bahan Baku</th>
					<th class="text-right">Stok</th>
					<th />
					<th class="text-right">Penggunaan</th>
					<th />
					<!-- {#if username2 == '4'}
						<th />
					{/if} -->
				</tr>
			</thead>
			<tbody class="text-slate-200">
				<!-- row -->
				{#each products as product, i}
						<tr>
							<td class="text-center">{number3DigitFormat(product.id)}</td>
							<td class="text-center"
								><b>{product.brand},</b> {product.quantity} {product.dr_ingredient.unit}</td
							>
							<td class="text-center"> {product.dr_ingredient.name} </td>
							<td class="text-right">{product.stock} </td>
							<td class="text-left">{product.product_unit}</td>
							<td class="text-right">
								<input
									class="input input-bordered w-fit bg-slate-100 text-right input-xs text-slate-700"
									type="text"
									id="ftotal"
									on:change={() => onUsed(i)}
									bind:value={valuesArr[i]}
									name='quantity'
								/>
							</td>
							<td class="text-center w-fit"> satuan </td>
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
				{/each}
			</tbody>
		</table>
	</div>
	<div class="card-actions justify-end p-3">
		{#if errorMessage.show}
			<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
		{/if}
		<button class="btn" on:click={cancelHandler}>Batal </button>
		<button class="btn btn-primary" type='submit'>Tambah </button>
	</div>
</form>
</main>
