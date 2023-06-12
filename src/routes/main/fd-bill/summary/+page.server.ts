import type { PageServerLoad } from "../$types";

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

    const billsActive = await prisma.fd_bill.findMany({
      orderBy:{
        id: 'desc',
      }, 
      where: {
        status: 'Aktif'
      }
    })

    const sortActive = billsActive.sort((a, b) => -(a.date.getTime() - b.date.getTime()));
    console.log(sortActive)
    let firstDate = sortActive[sortActive.length-1].date 
    // console.log('fDate: '+String(firstDate))
    let lastDate = sortActive[0].date
    console.log('lDate: '+String(lastDate))

    const billsPayment = await  prisma.fd_bill.findMany({
        include:{
            fd_bill_payment:{
                orderBy:{
                    date: 'desc'
                }
            }
        },where: {
            status: 'Lunas'
          }
    })

    const payments = await prisma.fd_bill_payment.findMany({
        orderBy:{
            date: 'asc'
        }
    })

    firstDate = firstDate < payments[0].date ? firstDate:payments[0].date;
    lastDate = lastDate > payments[payments.length-1].date ? lastDate:payments[payments.length-1].date;
    // console.log('fDate2: '+String(firstDate))
    // console.log('lDate2: '+String(lastDate))

    const period = {
        firstDate: firstDate,
        lastDate: lastDate,
        firstMonth: firstDate.getMonth(),
        firstYear: firstDate.getFullYear(),
        lastMonth: lastDate.getMonth(),
        lastYear: lastDate.getFullYear()
    }

    console.log(period)
  
    return { user: JSON.parse(JSON.stringify(user)), billsActive: JSON.parse(JSON.stringify(billsActive)), billsPayment: JSON.parse(JSON.stringify(billsPayment)), period: JSON.parse(JSON.stringify(period)) }
  };