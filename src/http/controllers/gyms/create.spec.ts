import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthUser } from '@/util/test/create-and-auth-user';

describe('Create Gym (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a gym', async () => {

        const { token } = await createAndAuthUser(app)

        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title:"Gym Name",
                description: "Some description",
                phone: "11999999999",
                latitude: -27.209052,
                longitude: -49.640109,

            })
        
        expect(response.status).toEqual(201)

        });
        
})