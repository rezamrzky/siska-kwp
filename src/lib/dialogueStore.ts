import { writable } from "svelte/store";

export const dialogueOpen = writable(false);
export const messageOpen = writable(false);
export const dialogueValue = writable();