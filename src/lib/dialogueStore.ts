import { writable, type Writable } from "svelte/store";

export const dialogueOpen = writable(false);
export const messageOpen = writable(false);
export const dialogueValue: Writable<boolean> = writable();

export const showDialog = writable(false);

export const navigationBlocked = writable(false);

// export function testDialog(dTitle: string, dDesc: string): boolean {
//     dialogueOpen.set(true);
// 		const timeIn = setInterval(() => {
// 			if (!dialogueOpen) {
// 				clearInterval(timeIn);
// 				if(!dialogueValue) {
// 						console.log('dialog batal cancel');
// 						return false;
// 				}
// 			}
// 		}, 200);

//         return true;
// }