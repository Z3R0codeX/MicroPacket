<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Estas líneas son el "GPS" para que Laravel encuentre tus controladores
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MicroPackageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\UserController;
// Agrega estos si ya creaste los archivos para propuestas y reseñas
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\PaymentController;

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

/*
|--------------------------------------------------------------------------
| Rutas Públicas (No requieren Token)
|--------------------------------------------------------------------------
*/

// Autenticación básica
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Visualización de catálogo (Para que el Home de la app funcione sin loguearse)
Route::get('categories', [CategoryController::class, 'index']);
Route::get('micro-packages', [MicroPackageController::class, 'index']);
Route::get('micro-packages/{id}', [MicroPackageController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Rutas Protegidas (Requieren Token Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('my-packages', [MicroPackageController::class, 'myPackages']);

    Route::put('/user/update', [AuthController::class, 'updateProfile']);
    
    // Gestión de usuario y salida
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('logout', [AuthController::class, 'logout']);

    // CRUD completo de recursos
    // Usamos apiResource para ahorrar líneas (index, store, show, update, destroy)
    Route::apiResource('categories', CategoryController::class)->except(['index']); 
    Route::apiResource('micro-packages', MicroPackageController::class)->except(['index', 'show']);
    Route::apiResource('orders', OrderController::class);
    
    // Payment intent for orders
    Route::post('orders/{id}/payment-intent', [PaymentController::class, 'createPaymentIntent']);
    
    // Otros recursos de MicroPacket
    Route::apiResource('proposals', ProposalController::class);
    Route::apiResource('requests', RequestController::class);
    Route::apiResource('reviews', ReviewController::class);
});

// Estas quedan fuera para que cualquiera las vea sin loguearse
Route::get('micro-packages', [MicroPackageController::class, 'index']);
Route::get('micro-packages/{id}', [MicroPackageController::class, 'show']);