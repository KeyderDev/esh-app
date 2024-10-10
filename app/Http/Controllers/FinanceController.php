<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use YahooFinanceAPI;

class FinanceController extends Controller
{
    public function getStockPrices()
    {
        $yahooFinance = new YahooFinanceAPI();
        $stocks = ['AAPL', 'GOOGL', 'AMZN']; 
        $data = [];

        foreach ($stocks as $stock) {
            $data[$stock] = $yahooFinance->getQuote($stock);
        }

        return response()->json($data);
    }
}
?>