import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repositories";
import { it, expect, describe, beforeEach } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
	beforeEach(async() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new FetchNearbyGymsUseCase(gymsRepository);

	});

	it("should be able to fetch nearby gyms", async () => {

		await gymsRepository.create({
			title: "Near Gym",
			description: null,
			phone: null,
			latitude: -27.209052,
			longitude: -49.640109,
		});

		await gymsRepository.create({
			title: "Far Gym",
			description: null,
			phone: null,
			latitude: -27.0610928,
			longitude: -49.5229501,
		});

		const { gyms } = await sut.execute({
			userLatitude: -27.209052,
			userLongitude: -49.640109,
            page: 1
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({title: "Near Gym"})]);
	});

	it("should be able to fetch paginated near gyms", async () => {

		for(let i = 1; i <= 22; i++){
			await gymsRepository.create({
				title: `Gym Number ${i}`,
				description: null,
				phone: null,
				latitude: -27.209052,
				longitude: -49.640109,
			});
		}

		const { gyms } = await sut.execute({
			userLatitude: -27.209052,
			userLongitude: -49.640109,
			page: 2
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({title: "Gym Number 21"}),
			expect.objectContaining({title: "Gym Number 22"}),
		]);
	});
});