import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthUser } from '@/util/test/create-and-auth-user';

describe('Profile (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get user profile', async () => {

        const { token } = await createAndAuthUser(app)

        const response = await request(app.server)
            .get('/me')
            .set('Authorization', `Bearer ${token}`)
            .send()
        
        expect(response.status).toEqual(200)
        expect(response.body.user).toEqual(expect.objectContaining({
                email: "johndoe@example.com"
            })
        )  

        });
        
})