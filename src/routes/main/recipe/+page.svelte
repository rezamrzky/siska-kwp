<script lang="ts">
	import { goto } from '$app/navigation';
	import { userId } from '$lib/dPegawai';
	
	let username1 = $userId;
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black my-2 flex">
		<h1>DAFTAR RESEP</h1>
		<div class="flex-grow"/>
		{#if username1 === '4'}
			<button class="btn btn-outline font-bold btn-sm btn-primary" on:click={() => goto('./recipe/add')}>+ Resep</button
			>
                {/if}
	</div>
	<div class="overflow-x-auto w-full mt-2">
		<table class="table w-full table-compact table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr>
					<th>Nomor</th>
					<th>Resep</th>
					<th />
					<th class="text-right">Updated At</th>
                    <th/>
					<!-- {#if username2 == '4'}
						<th />
					{/if} -->
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				{#each Array(50) as _}
				<tr>
					<td class="text-left"> 999 </td>
					<td class="text-left"> Nama Resep </td>
					<td class="text-left"> </td>
					<td class="text-right">99/99/9999</td>
                    <td class="text-right">
                        <button class="flex-none btn btn-outline font-bold btn-xs btn-white" on:click={() => goto('./recipe/detail')}>
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
				{/each}
			</tbody>
		</table>
	</div>
</main>
