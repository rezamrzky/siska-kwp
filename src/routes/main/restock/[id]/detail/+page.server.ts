import type { PageServerLoad } from "./$types";
import { number3DigitFormat } from '$lib/Functions';
import { minio } from "$lib/minio";
import { fail, type Actions } from "@sveltejs/kit";
import { Prisma, type dr_restock, type dr_restock_product, type dr_restock_product_confirm, type staff } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

let restocks: (dr_restock & { staff: staff; }) | null, user: { username: string; status: string; staff: { name: string; department: string; position: string; phone_numb: string; id: string; }; } | null, products: { product_id: any; }[];
const today = new Date();

export const load: PageServerLoad = async ({ cookies, params: { id } }) => {
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

    restocks = await prisma.dr_restock.findFirst({
        where: {
            id: +id
        },
        include: {
            staff: true,
        }
    })

    products = await prisma.dr_restock_product.findMany({
        where: {
            restock_id: +id
        },
        include: {
            dr_ingredient_product: {
                include: {
                    dr_ingredient: true,
                }
            }
            // {
            // select:{
            //     brand: true,
            //     product_unit: true,
            //     quantity:true,
            //     dr_ingredient: true,
            // }
            // }
        }
    })

    const bill = await prisma.dr_restock_bill.findFirst({
        where: {
            restock_id: +id
        },
        include: {
            staff: true,
        }
    })

    const payment = await prisma.dr_restock_payment.findFirst({
        where: {
            restock_id: +id
        },
        include: {
            staff: true,
        }
    })

    let urlBill, urlPaym;

    if (bill) {
        urlBill = await minio.presignedGetObject('siska-kwp', bill!.proof_name);
    }
    if (payment) {
        urlPaym = await minio.presignedGetObject('siska-kwp', payment!.proof_name);
    }

    return { user: JSON.parse(JSON.stringify(user)), restock: JSON.parse(JSON.stringify(restocks)), products: JSON.parse(JSON.stringify(products)), bill: JSON.parse(JSON.stringify(bill)), url: urlBill, payment: JSON.parse(JSON.stringify(payment)), url2: urlPaym }
};

