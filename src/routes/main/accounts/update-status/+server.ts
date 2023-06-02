import { fail, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';

export const POST = (async ({ request }) => {
    const requestData = await request.json();

    const dataUsername = String(requestData.username);
    const dataStatus = String(requestData.status);

    console.log('username:' + dataUsername + ' status:' + dataStatus);
    try {
        await prisma.user.update({
            where:{
                username: dataUsername
            }, 
            data: {
                status: dataStatus
            }
        })
    } catch (error) {
        return json({type: 'failed'});
    }
    return json({type: 'success'});
}) satisfies RequestHandler;