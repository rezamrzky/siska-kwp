import type { fd_event } from "@prisma/client";
import type { PageServerLoad } from "./$types"
import { foodNDrinkNotif } from "$lib/Notifikasi";

export const load: PageServerLoad = async ({ cookies }) => {
  // console.log(cookies.getAll())
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

  const events = await prisma.fd_event.findMany({
    orderBy:{
      id: 'desc',
    },
    include:{
      staff: true,
      fd_event_payment: true,
    }
  })

  // notif(JSON.parse(JSON.stringify(user)), JSON.parse(JSON.stringify(events)));

  return { user: JSON.parse(JSON.stringify(user)), events: JSON.parse(JSON.stringify(events)) }
};

// function notif(user: any, events: any){
//   switch(user.staff.department){
//     case 'Food & Drink': {
//       const filteredEvent = events.filter((event: {status: string}) => event.status==='Pembayaran');
//       const eventCount = filteredEvent.length()
//       foodNDrinkNotif.set(eventCount);
//       break;
//     }
//     case 'Ekonomi PWP': {
//       const filteredEvent = events.filter((event: {status: string}) => event.status==='Pemesanan');
//       const eventCount = filteredEvent.length
//       foodNDrinkNotif.set(eventCount);
//       break;
//     }
//   }
// }