<script lang="ts">
	import { userId } from '$lib/dPegawai';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData, SubmitFunction } from './$types';
	import { currencyToString, formatDate, formatDateYMD, number3DigitFormat } from '$lib/Functions';
	import { enhance } from '$app/forms';

	export let data: PageData;
	$: ({ restock } = data);
	$: ({ products } = data);
	$: ({bill} = data);
	$: ({payment} = data);

	const today = new Date();
	let dialog:any, dialog2:any;

	let userDepartment = data.user.staff.department;

	let status = data.restock.status;

	let listPembelian = new Array<number>(data.products.length)

	data.products.forEach((element:any , i:any) => {
		listPembelian[i] = element.quantity
	});
	let dumbArray = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
	let formPembelian = {
		date: '',
		cost: '',
		file: ''
	};

	let formPembayaran = {
		date: '',
		cost: '',
		file: ''
	};

	type errorMessage = {
		show: boolean;
		message: string;
	};

	var errorPembelianDR: errorMessage = {
		show: false,
		message: ''
	};

	var errorPembelianEko: errorMessage = {
		show: false,
		message: ''
	};

	var errorPembayaranEko: errorMessage = {
		show: false,
		message: ''
	};

	var bgColor3: String,
		bgColor2: String,
		bgColor4: String,
		bgColor5: String,
		message2: String,
		message3: String,
		message4: String,
		statStep2: String,
		statStep3: String,
		statStep4: String,
		statStep5: String;

	switch (status) {
		case 'Persetujuan': {
			bgColor2 = 'bg-yellow-100';
			bgColor3 = 'bg-slate-300';
			bgColor4 = 'bg-slate-300';
			bgColor5 = 'bg-slate-300';
			statStep2 = 'step-primary';
			message2 = 'Menunggu persetujuan';
			message3 = '';
			message4 = '';
			break;
		}
		case 'Pembelian': {
			bgColor2 = 'bg-green-200';
			bgColor3 = 'bg-yellow-100';
			bgColor4 = 'bg-slate-300';
			bgColor5 = 'bg-slate-300';
			statStep2 = 'step-primary';
			statStep3 = 'step-primary';
			message2 =  formatDate(data.restock.approved_date);
			message3 = 'Menunggu konfirmasi';
			message4 = '';
			break;
		}
		case 'Pembayaran': {
			bgColor2 = 'bg-green-200';
			bgColor3 = 'bg-green-200';
			bgColor4 = 'bg-yellow-100';
			bgColor5 = 'bg-slate-300';
			statStep2 = 'step-primary';
			statStep3 = 'step-primary';
			statStep4 = 'step-primary';
			message2 = formatDate(data.restock.approved_date);
			message3 = formatDate(data.bill.confirm_date);
			message4 = 'Menunggu konfirmasi';
			break;
		}

		case 'Selesai': {
			bgColor2 = 'bg-green-200';
			bgColor3 = 'bg-green-200';
			bgColor4 = 'bg-green-200';
			bgColor5 = 'bg-green-200';
			statStep2 = 'step-primary';
			statStep3 = 'step-primary';
			statStep4 = 'step-primary';
			statStep5 = 'step-primary';
			message2 = formatDate(data.restock.approved_date);
			message3 = formatDate(data.bill.confirm_date);
			message4 = formatDate(data.payment.confirm_date);
			break;
		}
	}

	const hapusHandler: SubmitFunction = () => {
		return async ({result}) => {
			if(result.type === 'success'){
				showMessage('Pengajuan Telah Dihapuskan!');
				goto('../')
			}
		}
		// setDialogue(
		// 	'Hapus Pengajuan Belanja Dapur?',
		// 	'Apakah Anda Yakin Menghapus Pengajuan Tersebut?'
		// );
		// dialogueOpen.set(true);
		// let timeIn = setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
		// 				
		// 			}
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 			}
		// 		}
		// 	}
		// }, 200);
	}

	const konfirmasiPengajuanHandler: SubmitFunction = () => {
		return async ({result}) => {
			if(result.type === 'success'){
				showMessage('Pengajuan Telah Disetujui!');
				window.location.reload()
			}
		}
		// setDialogue(
		// 	'Setujui Pengajuan Belanja Dapur?',
		// 	'Apakah Anda Yakin Mengkonfirmasi Pengajuan Tersebut?'
		// );
		// dialogueOpen.set(true);
		// let timeIn = setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
		// 				status = 2;
		// 				showMessage('Pengajuan Telah Disetujui!');
		// 			}
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 			}
		// 		}
		// 	}
		// }, 200);
	}

	const konfirmasiPembelianDRHandler: SubmitFunction = ({cancel}) => {
		if (listPembelian.length < 1) {
			errorPembelianDR.show = true;
			errorPembelianDR.message = 'Terdapat form yang belum diisi!';
			cancel()
		} 
		return async ({result}) => {
			if(result.type = 'success'){
				showMessage('Pembelian Telah Dikonfirmasi!');
				window.location.reload()
			}
		}
		// else {
		// 	setDialogue(
		// 		'Konfirmasi Pembelian Belanja Dapur?',
		// 		'Apakah Anda Yakin Mengkonfirmasi Pembelian Tersebut?'
		// 	);
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					showMessage('Pembelian Telah Dikonfirmasi!');
		// 				}
		// 				case false: {
		// 					console.log('dialog batal cancel');
		// 				}
		// 			}
		// 		}
		// 	}, 200);
		// }
	}

	const konfirmasiPembelianEkoHandler: SubmitFunction = ({cancel}) => {
		if (formPembelian.date === '' || formPembelian.cost === '' || formPembelian.file === '') {
			errorPembelianEko.show = true;
			errorPembelianEko.message = 'Terdapat form yang belum diisi!';
			cancel()
		} 
		return async ({result}) => {
			if(result.type = 'success'){
				showMessage('Pembelian Telah Dikonfirmasi!');
				window.location.reload()
			}
		}
		// else {
		// 	setDialogue(
		// 		'Konfirmasi Pembelian Belanja Dapur?',
		// 		'Apakah Anda Yakin Mengkonfirmasi Pembelian Tersebut?'
		// 	);
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					showMessage('Pembelian Telah Dikonfirmasi!');
		// 				}
		// 				case false: {
		// 					console.log('dialog batal cancel');
		// 				}
		// 			}
		// 		}
		// 	}, 200);
		// }
	}

	const konfirmasiPembayaranEkoHandler: SubmitFunction = ({cancel}) => {
		if (formPembayaran.date === '' || formPembayaran.cost === '' || formPembayaran.file === '') {
			errorPembayaranEko.show = true;
			errorPembayaranEko.message = 'Terdapat form yang belum diisi!';
			cancel()
		} 
		return async ({result}) => {
			if(result.type = 'success'){
				showMessage('Pembayaran Telah Dikonfirmasi!');
				window.location.reload()
			}
		}
		// else {
		// 	setDialogue(
		// 		'Konfirmasi Pembayaran Belanja Dapur?',
		// 		'Apakah Anda Yakin Mengkonfirmasi Pembayaran Tersebut?'
		// 	);
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					showMessage('Pembayaran Telah Dikonfirmasi!');
		// 				}
		// 				case false: {
		// 					console.log('dialog batal cancel');
		// 				}
		// 			}
		// 		}
		// 	}, 200);
		// }
	}

	function batalHandler() {
		setDialogue('Batal Konfirmasi?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						invalidateAll()
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
	}
	function onBought(index: number) {
		console.log('dumbArray', dumbArray[index]);
		if (dumbArray[index] !== '') {
			if (!listPembelian.includes(index)) {
				listPembelian.push(index);
			}
		} else {
			if (listPembelian.includes(index)) {
				let id = listPembelian.indexOf(index);
				listPembelian.splice(id, 1);
			}
		}
	}
</script>

<main class="h-screen w-full p-5 bg-slate-50 overflow-y-scroll">
	<section class="rounded">
		<div class="font-['Helvetica Neue] text-2xl w-full flex text-primary font-black">
			<h1 class="grow">DETAIL BELANJA DAPUR</h1>
		</div>
		<div class=" w-full rounded shadow-lg p-5 bg-slate-200">
			<div class="flex gap-5">
				<div class="flex gap-2 w-full">
					<div class="flex-none font-light text-slate-700">
						<p>Nomor</p>
						<p>Diajukan Oleh</p>
						<p>Uraian</p>
					</div>
					<div class="font-bold grow text-slate-700">
						<p>{number3DigitFormat(restock.id)}</p>
						<p>{restock.staff.name}</p>
						<p>{restock.note}</p>
					</div>
				</div>
				<div class="flex gap-2 w-full">
					<div class="flex-none font-light text-slate-700">
						<p>Tanggal Pengajuan</p>
						<p>Periode Kebutuhan</p>
						<p>Perkiraan Pengeluaran</p>
					</div>
					<div class="font-bold grow text-slate-700">
						<p>{formatDate(restock.created_at)}</p>
						<p>{formatDate(restock.initial_date)} - {formatDate(restock.finish_date)}</p>
						<p>{currencyToString(restock.total)}</p>
					</div>
				</div>

				<!-- <div class="align-middle flex-none font-light text-slate-700">
					<p>Bagian</p>
					<p>Keperluan</p>
					<p>Vendor</p>
					<p>Jumlah Konsumsi</p>
					<p>Total Pengeluaran</p>
				</div>
				<div class="font-bold grow text-slate-700">
					<p>000</p>
					<p>99/99/9999</p>
					<p>99:99</p>
				</div> -->
				<div class="flex-none">
					{#if userDepartment == 'Dining Room' && status == 'Persetujuan'}
					<form method="POST" action='?/delete' use:enhance={hapusHandler}>
						<button class="btn btn-warning btn-xs text-white flex-none" type='submit'>
							HAPUS
						</button>
					</form>
						<!-- <button class="btn btn-primary btn-xs text-white flex-none" on:click={() => goto('./edit')}>
							EDIT
						</button> -->
					{/if}
				</div>
			</div>
			<div class="overflow-y-auto max-h-[20rem] mt-2">
				<table class="table w-full table-compact pt-5">
					<!-- head -->
					<thead class="sticky top-0 text-slate-100">
						<tr class="text-center">
							<th>Nomor</th>
							<th>Nama</th>
							<th />
							<th />
							<th class="text-right">Diajukan</th>
							<th />
							{#if restock.is_stock_confirmed}
							<th class="text-right">Diterima</th>
							<th />
							{/if}
							<!-- {#if username2 == '4'}
                            <th />
                        {/if} -->
						</tr>
					</thead>
					<tbody>
						<!-- row -->
						<!-- {#each Array(15) as _} -->
						{#each products as product, i}
							<tr>
								<td class="text-center">
									{number3DigitFormat(product.dr_ingredient_product.id)}
								</td>
								<td class="text-center"> {product.dr_ingredient_product.brand} </td>
								<td class="text-right"> {product.dr_ingredient_product.quantity} </td>
								<td class="text-left"> {product.dr_ingredient_product.dr_ingredient.unit}</td>
								<td class="text-right"> {product.quantity} </td>
								<td class="text-left"> {product.dr_ingredient_product.product_unit} </td>
								{#if restock.is_stock_confirmed}
								<td class="text-right">{product.confirm_quantity}</td>
								<td class="text-left"> {product.dr_ingredient_product.product_unit} </td>
								{/if}
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
						<!-- {/each} -->
					</tbody>
				</table>
			</div>
			<div class="p-5 my-5 rounded bg-slate-100">
				<div class="w-full mb-5">
					<h2 class="font-bold text-slate-700 text-xl flex-none text-center">PROGRES EVENT</h2>
					<ul class="steps grow w-full my-5">
						<li class="step step-primary">Pengajuan</li>
						<li class="step {statStep2}">Persetujuan</li>
						<li class="step {statStep3}">Konfirmasi Pembelian</li>
						<li class="step {statStep4}">Konfirmasi Pembayaran</li>
						<li class="step {statStep5}">Selesai</li>
					</ul>
				</div>
				<div class="rounded w-full bg-green-200 p-3 mb-2 flex">
					<h2 class="font-bold text-l flex-none text-slate-700">1.PEMESANAN</h2>
					<p class="grow text-right text-slate-500 text-sm">{formatDate(restock.created_at)}</p>
				</div>

				<div class="rounded w-full {bgColor2} p-3 mb-2">
					<div class="flex">
						<h2 class="font-bold text-l flex-none text-slate-700">2.PERSETUJUAN</h2>
						<p class="grow text-right text-slate-500 text-sm">{message2}</p>
					</div>

					{#if userDepartment == 'Manajer' && status == 'Persetujuan'}
						<div class="mt-3 text-slate-700 flex">
							<div class="grow" />
							<div>
								<p class="">Konfirmasi belanja dapur disetujui</p>
								<form method="POST" action="?/approved" use:enhance={konfirmasiPengajuanHandler}>
									<button class="btn btn-primary btn-sm w-full mt-2"> Konfirmasi </button>
								</form>
							</div>
							<div class="grow" />
						</div>
					{/if}
				</div>

				<div class="rounded w-full {bgColor3} p-3 mb-2">
					<div class="flex">
						<h2 class="font-bold text-l flex-none text-slate-700">3.PEMBELIAN</h2>
						<p class="grow text-right text-slate-500 text-sm">{message3}</p>
					</div>

					{#if userDepartment == 'Ekonomi PWP' && status == 'Pembelian' && restock.is_stock_confirmed}
					<form method="POST" action="?/orderConfirm"  use:enhance={konfirmasiPembelianEkoHandler}>
						<div class="text-slate-700">
							<label class="label text-sm" for="fdatepayment">Tanggal Pembelian</label>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="date"
								id="fdatepayment"
								bind:value={formPembelian.date}
								max={formatDateYMD(today)}
								name='orderDate'
							/>
							<label class="label text-sm" for="fpengeluaran">Total Belanja</label>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="text"
								id="fpengeluaran"
								bind:value={formPembelian.cost}
								name='orderTotal'
							/>
							<label class="label text-sm" for="fbuktibelanja">Bukti Belanja</label>
							<input
								type="file"
								class="file-input file-input-bordered bg-slate-50 w-full rounded"
								id="fbuktibelanja"
								name="orderProof"
								accept='image/jpeg, image/jpg'
								bind:value={formPembelian.file}
							/>
							<button class="btn btn-primary btn-sm mt-3" type="submit">
								Konfirmasi
							</button>
							<button class="btn btn-sm" on:click={batalHandler}> Batal </button>
						
							{#if errorPembelianEko.show}
								<div class="justify-start text-red-500 italic text-sm">
									{errorPembelianEko.message}
								</div>
							{/if}
						</div>
						</form>
					{:else if userDepartment == 'Dining Room' && status == 'Pembelian' && !restock.is_stock_confirmed}
					<form method="POST" action="?/productConfirm"  use:enhance={konfirmasiPembelianDRHandler}>
						<div class="overflow-x-auto max-h-[24rem]">
							<table class="table w-full table-compact mt-5">
								<!-- head -->
								<thead class="sticky top-0 text-slate-100">
									<tr class="text-center">
										<th>Nomor</th>
										<th>Produk</th>
										<th />
										<th />
										<th class="text-right">Kuantitas</th>
										<th />
									</tr>
								</thead>
								<tbody class="text-slate-200">
									<!-- row -->
									{#each products as product, i}
										<tr>
											<td class="text-center"> {number3DigitFormat(product.dr_ingredient_product.id)}</td>
											<td class="text-center"> {product.dr_ingredient_product.brand}, {product.dr_ingredient_product.product_unit}</td>
											<td class="text-right"> {product.dr_ingredient_product.quantity} </td>
											<td class="text-left"> {product.dr_ingredient_product.dr_ingredient.unit} </td>
											<td class="text-right">
												<input
													class="input input-bordered w-fit bg-slate-100 text-right input-xs text-slate-700"
													type="text"
													id="famount"
													bind:value={listPembelian[i]}
													name='quantityList'
												/>
											</td>
											<td class="text-left">{product.dr_ingredient_product.product_unit}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<button class="btn btn-primary btn-sm mt-3" type="submit">
							Konfirmasi
						</button>
						<button class="btn btn-sm" on:click={batalHandler}> Batal </button>
						{#if errorPembelianDR.show}
							<div class="justify-start text-red-500 italic text-sm">
								{errorPembelianDR.message}
							</div>
						{/if}
					</form>
					{:else if status === 'Pembayaran' || status === 'Selesai'}
						<div class="flex gap-5 ml-5">
							<div class="align-middle flex-none font-light text-slate-700">
								<p>Tanggal Pembelian</p>
								<p>Total Belanja</p>
								<p>Nota</p>
								<p>Dikonfirmasi oleh</p>
							</div>
							<div class="grow text-slate-700 font-semibold">
								<p>{formatDate(bill.date)}</p>
								<p>{currencyToString(bill.total)}</p>
								<p class="link text-primary" on:click={() => dialog.showModal()}>{bill.proof_name}</p>
								<p>{bill.staff.name}</p>
							</div>
						</div>
					{/if}
				</div>

				<div class="rounded w-full {bgColor4} p-3 mb-2">
					<div class="flex">
						<h2 class="font-bold text-l flex-none text-slate-700">4. PEMBAYARAN</h2>
						<p class="grow text-right text-slate-500 text-sm">{message4}</p>
					</div>

					{#if userDepartment == 'Ekonomi PWP' && status == 'Pembayaran'}
					<form method="POST" action="?/paymentConfirm"  use:enhance={konfirmasiPembayaranEkoHandler}>
						<div class=" text-slate-700">
							<label class="label text-sm" for="fdatepayment">Tanggal Pembayaran</label>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="date"
								id="fdatepayment"
								name="paymentDate"
								bind:value={formPembayaran.date}
							/>
							<label class="label text-sm" for="fpengeluaran">Total Pembayaran</label>
							<input
								class="input input-bordered w-full bg-slate-100"
								type="text"
								id="fpengeluaran"
								name="paymentTotal"
								bind:value={formPembayaran.cost}
							/>
							<label class="label text-sm" for="fbuktibelanja">Bukti Pembayaran</label>
							<input
								type="file"
								class="file-input file-input-bordered bg-slate-50 w-full rounded"
								id="fbuktibelanja"
								name="paymentProof"
								bind:value={formPembayaran.file}
							/>
							<button class="btn btn-primary btn-sm mt-3" type="submit">
								Konfirmasi
							</button>
							<button class="btn btn-sm" on:click={batalHandler}> Batal </button>
							{#if errorPembayaranEko.show}
								<div class="justify-start text-red-500 italic text-sm">
									{errorPembayaranEko.message}
								</div>
							{/if}
						</div>
					</form>
					{:else if status == 'Selesai'}
						<div class="flex gap-5 ml-5">
							<div class="align-middle flex-none font-light text-slate-700">
								<p>Tanggal Pembayaran</p>
								<p>Total Pembayaran</p>
								<p>Nota</p>
								<p>Dikonfirmasi oleh</p>
							</div>
							<div class="grow text-slate-700 font-semibold">
								<p>{formatDate(payment.date)}</p>
								<p>{currencyToString(payment.total)}</p>
								<p class="link text-secondary" on:click={() => dialog2.showModal()}>{payment.proof_name}</p>
								<p>{payment.staff.name}</p>
							</div>
						</div>
					{/if}
				</div>

				<div class="rounded w-full {bgColor5} p-3">
					<div class="flex">
						<h2 class="font-bold text-l flex-none text-slate-700">5.SELESAI</h2>
					</div>

					<!-- {#if username2 == '2' && status == 2}
						<div class="mt-3 text-slate-700 flex">
							<div class="grow" />
							<div>
								<p class="">Konfirmasi event telah selesai</p>
								<button class="btn btn-primary btn-sm w-full mt-2">
									<a>Konfirmasi</a>
								</button>
							</div>
							<div class="grow" />
						</div>
					{/if} -->
				</div>
			</div>
		</div>
	</section>
</main>

<dialog bind:this={dialog} on:close={() => console.log('closed')} class='bg-slate-50 text-slate-700'>
	<button class="link link-hover text-error text-end text-xl w-full" on:click={() => dialog.close()}>&#9746;</button>
	<!-- This is amazingly simple! (press esc to close) -->
	<img src={data.url} alt="proof-bill-pict"/>
</dialog>

<dialog bind:this={dialog2} on:close={() => console.log('closed')} class='bg-slate-50 text-slate-700'>
	<button class="link link-hover text-error text-end text-xl w-full" on:click={() => dialog2.close()}>&#9746;</button>
	<!-- This is amazingly simple! (press esc to close) -->
	<img src={data.url2} alt="proof-bill-pict"/>
</dialog>