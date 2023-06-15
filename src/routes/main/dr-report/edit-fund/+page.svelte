<script lang="ts">
	
</script>

<main>
	<section class="place-content-center w-full h-screen drop-shadow-2xl rounded p-5 text-slate-700">
		<div class="w-full h-full bg-slate-100 rounded p-5">
			<h2 class="font-['Helvetica Neue'] font-black text-2xl text-primary">EDIT MODAL DINING ROOM</h2>
			<p>Silahkan mengisi form dibawah:</p>
			<form class="overflow-y-scroll">
                <label class="label font-bold" for="fdateevent">Tanggal</label>
				<input class="input input-bordered w-full bg-slate-100" type="date" id="fdateevent" />
                <label class="label font-bold" for="fplaceevent">Jumlah Modal</label>
				<input class="input input-bordered w-full bg-slate-100" type="text" id="fplaceevent" />
			</form>
			<div class="card-actions justify-end p-3">
                <button class="btn btn-warning btn-outline">
					<a href="/main/event">HAPUS</a>
				</button>
                <div class="grow" />
				<button class="btn">
					<a href="/main/event">Batal</a>
				</button>
				<button class="btn btn-primary">
					<a href="/main/event">Simpan</a>
				</button>
			</div>
		</div>
	</section>
</main>
