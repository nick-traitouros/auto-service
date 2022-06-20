import dayjs from 'dayjs';
import quoteModel from '../quoteModel'
import db from '../utils.js';

test('test the monthly premium math in quote model', () => {

  expect(quoteModel.calculateMonthlyPremium(21)).toBe(646.85);
  expect(quoteModel.calculateMonthlyPremium(35)).toBe(617.43);
  expect(quoteModel.calculateMonthlyPremium(78)).toBe(644.45);

  //two year olds should not be driving, but let's test some outlier cases
  expect(quoteModel.calculateMonthlyPremium(2)).toBe(699.77);
  expect(quoteModel.calculateMonthlyPremium(178)).toBe(1034.45);  

});

test('test the math for the premium earnings calculator' , () => {
  const current_date = dayjs("2022-06-19"); // Sunday, June 19th
  const policy_start_date = dayjs("2022-06-10"); // Friday, June 10th
  const policy_monthly_premium = 600;  

  //Test that a policy that costs $600 monthly that has been running for 9 days in June will total $180 in earnings
  // 600/30 = 20 per day
  // 9 * 20 = 180

  expect(quoteModel.policyEarningsBetweenDaysInMonth(current_date, policy_start_date, policy_monthly_premium)).toBe(180);
  
});

test('integration test to make database is working and some quotes exist', async () => {

  const sql_to_check_if_db_is_working_and_some_quotes_exist = "SELECT COUNT(*) as num_quotes FROM Quotes";
  const result = await db.get(sql_to_check_if_db_is_working_and_some_quotes_exist);
  
  expect(result.num_quotes).toBeGreaterThan(0);

});
