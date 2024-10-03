import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { initDatabase } from './database';

const router = express.Router();

const SECRET_KEY = 'sua_chave_secreta';

router.post('/register', async (req: Request, res: Response) => {
    const { name, cpf, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = await initDatabase();
    
    try {
        await db.run(`INSERT INTO users (name, cpf, email, password) VALUES (?, ?, ?, ?)`, [name, cpf, email, hashedPassword]);
        res.status(201).json({ message: 'Usuario registrado com sucesso' });
    } catch (error) {
        res.status(400).json({ error: 'Usuário já existe' });
    }

});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const db = await initDatabase();
    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user.id, email: user.email
    }, SECRET_KEY, {expiresIn: '1h',});
    
    res.json({ token });

    } else {
        res.status(401).json({ error: 'Credenciais inválidas'});
    }
});
export default router;