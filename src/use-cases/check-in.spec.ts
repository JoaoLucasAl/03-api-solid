import { it, expect, describe, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";


let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Check-n Use Case", () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new CheckInUseCase(checkInsRepository);
	});

	it("should be able to check in", async () => {

		const { checkIn } = await sut.execute({
			gymId: "gym-id",
			userId: "user-id"
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});


});