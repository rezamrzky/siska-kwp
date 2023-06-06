import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/prisma";
import { fail } from "@sveltejs/kit";
import type { staff } from "@prisma/client";

let user: { staff: staff; } | null;

export const load: PageServerLoad = async ({cookies}) => {
    const session = String(cookies.get('session'));

    try {
        user = await prisma.user.findFirst({
            where:{
                authToken: session,
            },
            select: {
                staff: true,
            }
        })
    } catch (error) {
        return fail(500, {message: 'Gagal mengambil data!'})
    }
};

export const actions: Actions = {
    add:async ({request}) => {
        const formData = await request.formData()

        const event_date = new Date(String(formData.get('event_date')));
        const temp_time = String(formData.get('event_time'));
        const department = String(formData.get('department'));
        const event_place = String(formData.get('event_place'));
        const purpose = String(formData.get('purpose'));
        const vendor = String(formData.get('vendor'));
        const total_pax = String(formData.get('total_pax'));
        const tempTotalPrice = String(formData.get('total_price'));
        const total_price = parseFloat(tempTotalPrice);
        const status = 'Pemesanan';
        const staff_id = user!.staff.id;
        const created_at = new Date();

        const [ hours, minutes] = temp_time.split(':');
        event_date.setHours(Number(hours));
        event_date.setMinutes(Number(minutes));
        // const event_time = date.toLocaleTimeString('id-ID', {hour12: false});
        console.log('event_date: '+event_date)


        try {
            await prisma.fd_event.create({
                data:{
                    event_date, event_place, department, purpose, vendor, total_pax, total_price, status, staff_id, created_at
                }
            })
            
        } catch (error) {
            console.log(String(error));
            return fail(500, {message: 'Gagal menambahkan event!'})
        }

        return {
            type: 'success'
        }

    }
} satisfies Actions;