export const actions: Actions = {
    approved: async ({ params: { id } }) => {
        try {
            await prisma.dr_restock.update({
                where: {
                    id: +id!
                },
                data: {
                    status: 'Pembelian',
                    is_approved: true,
                    approved_date: today
                }
            })
        } catch (error) {
            return fail(500, { message: 'Gagal menyetujui belanja!' })
        }

        return { type: 'success' }
    },

    orderConfirm: async ({ request, params: { id } }) => {
        const formData = await request.formData()

        const tempDate = String(formData.get('orderDate'))
        const date = new Date(tempDate);
        const total = String(formData.get('orderTotal'));
        const bill = formData.get('orderProof') as Blob;
        const buffer = Buffer.from(await bill.arrayBuffer());
        const fileName = 'dr-order-bill-restock' + number3DigitFormat(restocks!.id) + '.jpg';

        minio.putObject('siska-kwp', fileName, buffer, (err: any, objInfo: any) => {
            if (err) {
                console.log(err) // err should be null
                return fail(500, { message: 'Gagal upload file!' })
            }
            // console.log("Success", objInfo)
        });

        try {
            await prisma.dr_restock_bill.create({
                data: {
                    date: date,
                    total: +total,
                    proof_name: fileName,
                    staff_id: user!.staff.id,
                    confirm_date: today,
                    restock_id: +id!,
                }
            })
        } catch (error) {
            console.log(error)
            return fail(500, { message: 'Gagal konfirmasi pembayaran!' })
        }

        try {
            await prisma.dr_restock.update({
                where: {
                    id: +id!
                },
                data: {
                    status: 'Pembayaran'
                }
            })
        } catch (error) {
            console.log(error)
            return fail(500, { message: 'Gagal membuat restock!' })
        }

        return { type: 'success' }
    },

    productConfirm: async ({ request, params: { id } }) => {
        const formData = await request.formData()

        const listQty = formData.getAll('quantityList');

        const listConfirm: Array<dr_restock_product> = [];

        for (let i = 0; i < listQty.length; i++) {
            listConfirm.push({
                restock_id: +id!,
                product_id: products[i].product_id,
                quantity: new Prisma.Decimal(0),
                confirm_date: today,
                confirm_quantity: new Prisma.Decimal(+listQty[i])
            })
        }


        listConfirm.forEach(async (e: any) => {

            const prod = await prisma.dr_ingredient_product.findFirst({where:{id: e.product_id}, include:{dr_ingredient:true}})
            console.log(prod)
            const prodStock = +e.confirm_quantity+ +prod!.stock
            const ingrAddStock = +e.confirm_quantity * +prod!.quantity
            const ingrTotalStock = +prod!.dr_ingredient!.stock + ingrAddStock

            console.log(prodStock+' '+ingrTotalStock)
            try {
                await prisma.dr_restock_product.update({
                    where: {
                        restock_id_product_id: {
                            restock_id: e.restock_id,
                            product_id: e.product_id
                        }
                    },
                    data: {
                        confirm_date: e.confirm_date,
                        confirm_quantity: e.confirm_quantity,
                        dr_ingredient_product:{
                            update:{
                                stock: prodStock,
                                stock_date: e.confirm_date,
                                dr_ingredient:{
                                    update:{
                                        stock: ingrTotalStock,
                                        stock_date: e.confirm_date
                                    }
                                },
                            }
                        }
                    },
                })
            } catch (error) {
                console.log(error)
                return fail(500, { message: 'Gagal membuat restock!' })
            }
            try {
                await prisma.dr_stock.create({
                    data: {
                        date: e.confirm_date,
                        product_id: e.product_id,
                        ingredient_id: prod!.dr_ingredient.id,
                        action: 1,
                        quantity: e.confirm_quantity
                    }
                })
            } catch (error) {
                console.log(error)
                return fail(500, { message: 'Gagal membuat restock!' })
            }
        })


        try {
            await prisma.dr_restock.update({
                where: {
                    id: +id!
                },
                data: {
                    is_stock_confirmed: true
                }
            })
        } catch (error) {
            console.log(error)
            return fail(500, { message: 'Gagal membuat restock!' })
        }

        return { type: 'success' }
    },

    paymentConfirm: async ({ request, params: { id } }) => {
        const formData = await request.formData()

        const tempDate = String(formData.get('paymentDate'))
        const date = new Date(tempDate);
        const total = String(formData.get('paymentTotal'));
        const bill = formData.get('paymentProof') as Blob;
        const buffer = Buffer.from(await bill.arrayBuffer());
        const fileName = 'dr-payment-restock' + number3DigitFormat(restocks!.id) + '.jpg';

        minio.putObject('siska-kwp', fileName, buffer, (err: any, objInfo: any) => {
            if (err) {
                console.log(err) // err should be null
                return fail(500, { message: 'Gagal upload file!' })
            }
            // console.log("Success", objInfo)
        });


        let payment; 
        try {
            payment = await prisma.dr_restock_payment.create({
                data: {
                    date: date,
                    total: +total,
                    proof_name: fileName,
                    confirm_by: user!.staff.id,
                    confirm_date: today,
                    restock_id: +id!,
                }
            })
        } catch (error) {
            console.log(error)
            return fail(500, { message: 'Gagal konfirmasi pembayaran!' })
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
            saldoNew = +report[0].saldo - +tempTotal
        }

        // saldoNew = report[0].saldo?report[0].saldo:total;
        console.log(saldoNew)


        try {
            await prisma.dr_report.create({
                data:{
                    payment_id: payment.id,
                    payment_total: +total,
                    created_date: today,
                    action: -1,
                    saldo: saldoNew,
                    note: restocks?.note
                }
            })
        } catch (error) {
            return fail(500, { message: 'Gagal membuat report!' })
        }

        try {
            await prisma.dr_restock.update({
                where: {
                    id: +id!
                },
                data: {
                    status: 'Selesai'
                }
            })
        } catch (error) {
            console.log(error)
            return fail(500, { message: 'Gagal membuat restock!' })
        }

        return { type: 'success' }
    },

    delete: async ({ params: { id } }) => {
        try {
            await prisma.dr_restock.delete({
                where: {
                    id: +id!
                }
            })
        } catch (error) {
            console.log(error)
            return fail(500, { message: 'Gagal hapus restock!' })
        }

        return { type: 'success' }
    }
};