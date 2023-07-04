import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthUser } from '@/util/test/create-and-auth-user';

describe('Search Gyms (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search a gym by title', async () => {

        const { token } = await createAndAuthUser(app, true)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title:"JavaScript Gym",
                description: "Some description",
                phone: "11999999999",
                latitude: -27.209052,
                longitude: -49.640109,

            })

            await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title:"TypeScript Gym",
                description: "Some description",
                phone: "11999999999",
                latitude: -27.209052,
                longitude: -49.640109,

            })
        
        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                q: "JavaScript"
            })
            .set('Authorization', `Bearer ${token}`)
            .send()
        
        expect(response.status).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
                expect.objectContaining({
                    title: "JavaScript Gym"
                })
            ])
        });
        
})