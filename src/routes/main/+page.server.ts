import type { user } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

let iUser: any;

export const load: PageServerLoad = async ({ cookies }) => {
    if (cookies.get('session')) {
        console.log(cookies.get('session'))
        const user = await prisma.user.findFirst({
            where: {
                authToken: cookies.get('session')
            },
            select: {
                id: true,
                username: true,
                status: true,
                staff: {
                  select:{
                    name: true,
                    department: true,
                    position: true,
                    phone_numb: true,
                  }
                }
              }
        })
        console.log(user)
        iUser = user;
    } else {
        throw redirect(301, '/')
    }

    const activeEvent = await prisma.fd_event.count({
        where:{
            NOT:{
                status: 'Selesai'
            }
        }
    })

    const paymentEvent = await prisma.fd_event.count({
        where:{
                status: 'Pembayaran'
        }
    })

    const orderEvent = await prisma.fd_event.count({
        where:{
                status: 'Pemesanan'
        }
    })

    const activeBill = await prisma.fd_bill.count({
        where:{
            status: 'Aktif'
        }
    })

    const totalBill = await prisma.fd_bill.aggregate({
        _sum:{
            total_before_tax: true
        },
        where:{
            status: 'Aktif'
        }
    })

    const reportDR = await prisma.dr_report.findMany({
        orderBy:{
            id: 'desc'
        }
    })

    const activeRestock = await prisma.dr_restock.count({
        where:{
            NOT:{
                status: 'Selesai'
            }
        }
    })

    const paymentRestock = await prisma.dr_restock.count({
        where:{
                status: 'Pembayaran'
        }
    })

    const orderRestock = await prisma.dr_restock.count({
        where:{
                status: 'Pembelian'
        }
    })

    const approvalRestock = await prisma.dr_restock.count({
        where:{
                status: 'Persetujuan'
        }
    })

    const fd = {
        active: activeEvent,
        payment: paymentEvent,
        order: orderEvent,
        bill: activeBill,
        totalBill: totalBill._sum.total_before_tax
    }

    const dr = {
        saldo: reportDR[0].saldo,
        active: activeRestock,
        approval: approvalRestock,
        order: orderRestock,
        payment: paymentRestock
    }

    return { user: JSON.parse(JSON.stringify(iUser)), fd: JSON.parse(JSON.stringify(fd)), dr: JSON.parse(JSON.stringify(dr)) }
};

export const actions: Actions = {
    logout: async ({ cookies }) => {

        console.log('iUser.id: '+iUser!.id)
        try {
            await prisma.user.update({
                where: {
                    id: iUser!.id,
                },
                data: {
                    authToken: null
                }
            })
        } catch (error) {
            console.log(String(error))
            return fail(500, { message: 'Gagal logout' })
        }

        cookies.set('session', '', {
            path: '/',
            expires: new Date(0),
        })

    }
};