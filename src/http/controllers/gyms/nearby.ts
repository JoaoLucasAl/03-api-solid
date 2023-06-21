import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
	const nearbyGymsQuerySchema = z.object({
		latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        }),
        page: z.coerce.number().min(1).default(1),

	});

	const { latitude, longitude, page } = nearbyGymsQuerySchema.parse(request.query);

    const fetchNearbyGymUseCase = makeFetchNearbyGymsUseCase();

	const { gyms } = await fetchNearbyGymUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude,
        page
	});

	return reply.status(200).send({
        gyms,
    });
}
