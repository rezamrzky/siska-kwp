<script lang="ts">
	import { userId } from '$lib/dPegawai';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { showMessage } from '$lib/Message.svelte';
	import { goto } from '$app/navigation';
	import type { PageData, SubmitFunction } from './$types';
	import { formatDate, number3DigitFormat } from '$lib/Functions';
	import { enhance } from '$app/forms';

	export let data: PageData;
	$: ({ingredients} = data)
	$:({recipe}=data)

	let userDepartment = data.user.staff.department;

	const hapusHandler: SubmitFunction = () => {
		// setDialogue('Hapus Event?', 'Apakah Anda Yakin Menghapus Event Tersebut?');
		// dialogueOpen.set(true);
		// let timeIn = setInterval(() => {
		// 	if (!$dialogueOpen) {
		// 		clearInterval(timeIn);
		// 		switch ($dialogueValue) {
		// 			case true: {
						goto('../');
						showMessage('Resep Telah Dihapus!');
		// 			}
		// 			case false: {
		// 				console.log('dialog batal cancel');
		// 			}
		// 		}
		// 	}
		// }, 200);
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="flex">
		<div class="font-['Helvetica Neue] w-full text-2xl text-primary mx-2">
			<h1 class="font-black uppercase">RESEP {recipe.name.toUpperCase()}</h1>
			<p class="text-sm text-slate-700 font-black align-bottom">Porsi: {recipe.portion}</p>
			<p class="text-sm text-slate-500 align-bottom">diperbarui pada {recipe.updated_at?formatDate(recipe.updated_at):formatDate(recipe.created_at)}</p>
		</div>
		{#if userDepartment === 'Dining Room'}
			<div class="mt-2 flex w-fit flex-col gap-1">
				<button
					class="btn font-bold btn-sm btn-primary flex-none"
					on:click={() => goto('./edit')}>Edit</button
				>
				<form method="POST" action="?/delete" use:enhance={hapusHandler}>
				<button
					class="btn btn-outline font-bold btn-sm btn-warning flex-none"
				>
					Hapus</button
				>
			</form>
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
			<tbody class="text-slate-200">
				<!-- row -->
				{#each ingredients as ingredient}
					<tr>
						<td class="text-center"> {number3DigitFormat(ingredient.ingredient_id)} </td>
						<td class="text-center"> {ingredient.dr_ingredient.name} </td>
						<td class="text-right">{ingredient.quantity}</td>
						<td class="text-left">{ingredient.dr_ingredient.unit}</td>
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
