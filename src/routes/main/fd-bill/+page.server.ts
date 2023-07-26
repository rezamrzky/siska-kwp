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
        }
      }
    })

    const bills = await prisma.fd_bill.findMany({
      orderBy:{
        id: 'desc',
      },
      include:{
        fd_bill_payment: true
    }})
  
    return { user: JSON.parse(JSON.stringify(user)), bills: JSON.parse(JSON.stringify(bills)) }
  };