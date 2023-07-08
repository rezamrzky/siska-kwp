<script lang="ts">
	import { dialogueOpen, dialogueValue, navigationBlocked } from '$lib/dialogueStore';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { goto } from '$app/navigation';
	import { showMessage } from '$lib/Message.svelte';
	import type { PageData } from './$types';
	import { enhance, type SubmitFunction } from '$app/forms';

	navigationBlocked.set(true);

	export let data: PageData;
	$: ({ staffs } = data);

    let errorMessage = {
		show: false,
		message: ''
	};

	function cancelHandler() {
		setDialogue('Batal Tambah Akun?', 'Data yang dimasukkan tidak akan disimpan');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../accounts');
						navigationBlocked.set(false);
						break;
					}
					case false: {
						// console.log('dialog batal cancel');
						break;
					}
				}
			}
		}, 200);
	}

	const submitHandler: SubmitFunction = ({cancel}) => {
		// setDialogue('Tambah Akun Pegawai', 'Apakah Anda yakin akan menambahkan akun pegawai?');
		// dialogueOpen.set(true);
		// let timeIn = setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
		// 				goto('../accounts');
		// 				showMessage('Akun berhasil ditambah!');
		// 				break;
		// 			}
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 				break;
		// 			}
		// 		}
		// 	}
		// }, 200);
        return async ({ result }) => {
			if (
				result.type == 'success'
				// result.status == 201
				) {
				// console.log('Actions Success');
				// console.log(result.status.toString);
				navigationBlocked.set(false);
				goto('../accounts');
				showMessage('Akun Berhasil Ditambahkan!');
			}

			if (result.type == 'failure') {
				errorMessage.show = true;
				errorMessage.message = result.data?.message!;
			}
		};
	}

	$: disabled = true;

	let listChecked: Array<number> = [];

	function onChecked(index: number) {
		if (listChecked.length > 0) {
			if (listChecked.includes(index)) {
				let id = listChecked.indexOf(index);
				listChecked.splice(id, 1);
				if (listChecked.length === 0) {
					disabled = true;
				}
			} else {
				listChecked.push(index);
			}
		} else {
			listChecked.push(index);
			disabled = false;
		}
		// console.log(listChecked);
	}
</script>

<main>
	<section class="place-content-center w-full h-screen drop-shadow-2xl rounded p-5">
		<div class="w-full h-full bg-slate-100 rounded p-5">
			<h2 class="font-['Helvetica Neue'] font-black text-2xl text-primary">
				TAMBAH AKUN SISTEM KATERING KWP
			</h2>
			<p class="text-slate-700">Silahkan pilih pegawai dibawah untuk dibuatkan akun:</p>
			<form method="POST" use:enhance={submitHandler}>
				<div class="w-full h-5/6 overflow-x-auto">
					<table class="table w-full table-compact table-zebra">
						<!-- head -->
						<thead class="sticky top-0 text-slate-100">
							<tr>
								<th>Nama </th>
								<th class="text-center">Bagian</th>
								<th class="text-right" />
							</tr>
						</thead>
						<tbody class="text-slate-200">
							<!-- row -->
							{#each staffs as pegawai, i}
								<tr>
									<td class="font-bold"> {pegawai.name} </td>
									<td class="text-center"
										><div class="font-bold">{pegawai.department}</div>
										<span class="badge badge-primary badge-sm">{pegawai.position}</span>
									</td>
									<td class="text-right">
										<input
											type="checkbox"
											class="checkbox bg-slate-50"
											name="checked"
											on:change={() => {
												onChecked(i);
											}}
											value={pegawai.id}
										/>
									</td>
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
					<button class="btn btn-primary" {disabled}>Buat Akun </button>
				</div>
			</form>
		</div>
	</section>
</main>
