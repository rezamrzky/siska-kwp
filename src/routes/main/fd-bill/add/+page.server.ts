import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types"
import type { fd_event } from "@prisma/client";

let iUser: { username: string; status: string; staff: { name: string; department: string; position: string; phone_numb: string; id: string; }; } | null;
let iEvents: fd_event[];

export const load: PageServerLoad = async ({cookies}) => {
    const user = await prisma.user.findFirst({
        where: {
          authToken: cookies.get('session')
        },
        select: {
          username: true,
          status: true,
          staff: {
            select:{
              id: true,
              name: true,
              department: true,
              position: true,
              phone_numb: true,
            }
          }
        }
      })

      iUser = user;

      const events = await prisma.fd_event.findMany({
        where:{
            status: 'Selesai',
            bill_id: null,
        }
      })

      iEvents = events;
    
      return { user: JSON.parse(JSON.stringify(user)), events: JSON.parse(JSON.stringify(events)) }
};

export const actions: Actions = {
  add:async ({request}) => {
    const formData = await request.formData();
    const now = new Date()

    const temp_date = String(formData.get("due_date"));
    const date = new Date(temp_date);
    const note = String(formData.get("note"));
    const str = String(formData.getAll('checked'));
    const eventsIndex = str.split(",");

    let total_before_tax = 0;

    for(let i = 0; i<eventsIndex.length; i++){
      const eventId = iEvents.findIndex(event => event.id === +eventsIndex[i]);
      const event = JSON.parse(JSON.stringify(iEvents[eventId])); 
      total_before_tax = +event.total_price + total_before_tax;
    }

    // console.log('total_btax: '+total_before_tax)
    const ppn = total_before_tax * 0.11;
    const pph = total_before_tax * 0.02;
    const total_after_tax = ppn + pph + total_before_tax;
    // console.log('total_atax: '+total_after_tax)

    let bill;

    try {
     bill = await prisma.fd_bill.create({
        data:{
          date: date,
          note: note,
          total_after_tax: total_after_tax,
          total_before_tax: total_before_tax,
          ppn10: ppn,
          pph23: pph,
          status: 'Aktif',
          created_by: iUser!.staff.id,
          created_at: now,
        }
      })
    } catch (error) {
      console.log(error)
      return fail(500, {mesaage: 'Gagal membuat tagihan!'});
    }

    for(let i = 0; i<eventsIndex.length; i++){
      const eventId = +eventsIndex[i];

      try {
        await prisma.fd_event.update({
          where:{
            id: eventId
          },
          data: {
            bill_id: bill.id
          }
        })
      } catch (error) {
      console.log(error)
        return fail(500, {mesaage: 'Gagal update event!'});
      }
    }
    return{type: 'success'}
  }
} satisfies Actions;