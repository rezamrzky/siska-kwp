import type { fail, PageServerLoad } from "./$types";

let products, paramsId;

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

    paramsId = +id;

    products = await prisma.dr_ingredient_product.findMany({
        where:{
            NOT:{
                is_blocked: true
            }
        },
        orderBy: {
            brand: 'asc'
        },
        include: {
            dr_ingredient: true,
        }
    })

    const restock = await prisma.dr_restock.findFirst({
        where: {
            id: +id
        }
    })

    const restockProduct = await prisma.dr_restock_product.findMany({
        where: {
            restock_id: +id
        }
    })

    // console.log(restockProduct)

    return { user: JSON.parse(JSON.stringify(user)), products: JSON.parse(JSON.stringify(products)), restock: JSON.parse(JSON.stringify(restock)), restockProduct: JSON.parse(JSON.stringify(restockProduct)) }
};

export const actions: Actions = {
    edit: async ({ request }) => {
        const formData = await request.formData()

        const initial_date = new Date(formData.get('initialDate'));
        const finish_date = new Date(formData.get('finishDate'));
        const total = String(formData.get('total'));
        const note = String(formData.get('note'));
        const productQty = formData.getAll('stockValue');
        // const now = new Date()

        const idList: Array<dr_restock_payment> = [];

        let restock;

        try {
            restock = await prisma.dr_restock.update({
                where: {
                    id: paramsId
                },
                data: {
                    initial_date: initial_date,
                    finish_date: finish_date,
                    total: +total,
                    note, 
                }
            })
        } catch (error) {
            console.log(error)
            return fail(500, { message: 'Gagal membuat restock!' })
        }

        for (let i = 0; i < productQty.length; i++) {
            if (productQty[i] !== '') {
                // idList.push({
                // restock_id: restock.id,
                // product_id: products[i].id,
                // quantity: +productQty[i]
                // })

                try {
                    await prisma.dr_restock_product.upsert({
                        where: {
                            restock_id: {
                                equalTo: restock.id
                            },
                            product_id: {
                                equalTo: products[i].id,
                            }
                        },
                        update: {
                            quantity: +productQty[i]
                        },
                        create: {
                            restock_id: restock.id,
                            product_id: products[i].id,
                            quantity: +productQty[i]
                        }
                    })
                    } catch (error) {
                        console.log(error)
                        return fail(500, { message: 'Gagal membuat restock!' })
                    }
                }
        }

            return { type: 'success' }
        }
    };