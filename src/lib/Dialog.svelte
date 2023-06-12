<script>
	/**
	 * @type {HTMLDialogElement}
	 */
	 export let dialog
</script>

<dialog bind:this={dialog} on:close class="bg-slate-50 text-slate-700 flex flex-col">
	<slot/>
</dialog>