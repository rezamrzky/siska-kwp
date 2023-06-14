import type { PageServerLoad } from "./$types";

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
      }
    }
  })

  const ingredients = await prisma.dr_ingredient.findMany({
    orderBy: {
      name: 'asc'
    },
  })

  const stockP1 = await prisma.dr_stock.groupBy({
    by: ['ingredient_id'],
    _sum: {
      quantity: true
    },
    where: {
      action: 1
    }
  })

  const stockM1 = await prisma.dr_stock.groupBy({
    by: ['ingredient_id'],
    _sum: {
      quantity: true
    },
    where: {
      action: -1
    }
  })

  ingredients.forEach((e:any, i:any) => {
    console.log(e)
    const sp = stockP1.find((o:any) => o.ingredient_id === e.id)?stockP1.find((o:any) => o.ingredient_id === e.id):0;
    console.log('sp: '+sp)
    const sm = stockM1.find((o:any) => o.ingredient_id === e.id)?stockM1.find((o:any) => o.ingredient_id === e.id):0;
    console.log('sm: '+sm)
    // const stock = +sp?._sum - +sm?._sum
  })

  

  return { user: JSON.parse(JSON.stringify(user)), ingredients: JSON.parse(JSON.stringify(ingredients)) }
};