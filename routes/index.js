const express = require('express');
const csv = require('csvtojson');
const router = express.Router();

const mongoose = require('mongoose');
const Survey = require('../models/survey');

const csvFilePath = `${__dirname}/../public/files/survey.csv`;

router
  .get('/', (req, res) => {
    res.sendFile(path.join(`${__dirname}/index.html`));
  })
  .get('/import', async (req, res) => {
    try {
      const jsonArray = await csv().fromFile(csvFilePath);
      for (const result of jsonArray) {
        const replaceKeysArray = [
          ['timeStamp', 'Timestamp'],
          ['name', "What's your name?"],
          ['email', 'Email Address'],
          ['office', 'Which office are you from?']
        ];
        for (const [newKey, replacedKey] of replaceKeysArray) {
          result[newKey] = result[replacedKey];
          delete result[replacedKey];
        }
        const objectKeys = Object.keys(result);
        const actionPlanKeys = objectKeys.filter(key => {
          return key.includes('Action Plan');
        });
        categories = [];
        for (const item of actionPlanKeys) {
          const pattern = /(?<=\[).*(?=\]$)/;
          const amendedKey = item.match(pattern)[0];
          const object = {
            name: amendedKey,
            level: result[amendedKey],
            action: result[item] ? result[item].split(', ') : []
          };
          delete result[amendedKey];
          delete result[item];
          categories.push(object);
        }
        result.categories = categories;
      }
      const db = mongoose.connection;
      await db.dropCollection('surveys');
      // await Survey.collection.deleteMany({});
      const savedResults = await Survey.insertMany(jsonArray);
      res.status(200).json(savedResults);
    } catch (error) {
      console.error(error);
    }
  });

module.exports = router;
