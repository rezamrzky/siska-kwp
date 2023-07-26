<script lang="ts">
	import { goto } from '$app/navigation';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import type { PageData, SubmitFunction } from './$types';
	import {
		currencyToString,
		formatDate,
		formatDateYMD,
		formatTime,
		number3DigitFormat
	} from '$lib/Functions';
	import { enhance } from '$app/forms';

	let dialogBill: any;
	let dialogPayment: any;
	let dialogEditOrder: any;
	let dialogEditPayment: any;
	// let imgSrc: { //<reference types="svelte" />
	// 	type: string;
	// } | { type: string; } | { type: string; } | { type: string; data: { url: string; }; } | undefined;

	export let data: PageData;
	$: ({ event } = data);
	// $: ({ user } = data);
	const tempDateEvent = data.event.event_date;
	const eventTime = formatTime(tempDateEvent);
	const today = new Date();

	const orders = data.orders

	const paymentTotal = currencyToString(data.payment.total);
	const paymentDate = formatDate(data.payment.date);
	let paymentProof = '', url = '';
	const paymentStaff = data.payment.confirmed_by;

	const paymentCreaterAt = formatDate(data.payment.confirmed_date);

	let eventStatus = data.event.status;

	let editOrder = {
		id: '',
		vendor: '',
		total: ''
	}

	let editPayment = {
		id: '',
		date: '',
		total: '',
		proof: ''
	}

	let paymentOrderChoosen: number;

	let userDepartment = data.user.staff.department;
	let errorMessage = {
		show: false,
		message: ''
	};
	let proofName = '',
	nameVendor = '',
		orderValue = '';
	let formValue = ['', '', ''];

	var bgColor3: String,
		bgColor2: String,
		message2: String,
		message3: String,
		statStep2: String,
		statStep3: String,
		bgColor1: String,
		message1: String;

	switch (eventStatus) {
		case 'Pemesanan': {
			bgColor1 = 'bg-yellow-100';
			bgColor3 = 'bg-slate-300';
			bgColor2 = 'bg-slate-300';
			message1 = 'Menunggu konfirmasi';
			message2 = '';
			message3 = '';
			break;
		}
		case 'Pembayaran': {
			bgColor1 = 'bg-green-200';
			bgColor2 = 'bg-yellow-100';
			bgColor3 = 'bg-slate-300';
			statStep2 = 'step-primary';
			message1 = '';
			message3 = '';
			message2 = 'Menunggu konfirmasi';
			break;
		}
		case 'Selesai': {
			bgColor1 = 'bg-green-200';
			bgColor2 = 'bg-green-200';
			bgColor3 = 'bg-green-200';
			statStep2 = 'step-primary';
			statStep3 = 'step-primary';
			message1 = paymentCreaterAt;
			message2 = paymentCreaterAt;
			message3 = formatDate(data.event.confirmed_date);
			break;
		}
	}

	let totalOrder = 0;
	let totalPayment = 0;
	orders.forEach((e: any) => {
		totalOrder += +e.total;
		if(e.fd_event_payment){
			totalPayment += +e.fd_event_payment.total
		}
	});

	// const showBill: SubmitFunction = () => {
	// 	return async ({ result  }) => {
	// 		if (result.type === 'success') {
	// 			console.log('$imgSrc '+$imgSrc)
	// 			if($imgSrc){
	// 				console.log('$imgSrc true '+$imgSrc)
	// 			dialog.showModal();
	// 			console.log('imgSrc: ' + String(imgSrc));
	// 			}else{
	// 				console.log('$imgSrc false')
	// 			}
	// 		}
	// 	};
	// };

	const selesaiHandler: SubmitFunction = () => {
		// setDialogue('Konfirmasi Selesai?', 'Apakah Anda Yakin Event Tersebut telah selesai?');
		// dialogueOpen.set(true);
		// let timeIn = setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
		// 				goto('../events');
		// 				showMessage('Event Telah Selesai!');
		// 			}
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 			}
		// 		}
		// 	}
		// }, 200);
		return async ({ result }) => {
			if (result.type === 'success') {
				showMessage('Konfirmasi Pembayaran Berhasil!');
				window.location.reload();
			}
		};
	};

	const hapusHandler: SubmitFunction = () => {
		// setDialogue('Hapus Event?', 'Apakah Anda Yakin Menghapus Event Tersebut?');
		// dialogueOpen.set(true);
		// let timeIn = setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
		// 				goto('../events');
		// 				showMessage('Event Telah Dihapus!');
		// 			}
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 			}
		// 		}
		// 	}
		// }, 200);
		return async ({ result }) => {
			if (result.type === 'success') {
				showMessage('Event Berhasil Dihapus!');
				goto('../');
			}
		};
	};

	const hapusOrderHandler: SubmitFunction = () => {
		// setDialogue('Hapus Event?', 'Apakah Anda Yakin Menghapus Event Tersebut?');
		// dialogueOpen.set(true);
		// let timeIn = setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
		// 				goto('../events');
		// 				showMessage('Event Telah Dihapus!');
		// 			}
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 			}
		// 		}
		// 	}
		// }, 200);
		return async ({ result }) => {
			if (result.type === 'success') {
				showMessage('Pemesanan Vendor Berhasil Dihapus!');
				window.location.reload();
			}
		};
	};

	const pembayaranHandler: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;

		var emptyMessage = '';

		for (var i = 0; i < formValue.length; i++) {
			if (formValue[i] === '') {
				if (emptyMessage === '') {
					emptyMessage = String(i + 1);
				} else {
					emptyMessage = emptyMessage + ', ' + String(i + 1);
				}
				console.log('empty message: ' + emptyMessage);
			}
		}

		if (emptyMessage != '') {
			cancel();
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
		}

		return async ({ result }) => {
			if (result.type === 'success') {
				showMessage('Konfirmasi Pembayaran Berhasil!');
				window.location.reload();
			}
		};
		// else {
		// 	setDialogue('Tambah Event?', 'Apakah Anda Yakin menambahkan event baru?');
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					goto('../events');
		// 					showMessage('Event Berhasil Ditambahkan!');
		// 				}
		// 				case false: {
		// 					console.log('dialog batal cancel');
		// 				}
		// 			}
		// 		}
		// 	}, 200);
		// }
	};

	const pembayaranEditHandler: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;

		// for (var i = 0; i < formValue.length; i++) {
		// 	if (formValue[i] === '') {
		// 		if (emptyMessage === '') {
		// 			emptyMessage = String(i + 1);
		// 		} else {
		// 			emptyMessage = emptyMessage + ', ' + String(i + 1);
		// 		}
		// 		console.log('empty message: ' + emptyMessage);
		// 	}
		// }

		if (editPayment.total === '' || editPayment.date === '') {
			cancel();
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
		}

		return async ({ result }) => {
			if (result.type === 'success') {
				showMessage('Konfirmasi Pembayaran Berhasil!');
				window.location.reload();
			}
		};
		// else {
		// 	setDialogue('Tambah Event?', 'Apakah Anda Yakin menambahkan event baru?');
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					goto('../events');
		// 					showMessage('Event Berhasil Ditambahkan!');
		// 				}
		// 				case false: {
		// 					console.log('dialog batal cancel');
		// 				}
		// 			}
		// 		}
		// 	}, 200);
		// }
	};

	function cancelHandler() {
		setDialogue('Batal Tambah Event?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../events');
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
	}

	function editOrderHandler(order: any){

		editOrder = {
			id: order.id,
			vendor: order.vendor,
			total: order.total
		}
		dialogEditOrder.showModal();
	}

	const editOrderSubmit: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;

		if (editOrder.vendor === '' || editOrder.total === '') {
			cancel();
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
		}

		return async ({ result }) => {
			if (result.type === 'success') {
				showMessage('Berhasil mengubah pemesanan!');
				window.location.reload();
			}
		};
		// else {
		// 	setDialogue('Tambah Event?', 'Apakah Anda Yakin menambahkan event baru?');
		// 	dialogueOpen.set(true);
		// 	let timeIn = setInterval(() => {
		// 		if (!$dialogueOpen) {
		// 			clearInterval(timeIn);
		// 			switch ($dialogueValue) {
		// 				case true: {
		// 					goto('../events');
		// 					showMessage('Event Berhasil Ditambahkan!');
		// 				}
		// 				case false: {
		// 					console.log('dialog batal cancel');
		// 				}
		// 			}
		// 		}
		// 	}, 200);
		// }
	};

