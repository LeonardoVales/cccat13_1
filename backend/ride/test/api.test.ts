import axios from "axios"

test("Deve criar uma conta de passageiro", async function () {
  const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}

  //when
  const responseSignup = await axios.post("http://localhost:3000/signup", input)
  const outputSignup = responseSignup.data
  //then
  const resposneGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`)
  const outputGetAccount = resposneGetAccount.data

  // expect(outputGetAccount.outputGetAccount_id).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
})