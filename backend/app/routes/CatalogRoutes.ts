import express from 'express';
import CatalogService from '../controllers/CatalogService';

const catalogRouter = express.Router();

// catalogRouter.post('/', CatalogService.___);
catalogRouter.get('/', CatalogService.viewCatalogItems);

export { catalogRouter };
