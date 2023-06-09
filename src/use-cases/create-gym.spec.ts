import { it, expect, describe, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repositories";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymUseCase(gymsRepository);
	});

	it("should be able to register create gym", async () => {

		const { gym } = await sut.execute({
			title: "Gym Name",
			description: null,
			phone: null,
			latitude: -27.209052,
			longitude: -49.640109,
		});

		expect(gym.id).toEqual(expect.any(String));
	});

});