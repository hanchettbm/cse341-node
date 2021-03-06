const connect = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  try {
    const results = await connect.getCollection().find();
    results.toArray().then((documents) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(documents);
      console.log("Returned All Contacts");
    });
  } catch (err) {
    res.status (500) .json(err);
  }
};

const getSingle = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const results = await connect.getCollection().find({_id: contactId});
    results.toArray().then((documents) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(documents[0]);
      console.log(`Returned Contact ${req.params.id}`);
    });
  } catch (err) {
    res.status (500) .json(err);
  }
};

const createContact = async (req, res) => {
  try {
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await connect.getCollection('contacts').insertOne(contact);
    if (response.acknowledged) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'An error occurred: could not create contact.');
    }
  } catch (err) {
    res.status (500) .json(err);
  }
};

const updateContact = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const results = await connect.getCollection('contacts').replaceOne({ _id: contactId }, contact);
    console.log(results);
    if (results.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(results.error || 'An error occurred: Can not update the contact.');
    }
  } catch (err) {
    res.status (500) .json(err);
  }
};

const deleteContact = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const results = await connect.getCollection('contacts').deleteOne({ _id: contactId }, true);
    console.log(results);
    if (results.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(results.error || 'An error occurred: Can not delete the contact.');
    }
  } catch (err) {
    res.status (500) .json(err);
  }
};

  module.exports = { getAll, getSingle, createContact, updateContact, deleteContact };