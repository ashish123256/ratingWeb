import * as storeService from '../services/store.services.js';

export const getAllStores = async (req, res) => {
  try {
    const stores = await storeService.getAllStores(req.query);
    res.status(200).send(stores);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getStore = async (req, res) => {
  try {
    const store = await storeService.getStoreById(req.params.id);
    res.status(200).send(store);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export const createStore = async (req, res) => {
  try {
    const store = await storeService.createStore(req.body);
    res.status(201).send(store);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const updateStore = async (req, res) => {
  try {
    const store = await storeService.updateStore(req.params.id, req.body);
    res.status(200).send(store);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const deleteStore = async (req, res) => {
  try {
    await storeService.deleteStore(req.params.id);
    res.status(200).send({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};