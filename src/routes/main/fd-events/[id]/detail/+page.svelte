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
	
	let dialog: any;
	// let imgSrc: { //<reference types="svelte" />
	// 	type: string;
	// } | { type: string; } | { type: string; } | { type: string; data: { url: string; }; } | undefined;

	export let data: PageData;
	$: ({ event } = data);
	// $: ({ user } = data);
	const tempDateEvent = data.event.event_date;
	const eventTime = formatTime(tempDateEvent);
	const today = new Date();

	const paymentTotal = currencyToString(data.payment.total);
	const paymentDate = formatDate(data.payment.date);
	const paymentProof = data.payment.proof_name;
	const paymentStaff = data.payment.confirmed_by;

	const paymentCreaterAt = formatDate(data.payment.confirmed_date);

	let eventStatus = data.event.status;

	let userDepartment = data.user.staff.department;
	let errorMessage = {
		show: false,
		message: ''
	};

	let formValue = ['', '', ''];

	var bgColor3: String,
		bgColor2: String,
		message2: String,
		message3: String,
		statStep2: String,
		statStep3: String;

	switch (eventStatus) {
		case 'Pemesanan': {
			bgColor2 = 'bg-yellow-100';
			bgColor3 = 'bg-slate-300';
			message2 = 'Menunggu konfirmasi';
			message3 = '';
			break;
		}
		case 'Pembayaran': {
			bgColor2 = 'bg-green-200';
			bgColor3 = 'bg-yellow-100';
			statStep2 = 'step-primary';
			message2 = paymentCreaterAt;
			message3 = 'Menunggu konfirmasi';
			break;
		}
		case 'Selesai': {
			bgColor2 = 'bg-green-200';
			bgColor3 = 'bg-green-200';
			statStep2 = 'step-primary';
			statStep3 = 'step-primary';
			message2 = paymentCreaterAt;
			message3 = formatDate(data.event.confirmed_date);
			break;
		}
	}

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
</script>



<main class="h-screen w-full bg-slate-50 overflow-y-scroll">
	<section class="p-5 rounded">
		<div class="font-['Helvetica Neue] text-2xl w-full flex text-primary font-black py-3">
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
						d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
					/>
				</svg>DETAIL EVENT #{number3DigitFormat(event.id)}
			</h1>
		</div>
		<div class=" w-full rounded shadow-lg p-5 bg-slate-200">
			<div class="flex gap-5">
				<div class="flex-none font-light text-slate-700">
					<p>Nomor</p>
					<p>Tanggal Event</p>
					<p>Waktu Event</p>
					<p>Tempat Event</p>
					<p>Dibuat</p>
					<p>Admin</p>
				</div>
				<div class="font-semibold grow text-slate-700">
					<p>{number3DigitFormat(event.id)}</p>
					<p>{formatDate(event.event_date)}</p>
					<p>{eventTime}</p>
					<p>{event.event_place}</p>
					<p>{formatDate(event.created_at)}</p>
					<p>{event.staff.name}</p>
				</div>
				<div class="align-middle flex-none font-light text-slate-700">
					<p>Nomor Tagihan</p>
					<p>Bagian</p>
					<p>Keperluan</p>
					<p>Vendor</p>
					<p>Jumlah Konsumsi</p>
					<p>Total Pengeluaran</p>
				</div>
				<div class="font-semibold grow text-slate-700">
					<p>{event.bill_id === null ? '-' : number3DigitFormat(event.bill_id)}</p>
					<p>{event.department}</p>
					<p>{event.purpose}</p>
					<p>{event.vendor}</p>
					<p>{event.total_pax}</p>
					<p>{currencyToString(event.total_price)}</p>
				</div>
				<div class="flex-none">
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
				<div class="rounded w-full bg-green-200 p-3 mb-2 flex">
					<h2 class="font-bold text-l flex-none text-slate-700">1.PEMESANAN</h2>
					<p class="grow text-right text-slate-500 text-sm font-semibold">
						{formatDate(event.created_at)}
					</p>
				</div>

				<div class="rounded w-full {bgColor2} p-3 mb-2">
					<div class="flex">
						<h2 class="font-bold text-l flex-none text-slate-700">2.PEMBAYARAN</h2>
						<p class="grow text-right text-slate-500 text-sm font-semibold">{message2}</p>
					</div>

					{#if userDepartment === 'Ekonomi PWP' && eventStatus === 'Pemesanan'}
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
							<button class="btn btn-primary btn-sm mt-3"> Konfirmasi </button>
							<button class="btn btn-sm" on:click|preventDefault={cancelHandler}> Batal </button>
							{#if errorMessage.show}
								<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
							{/if}
						</form>
					{:else if event.status === 'Selesai' || eventStatus === 'Pembayaran'}
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
								<!-- <form method="POST" use:enhance={showBill} action="?/billUrl"> -->
									<button class="link font-semibold text-primary hover:text-secondary" on:click={() => {
										dialog.showModal()
									}
										}
										>{paymentProof}</button
									>
								<!-- </form> -->
								<p class="font-semibold">{paymentStaff}</p>
							</div>
						</div>
					{/if}
				</div>

				<div class="rounded w-full {bgColor3} p-3">
					<div class="flex">
						<h2 class="font-bold text-l flex-none text-slate-700">3.SELESAI</h2>
						<p class="grow text-right text-slate-500 text-sm font-semibold">{message3}</p>
					</div>

					{#if userDepartment === 'Food & Drink' && eventStatus === 'Pembayaran' && data.event.staff_id === data.user.staff.id}
						<div class="mt-3 text-slate-700 flex">
							<div class="grow" />
							<div>
								<p class="">
									Periksa kembali setiap informasi sebelum konfirmasi event telah selesai!
								</p>
								<form method="POST" use:enhance={selesaiHandler} action="?/confirmDone">
									<button class="btn btn-primary btn-sm w-full mt-2" type="submit">
										Konfirmasi
									</button>
								</form>
							</div>
							<div class="grow" />
						</div>
					{/if}
				</div>
			</div>
		</div>
	</section>
</main>

<dialog bind:this={dialog} on:close={() => console.log('closed')} class='bg-slate-50 text-slate-700'>
	<button class="link link-hover text-error text-end text-xl w-full" on:click={() => dialog.close()}>&#9746;</button>
	<b>{data.payment.proof_name}</b>
	<img src={data.url} alt="proof-bill-pict"/>
</dialog>