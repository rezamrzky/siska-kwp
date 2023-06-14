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
          select:{
            id: true,
            name: true,
            department: true,
            position: true,
            phone_numb: true,
          }
        },
      }
    })

    const stocks = await prisma.dr_stock.findMany({
        orderBy:{
            date: 'desc'
        },
        include:{
            dr_ingredient: true,
            dr_ingredient_product: true,
        }
    })

    console.log(stocks)

    return { user: JSON.parse(JSON.stringify(user)), stocks: JSON.parse(JSON.stringify(stocks)) }
  };