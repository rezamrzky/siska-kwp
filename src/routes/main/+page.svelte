<script lang="ts">
	import { currencyToString, formatDate } from "$lib/Functions";
	import type { PageData } from "./$types";

   export let data: PageData
   const today = new Date()
</script>

<main class="h-screen w-full bg-slate-50 overflow-y-scroll">
	<section class="p-5 rounded">
		<div class="font-['Helvetica Neue] text-2xl w-full flex text-primary font-black py-3">
			<h1 class="grow flex gap-2">
				HALO {data.user.staff.name}!
			</h1>
            <p>{formatDate(today)}</p>
		</div>
			
			<div class="p-5 my-5 rounded bg-slate-100 flex gap-2 flex-col">
				{#if data.user.staff.department != 'Dining Room'}
				<div class="rounded w-full bg-blue-200 p-3 mb-2">
					<div class="flex">
						<h2 class="font-bold text-l flex-none text-slate-700">FOOD & DRINK</h2>
					</div>
					<!-- <div class="flex"> -->
					<div class="grow flex gap-2">
						<div class="stats shadow">
  
                            <div class="stat place-items-center">
                              <div class="stat-title">Pesanan Aktif</div>
                              <div class="stat-value">{data.fd.active}</div>
                            </div>
                            
                            <div class="stat place-items-center">
                              <div class="stat-title">Pemesanan</div>
                              <div class="stat-value">{data.fd.order}</div>
                            </div>
                            
                            <div class="stat place-items-center">
                              <div class="stat-title">Pembayaran</div>
                              <div class="stat-value">{data.fd.payment}</div>
                            </div>
                            </div>

                            {#if data.user.staff.department != 'Food & Drink'}
                            <div class="stats shadow">
  
                                <div class="stat place-items-center">
                                  <div class="stat-title">Tagihan Aktif</div>
                                  <div class="stat-value">{data.fd.bill}</div>
                                </div>
                                
                                <div class="stat place-items-center">
                                  <div class="stat-title">Total Tagihan Sebelum Pajak</div>
                                  <div class="stat-value">{currencyToString(data.fd.totalBill)}</div>
                                </div>
                                
                                </div>
                                {/if}
					</div>

				</div>
                {/if}
                {#if data.user.staff.department != 'Food & Drink'}

				<div class="rounded w-full bg-blue-200 p-3 mb-2">
					<div class="flex">
						<h2 class="font-bold text-l flex-none text-slate-700">DINING ROOM</h2>
					</div>

                    
                    <div class="grow flex gap-2">
                        {#if data.user.staff.department != 'Dining Room'}
                        <div class="stats shadow">
  
                            <div class="stat place-items-center">
                              <div class="stat-title">Saldo Dining Room</div>
                              <div class="stat-value">{currencyToString(data.dr.saldo)}</div>
                            </div>
                            </div>

                    {/if}
						<div class="stats shadow">
  
                            <div class="stat place-items-center">
                              <div class="stat-title">Belanja Aktif</div>
                              <div class="stat-value">{data.dr.active}</div>
                            </div>
                            
                            <div class="stat place-items-center">
                              <div class="stat-title">Persetujuan</div>
                              <div class="stat-value">{data.dr.approval}</div>
                            </div>
                            
                            <div class="stat place-items-center">
                              <div class="stat-title">Pembelian</div>
                              <div class="stat-value">{data.dr.order}</div>
                            </div>

                            <div class="stat place-items-center">
                                <div class="stat-title">Pembayaran</div>
                                <div class="stat-value">{data.dr.payment}</div>
                              </div>
                        </div>
					</div>
					
				</div>

                {/if}

			</div>
	</section>
</main>