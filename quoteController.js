import quoteModel from './quoteModel.js';
import dayjs from 'dayjs';

const quoteController = {

     async searchPremiumsForCurrentMonth(req, res) {

        const days_into_current_month = dayjs().date() - 1; // how many days have passed since the beginning of the month        
        const premiums = await quoteModel.searchPremiumsForCurrentMonth(days_into_current_month);

        return res.send({"premiums this month so far":premiums});
     },

    async searchQuotes(req, res, only_return_most_recent_quote = false) {

        const search_params = req.query;
        const quotes = await quoteModel.findQuotes(search_params, only_return_most_recent_quote);        

        return res.send(quotes);
    },

    async searchQuotesInPastHours(req, res) {        

        const hours_ago = req.params.hours;
        const zip_code = req.query.zip_code;
        const greater_than = req.query.greater_than;
        const less_than = req.query.less_than;
        const quotes = await quoteModel.searchQuotesInPastHours(hours_ago, zip_code, greater_than, less_than);

        return res.send(quotes);
    },

    async addQuote(req, res) {

        const name = req.body.name;
        const zip_code = req.body.zip_code;
        const date_of_birth = req.body.date_of_birth;
        const new_quote_details = await quoteModel.addQuote(name, zip_code, date_of_birth);

        return res.send({
                         "six_month_premium" : new_quote_details.six_month_premium,
                         "quote_id" : new_quote_details.new_quote_id
                        });
    }

}

export default quoteController;