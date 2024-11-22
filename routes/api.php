<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Projects\ProjectsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');


Route::prefix('v1/auth')->group(function () {

    Route::post('login', [LoginController::class,'login']);

});


Route::prefix('v1/projects')->group(function () {

    Route::get('list', [ProjectsController::class,'getProject']);

});
