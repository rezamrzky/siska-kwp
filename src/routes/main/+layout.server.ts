import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({ cookies }) => {
  // console.log(cookies.getAll())
  
  // try {
   const user = await prisma.user.findFirst({
      where: {
        authToken: cookies.get('session')
      },
      select: {
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
  // } 
  // catch (error) {
  //   console.log(error)
  // }
  
  return { user: JSON.parse(JSON.stringify(user)) }
};