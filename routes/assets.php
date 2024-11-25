<?php


use App\Http\Controllers\Assets\AssetsController;
use App\Http\Controllers\Assets\AssetsGroupsController;
use Illuminate\Support\Facades\Route;


Route::prefix('v1/assets/groups')->middleware('auth:api')->group(function () {

    Route::get('', [AssetsGroupsController::class, 'getAssetGroups']);
    Route::post('add', [AssetsGroupsController::class, 'addAssetGroup']);
    Route::post('update', [AssetsGroupsController::class, 'updateGroup']);
    Route::get('details', [AssetsGroupsController::class, 'getAssetGroupDetails']);

});


Route::prefix("/v1/assets")->middleware('auth:api')->group(function () {
    Route::get('/', [AssetsController::class, 'getAssets']);
    Route::post('/add', [AssetsController::class, 'addAsset']);
    Route::post('/update', [AssetsController::class, 'updateAsset']);
    Route::get('/details', [AssetsController::class, 'getAssetDetails']);
});

