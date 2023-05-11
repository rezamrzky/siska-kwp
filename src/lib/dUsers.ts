import { null_to_empty, set_data_dev } from "svelte/internal";

const dumDate = new Date('2022-02-25');

interface User {
    username: string,
    nama: string,
    bagian: string,
    phone: string,
    active: boolean,
    lastLogin: Date;
};

export const dUser : Array<User> = [
    {'username': 'eko-ridho', 'nama': 'Ridho Nama Panjang', 'bagian': '3', 'phone': '08123456789', 'active': true, 'lastLogin': dumDate},
    {'username': 'adm-salsa', 'nama': 'Salsa Nama Panjang', 'bagian': '2', 'phone': '08123456789', 'active': true, 'lastLogin': dumDate},
    {'username': 'dr-siti','nama': 'Siti Nama Panjang' , 'bagian': '4', 'phone': '08123456789', 'active': true, 'lastLogin': new Date('')},
    {'username': 'man-eng', 'nama': 'Eng Nama Panjang', 'bagian': '1', 'phone': '08123456789', 'active': false, 'lastLogin': dumDate}
];

export function getUserByBagian (bagianId: string){
    return dUser.find(x => x.bagian === bagianId);
}

export function bagianString (bagianId: string){
    switch (bagianId){
        case '1': return 'Manajer';
        case '2': return 'Food & Drink';
        case '3': return 'Ekonomi PWP';
        case '4': return 'Dining Room';
    }
    return '';
}
