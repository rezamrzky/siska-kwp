import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = ( async () => {
    const response = await prisma.staff.findMany()

    console.log(response);

    return { staffs: JSON.parse(JSON.stringify(response)) };
}) satisfies PageServerLoad;