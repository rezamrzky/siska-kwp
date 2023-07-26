<script lang="ts">
	import { formatDate, number3DigitFormat } from "$lib/Functions";
	import { each } from "svelte/internal";
	import type { PageData } from "./$types";

	
    export let data: PageData;
    $:({stocks} = data)
</script>

<main class="mx-auto h-screen flex flex-col bg-slate-100 p-5">
	<div class="font-['Helvetica Neue] w-full text-2xl text-primary font-black">
		<h1>STOK LOG</h1>
	</div>
	
	<div class="overflow-x-auto w-full mt-3">
		<table class="table table-compact w-full table-zebra">
			<!-- head -->
			<thead class="sticky top-0 text-slate-100">
				<tr class="text-center">
					<th>Nomor</th>
					<th>Bahan Baku</th>
					<th>Produk</th>
					<th class="text-right">Kuantitas</th>
					<th />
					<th>Tanggal</th>
					<th>Transaksi</th>
				</tr>
			</thead>
			<tbody class="text-slate-200">
				<!-- row -->
				{#each stocks as stock}
                <!-- {#each Array(100) as _} -->
				<tr class="bg-slate-100">
					<td class="text-center">{number3DigitFormat(stock.id)}</td>
					<td class="text-center">{stock.dr_ingredient.name}</td>
					<td class="text-center"><b>{stock.dr_ingredient_product.brand}</b>, {stock.dr_ingredient_product.quantity} {stock.dr_ingredient.unit}</td>
					<td class="text-right">{stock.quantity}</td>
					<td class="text-left">{stock.dr_ingredient_product.product_unit}</td>
					<td class="text-center">{formatDate(stock.date)}</td>
                    {#if stock.action === 1}
					<td class="text-center text-success font-semibold"> Masuk</td>
                    {:else if stock.action === -1}
                    <td class="text-center text-warning font-semibold"> Keluar</td>
                    {/if}
				</tr>
                <!-- {/each} -->
				{/each}
			</tbody>
		</table>
	</div>
</main>
