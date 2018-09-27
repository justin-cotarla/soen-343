import express from 'express';
import AccountService from '../controllers/AccountService';

const router = express.Router();

router.post('/login', AccountService.login);
router.post('/register', AccountService.createAccount);

export { router };
