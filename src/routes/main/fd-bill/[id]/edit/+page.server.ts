import type { fd_bill, fd_event } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";

let iBill: (fd_bill & { fd_event: fd_event[]; }) | null;
let iUser, iEvents: any[];
const now = new Date()

export const load: PageServerLoad = async ({ cookies, params: { id } }) => {
    // console.log(cookies.getAll())
    const user = await prisma.user.findFirst({
        where: {
            authToken: cookies.get('session')
        },
        select: {
            username: true,
            status: true,
            staff: {
                select: {
                    id: true,
                    name: true,
                    department: true,
                    position: true,
                    phone_numb: true,
                }
            }
        }
    })

    const bill = await prisma.fd_bill.findFirst({
        where: {
            id: +id,
        },
        include: {
            fd_event: true,
            fd_bill_payment: true,
            staff: true
        }
    })

    iUser = user;
    iBill = bill;

    const events = await prisma.fd_event.findMany({
        where: {
            status: 'Selesai',
            OR: [
                {
                    bill_id: null
                },
                {
                    bill_id: iBill!.id
                }
            ],
        }
    })

    iEvents = events;

    return { user: JSON.parse(JSON.stringify(user)), bill: JSON.parse(JSON.stringify(bill)), events: JSON.parse(JSON.stringify(events)) }
};

export const actions: Actions = {
    edit: async ({ request }) => {
        const formData = await request.formData();
        const now = new Date()

        const temp_date = String(formData.get("due_date"));
        const date = new Date(temp_date);
        const note = String(formData.get("note"));
        const str = String(formData.getAll('checked'));
        const eventsIndex = str.split(",");

        console.log(eventsIndex)

        let total_before_tax = 0;

        for (let i = 0; i < eventsIndex.length; i++) {
            console.log(eventsIndex[i])
            const eventId = iEvents.findIndex(event => event.id === +eventsIndex[i]);
            const event = JSON.parse(JSON.stringify(iEvents[eventId]));
            total_before_tax = +event.total_price + total_before_tax;
            const isListed = iBill!.fd_event.filter(event => event.id === +eventsIndex[i]);
            if (!isListed[0]) {
                console.log('Ketemu event baru!' + eventsIndex[i])
                try {
                    await prisma.fd_event.update({
                        where:{
                            id: +eventsIndex[i]
                        },
                        data:{
                            bill_id: iBill!.id
                        }
                    })
                } catch (error) {
                    return fail(500, {mesaage: 'Gagal update event'});
                }
            }
        }

        for (let i = 0; i < iBill!.fd_event.length; i++) {
            const isListed = eventsIndex.findIndex(value => value === String(iBill!.fd_event[i].id));
            if (isListed === -1) {
                console.log('Ketemu event yang dihapus!' + iBill!.fd_event[i].id)
                try {
                    await prisma.fd_event.update({
                        where:{
                            id: iBill!.fd_event[i].id
                        },
                        data:{
                            bill_id: null
                        }
                    })
                } catch (error) {
                    return fail(500, {mesaage: 'Gagal update event'});
                }
            }
        }

        console.log(total_before_tax)

        // console.log('total_btax: '+total_before_tax)
        const ppn = total_before_tax * 0.11;
        const pph = total_before_tax * 0.02;
        const total_after_tax = ppn + pph + total_before_tax;
        // console.log('total_atax: '+total_after_tax)

        try {
         await prisma.fd_bill.update({
            where:{
                id: iBill!.id
            },
            data:{
              date: date,
              note: note,
              total_after_tax: total_after_tax,
              total_before_tax: total_before_tax,
              ppn10: ppn,
              pph23: pph,
            }
          })
        } catch (error) {
          console.log(error)
          return fail(500, {mesaage: 'Gagal membuat tagihan!'});
        }

       
    }
} satisfies Actions;