</script>

<main class="h-screen w-full bg-slate-50 overflow-y-scroll">
	<section class="p-5 rounded">
		<div class="font-['Helvetica Neue]  w-full  py-3 flex">
			<h1 class="grow flex gap-2 text-primary font-black text-2xl">
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
						d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
					/>
				</svg>DETAIL PESANAN #{number3DigitFormat(event.id)}
			</h1>
			<p class="text-slate-500"><b>{event.staff.name}</b>,{formatDate(event.created_at)}</p>
		</div>
		<div class=" w-full rounded shadow-lg p-5 bg-slate-200">
			<div class="flex gap-5">
				<div class="flex-none font-light text-slate-700">
					<p>Nomor</p>
					<p>Tanggal Event</p>
					<p>Waktu Event</p>
					<!-- <p>Dibuat</p>
					<p>Admin</p> -->
				</div>
				<div class="font-semibold grow text-slate-700">
					<p>{number3DigitFormat(event.id)}</p>
					<p>{formatDate(event.event_date)}</p>
					<p>{eventTime}</p>
					<!-- <p>{formatDate(event.created_at)}</p>
					<p>{event.staff.name}</p> -->
				</div>
				<div class="align-middle flex-none font-light text-slate-700">
					<!-- <p>Nomor Tagihan</p> -->
					<p>Bagian</p>
					<!-- <p>Keperluan</p> -->
					<!-- <p>Vendor</p> -->
					<p>Tempat Event</p>
					<p>Jumlah Konsumsi</p>
					<!-- <p>Total Pengeluaran</p> -->
				</div>
				<div class="font-semibold grow text-slate-700">
					<!-- <p>{event.bill_id === null ? '-' : number3DigitFormat(event.bill_id)}</p> -->
					<p>{event.department}</p>
					<!-- <p>{event.purpose}</p> -->
					<!-- <p>{event.vendor}</p> -->
					<p>{event.event_place}</p>
					<p>{event.total_pax}</p>
					<!-- <p>{currencyToString(event.total_price)}</p> -->
				</div>
				<div class="flex-none flex gap-2">
					<!-- {#if userDepartment === 'Food & Drink' && event.status === 'Pemesanan'} -->
					<form method="POST" action="?/deleteEvent" use:enhance={hapusHandler}>
						<button
							class="btn btn-warning btn-sm text-white flex-none"
							disabled={!(
								userDepartment === 'Food & Drink' &&
								eventStatus === 'Pemesanan' &&
								data.event.staff_id === data.user.staff.id
							)}
						>
							HAPUS
						</button>
					</form>
					<!-- <form method="POST" action="?/deleteEvent" use:enhance={hapusHandler}> -->
						<button
							class="btn btn-primary btn-sm text-white flex-none"
							disabled={!(
								userDepartment === 'Food & Drink' &&
								eventStatus === 'Pemesanan' &&
								data.event.staff_id === data.user.staff.id
							)}
							on:click={() => goto('../'+event.id+'/edit')}
						>
							EDIT
						</button>
					<!-- </form> -->
					<!-- {/if} -->
				</div>
			</div>
			<div class="p-5 my-5 rounded bg-slate-100">
				<div class="w-full mb-5">
					<h2 class="font-bold text-slate-700 text-xl flex-none text-center">PROGRES EVENT</h2>
					<ul class="steps grow w-full my-5">
						<li class="step step-primary">Pemesanan</li>
						<li class="step {statStep2}">Pembayaran</li>
						<li class="step {statStep3}">Selesai</li>
					</ul>
				</div>
				<div class="rounded w-full {bgColor1} p-3 mb-2">
					<div class="flex">
						<h2 class="font-bold text-l flex-none text-slate-700">1.PEMESANAN</h2>
						<p class="grow text-right text-slate-500 text-sm font-semibold">
							{message1}
						</p>
					</div>
					<!-- <div class="flex"> -->
					<div class="grow">
						<div class="max-h-[10rem] overflow-y-scroll">
							<table class="table table-compact table-zebra w-full">
								<thead class="text-slate-100">
									<tr>
										<th>Vendor</th>
										<th>Total</th>
										<th />
									</tr>
								</thead>
								<tbody class="text-slate-300">
									{#each data.orders as order}
										<tr>
											<td class="capitalize">{order.vendor}</td>
											<td>{currencyToString(order.total)}</td>
											<td class="text-right">
												{#if userDepartment === 'Food & Drink' && eventStatus === 'Pemesanan' && data.event.staff_id === data.user.staff.id}

												<form method="POST" action="?/deleteOrder" use:enhance={hapusHandler}>
												<input name="orderId" type="hidden" value={order.id} />
													<button
														class="flex-none btn btn-outline btn-warning font-bold btn-xs btn-white"
													>
														Hapus</button
													>
												</form>
													<button
														class="flex-none btn btn-outline btn-secondary font-bold btn-xs btn-white mt-2"
														on:click={() => editOrderHandler(order)}
													>
														Edit</button
													>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
								<tfoot class="text-slate-100">
									<tr>
										<td class="text-right">Total</td>
										<td>{currencyToString(totalOrder)}</td>
										<td />
									</tr>
								</tfoot>
							</table>
						</div>
					</div>

					<!-- Form konfirmasi -->
					{#if userDepartment === 'Food & Drink' && eventStatus === 'Pemesanan' && data.event.staff_id === data.user.staff.id}
						<div class="grow bg-slate-50 rounded p-2 text-slate-700">
							<h2 class="font-['Helvetica Neue'] font-black text-lg text-primary mt-2">
								Tambah Pemesanan Vendor
							</h2>
							<p>Silahkan mengisi informasi pemesanan melalui form dibawah:</p>
							<form
								class="flex flex-col gap-3 overflow-y-scroll w-full"
								method="POST"
								action="?/addOrder"
							>
								<div class="flex gap-3">
									<div class="w-1/2">
										<label class="label font-bold w-fit" for="fdateevent"
											>Vendor<span class="text-red-500">*</span></label
										>
										<input
											class="input input-bordered w-full bg-slate-50 capitalize"
											type="text"
											id="fdateevent"
											name="name"
											bind:value={nameVendor}
										/>
									</div>
									<div class="w-1/2">
										<label class="label font-bold w-fit" for="fplaceevent"
											>Total<span class="text-red-500">*</span></label
										>
										<input
											class="input input-bordered w-full bg-slate-50"
											type="text"
											id="fplaceevent"
											name="total"
											bind:value={orderValue}
										/>
									</div>
								</div>
								<div class="card-actions justify-end">
									{#if errorMessage.show}
										<div class="justify-start text-red-500 italic text-sm">
											{errorMessage.message}
										</div>
									{/if}
									<button class="btn btn-sm" on:click={cancelHandler}> Batal </button>
									<button class="btn btn-primary btn-sm" type="submit">Simpan </button>
								</div>
							</form>
						</div>

						<!-- </div> -->
						<p class="text-slate-700 text-center">
							Periksa kembali setiap pemesanan sebelum konfirmasi pemesanan telah selesai!
						</p>
						<form
							method="POST"
							use:enhance={selesaiHandler}
							action="?/orderDone"
							class="w-full flex justify-center"
						>
							<button class="btn btn-primary btn-sm w-fit" type="submit"> Selesai </button>
						</form>
					{/if}
				</div>

				<div class="rounded w-full {bgColor2} p-3 mb-2">
					<div class="flex">
						<h2 class="font-bold text-l flex-none text-slate-700">2.PEMBAYARAN</h2>
						<p class="grow text-right text-slate-500 text-sm font-semibold">{message2}</p>
					</div>

					<!-- {#if userDepartment === 'Ekonomi PWP' && eventStatus === 'Pembayaran'} -->
						<div class="grow">
							<div class="max-h-full">
								<table class="table table-compact table-zebra w-full">
									<thead class="text-slate-100">
										<tr>
											<th>Vendor</th>
											<th>Total</th>
											<th>Nota</th>
											<th>Dikonfirmasi Oleh</th>
											<th />
										</tr>
									</thead>
									<tbody class="text-slate-300">
										{#each data.orders as order, i}
											<tr>
												<td class="capitalize">{order.vendor}</td>
												{#if order.fd_event_payment}
												<td>{currencyToString(order.fd_event_payment.total)}</td>
												<td><button
													class="link font-semibold text-primary hover:text-secondary"
													on:click={() => {
														// getUrl(order.fd_event_payment.proof_name);
														url = data.url[i]
														proofName = order.fd_event_payment.proof_name
														dialogBill.showModal();
													}}>{order.fd_event_payment.proof_name}</button
												></td>
												<td>{order.fd_event_payment.confirmed_by}</td>
												<td class="text-right">
													{#if userDepartment === 'Ekonomi PWP' && eventStatus === 'Pembayaran'}
														<!-- <button
														class="flex-none btn btn-outline btn-warning font-bold btn-xs btn-white"
													>
														Hapus</button
													> -->
														<button
															class="flex-none btn btn-primary btn-outline font-bold btn-xs btn-white"
															on:click={() => {
																editPayment.id = order.fd_event_payment.id;
																editPayment.date = formatDateYMD(order.fd_event_payment.date)
																editPayment.total = order.fd_event_payment.total;
																editPayment.proof = order.fd_event_payment.proof_name
																dialogEditPayment.showModal();
															}}
														>
															Edit</button
														>
													{/if}
												</td>
												{:else}
												<td />
												<td />
												<td />
												<td class="text-right">
													{#if userDepartment === 'Ekonomi PWP' && eventStatus === 'Pembayaran'}
														<!-- <button
														class="flex-none btn btn-outline btn-warning font-bold btn-xs btn-white"
													>
														Hapus</button
													> -->
														<button
															class="flex-none btn btn-secondary font-bold btn-xs btn-white"
															on:click={() => {
																paymentOrderChoosen = order.id;
																dialogPayment.showModal();
															}}
														>
															Konfirmasi</button
														>
													{/if}
												</td>
												{/if}
											</tr>
										{/each}
									</tbody>
									<tfoot class="text-slate-100">
										<tr>
											<td class="text-right">Total</td>
											<td>{currencyToString(totalPayment)}</td>
											<td />
											<td />
											<td />
										</tr>
									</tfoot>
								</table>
								{#if userDepartment === 'Ekonomi PWP' && eventStatus === 'Pembayaran'}
								<div class="mt-3 text-slate-700 flex">
									<div class="grow" />
									<div>
										<p class="">
											Periksa kembali setiap informasi sebelum konfirmasi event telah selesai!
										</p>
										<form method="POST" use:enhance={selesaiHandler} action="?/confirmDone" class="w-full flex justify-center">
											<input name="total" type="hidden" value={totalPayment} />
											<button class="btn btn-primary btn-sm w-fit mt-2" type="submit">
												Konfirmasi
											</button>
										</form>
									</div>
									<div class="grow" />
								</div>
							{/if}
							</div>
						</div>

					<!-- {:else if event.status === 'Selesai'}
						<div class="flex gap-5 ml-5">
							<div class="align-middle flex-none font-light text-slate-700">
								<p>Tanggal Pembayaran</p>
								<p>Total Pembayaran</p>
								<p>Nota</p>
								<p>Dikonfirmasi oleh</p>
							</div>
							<div class="grow text-slate-700">
								<p class="font-semibold">{paymentDate}</p>
								<p class="font-semibold">{paymentTotal}</p>
								<form method="POST" use:enhance={showBill} action="?/billUrl"> -->

								<!-- <button
									class="link font-semibold text-primary hover:text-secondary"
									on:click={() => {
										dialogBill.showModal();
									}}>{paymentProof}</button
								>
								 </form> -->
								<!-- <p class="font-semibold">{paymentStaff}</p>
							</div>
						</div> -->
					<!-- {/if}  -->
				</div>

				<div class="rounded w-full {bgColor3} p-3">
					<div class="flex">
						<h2 class="font-bold text-l flex-none text-slate-700">3.SELESAI</h2>
						<p class="grow text-right text-slate-500 text-sm font-semibold">{message3}</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>

<dialog
	bind:this={dialogBill}
	on:close={() => console.log('closed')}
	class="bg-slate-50 text-slate-700"
>
	<button
		class="link link-hover text-error text-end text-xl w-full"
		on:click={() => dialogBill.close()}>&#9746;</button
	>
	<b>{proofName}</b>
	<img src={url} alt="proof-bill-pict" />
</dialog>

<dialog bind:this={dialogPayment} class="bg-slate-50 text-slate-700 rounded">
	<h2 class="font-bold text-l flex-none text-primary">KONFIRMASI PEMBAYARAN</h2>
	<form
		class="mt-3 text-slate-700"
		use:enhance={pembayaranHandler}
		method="POST"
		action="?/paymentConfirmation"
	>
		<label class="label text-sm w-fit" for="fdatepayment"
			>Tanggal Pembayaran<span class="text-red-500">*</span></label
		>
		<input
			class="input input-bordered w-full bg-slate-100"
			type="date"
			id="fdatepayment"
			name="date"
			max={formatDateYMD(today)}
			bind:value={formValue[0]}
		/>
		<label class="label text-sm w-fit" for="fpengeluaran"
			>Total Pembayaran<span class="text-red-500">*</span></label
		>
		<input
			class="input input-bordered w-full bg-slate-100 mb-3"
			type="text"
			id="fpengeluaran"
			name="total"
			bind:value={formValue[1]}
		/>
		<input
			name="bill"
			type="file"
			accept=".jpeg, .jpg"
			class="file-input file-input-bordered file-input-md w-full rounded bg-slate-100"
			bind:value={formValue[2]}
		/>
		<input name="orderId" type="hidden" value={paymentOrderChoosen} />
		<button class="btn btn-primary btn-sm mt-3"> Konfirmasi </button>
		<button class="btn btn-sm" on:click|preventDefault={dialogPayment.close()}> Batal </button>
		{#if errorMessage.show}
			<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
		{/if}
	</form>
</dialog>

<dialog bind:this={dialogEditOrder} class="bg-slate-50 text-slate-700 rounded">
	<h2 class="font-bold text-l flex-none text-primary">Edit Pemesanan</h2>
	<form
		class="mt-3 text-slate-700"
		use:enhance={editOrderSubmit}
		method="POST"
		action="?/editOrder"
	>
		<label class="label text-sm w-fit" for="fdatepayment"
			>Vendor<span class="text-red-500">*</span></label
		>
		<input
			class="input input-bordered w-full bg-slate-100"
			type="text"
			id="fdatepayment"
			name="vendor"
			max={formatDateYMD(today)}
			bind:value={editOrder.vendor}
		/>
		<label class="label text-sm w-fit" for="fpengeluaran"
			>Total<span class="text-red-500">*</span></label
		>
		<input
			class="input input-bordered w-full bg-slate-100 mb-3"
			type="text"
			id="fpengeluaran"
			name="total"
			bind:value={editOrder.total}
		/>
		<input name="orderId" type="hidden" value={editOrder.id} />
		<button class="btn btn-primary btn-sm mt-3"> Edit </button>
		<button class="btn btn-sm" on:click|preventDefault={dialogEditOrder.close()}> Batal </button>
		{#if errorMessage.show}
			<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
		{/if}
	</form>
</dialog>

<dialog bind:this={dialogEditPayment} class="bg-slate-50 text-slate-700 rounded">
	<h2 class="font-bold text-l flex-none text-primary">EDIT PEMBAYARAN</h2>
	<form
		class="mt-3 text-slate-700"
		use:enhance={pembayaranEditHandler}
		method="POST"
		action="?/editPayment"
	>
		<label class="label text-sm w-fit" for="fdatepayment"
			>Tanggal Pembayaran<span class="text-red-500">*</span></label
		>
		<input
			class="input input-bordered w-full bg-slate-100"
			type="date"
			id="fdatepayment"
			name="date"
			max={formatDateYMD(today)}
			bind:value={editPayment.date}
		/>
		<label class="label text-sm w-fit" for="fpengeluaran"
			>Total Pembayaran<span class="text-red-500">*</span></label
		>
		<input
			class="input input-bordered w-full bg-slate-100 mb-3"
			type="text"
			id="fpengeluaran"
			name="total"
			bind:value={editPayment.total}
		/>
		<label class="label text-sm w-fit" for="fpengeluaran"
			>Bukti Pembayaran (Kosongkan jika tidak ingin diubah)</label
		>
		<input
			name="bill"
			type="file"
			accept=".jpeg, .jpg"
			class="file-input file-input-bordered file-input-md w-full rounded bg-slate-100"
		/>
		<input name="orderId" type="hidden" value={editPayment.id} />
		<input name="proof_name" type="hidden" value={editPayment.proof} />
		<button class="btn btn-primary btn-sm mt-3"> EDIT </button>
		<button class="btn btn-sm" on:click|preventDefault={dialogEditPayment.close()}> Batal </button>
		{#if errorMessage.show}
			<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
		{/if}
	</form>
</dialog>
