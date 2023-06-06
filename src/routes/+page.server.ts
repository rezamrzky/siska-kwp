import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcrypt';

export const load: PageServerLoad = (async ({ cookies }) => {
    console.log("cookies session at route page: " + cookies.get('session'))
    if (cookies.get('session')) {
        let user;
        try {
            user = await prisma.user.findFirst({
                where: {
                    authToken: cookies.get('session')
                }
            })
        } catch (err) {
            console.log("ERR: " + String(err))
        }
        // console.log('user.username: ' + String(user.username));
        if (user) {
            console.log("cookies session at route page: " + cookies.get('session'))
            throw redirect(301, '/main');
        }
    }
}) satisfies PageServerLoad;

export const actions: Actions = {
    login: async ({ cookies, request }) => {
        const formData = await request.formData();

        const username = String(formData.get('username'));
        const password = String(formData.get('password'));

        let user;

        try {
            user = await prisma.user.findUnique({
                where: {
                    username: username
                }
            })
        } catch (error) {
            // console.log(String(error));
            return fail(400, { message: 'Gagal login' });
        }
        // console.log('User: '+user?.id)

        if (!user) {
            return fail(400, { message: 'username salah' });
        }
        // console.log('password: '+password)

        if (user.status === 'Beku') {
            return fail(400, { message: 'Akses ditolak, hubungi Manajer KWP untuk informasi lebih lanjut.' });
        }

        const userPass = await bcrypt.compare(password, user.password);

        if (!userPass) {
            return fail(400, { message: 'password salah' });
        }


        let authUser;
        try {
            authUser = await prisma.user.update({
                where: { username: user.username },
                data: {
                    authToken: crypto.randomUUID(),
                    last_login: new Date(),
                },
            })
        } catch (error) {
            // console.log(String(error));
            return fail(400, { message: 'Gagal login' });
        }

        // console.log('authUser: '+authUser)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        cookies.set('session', authUser.authToken!, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
        })

        return {
            type: 'success',
            status: 201
        }
    }
} satisfies Actions;