<script lang="ts">
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';
	import type { PageData, SubmitFunction } from './$types';
	import { formatDateYMD, number3DigitFormat } from '$lib/Functions';
	import { enhance } from '$app/forms';

	navigationBlocked.set(true);

	export let data: PageData;
	$: ({ products } = data);

	let array = new Array<string>(data.products.length);

	let searchedName = '';

	console.log('arrayValue.length: ' + array.length);

	// $: checked = false;
	// $: disabled = !checked;
	let initial_date = '',
		latest_date = '',
		total = '',
		note = '';
	let listOut: Array<number> = [];

	let errorMessage = {
		show: false,
		message: ''
	};

	const today = new Date();

	function batalHandler() {
		setDialogue('Batal Pengajuan Belanja Dapur?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						navigationBlocked.set(false);
						goto('../restock');
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
	}

	const ajukanHandler: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;

		if (listOut.length < 1 || initial_date === '' || latest_date === '' || total === '') {
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
			cancel();
		}

		return async ({ result }) => {
			if (result.type === 'success') {
				goto('../restock');
				showMessage('Pengajuan Belanja Dapur Berhasil Ditambahkan!');
				navigationBlocked.set(false);
			}
		};
		// else {
		// 	setDialogue(
		// 		'Tambah Pengajuan Belanja Dapur?',
		// 		'Apakah Anda Yakin menambahkan pengajuan belanja dapur?'
		// 	);
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					goto('../restock');
		// 					showMessage('Pengajuan Belanja Dapur Berhasil Ditambahkan!');
		// 				}
		// 				case false: {
		// 					console.log('dialog batal cancel');
		// 				}
		// 			}
		// 		}
		// 	}, 200);
		// }
	};

	function onUsed(index: number) {
		if (array[index] !== '') {
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
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary ml-2 flex">
		<h1 class="font-black">PENGAJUAN BELANJA DAPUR</h1>
	</div>
	<form method="POST" action="?/add" use:enhance={ajukanHandler}>
		<div class="w-full">
			<div class="text-slate-700 bg-blue-200 p-2 rounded">
				<div class="flex flex-row w-full gap-5">
					<div class="w-full">
						<label class="label font-bold" for="fdateevent">Tanggal Awal</label>
						<input
							class="input input-bordered w-full bg-slate-100"
							type="date"
							id="fdateevent"
							min={formatDateYMD(today)}
							bind:value={initial_date}
							name="initialDate"
						/>
					</div>
					<div class="w-full">
						<label class="label font-bold" for="fdateevent">Tanggal Akhir</label>
						<input
							class="input input-bordered w-full bg-slate-100"
							type="date"
							id="fdateevent"
							min={initial_date}
							disabled={initial_date === ''}
							bind:value={latest_date}
							name="finishDate"
						/>
					</div>
				</div>
				<div class="flex flex-row w-full gap-5">
					<div class="w-full">
						<label class="label font-bold" for="fpengeluaran">Perkiraan Total Pengeluaran</label>
						<input
							class="input input-bordered w-full bg-slate-100"
							type="text"
							id="fpengeluaran"
							bind:value={total}
							name="total"
						/>
					</div>
					<div class="w-full">
						<label class="label font-bold" for="fpengeluaran">Uraian</label>
						<input
							class="input input-bordered w-full bg-slate-100 capitalize"
							type="text"
							id="fpengeluaran"
							bind:value={note}
							name="note"
						/>
					</div>
				</div>
			</div>
			<!-- <button class="btn btn-sm mt-3">
            <a>Upload Bukti Pemesanan</a>
        </button>
        <p class="text-sm text-slate-700 mb-3 ml-2">nama-file-foto.jpg</p> -->
			<input
				bind:value={searchedName}
				type="text"
				placeholder="Cari Nama Produk"
				class="input input-bordered input-primary w-full max-w-xs input-sm bg-slate-50 text-slate-700 my-2"
			/>
			<div class="overflow-x-auto max-h-[26rem]">
				<table class="table w-full table-compact table-zebra">
					<!-- head -->
					<thead class="sticky top-0 text-slate-100">
						<tr class="text-center">
							<!-- <th /> -->
							<th>Nomor</th>
							<th>Produk</th>
							<th>Bahan Baku</th>
							<th class="text-center">Stok<br>Produk</th>
							<th />
							<!-- <th class="text-center">Stok<br>Bahan Baku</th> -->
							<!-- <th /> -->
							<th class="text-right">Kuantitas</th>
							<th />
						</tr>
					</thead>
					<tbody class="text-slate-200">
						<!-- row -->
						<!-- {#each Array(30) as _} -->
							{#each products as product, i}
								{#if product.brand.toLowerCase().includes(searchedName.toLowerCase())}
									<tr>
										<!-- <th>
						<label>
							<input type="checkbox" class="checkbox" bind:checked={checked}/>
						</label>
					</th> -->
										<td class="text-center"> {number3DigitFormat(product.id)} </td>
										<td class="text-center"> <b>{product.brand}</b>, {product.quantity} {product.dr_ingredient.unit}</td>
										<td class="text-center">{product.dr_ingredient.name}</td>
										<td class="text-center">{product.stock} </td>
										<td class="text-left">{product.product_unit}</td>
										<!-- <td class="text-center">{product.dr_ingredient.stock}</td> -->
										<!-- <td class="text-left">{product.dr_ingredient.unit}</td> -->
										<td class="text-right">
											<input
												class="input input-bordered w-fit bg-slate-100 text-right input-sm text-slate-700"
												type="text"
												id="famount"
												on:change={() => onUsed(i)}
												bind:value={array[i]}
												name="stockValue"
											/>
										</td>
										<td class="text-left">{product.product_unit}</td>
									</tr>
								{/if}
							<!-- {/each} -->
						{/each}
					</tbody>
				</table>
			</div>

			<div class="card-actions justify-end p-3">
				{#if errorMessage.show}
					<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
				{/if}
				<button class="btn" on:click={() => batalHandler()}> Batal </button>
				<button class="btn btn-primary" type="submit"> AJUKAN </button>
			</div>
		</div>
	</form>
</main>
