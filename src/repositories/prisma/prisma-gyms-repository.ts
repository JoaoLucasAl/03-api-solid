import { Gym, Prisma } from "@prisma/client";
import { GymsRepository, findManyNearbyParams } from "../gyms-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymsRepository implements GymsRepository {
    async findById(id: string){
       const gym = await prisma.gym.findUnique({
            where: {
                id,
            },
        });

        return gym;
    }
    async findManyNearby({latitude, longitude}: findManyNearbyParams, page: number) {
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * from gyms 
            WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
        `

        const gymsPaginated = gyms.slice((page - 1) * 20, page * 20);
        
        return gymsPaginated;
    }
    async searchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query,
                },
            },
            skip: (page - 1) * 20,
            take: page * 20,
        });

        return gyms;
    }
    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data,
        });

        return gym;
    }

}