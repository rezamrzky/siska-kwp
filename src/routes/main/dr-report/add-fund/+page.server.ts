import {  fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Prisma } from "@prisma/client";

let user: {
    username: string; status: string; staff: {
        name: string; department: string; position: string; phone_numb: string; id:
            // console.log(cookies.getAll())
            string;
    };
} | null;

export const load: PageServerLoad = async ({ cookies }) => {
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

    return { user: JSON.parse(JSON.stringify(user)) }
};

export const actions: Actions = {
    add:async ({request}) => {
        const formData = await request.formData()

        const tempDate = String(formData.get('date'));
        const total = String(formData.get('total'));
        const date = new Date(tempDate);
        const created_date = new Date();
        const created_by = user!.staff.id

        let modal;

        try {
            modal = await prisma.dr_modal.create({
                data:{
                    date, total, created_date, created_by
                }
            })
        } catch (error) {
            return fail(500, {message: 'Gagal tambah modal'})
        }

        const report = await prisma.dr_report.findMany({
            orderBy:{
                id: 'desc'
            }
        })

        let saldoNew;

        if(report.length === 0){
            saldoNew = total
        }else{
            console.log('kesini?')
            const tempTotal = new Prisma.Decimal(total)
            saldoNew = +report[0].saldo + +tempTotal
        }

        // saldoNew = report[0].saldo?report[0].saldo:total;
        console.log(saldoNew)

        try {
            await prisma.dr_report.create({
                data:{
                    saldo: saldoNew,
                    action: 1,
                    modal_total: total,
                    modal_id: modal.id,
                    created_date: date,
                    note: 'Modal'
                }
            })
        } catch (error) {
            return fail(500, {message: 'Gagal tambah report'})
        }

        return {type: 'success'}
    }
};