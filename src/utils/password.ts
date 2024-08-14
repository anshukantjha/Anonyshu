import bcrypt from "bcryptjs";

async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
}

async function comparePassword(
  givenPass: string,
  origPass: string
): Promise<boolean> {
  const isPasswordCorrect = bcrypt.compare(givenPass, origPass);
  return isPasswordCorrect;
}

export { hashPassword, comparePassword };
