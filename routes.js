import express from 'express';
import quoteController from './quoteController.js';

var router = express.Router();

router.post('/quote', (req, res) => quoteController.addQuote(req, res));
router.get('/quote/search/:hours', (req, res) => quoteController.searchQuotesInPastHours(req, res));
router.get('/quote/search', (req, res) => quoteController.searchQuotes(req, res));
router.get('/premiums', (req, res) => quoteController.searchPremiumsForCurrentMonth(req, res));

export default router;

/**
 * 
 * /**
 * @swagger
 * components:
 *   schemas:
 *     Quote:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The quote ID.
 *           example: 1
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: Ada Lovelace
 *         zip_code:
 *           type: string
 *           description: The user's zip code.
 *           example: 12561
 *         monthly_premium:
 *           type: number
 *           description: The user's monthly premium.
 *           example: 12342.10
 *         created_at:
 *           type: timestamp
 *           description: The time this quote was created.
 *           example: "2022-06-12 20:11:22"

*/

/** 
 * @swagger
 * /quote:
 *   post:
 *     summary: Get a quote for 6 months of auto insurance.
 *     description: Calculates a quote for 6 months of auto insurance for a user based on their age.  This quote is saved to our system as a policy.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *                 example: Ada Lovelace
 *               zip_code:
 *                 type: string
 *                 description: The user's zip code
 *                 example: 12561
 *               date_of_birth:
 *                 type: date
 *                 description: The user's birthdate 
 *                 example: "1983-08-04"
 * 
 *     responses:
 *       200:
 *         description: Price of the policy for 6 months and a quote id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  six_month_premium:
 *                    type: number
 *                    description: Cost of the policy for 6 months
 *                    example: 620.43
 *                  quote_id:
 *                    type: integer
 *                    description: The ID of the policy in our system
 *                    example: 23
 */


/**
 * @swagger
 * /quote/search/:hours:
 *   get:
 *     summary: Retrieve a list of all recent quotes within a certain amount of hours.
 *     description: Search all quotes within the amount of hours passed in, also use parameters to filter these quotes
 *     parameters: 
 *       - in: path
 *         name: hours
 *         required: true
 *         description: return recent quotes that were made within this number of hours
 *         example: 12
 *         schema:
 *           type: string
 * 
 *       - in: path
 *         name: name
 *         required: false
 *         description: filter for policies for a certain name
 *         example: Ada Lovelace
 *         schema:
 *           type: string

 *       - in: path
 *         name: zip_code
 *         required: false
 *         description: filter for policies in a certain zip code
 *         example: 11803
 *         schema:
 *           type: string

 *       - in: path
 *         name: greater_than
 *         required: false
 *         description:  filter for policies with a six month cost greater than entered number
 *         example: 10000
 *         schema:
 *           type: integer
 * 
 *       - in: path
 *         name: less_than
 *         required: false
 *         description: filter for policies with a six month cost less than entered number 
 *         example: 100000
 *         schema:
 *           type: integer 
 * 
 * 
 *     responses:
 *       200:
 *         description: List of policies that meet the filtering criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  $ref: '#/components/schemas/Quote'
 */

/**
 * @swagger
 * /premiums:
 *   get:
 *     summary: Returns the amount of premiums earned for this month so far from new policies
 *     description: Calculates earnings so far for all policies started this month. Assumes that all quotes turned into policies, and that no policies have been canceled.
 *     responses:
 *       200:
 *         description: Price of the policy for 6 months and a quote id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  premiums this month so far:
 *                    type: number
 *                    description: Total of premiums from all policies started this month
 *                    example: 1620.43
 */


/**
 * @swagger
 * /quote/search:
 *   get:
 *     summary: Retrieve a filtered list of all quotes
 *     description: Search all quotes filtered by zip code, name, id and creation time or monthly_premium
 *     parameters: 
 * 
 *       - in: path
 *         name: name
 *         required: false
 *         description: filter for policies for a certain name
 *         example: Ada Lovelace
 *         schema:
 *           type: string

 *       - in: path
 *         name: zip_code
 *         required: false
 *         description: filter for policies in a certain zip code
 *         example: 11803
 *         schema:
 *           type: string


 *       - in: path
 *         name: created_at
 *         required: false
 *         description: filter for policies by a certain creation time
 *         example: "2022-06-12 20:11:22"
 *         schema:
 *           type: datetime


 *       - in: path
 *         name: monthly_premium
 *         required: false
 *         description: filter for policies by a certain monthly premium
 *         example: 2342.23
 *         schema:
 *           type: number

 *       - in: path
 *         name: id
 *         required: false
 *         description: filter for policies by a certain id
 *         example: 12
 *         schema:
 *           type: integer

 * 
 * 
 *     responses:
 *       200:
 *         description: List of policies that meet the filtering criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  $ref: '#/components/schemas/Quote'
 */
