import express from 'express';
import CatalogService from '../controllers/CatalogService';

const catalogRouter = express.Router();

catalogRouter.get('/', CatalogService.viewCatalogItems);
catalogRouter.put('/', CatalogService.createCatalogItem);

export { catalogRouter };
