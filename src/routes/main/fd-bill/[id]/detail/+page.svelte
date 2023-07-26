<script lang="ts">
	import { userId } from '$lib/dPegawai';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { showMessage } from '$lib/Message.svelte';
	import type { PageData } from './$types';
	import { currencyToString, formatDate, formatDateYMD, number3DigitFormat } from '$lib/Functions';
	import { enhance, type SubmitFunction } from '$app/forms';
	import type { fd_bill_payment } from '@prisma/client';
	import { null_to_empty } from 'svelte/internal';

	export let data: PageData;
	$: ({ bill } = data);

	let piutang = data.bill.total_after_tax
	let dialogEditPayment: any;

	let editPayment = {
		id: '',
		date: '',
		total: ''
	}

	let payment: fd_bill_payment[] | null = data.bill.fd_bill_payment;
	console.log('payment_length: '+payment?.length)

	let userDepartment = data.user.staff.department;
	let errorMessage = {
		show: false,
		message: ''
	};

	let isApproved: boolean | undefined = data.bill.approval;
	let isPaidOff = false;

	$: disabled = isPaidOff;

	// function deleteHandler() {
	// 	setDialogue('Hapus Tagihan', 'Apakah Anda Yakin Menghapus Tagihan?');
	// 	dialogueOpen.set(true);
	// 	let timeIn = setInterval(() => {
	// 		if (!$dialogueOpen) {
	// 			clearInterval(timeIn);
	// 			switch ($dialogueValue) {
	// 				case true: {
	// 					goto('../fd-bill');
	// 					showMessage('Tagihan Berhasil Dihapus!');
	// 				}
	// 				case false: {
	// 					console.log('dialog batal cancel');
	// 				}
	// 			}
	// 		}
	// 	}, 200);
	// }

	function editHandler() {
		goto('./edit');
	}

	var date: string = '';
	var paymentValue = '';

	// function submitHandler() {
	// 	errorMessage.show = false;

	// 	if (date === '' || paymentValue === '') {
	// 		errorMessage.show = true;
	// 		errorMessage.message = 'Terdapat form yang belum diisi!';
	// 	} else {
	// 		setDialogue('Konfirmasi Pembayaran?', 'Apakah Anda Yakin Konfirmasi Pembayaran?');
	// 		dialogueOpen.set(true);
	// 		let timeIn = setInterval(() => {
	// 			if (!$dialogueOpen) {
	// 				clearInterval(timeIn);
	// 				switch ($dialogueValue) {
	// 					case true: {
	// 						isPaidOff = true;
	// 						showMessage('Pembayaran Berhasil Ditambahkan!');
	// 					}
	// 					case false: {
	// 						console.log('dialog batal cancel');
	// 					}
	// 				}
	// 			}
	// 		}, 200);
	// 	}
	// }

	function cancelHandler() {
		setDialogue('Batal Konfirmasi Pembayaran?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						window.location.reload();
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
	}

	function approvalColor(isApproved: boolean | undefined): string {
		switch (isApproved) {
			case true:
				return 'bg-green-200';
			case false:
				return 'bg-red-200';
			case undefined:
				return 'bg-slate-200';
			default:
				return 'bg-slate-200';
		}
	}
	const approvedHandle: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				showMessage('Berhasil menyetujui tagihan!');
				window.location.reload();
			}
		};
	};

	// const disapprovedHandle: SubmitFunction = () => {
	// 	return async ({ result }) => {
	// 		if (result.type === 'success') {
	// 			showMessage('Berhasil menolak tagihan!');
	// 			window.location.reload();
	// 		}
	// 	};
	// };

	function kreditCheck(): number{
		let sisa = piutang;
		for(let i=0; i<payment!.length; i++){
		sisa = +sisa - +payment![i].total
		}
		return sisa;
	}

	function editPaymentHandler(payment: any){

		editPayment = {
			id: payment.id,
			date: formatDateYMD(payment.date),
			total: payment.total
		}
		dialogEditPayment.showModal()
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="flex">
		<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black py-3 grow">
			<h1>DETAIL TAGIHAN FOOD & DRINK</h1>
		</div>
		<div class="grow" />
	</div>
	<div class="flex flex-col p-5 rounded bg-blue-200">
		<div class="flex gap-5">
			<div class="flex-none font-light text-slate-700">
				<p>Nomor</p>
				<p>Uraian Tagihan</p>
				<p>Tanggal Tagihan</p>
				<p>Status</p>
				<p>Ekonomi</p>
			</div>
			<div class="font-semibold grow text-slate-700">
				<p>{number3DigitFormat(bill.id)}</p>
				<p>{bill.note}</p>
				<p>{formatDate(bill.date)}</p>
				<p>{bill.status}</p>
				<p>{data.user.staff.name}</p>
			</div>
			<div class="align-middle flex-none font-light text-slate-700">
				<p>Jumlah Sebelum Pajak</p>
				<p>PPN 11%</p>
				<p>PPh Pasal 23</p>
				<p>Total Setelah Pajak</p>
				<p>Dibuat Tanggal</p>
			</div>
			<div class="font-semibold grow text-slate-700">
				<p>{currencyToString(bill.total_before_tax)}</p>
				<p>{currencyToString(bill.ppn10)}</p>
				<p>{currencyToString(bill.pph23)}</p>
				<p>{currencyToString(bill.total_after_tax)}</p>
				<p>{formatDate(bill.created_at)}</p>
			</div>
			<div class="flex-none">
				{#if userDepartment == 'Ekonomi PWP' && isApproved === null}
					<div class="flex mb-2 justify-center">
						<!-- <button
							class="btn btn-warning btn-sm text-white flex-none"
							on:click={deleteHandler}
							{disabled}
						>
							HAPUS
						</button> -->
						<button
							class="btn btn-wide btn-outline font-bold btn-sm btn-primary ml-2"
							on:click={editHandler}
							{disabled}
						>
							EDIT</button
						>
					</div>
				{/if}

				<div class="{approvalColor(isApproved)} rounded p-3 text-slate-700 w-full max-w-1/3">
					{#if userDepartment === 'Manajer' && isApproved === null}
						<h2 class="font-['Helvetica Neue'] font-black text-lg text-primary text-center">
							KONFIRMASI TAGIHAN
						</h2>
						<p class="text-center w-full text-sm">
							Periksa kembali data tagihan <br /> sebelum menyetujui.
						</p>
						<div class="justify-center flex gap-2 mt-2">
							<!-- <form method="POST" use:enhance={disapprovedHandle} action="?/declined">
								<button class="btn btn-error btn-sm"> TOLAK </button>
							</form> -->
							<form method="POST" use:enhance={approvedHandle} action="?/approved">
								<button class="btn btn-success btn-sm">SETUJUI </button>
							</form>
						</div>
					{:else if isApproved === null}
						<p class="text-center w-full">Menunggu Persetujuan Manajer</p>
					{:else if isApproved}
						<div class="text-sm">
							<p class="w-full font-bold">DISETUJUI</p>
							<p>{formatDate(bill.approval_at)}</p>
						</div>
						<!-- {:else if bill.status === 'Aktif' && isApproved === null}
						<div class="flex text-sm">
							<p class="w-full font-bold grow">DITOLAK</p>
							<p>{formatDate(bill.approval_at)}</p>
						</div> -->
					{/if}
				</div>
			</div>
		</div>

		{#if userDepartment === 'Ekonomi PWP' && isApproved}
			<div class="w-full h-full bg-slate-100 rounded p-3 mt-3 text-slate-700 flex gap-5">
				{#if typeof data.bill.fd_bill_payment !== undefined}
					<div class="grow">
						<h2 class="font-['Helvetica Neue'] font-black text-lg text-primary mt-2">
							PEMBAYARAN TAGIHAN
						</h2>
						<div class="max-h-[10rem] overflow-y-scroll">
							<table class="table table-compact table-zebra w-full">
								<thead class="text-slate-100">
									<tr>
										<th>Tanggal</th>
										<th>Total</th>
										<th>Ekonomi</th>
									<th />
									</tr>
								</thead>
								<tbody class="text-slate-300">
									{#each data.bill.fd_bill_payment as pay}
										<tr>
											<td>{formatDate(pay.date)}</td>
											<td>{currencyToString(pay.total)}</td>
											<td>{data.bill.staff.name}</td>
											<td>{#if userDepartment === 'Ekonomi PWP'}

												<form method="POST" action="?/delete_payment">
												<input name="id" type="hidden" value={pay.id} />
													<button
														class="flex-none btn btn-outline btn-warning font-bold btn-xs btn-white"
													>
														Hapus</button
													>
												</form>
													<button
														class="flex-none btn btn-outline btn-secondary font-bold btn-xs btn-white mt-2"
														on:click={() => editPaymentHandler(pay)}
													>
														Edit</button
													>
												{/if}</td>
										</tr>
									{/each}
								</tbody>
								<tfoot class="text-slate-100">
									<tr>
										<td>Sisa</td>
										<td>{currencyToString(kreditCheck())}</td>
										<td />
										<td />
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				{/if}
				{#if data.bill.status === 'Aktif'}
				<div class="grow bg-blue-100 rounded p-2">
					<h2 class="font-['Helvetica Neue'] font-black text-lg text-primary mt-2">
						KONFIRMASI PEMBAYARAN
					</h2>
					<p>Silahkan mengisi informasi pembayaran melalui form dibawah:</p>
					<form
						class="flex flex-col gap-3 overflow-y-scroll w-full"
						method="POST"
						action="?/set_payment"
					>
						<div class="flex gap-3">
							<div class="w-1/2">
								<label class="label font-bold w-fit" for="fdateevent"
									>Tanggal Pembayaran<span class="text-red-500">*</span></label
								>
								<input
									class="input input-bordered w-full bg-slate-100"
									type="date"
									id="fdateevent"
									name="date"
									bind:value={date}
								/>
							</div>
							<div class="w-1/2">
								<label class="label font-bold w-fit" for="fplaceevent"
									>Jumlah Pembayaran<span class="text-red-500">*</span></label
								>
								<input
									class="input input-bordered w-full bg-slate-100"
									type="text"
									id="fplaceevent"
									name="total"
									bind:value={paymentValue}
								/>
							</div>
						</div>
						<div class="card-actions justify-end">
							{#if errorMessage.show}
								<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
							{/if}
							<button class="btn btn-sm" on:click={cancelHandler}> Batal </button>
							<button class="btn btn-primary btn-sm" type="submit">Simpan </button>
						</div>
					</form>
				</div>
				{/if}
			</div>
		{/if}
	</div>
	<div class="overflow-y-scroll max-h-[46rem] w-full mt-2">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>Tanggal </th>
					<th>Bagian</th>
					<!-- <th>KEPERLUAN</th> -->
					<th>JUMLAH SEBELUM PAJAK</th>
					<th />
				</tr>
			</thead>
			<tbody class="text-slate-300">
				<!-- row -->
					{#each bill.fd_event as event}
						<tr class="text-center" on:click={() => fetch('main/events/detail')}>
							<td> {number3DigitFormat(event.id)} </td>
							<td> {formatDate(event.event_date)} </td>
							<td> {event.department}</td>
							<!-- <td> {event.purpose} </td> -->
							<td>{currencyToString(event.total_price)}</td>
							<td>
								<button
									class="flex-none btn btn-outline font-bold btn-xs btn-white"
									on:click={() => goto('/main/fd-events/' + event.id + '/detail')}
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


<dialog bind:this={dialogEditPayment} class="bg-slate-50 text-slate-700 rounded">
	<h2 class="font-bold text-l flex-none text-primary">Edit Pembayaran</h2>
	<form
		class="mt-3 text-slate-700"
		method="POST"
		action="?/edit_payment"
	>
		<label class="label text-sm w-fit" for="fdatepayment"
			>Tanggal Pembayaran<span class="text-red-500">*</span></label
		>
		<input
			class="input input-bordered w-full bg-slate-100"
			type="date"
			id="fdatepayment"
			name="vendor"
			bind:value={editPayment.date}
		/>
		<label class="label text-sm w-fit" for="fpengeluaran"
			>Total<span class="text-red-500">*</span></label
		>
		<input
			class="input input-bordered w-full bg-slate-100 mb-3"
			type="text"
			id="fpengeluaran"
			name="total"
			bind:value={editPayment.total}
		/>
		<input name="id" type="hidden" value={editPayment.id} />
		<button class="btn btn-primary btn-sm mt-3"> Edit </button>
		<button class="btn btn-sm" on:click|preventDefault={dialogEditPayment.close()}> Batal </button>
		{#if errorMessage.show}
			<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
		{/if}
	</form>
</dialog>