<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDate, number3DigitFormat } from '$lib/Functions';
	import { userId } from '$lib/dPegawai';
	import type { PageData } from './$types';
	import Reciperetail from './[id]/detail/+page.svelte';

	export let data: PageData;
	$: ({ recipes } = data);

	$: searchedName = '';

	let userDepartment = data.user.staff.department;
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black my-2 flex">
		<h1 class="flex gap-2">
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
					d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
				/>
			</svg>DAFTAR RESEP
		</h1>
		<div class="flex-grow" />
		{#if userDepartment === 'Dining Room'}
			<button
				class="btn btn-outline font-bold btn-sm btn-primary"
				on:click={() => goto('./recipe/add')}>+ Resep</button
			>
		{/if}
	</div>
	<!-- <div class="flex gap-5 max-h-full"> -->
	<div class="overflow-y-scroll mt-2">
		<input
			bind:value={searchedName}
			type="text"
			placeholder="Cari Nama Resep"
			class="input input-bordered input-primary w-full max-w-xs input-sm bg-slate-50 text-slate-700 my-2 ml-2"
		/>
		<div class="grow" />
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr>
					<th>Nomor</th>
					<th>Resep</th>
					<th />
					<th class="text-right">Updated At</th>
					<th />
					<!-- {#if username2 == '4'}
						<th />
					{/if} -->
				</tr>
			</thead>
			<tbody class="text-slate-200">
				<!-- row -->
				{#each recipes as recipe}
				{#if recipe.name.toLowerCase().includes(searchedName.toLowerCase())}
					<!-- {#each Array(50) as _} -->
					<tr>
						<td class="text-left"> {number3DigitFormat(recipe.id)} </td>
						<td class="text-left font-semibold">{recipe.name}</td>
						<td class="text-left" />
						<td class="text-right"
							>{recipe.updated_at
								? formatDate(recipe.updated_at)
								: formatDate(recipe.created_at)}</td
						>
						<td class="text-right">
							<button
								class="flex-none btn btn-outline font-bold btn-xs btn-white"
								on:click={() => goto('./recipe/' + recipe.id + '/detail')}
							>
								!</button
							>
						</td>
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
					<!-- {/each} -->
					{/if}
				{/each}
			</tbody>
		</table>

		<!-- </div>
		<div class="grow bg-blue-200 rounded overflow-y-scroll mt-2 max-h-[28rem]">
			<Reciperetail/>
		</div> -->
	</div>
</main>
