<script lang="ts">
	import { userId } from '$lib/dPegawai';
	import { dialogueOpen, dialogueValue } from '$lib/dialogueStore';
	import { setDialogue } from '$lib/Dialogue.svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

    export let data: PageData;

	let userDepartment = data.user.staff.department, persetujuan = true, persetujuanState = 'Setujui';

	$: allchecked = false;

	let listMonth = [[false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false], [false, false, false, false],]

	$: disabled = persetujuan;

	function persetujuanHandler(){

		if(persetujuanState == 'Setujui'){
			persetujuan = false;
			persetujuanState = 'Simpan'
		} else if ( persetujuanState == 'Simpan' ){
			setDialogue('Simpan Persetujuan Menu?', 'Apakah Anda yakin akan menyimpan persetujuan menu?');
			dialogueOpen.set(true);

			const interval = setInterval(() => {
				if ($dialogueOpen == false){
					console.log('dialogueValue: '+$dialogueValue);
					clearInterval(interval)
				}
			}, 250)

			persetujuanState = 'Setujui';
			persetujuan = true;
		}
		
	}

	function setRow(index: number){
		listMonth[index][0] = listMonth[index][3];
		listMonth[index][1] = listMonth[index][3];
		listMonth[index][2] = listMonth[index][3];
	}

	function setAll(){
		for(var i = listMonth.length; i>=0; i--){
			listMonth[i-1][3] = allchecked;
			setRow(i-1);
		}
	}
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black ml-2">
		<h1>MENU DINING ROOM</h1>
	</div>
	<div class="mt-2 flex w-full">
        <button class="btn btn-outline font-bold btn-sm btn-primary">
            &#8249;</button
        >
        <button class="btn btn-outline font-bold btn-sm btn-primary ml-2">
            Bulan-Tahun</button
        >
        <button class="btn btn-outline font-bold btn-sm btn-primary ml-2">
            &#8250;</button
        >

        <div class="grow"/>
		{#if userDepartment === 'Dining Room'}
			<button class="btn btn-outline font-bold btn-sm btn-primary" on:click={() => {goto('./menu/edit')}}>
				EDIT</button
			>
			<button class="btn btn-outline font-bold btn-sm btn-primary ml-2" on:click={() => {goto('./menu/add')}}>
				+ MENU</button
			>
		{/if}
		{#if userDepartment === 'Manajer'}
		<!-- <button class="btn btn-outline font-bold btn-sm btn-error mr-2">
			<a href="./recipe/add">TOLAK</a></button
		> -->
			<button class="btn font-bold btn-sm btn-primary" on:click={() => persetujuanHandler()}>
				{persetujuanState}</button
			>
		{/if}
	</div>
	<div class="overflow-x-auto w-full mt-2">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead  class="sticky top-0 text-slate-100">
				<tr>
					{#if userDepartment === '1'}
                    <th><input type="checkbox" class="checkbox" {disabled} bind:checked={allchecked} on:change={() => setAll()}/></th>
                    {/if}
					<th>Tanggal</th>
                    <th/>
					<th >PAGI</th>
                    <th/>
					<th>SIANG</th>
                    <th/>
					<th>MALAM</th>
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				{#each listMonth as monthl, i}
				<tr>
					{#if userDepartment === 'Manajer'}
                    <td>
                        <input type="checkbox" class="checkbox" {disabled} bind:checked={listMonth[i][3]} on:change={() => setRow(i)}/>
                    </td>
                    {/if}
					<td>99/99</td>
                    <td>
                        <input type="checkbox" class="checkbox" {disabled} bind:checked={listMonth[i][0]}/>
                    </td>
					<td>
						<p>RESEP 1</p>
						<p>RESEP 2</p>
						<p>RESEP 3</p>
						<p>RESEP 4</p>
						<p>RESEP 5</p>
					</td>
                    <td>
                        <input type="checkbox" class="checkbox" {disabled} bind:checked={listMonth[i][1]}/>
                    </td>
					<td>
						<p>RESEP 1</p>
						<p>RESEP 2</p>
						<p>RESEP 3</p>
						<p>RESEP 4</p>
						<p>RESEP 5</p>
					</td>
                    <td>
                        <input type="checkbox" class="checkbox" {disabled} bind:checked={listMonth[i][2]}/>
                    </td>
					<td>
						<p>RESEP 1</p>
						<p>RESEP 2</p>
						<p>RESEP 3</p>
						<p>RESEP 4</p>
						<p>RESEP 5</p>
					</td>
				</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
