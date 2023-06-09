import { it, expect, describe, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found";

let userRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {

	beforeEach(() => {
		userRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(userRepository);
	});

	it("should be able to get user profile", async () => {

		const createdUser = await userRepository.create({
			name: "John Doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 6)
		});

		const { user } = await sut.execute({
			userId: createdUser.id
		});

		expect(user.id).toEqual(expect.any(String));
		expect(user.name).toEqual("John Doe");

	});

	it("should not be able to get user profile with the wrong id", async () => {

		expect(() => sut.execute({
			userId: "wrong-id"
		})).rejects.toBeInstanceOf(ResourceNotFoundError);

	});

});