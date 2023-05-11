interface Pegawai {
    nama: string,
    bagian: string
};
import { writable } from "svelte/store";

export const userId = writable('');


export let dPegawai: Array<Pegawai>;
// eslint-disable-next-line prefer-const
dPegawai = [
    { "nama": "Ridho", "bagian": "Ekonomi" },
    { "nama": "Salsa", "bagian": "Admin" }, 
    {"nama": "Siti", "bagian": "Dapur"},
    {"nama": "Eng", "bagian": "Manajer"}
];

export function updateDPegawai(nName: string, nBagian: string, id: number) {
    dPegawai[id].nama = nName
    dPegawai[id].bagian = nBagian
};

export function addDPegawai(name: string, bagian:string) {
    dPegawai.push({"nama": name, "bagian": bagian})
};

export function dropDPegawai(index: number){
    dPegawai.splice(index, 1)
};

// export function setUserId(id: string){
//     userId = id;
// }