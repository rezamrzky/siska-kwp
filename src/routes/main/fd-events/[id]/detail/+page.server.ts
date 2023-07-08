import { minio } from "$lib/minio";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types"
import type { fd_event, staff, user, fd_event_payment } from "@prisma/client";
import { number3DigitFormat } from "$lib/Functions";
import { imgSrc } from "$lib/dialogueStore";

let user: { username: string; status: string; staff: { name: string; department: string; position: string; phone_numb: string; id: string; }; } | null;
let event: (fd_event & { staff: staff; }) | null;
const today = new Date();
let payment: fd_event_payment | null;

export const load: PageServerLoad = async ({ cookies, params: { id } }) => {
  console.log('params: '+id)
  // console.log(cookies.getAll())
  user = await prisma.user.findFirst({
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
  console.log('user name: '+user?.username)
  event = await prisma.fd_event.findFirst({
    where: {
      id: Number(id)
    },
    include: {
      staff: true,
    }
  })
  console.log('event: '+event?.id)
  console.log('event.payment_id: '+event?.payment_id)
  const payment_id = (event!.payment_id !== null) ? event!.payment_id : undefined;
  console.log('payment: '+payment_id)
  payment = await prisma.fd_event_payment.findFirst({
    where: {
      id: payment_id!
    }
  })

  const url = await minio.presignedGetObject('siska-kwp', payment!.proof_name);

  return { user: JSON.parse(JSON.stringify(user)), event: JSON.parse(JSON.stringify(event)), payment: JSON.parse(JSON.stringify(payment)), url: url }
};

export const actions: Actions = {
  paymentConfirmation: async ({ request }) => {
    const formData = await request.formData();

    const tempDate = String(formData.get('date'));
    const date = new Date(tempDate);
    console.log('date: ' + tempDate);
    const total = String(formData.get('total'));
    console.log('total: ' + total);
    const bill = formData.get('bill') as Blob;
    const buffer = Buffer.from(await bill.arrayBuffer());
    const fileName = 'fd-payment-event' + number3DigitFormat(event!.id) + '.jpg';
    let payment;


    minio.putObject('siska-kwp', fileName, buffer, (err, objInfo) => {
      if (err) {
        console.log(err) // err should be null
        return fail(500, { message: 'Gagal upload file!' })
      }
      // console.log("Success", objInfo)
    });

    try {
    payment =  await prisma.fd_event_payment.create({
        data: {
          date: date,
          total: total,
          proof_name: fileName,
          confirmed_by: user!.staff.name,
          confirmed_date: today,
        }
      })
    } catch (error) {
      return fail(500, { message: 'Gagal konfirmasi pembayaran!' })
    }

    try {
     await prisma.fd_event.update({
        where: {
          id: event!.id
        },
        data: {
          status: 'Pembayaran',
          total_price: total,
          payment_id: payment!.id
        }
      })
    } catch (error) {
      return fail(500, { message: 'Gagal konfirmasi pembayaran!' })
    }
    return { type: 'success' }
  },

  confirmDone: async () => {
    try {
      await prisma.fd_event.update({
        where: {
          id: event!.id
        },
        data: {
          status: 'Selesai',
          confirmed_date: today,
          payment_id: payment!.id
        }
      })
    } catch (error) {
      console.log(error)
      return fail(500, { message: 'Gagal konfirmasi event selesai!' })
    }
    return { type: 'success' }

  },

  deleteEvent: async () => {
    try {
      await prisma.fd_event.delete({
        where: {
          id: event!.id
        }
      })
    } catch (error) {
      console.log(error)
      return fail(500, { message: 'Gagal hapus event!' })
    }
    return { type: 'success' }

  },

  billUrl: async () => {

    // try {
    const url = await minio.presignedGetObject('siska-kwp', payment!.proof_name);
    console.log(url);
    // } catch (error) {
    //   console.log(error)
    //   return fail(500, { message: 'Gagal hapus event!' })
    // }
    if(url){
      imgSrc.set(url)
      console.log('$imgSrc '+imgSrc.subscribe)
      console.log('url true')
      return { type: 'success'}
    }else{
      console.log('url false')
      return fail(500, { message: 'Gagal hapus event!' })
    }
   
  }
};