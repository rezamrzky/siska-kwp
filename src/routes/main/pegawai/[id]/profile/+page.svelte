<script lang="ts">
	import { goto } from '$app/navigation';
	import { dPegawai, updateDPegawai, addDPegawai, dropDPegawai } from '$lib/dPegawai';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import type { PageData, SubmitFunction } from './$types';
	import { formatDate, currencyToString } from '$lib/Functions';
	import { enhance } from '$app/forms';

	export let data: PageData;
	$: ({ staff: data });

	const deleteHandler: SubmitFunction = async ({ cancel }) => {
		// setDialogue('Hapus Pegawai', 'Apakah Anda Yakin Menghapus Pegawai?');
		// dialogueOpen.set(true);
		// const timeIn = async () => {setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 				cancel();
		// 			}
		// 		}
		// 	}
		// }, 200)};

		// let dialogueVal: boolean;
		// dialogueVal = await testDialogue('Hapus Pegawai', 'Apakah Anda Yakin Menghapus Pegawai?');

		// if (dialogueVal) {
		return async ({ result }) => {
			if (result.type == 'success') {
				goto('../');
				showMessage('Pegawai Berhasil Dihapus!');
			}
		};
		// } else {
		// 	console.log('dialog batal cancel');
		// 	cancel()
		// }
	};

	function editHandler() {
		goto('./edit');
	}

	function formatStatus(status: boolean): string {
		if (status) {
			return 'Menikah';
		}
		return 'Tidak Menikah';
	}

	function formatChildren(child: number): string {
		if (child === 3) {
			return '3 atau lebih';
		}
		return child.toString();
	}
</script>

<main class="h-screen w-full p-5">
	<section class="p-5 bg-slate-50 rounded">
		<div class="font-['Helvetica Neue] text-2xl w-full flex text-primary font-black p-3">
			<h1 class="grow flex gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" class="w-8 h-8 rounded-full bg-primary text-slate-50 p-1"
					><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
					<path
					fill='white'
						d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"
					/></svg
				>PROFIL KARYAWAN
			</h1>
			<button
				class="btn btn-error btn-outline btn-xs flex-none"
				on:click={() => goto('/main/pegawai')}
			>
				&#8592;kembali
			</button>
		</div>
		<div class="flex flex-row-reverse rounded shadow-lg p-5 bg-slate-100 w-3/5">
			<div class="flex flex-col">
				<div class="avatar w-40 h-40 my-auto">
					<img
						src="https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"
						class="rounded-full"
					/>
				</div>
				<button class="btn btn-xs btn-outline btn-primary" on:click={editHandler}> EDIT </button>
				<div class="h-2" />
				<form class="w-full" action="?/delete" method="POST" use:enhance={deleteHandler}>
					<button class="w-full btn btn-xs btn-outline btn-error" type="submit"> HAPUS</button>
				</form>
			</div>
			<div class="grow flex gap-5">
				<div class="align-middle font-light text-slate-700">
					<p>Nama</p>
					<p>Bagian</p>
					<p>Jabatan</p>
					<p>Tanggal Bergabung</p>
					<p>Alamat</p>
					<p>Nomor Telepon</p>
					<p>E-mail</p>
					<p>Tempat Kelahiran</p>
					<p>Tanggal Lahir</p>
					<p>Status</p>
					<p>Anak</p>
					<p>Nomor BPJS</p>
					<p>NPWP</p>
					<p>Gaji</p>
				</div>
				<div class="font-semibold text-slate-700">
					<p>{data.staff.name}</p>
					<p>{data.staff.department}</p>
					<p>{data.staff.position}</p>
					<p>{formatDate(data.staff.join_date)}</p>
					<p>{data.staff.address}</p>
					<p>{data.staff.phone_numb}</p>
					<p>{data.staff.email}</p>
					<p>{data.staff.birth_place}</p>
					<p>{formatDate(data.staff.birth_date)}</p>
					<p>{formatStatus(data.staff.is_married)}</p>
					<p>{formatChildren(data.staff.have_children)}</p>
					<p>{data.staff.bpjs_id}</p>
					<p>{data.staff.npwp}</p>
					<p>{currencyToString(data.staff.salary)}</p>
				</div>
			</div>
		</div>
	</section>
</main>
