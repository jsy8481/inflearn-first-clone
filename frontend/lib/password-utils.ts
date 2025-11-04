import bcrypt from 'bcryptjs';

// salt + hash password
export function saltAndHashPassword(password: string) {
    const saltsRounds = 10;
    const salt = bcrypt.genSaltSync(saltsRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export function comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
}