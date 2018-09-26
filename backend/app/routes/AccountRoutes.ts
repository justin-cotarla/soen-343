import express from 'express';
import AccountService from '../controllers/AccountService';


const router = express.Router();

router.post('/account/login', AccountService.login);

export { router };