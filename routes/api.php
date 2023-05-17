<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//contact crud routes
Route::get("contacts", [ContactController::class, "index"]);
Route::post("contacts", [ContactController::class, "store"]);
Route::patch("contacts/{id}", [ContactController::class, "update"]);
Route::delete("contacts/{id}", [ContactController::class, "destroy"]);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
