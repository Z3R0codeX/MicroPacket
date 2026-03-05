<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MicroPackageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('login', [\App\Http\Controllers\AuthController::class, 'login']);

// protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [\App\Http\Controllers\AuthController::class, 'logout']);

    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('micro-packages', MicroPackageController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('proposals', ProposalController::class);
    Route::apiResource('requests', RequestController::class);
    Route::apiResource('reviews', ReviewController::class);
});

// endpoints that don't require auth
Route::get('categories', [CategoryController::class, 'index']);
Route::get('micro-packages', [MicroPackageController::class, 'index']);
