<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDate, number3DigitFormat } from '$lib/Functions';
	import { userId } from '$lib/dPegawai';
	import type { PageData } from './$types';
	import Reciperetail from './[id]/detail/+page.svelte';

	export let data: PageData;
	$: ({ recipes } = data);

	let userDepartment = data.user.staff.department;
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black my-2 flex">
		<h1>DAFTAR RESEP</h1>
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
											on:click={() => goto('./recipe/'+recipe.id+'/detail')}
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
						{/each}
					</tbody>
				</table>
			
		<!-- </div>
		<div class="grow bg-blue-200 rounded overflow-y-scroll mt-2 max-h-[28rem]">
			<Reciperetail/>
		</div> -->
	</div>
</main>
