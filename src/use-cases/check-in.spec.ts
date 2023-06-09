import { it, expect, describe, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repositories";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
	beforeEach(async() => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: "gym-id",
			title: "Gym Name",
			description: "",
			phone: "",
			latitude: 0,
			longitude: 0
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check in", async () => {

		const { checkIn } = await sut.execute({
			gymId: "gym-id",
			userId: "user-id",
			userLatitude: 0,
			userLongitude: 0
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice in the same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-id",
			userId: "user-id",
			userLatitude: 0,
			userLongitude: 0
		});

		expect(async () =>  await sut.execute({
			gymId: "gym-id",
			userId: "user-id",
			userLatitude: 0,
			userLongitude: 0
		})).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it("should not be able to check in twice in but in different days", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
		
		await sut.execute({
			gymId: "gym-id",
			userId: "user-id",
			userLatitude: 0,
			userLongitude: 0
		});
		
		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gym-id",
			userId: "user-id",
			userLatitude: 0,
			userLongitude: 0
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in on distant gym", async () => {

		gymsRepository.items.push({
			id: "gym-id-02",
			title: "Gym Name",
			description: "",
			phone: "",
			latitude: new Decimal(-27.0747279),
			longitude: new Decimal(-49.4889672)
		});

		await expect(async () => await 
		sut.execute({
			gymId: "gym-id-02",
			userId: "user-id",
			userLatitude: -27.209052,
			userLongitude: -49.640109,
		})).rejects.toBeInstanceOf(MaxDistanceError);
	});
});