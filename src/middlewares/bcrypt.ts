import bcrypt from 'bcrypt'

export const generatePassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
}

export const comparePassword = (password1: string, password2: string): Promise<boolean>=>{
    return bcrypt.compare(password1, password2)
}