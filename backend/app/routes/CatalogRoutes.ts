import express from 'express';
import CatalogService from '../controllers/CatalogService';

const catalogRouter = express.Router();

catalogRouter.put('/', CatalogService.createCatalogItem);

export { catalogRouter };
