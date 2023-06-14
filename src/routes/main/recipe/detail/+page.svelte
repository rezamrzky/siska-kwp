<script lang="ts">
	import { userId } from '$lib/dPegawai';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';

	let username3 = $userId;

	function hapusHandler() {
		setDialogue('Hapus Event?', 'Apakah Anda Yakin Menghapus Event Tersebut?');
		dialogueOpen.set(true);
		let timeIn = setInterval(() => {
			if (!$dialogueOpen) {
				clearInterval(timeIn);
				switch ($dialogueValue) {
					case true: {
						goto('../recipe');
						showMessage('Resep Telah Dihapus!');
					}
					case false: {
						console.log('dialog batal cancel');
					}
				}
			}
		}, 200);
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="flex">
		<div class="font-['Helvetica Neue] w-full text-2xl text-primary mx-2">
			<h1 class="font-black">RESEP NAMA RESEP MAKANAN ENAK</h1>
			<p class="text-sm text-slate-700 font-black align-bottom">Porsi: 999</p>
			<p class="text-sm text-slate-500 align-bottom">diperbarui pada 99/99/9999</p>
		</div>
		{#if username3 === '4'}
			<div class="mt-2 flex w-fit flex-col gap-1">
				<button
					class="btn font-bold btn-sm btn-primary flex-none"
					on:click={() => goto('./edit')}>Edit</button
				>
				<button
					class="btn btn-outline font-bold btn-sm btn-warning flex-none"
					on:click={hapusHandler}
				>
					Hapus</button
				>
			</div>
		{/if}
	</div>
	<div class="overflow-x-auto w-full mt-2">
		<table class="table w-full table-zebra table-compact">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>Bahan Baku</th>
					<th class="text-right">Kuantitas</th>
					<th />
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				{#each Array(50) as _}
					<tr>
						<td class="text-center"> 999 </td>
						<td class="text-center"> Nama Resep </td>
						<td class="text-right">999</td>
						<td class="text-left">satuan</td>
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
</main>
