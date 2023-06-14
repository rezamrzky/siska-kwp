import { Prisma, type dr_stock } from "@prisma/client";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";

let products: any[];

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
        select: {
          id: true,
          name: true,
          department: true,
          position: true,
          phone_numb: true,
        }
      },
    }
  })

  products = await prisma.dr_ingredient_product.findMany({
    orderBy: {
      brand: 'asc'
    },
    include: {
      dr_ingredient: true
    }
  })

  return { user: JSON.parse(JSON.stringify(user)), products: JSON.parse(JSON.stringify(products)) }
};

export const actions: Actions = {
  itemsOut: async ({ request }) => {
    const formData = await request.formData()

    const tempDate = String(formData.get('date'));
    const date = new Date(tempDate)
    const productQty = formData.getAll('quantity');

    const idList: Array<dr_stock> = [];

    for (let i = 0; i < productQty.length; i++) {
      if (productQty[i] !== '') {
        idList.push({
          date: date,
          product_id: products[i].id,
          ingredient_id: products[i].dr_ingredient.id,
          quantity: new Prisma.Decimal(+productQty[i]),
          action: -1,
          id: 0
        })
      }
    }

    try {
      await prisma.dr_stock.createMany({ data: idList })
    } catch (error) {
      return fail(500, { message: 'Gagal membuat restock!' })
    }

    idList.forEach(async (e: any) => {
      const prod = await prisma.dr_ingredient_product.findFirst({ where: { id: e.product_id }, include: { dr_ingredient: true } })
      console.log(prod)
      const prodStock = +prod!.stock - +e.quantity
      const ingrAddStock = +e.quantity * +prod!.quantity
      const ingrTotalStock = +prod!.dr_ingredient!.stock - ingrAddStock

      try {
        await prisma.dr_ingredient_product.update({
          where: {
            id: e.product_id
          },
          data: {
            stock: prodStock,
            stock_date: e.date,
            dr_ingredient: {
              update: {
                stock: ingrTotalStock,
                stock_date: e.date
              }
            },
          },
        })
      } catch (error) {
        console.log(error)
        return fail(500, { message: 'Gagal membuat restock!' })
      }
    })

    return { type: 'success' }

  }

};