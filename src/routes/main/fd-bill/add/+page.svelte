<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { goto } from '$app/navigation';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { currencyToString, formatDate, formatDateYMD, number3DigitFormat } from '$lib/Functions';
	import { showMessage } from '$lib/Message.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ events } = data);
	$: filteredEvents = events;

	$: totalBeforeTax = 0;
	$: searchedName = '';

	navigationBlocked.set(true);
	const today = new Date();

	let errorMessage = {
		show: false,
		message: ''
	};
	let listChecked: Array<number> = [];
	var date: string = '';
	var desc = '';

	const sortSymbol = ['\u{2193}', '\u{2191}', '\u{2195}'];

	let headSymbol = { id: sortSymbol[1], event_date: sortSymbol[2] };
	let sortBy = { col: 'id', ascending: false };

	$: sort = (column: string) => {
		if (sortBy.col == column) {
			sortBy.ascending = !sortBy.ascending;
			if (sortBy.ascending) {
				headSymbol[column as keyof typeof headSymbol] = sortSymbol[0];
			} else {
				headSymbol[column as keyof typeof headSymbol] = sortSymbol[1];
			}
		} else {
			const prevCol = sortBy.col;
			sortBy.col = column;
			sortBy.ascending = true;
			headSymbol[column as keyof typeof headSymbol] = sortSymbol[0];
			headSymbol[prevCol as keyof typeof headSymbol] = sortSymbol[2];
		}

		// Modifier to sorting function for ascending or descending
		let sortModifier = sortBy.ascending ? 1 : -1;

		let sort = (a: any, b: any) =>
			a[column] < b[column] ? -1 * sortModifier : a[column] > b[column] ? 1 * sortModifier : 0;

		events = events.sort(sort);
	};

	$: finishDateDisabled = true;

	let searchedDate = '',
		finishDate = '';

	function searchHandle() {
		if (finishDateDisabled && searchedDate !== '' && searchedDate !== undefined) {
			filteredEvents = events.filter(
				(event: { event_date: Date }) => formatDate(event.event_date) === formatDate(searchedDate)
			);
		} else if (
			searchedDate !== '' &&
			finishDate !== '' &&
			searchedDate !== undefined &&
			finishDate !== undefined
		) {
			filteredEvents = events.filter((event: { event_date: Date }) => {
				const event_date = new Date(event.event_date);
				const finishDateDate = new Date(finishDate);
				finishDateDate.setHours(23);
				finishDateDate.setMinutes(59);
				finishDateDate.setSeconds(59);
				const searchedDateDate = new Date(searchedDate);
				return event_date >= searchedDateDate && event_date <= finishDateDate;
			});
		} else {
			filteredEvents = events;
		}
	}

	const submitHandler: SubmitFunction = ({ cancel }) => {
		errorMessage.show = false;

		if (date === '' || desc === '' || listChecked.length < 1) {
			cancel();
			errorMessage.show = true;
			errorMessage.message = 'Terdapat form yang belum diisi!';
		}

		return async ({ result }) => {
			if (result.type === 'success') {
				goto('../fd-bill');
				showMessage('Tagihan Berhasil Ditambahkan!');
				navigationBlocked.set(false);
			} 
		};
		// else {
		// setDialogue('Tambah Tagihan?', 'Apakah Anda Yakin menambahkan tagihan?');
		// dialogueOpen.set(true);
		// let timeIn = setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
		// 				goto('../fd-bill');
		// 				showMessage('Tagihan Berhasil Ditambahkan!');
		// 			}
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 			}
		// 		}
		// 	}
		// }, 200);
		// }
	};

	function cancelHandler() {
		setDialogue('Batal Tambah Tagihan?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../fd-bill');
						navigationBlocked.set(false);
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
	}

	function afterTax(before: number): number {
		const ppn11 = before * 0.11;
		const pph23 = before * 0.02;
		const result = ppn11 + pph23 + +before;
		return result;
	}

	function onChecked(index: number, total: number) {
		if (listChecked.length > 0) {
			if (listChecked.includes(index)) {
				let id = listChecked.indexOf(index);
				listChecked.splice(id, 1);
				totalBeforeTax -= +total;
			} else {
				listChecked.push(index);
				totalBeforeTax += +total;
			}
		} else {
			listChecked.push(index);
			totalBeforeTax += +total;
		}
		console.log(listChecked);
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5 ml-2">
	<div>
		<h1 class="font-['Helvetica Neue] w-full text-2xl text-primary font-black">TAMBAH TAGIHAN</h1>
		<p class="text-slate-700">Silahkan mengisi informasi pegawai melalui form dibawah:</p>
	</div>
	<form method="POST" use:enhance={submitHandler} action="?/add">
		<div class="w-full rounded bg-blue-200 p-3 text-slate-700">
			<div class="text-slate-700 text-center">
				<div class="flex gap-2">
					<div>
						<label class="label font-bold w-fit" for="fdateevent"
							>Tanggal Tagihan<span class="text-red-500">*</span></label
						>
						<input
							class="input input-bordered w-full bg-slate-100 input-sm"
							type="date"
							id="fdateevent"
							min={formatDateYMD(today)}
							name="due_date"
							bind:value={date}
						/>
					</div>
					<div class="grow">
						<label class="label font-bold w-fit" for="fplaceevent"
							>Uraian<span class="text-red-500">*</span></label
						>
						<input
							class="input input-bordered w-full bg-slate-100 input-sm"
							type="text"
							id="fplaceevent"
							name="note"
							bind:value={desc}
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="w-full mt-2">
			<div class="flex mb-3 ml-3 items-end">
				<input
					bind:value={searchedName}
					type="text"
					placeholder="Cari Bagian"
					class="input input-bordered input-primary w-full max-w-xs input-sm bg-slate-50 text-slate-700"
				/>
				<div class="grow" />
				<div class="flex gap-2">
					<div>
						<div class="label-text py-1 text-xs text-slate-500">Pilih Tanggal</div>
						<input
							bind:value={searchedDate}
							type="date"
							class="input input-bordered input-primary max-w-xs input-sm bg-slate-50 text-slate-700"
							on:input={searchHandle}
						/>
					</div>
					<div>
						<div class="form-control w-fit">
							<label class="label cursor-pointer h-fit py-0">
								<input
									type="checkbox"
									class="checkbox checkbox-xs border-slate-500"
									on:change={() => {
										finishDateDisabled = !finishDateDisabled;
										finishDate = '';
										searchHandle();
									}}
								/>
								<span class="label-text text-xs pl-2 text-slate-500 py-1">Sampai Tanggal</span>
							</label>
						</div>
						<input
							bind:value={finishDate}
							type="date"
							class="input input-bordered input-primary max-w-xs input-sm bg-slate-50 text-slate-700"
							disabled={finishDateDisabled}
							on:input={searchHandle}
						/>
					</div>
				</div>
			</div>
			<div class="max-h-[28rem] overflow-y-scroll">
				<table class="table w-full table-compact table-zebra">
					<!-- head -->
					<thead class="sticky top-0 text-slate-100">
						<tr class="text-center">
							<th class="bg-primary" />
							<th class="bg-primary" on:click={() => sort('id')}>Nomor {headSymbol.id}</th>
							<th class="bg-primary" on:click={() => sort('event_date')}
								>Tanggal {headSymbol.event_date}
							</th>
							<th class="bg-primary">Bagian</th>
							<th class="bg-primary">SEBELUM PAJAK</th>
							<th class="bg-primary">SETELAH PAJAK (PPN11% + PPh23)</th>
							<!-- <th /> -->
						</tr>
					</thead>
					<tbody class="text-slate-200 z-0">
						<!-- row -->
						{#each filteredEvents as event, i}
							{#if event.department.toLowerCase().includes(searchedName.toLowerCase())}
								<tr
									class="text-center"
									on:change={() => {
										onChecked(i, event.total_price);
									}}
								>
									<td>
										<input
											type="checkbox"
											class="checkbox bg-slate-100"
											checked={listChecked.includes(i)}
											name="checked"
											value={event.id}
										/>
									</td>
									<td> {number3DigitFormat(event.id)} </td>
									<td> {formatDate(event.event_date)} </td>
									<td> {event.department} </td>
									<td>{currencyToString(event.total_price)}</td>
									<td>{currencyToString(afterTax(event.total_price))}</td>
									<!-- <td>
								<button class="flex-none btn btn-outline font-bold btn-xs btn-white">
									detail</button
								>
							</td> -->
								</tr>
							{/if}
						{/each}
					</tbody>
					<tfoot class="sticky bottom-0 text-slate-100">
						<tr class="text-center">
							<th class="bg-primary" />
							<th class="bg-primary" />
							<th class="bg-primary" />
							<th class="bg-primary">total</th>
							<th class="bg-primary">{currencyToString(totalBeforeTax)}</th>
							<th class="bg-primary">{currencyToString(afterTax(totalBeforeTax))}</th>
							<!-- <th /> -->
						</tr>
					</tfoot>
				</table>
			</div>
			<div class="card-actions justify-end p-3">
				{#if errorMessage.show}
					<div class="justify-start text-red-500 italic text-sm">{errorMessage.message}</div>
				{/if}
				<button class="btn" on:click={cancelHandler}>Batal </button>
				<button class="btn btn-primary" type="submit"> Tambah </button>
			</div>
		</div>
	</form>
</main>
