import express from 'express';
import CatalogService from '../controllers/CatalogService';

const catalogRouter = express.Router();

catalogRouter.get('/', CatalogService.viewCatalogItems);
catalogRouter.put('/', CatalogService.createCatalogItem);
catalogRouter.delete('/:id', CatalogService.deleteCatalogItem);
catalogRouter.delete('/inventory/:id', CatalogService.deleteInventoryItem);

catalogRouter.put('/:catalogItemId/inventory', CatalogService.addInventoryItem);

export { catalogRouter };
