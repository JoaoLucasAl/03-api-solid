import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repositories";
import { it, expect, describe, beforeEach } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
	beforeEach(async() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymsUseCase(gymsRepository);

	});

	it("should be able to search for gyms", async () => {

		await gymsRepository.create({
			title: "JavaScript Gym",
			description: null,
			phone: null,
			latitude: -27.209052,
			longitude: -49.640109,
		});

		await gymsRepository.create({
			title: "TypeScript Gym",
			description: null,
			phone: null,
			latitude: -27.209052,
			longitude: -49.640109,
		});

		const { gyms } = await sut.execute({
			query: "TypeScript",
			page: 1
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({title: "TypeScript Gym"})]);
	});

	it("should be able to fetch paginated gyms search", async () => {

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
			query: "Gym",
			page: 2
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({title: "Gym Number 21"}),
			expect.objectContaining({title: "Gym Number 22"}),
		]);
	});
});