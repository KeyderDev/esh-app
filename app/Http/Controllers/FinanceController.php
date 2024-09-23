<?php

// app/Http/Controllers/FinanceController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use YahooFinanceAPI;

class FinanceController extends Controller
{
    public function getStockPrices()
    {
        $yahooFinance = new YahooFinanceAPI();
        $stocks = ['AAPL', 'GOOGL', 'AMZN']; // Aquí puedes poner los símbolos que quieras
        $data = [];

        foreach ($stocks as $stock) {
            $data[$stock] = $yahooFinance->getQuote($stock);
        }

        return response()->json($data);
    }
}
?>