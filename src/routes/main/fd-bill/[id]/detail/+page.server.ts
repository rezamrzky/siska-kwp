import type { fd_bill, fd_event } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import { fail, type Actions } from "@sveltejs/kit";

let iBill: (fd_bill & { fd_event: fd_event[]; }) | null;
let iUser;
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

  return { user: JSON.parse(JSON.stringify(user)), bill: JSON.parse(JSON.stringify(bill)) }
};

export const actions: Actions = {
  approved: async () => {
    try {
      await prisma.fd_bill.update({
        where: {
          id: iBill!.id,
        }, data: {
          approval: true,
          approval_at: now,
        }
      })
    }
    catch (error) {
      console.log(error)
      return fail(500, { message: 'Gagal melakukan persetujuan tagihan.' })
    }
  },
  set_payment:async ({request}) => {
    const formData = await request.formData()

    const stringDate = String(formData.get('date'))
    const date = new Date(stringDate);
    const total = String(formData.get('total'))

    console.log('date: '+String(date));
    console.log('total: '+total);

    try {
      await prisma.fd_bill_payment.create({
        data:{
          date: date,
          total: total,
          confirm_by: iUser.staff.id,
          confirm_date: now,
          bill_id: iBill.id
        }
      })
    } catch (error) {
      return fail(500, {message: 'Gagal buat pembayaran!'})
    }

    const bill_payments = await prisma.fd_bill_payment.groupBy({
      by: ['bill_id'],
      where: {
        bill_id: iBill.id
      },
      _sum:{
        total: true,
      }
    })

    const total_payments = bill_payments[0]._sum.total;

    if(+iBill.total_after_tax <= +total_payments){
      try{
        await prisma.fd_bill.update({
          where: {
            id: iBill.id,
          }, data: {
            status: 'Lunas'
          }
        })
      }
      catch(error){
        console.log(error)
        return fail(500, {message: 'Gagal ubah status!'})
      }
    }

    return {type: 'success'}
  }
} satisfies Actions;