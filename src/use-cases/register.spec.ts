import { it, expect, describe, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exits-error";

let userRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
	beforeEach(() => {
		userRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(userRepository);
	});

	it("should be able to register a new user", async () => {

		const { user } = await sut.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "123456"
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should hash a user password upon registration", async () => {

		const { user } = await sut.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "123456"
		});

		const isPasswordCorrectlyHashed = await compare("123456", user.password_hash);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it("should not be able to register a new user with an email that is already in use", async () => {

		const email = "johndoe@example.com";

		await sut.execute({
			name: "John Doe",
			email,
			password: "123456"
		});

		expect(async () =>
			await sut.execute({
				name: "John Doe",
				email,
				password: "123456"
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError);

	});
});