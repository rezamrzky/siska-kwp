import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Prisma, type dr_restock_payment, type dr_restock_product } from "@prisma/client";

let products: { id: any; }[];
let user: { username: string; status: string; staff: { name: string; department: string; position: string; phone_numb: string; id: string; }; } | null;

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

    products = await prisma.dr_ingredient_product.findMany({
        orderBy:{
            brand: 'asc'
        },
        include: {
            dr_ingredient: true,
        }
    })

    return { user: JSON.parse(JSON.stringify(user)), products: JSON.parse(JSON.stringify(products)) }
};

export const actions: Actions = {
    add:async ({request}) => {
        const formData = await request.formData()

        const iDate = String(formData.get('initialDate'))
        const initial_date = new Date(iDate);
        const fDate = String(formData.get('finishDate'))
        const finish_date = new Date(fDate);
        const total = String(formData.get('total'));
        const productQty = formData.getAll('stockValue');
        const now = new Date()
        const note = String(formData.get('note'))

        const idList: Array<dr_restock_product> = [];

        let restock;

        try {
            restock = await prisma.dr_restock.create({
                data:{
                    created_at: now,
                    initial_date: initial_date,
                    finish_date: finish_date,
                    total: +total,
                    is_approved: false,
                    status: 'Persetujuan',
                    is_stock_confirmed: false,
                    note,
                    staff_id: user!.staff.id
                }
            })
        } catch (error) {
            console.log(error)
            return fail(500, {message: 'Gagal membuat restock!'})
        }

        for(let i=0; i < productQty.length; i++){
            if(productQty[i] !== ''){
                idList.push({
                    restock_id: restock.id,
                    product_id: products[i].id,
                    quantity: new Prisma.Decimal(+productQty[i]), 
                    confirm_date: null,
                    confirm_quantity: null
                })
            }
        }

        try {
            await prisma.dr_restock_product.createMany({data: idList})
        } catch (error) {
            return fail(500, {message: 'Gagal membuat restock!'})
        }

        return { type: 'success'}
    }
};