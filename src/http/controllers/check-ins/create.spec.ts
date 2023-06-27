import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthUser } from '@/util/test/create-and-auth-user';
import { prisma } from '@/lib/prisma';

describe('Create Check-in (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a check-in', async () => {

        const { token } = await createAndAuthUser(app)

        const gym = await prisma.gym.create({
            data: {
                title:"Gym Name",
                latitude: -27.209052,
                longitude: -49.640109,
            }
        })
        
        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title:"Gym Name",
                description: "Some description",
                phone: "11999999999",
                latitude: -27.209052,
                longitude: -49.640109,

            })

        expect(response.statusCode).toEqual(201)

        });
        
})