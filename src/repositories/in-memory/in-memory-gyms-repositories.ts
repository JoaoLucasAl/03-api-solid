import { Gym, Prisma } from "@prisma/client";

import { GymsRepository, findManyNearbyParams } from "../gyms-repository";
import { randomUUID } from "node:crypto";
import { getDistanceBetweenCoordinates } from "@/util/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
	
	public items: Gym[] = [];
	
	async findById(id: string) {
		const gym = this.items.find(gym => gym.id === id);

		if (!gym) {
			return null;
		}

		return gym;
	}

	async findManyNearby(params: findManyNearbyParams, page: number){
		return this.items.filter(gym => {
			const distance = getDistanceBetweenCoordinates(
				{ latitude: params.latitude, longitude: params.longitude },
				{ latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
				)

			return distance < 10
			
			})
			.slice((page - 1) * 20, page * 20);
	}
	

	async searchMany(query: string, page: number) {
		const gyms = this.items.filter(gym => gym.title.includes(query)).slice((page - 1) * 20, page * 20);

		return gyms;
	}

	async create(data: Prisma.GymCreateInput) {
		const gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Prisma.Decimal(data.latitude.toString()),
			longitude: new Prisma.Decimal(data.longitude.toString()),
			created_at: new Date(),
		};

		this.items.push(gym);

		return gym;
	}

}