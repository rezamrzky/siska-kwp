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

  const orders = await prisma.fd_event_order.findMany({
    where: {
      event_id: event?.id
    },
    select:{
      id: true,
      vendor: true,
      total: true,
      fd_event_payment: true
    }
  })

  const url: string[] = new Array(orders.length)

  orders.forEach(async (e:any, i) => {
    // console.log(e.fd_event_payment)
    if(e.fd_event_payment){
      const temp = await minio.presignedGetObject('siska-kwp', e.fd_event_payment.proof_name);
      url[i] = temp;
    }
  })

  payment = await prisma.fd_event_payment.findFirst({
    where: {
      id: payment_id!
    }
  })

  // const url = await minio.presignedGetObject('siska-kwp', payment!.proof_name);

  return { user: JSON.parse(JSON.stringify(user)), event: JSON.parse(JSON.stringify(event)), payment: JSON.parse(JSON.stringify(payment)), url: url, orders: JSON.parse(JSON.stringify(orders)) }
};

export const actions: Actions = {
  paymentConfirmation: async ({ request }) => {
    const formData = await request.formData();

    const tempDate = String(formData.get('date'));
    const date = new Date(tempDate);
    console.log('date: ' + tempDate);
    const total = String(formData.get('total'));
    console.log('total: ' + total);
    const order_id = String(formData.get('orderId'))
    const bill = formData.get('bill') as Blob;
    const buffer = Buffer.from(await bill.arrayBuffer());
    const fileName = 'fd-payment-event' + number3DigitFormat(event!.id) + number3DigitFormat(+order_id) + '.jpg';
    let payment;

    console.log('ORDER-ID: '+order_id)


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
          order_id: +order_id
        }
      })
    } catch (error) {
      return fail(500, { message: 'Gagal konfirmasi pembayaran!' })
    }

    // try {
    //  await prisma.fd_event.update({
    //     where: {
    //       id: event!.id
    //     },
    //     data: {
    //       status: 'Pembayaran',
    //       total_price: total,
    //       payment_id: payment!.id
    //     }
    //   })
    // } catch (error) {
    //   return fail(500, { message: 'Gagal konfirmasi pembayaran!' })
    // }
    return { type: 'success' }
  },

  confirmDone: async ({request}) => {
    const formData = await request.formData();

    const total = String(formData.get('total'));
    try {
      await prisma.fd_event.update({
        where: {
          id: event!.id
        },
        data: {
          status: 'Selesai',
          confirmed_date: today,
          payment_id: payment!.id,
          total_price: total
        }
      })
    } catch (error) {
      console.log(error)
      return fail(500, { message: 'Gagal konfirmasi event selesai!' })
    }
    return { type: 'success' }

  },
  orderDone: async () => {
    try {
      await prisma.fd_event.update({
        where: {
          id: event!.id
        },
        data: {
          status: 'Pembayaran',
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

  addOrder: async ({request}) =>{
    const formData = await request.formData();

    const vendor = String(formData.get('name'))
    const total = String(formData.get('total'))
    const event_id = event!.id

    try {
      await prisma.fd_event_order.create({
        data:{
          vendor, total, event_id
        }
      })
    } catch (error) {
      console.log(error)
      return fail(500, { message: 'Gagal tambah pemesanan!' })
    }
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
    }else{
      console.log('url false')
      return fail(500, { message: 'Gagal hapus event!' })
    }
   
    return { type: 'success'}
  },

  editOrder: async ({request}) =>{
    const formData = await request.formData();

    const vendor = String(formData.get('vendor'))
    const total = String(formData.get('total'))
    const id = String(formData.get('orderId'))

    try {
      await prisma.fd_event_order.update({
        where:{
          id: +id
        },
        data:{
          vendor, total
        }
      })
    } catch (error) {
      console.log(error)
      return fail(500, { message: 'Gagal tambah pemesanan!' })
    }
  },

  deleteOrder: async ({request}) =>{
    const formData = await request.formData();

    const id = String(formData.get('orderId'))

    try {
      await prisma.fd_event_order.delete({
        where:{
          id: +id
        }
      })
    } catch (error) {
      console.log(error)
      return fail(500, { message: 'Gagal tambah pemesanan!' })
    }
  },

  editPayment: async ({ request }) => {
    const formData = await request.formData();

    const tempDate = String(formData.get('date'));
    const date = new Date(tempDate);
    // console.log('date: ' + tempDate);
    const total = String(formData.get('total'));
    // console.log('total: ' + total);
    const bill = formData.get('bill') as Blob;
    const buffer = Buffer.from(await bill.arrayBuffer());
    const proofName = String(formData.get('proof_name'))
    const fileName = proofName;
    console.log("FILENAME: "+fileName)
    let payment;

    const payment_id = String(formData.get('orderId'))

    // console.log('PAYMENT-ID: '+payment_id)


    if(bill.size === 0 || !bill){
      // console.log('kosong')
      try {
        payment =  await prisma.fd_event_payment.update({
          where:{
            id: +payment_id
          },
            data: {
              date: date,
              total: total,
            }
          })
        } catch (error) {
          return fail(500, { message: 'Gagal konfirmasi pembayaran!' })
        }
    }else{
      // console.log('gak empty')
      minio.putObject('siska-kwp', fileName, buffer, (err, objInfo) => {
      if (err) {
        console.log(err) // err should be null
        return fail(500, { message: 'Gagal upload file!' })
      }
    });


      try {
        payment =  await prisma.fd_event_payment.update({
          where:{
            id: +payment_id
          },
            data: {
              date: date,
              total: total,
              proof_name: fileName
            }
          })
        } catch (error) {
          return fail(500, { message: 'Gagal konfirmasi pembayaran!' })
        }
    }
    

    

    return { type: 'success' }
  },
};