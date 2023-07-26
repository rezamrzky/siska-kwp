import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/prisma";
import { fail } from "@sveltejs/kit";
import type { staff } from "@prisma/client";

let user: { staff: staff; } | null;

export const load: PageServerLoad = async ({cookies, params}) => {
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

    const event = await prisma.fd_event.findFirst({
        where:{
            id: +params.id
        }
    })

    return {event: JSON.parse(JSON.stringify(event))}
};

export const actions: Actions = {
    add:async ({request, params}) => {
        const formData = await request.formData()

        const event_date = new Date(String(formData.get('event_date')));
        const temp_time = String(formData.get('event_time'));
        const department = String(formData.get('department'));
        const event_place = String(formData.get('event_place'));
        const total_pax = String(formData.get('total_pax'));

        const [ hours, minutes] = temp_time.split(':');
        event_date.setHours(Number(hours));
        event_date.setMinutes(Number(minutes));
        console.log('event_date: '+event_date)


        try {
            await prisma.fd_event.update({
                where:{
                    id: +params.id
                },
                data:{
                    event_date, event_place, department, total_pax,
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