import db from './utils.js';
import dayjs from 'dayjs';

const quoteModel = {

    /**
     * Calculates the amount of dollars earned from all policies created so far this month
     * @param {Number} days_into_current_month - amount of days to look back to find new policies created this month
     * @return {Number} amount of dollars - earned by the policies created this month
     */

    async searchPremiumsForCurrentMonth(days_into_current_month) {        

        //we know how far we are into the current month from the controller
        //our model should only interact with the datastore and deal with the business logic        
        
        const policies_sold_this_month = await this.searchPoliciesSoldSinceDaysAgo(days_into_current_month);

        let total_for_current_month = 0;

        policies_sold_this_month.forEach(policy => {

            //for each policy, lets handle the logic for calculating how much we've earned in our helper function
            //this loop is only about adding the totals and sending the correct data to our helper function

            total_for_current_month += this.policyEarningsBetweenDaysInMonth(dayjs(), dayjs(policy.created_at), policy.monthly_premium)
        });

        return total_for_current_month;
    },

    /**
     * Calculate the earnings of a policy that has been active between who days in a certain month, the most granular unit of time for these calculations is a full day (for example: we don't account for half days)
     * @param {dayjs} measurement_date - the end date of the timeframe we are measuring
     * @param {dayjs} policy_start_date - the start date of the timeframe we are measuring 
     * @param {Number} policy_monthly_premium - how much the policy costs per month
     * @return {Number} amount of dollars earned by the policy between these two dates in the same month
     */

    policyEarningsBetweenDaysInMonth(measurement_date, policy_start_date, policy_monthly_premium) {

        //this function is easily testable because it is agnostic to the current date in the real world
        //when this function is called by our controller, measurement date will be the current date

        //we are simply calculating the earnings between two dates here

        const days_this_month = measurement_date.daysInMonth();    
        const cost_per_day = (policy_monthly_premium / days_this_month);
        const days_this_policy_has_been_active = measurement_date.date() - policy_start_date.date();

        return Number((cost_per_day * days_this_policy_has_been_active).toFixed(2));      
    },   

    /**
     * Create a new quote by calculating the 6 month premium based on a user's age, and add it to our DB
     * @param {String} name - user's full name 
     * @param {String} zip_code - user's zip_code 
     * @param {Date} date_of_birth - user's date of birth in DATE format (ex: 1983-08-04)
     * @return {Object} object that shows the six month premium for this quote and the id of the newly added quote 
     */

    async addQuote(name, zip_code, date_of_birth) {

        const todays_date_timestamp = Math.floor(+new Date() / 1000);
        const policy_holders_age_in_years = Math.floor((todays_date_timestamp - dayjs(date_of_birth).unix()) / 86400 / 365);
        const per_month_premium = quoteModel.calculateMonthlyPremium(policy_holders_age_in_years);
        const sql = "INSERT INTO quotes (name,zip_code,date_of_birth,monthly_premium)VALUES(?,?,?,?)";
        const params = [name, zip_code, date_of_birth, per_month_premium];
        const result = await db.run(sql,params);
        const new_quote_id = result.lastID;

        return { 
                 "six_month_premium" : (per_month_premium * 6).toFixed(2),
                 "new_quote_id" : new_quote_id
               }
    },

    /**
     * Return quotes that fit the search criteria, we can search on any field in the DB
     * @param {Array} search_params - key value pair of fields to search on, any DB field (id, zip_code, name, monthly_premium, created_at) can be used
     * @param {Boolean} only_return_most_recent_one - flag for returning only the most recent quote that meets search criteria
     * @return {Array} collection of objects representing policies that meet the search criteria
     */

    async findQuotes(search_params, only_return_most_recent_one = false) {

        let where_clause = "";

        for( let key in search_params){
            where_clause += " AND " + key + " = \"" + search_params[key] + "\"";
        }

        //SQL Injection possibility here
        const sql = "SELECT * from quotes WHERE 1=1 " + where_clause + ( only_return_most_recent_one ? " ORDER BY id DESC LIMIT 1" : "" );

        const quotes = await db.all(sql);

        return quotes;
    },

    /**
     * Search for all policies that have been created since a certain amount of hours ago, and allow filtering by zip_code and six month cost
     * @param {Number} hours_ago - search policies with a created_at date equal to, or more recent, than this many hours ago
     * @param {String} zip_code - zip_code of policy holder to filter on
     * @param {Number} greater_than - return policies greater than this number
     * @param {Number} less_than - return policies less than this number
     * @return {Array} collection of objects representing policies that meet the filtering criteria
     */

    async searchQuotesInPastHours(hours_ago, zip_code, greater_than, less_than) {

        //SQL Injection possibility here
        let where_clause = "where created_at > datetime('now', ?)";        

        where_clause += (zip_code) ? " AND zip_code = \"" + zip_code + "\"" : "";
        where_clause += (greater_than) ? " AND monthly_premium > \"" + (greater_than / 6) + "\"" : "";
        where_clause += (less_than) ? " AND monthly_premium < \"" + (less_than / 6) + "\"" : "";

        return await db.all("SELECT * from quotes "+ where_clause, ['-'+hours_ago+' hours']);
    },

    /**
     * Calculate a monthly premium for a quote based on the policy holder's age
     * @param {Number} policy_holders_age_in_years - age of the policy holder in years
     * @return {Number} cost of this policy in dollars and cents per month
     */

    calculateMonthlyPremium(policy_holders_age_in_years) {

        return Number((600 + (0.3 * Math.pow(Math.abs(policy_holders_age_in_years - 50), 1.5))).toFixed(2));
    },

    /**
     * Searches for all policies that have been created within "days_ago" days
     * @param {Number} days_ago - number of days to look back to find policies 
     * @return {Array} collection of objects representing policies sold
     */
    
    async searchPoliciesSoldSinceDaysAgo(days_ago) {

        //SQL Injection possibility here
        const policies_sold_this_month = await db.all("SELECT * from quotes where created_at > datetime('now', ?)", ['-'+ days_ago +' days']);

        return policies_sold_this_month;
    }

}

export default quoteModel
