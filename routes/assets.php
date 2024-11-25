<?php


use App\Http\Controllers\Projects\ProjectsController;
use App\Http\Controllers\Users\UsersManagementController;
use Illuminate\Support\Facades\Route;


Route::prefix('v1/assets/groups')->middleware('auth:api')->group(function () {

    Route::get('list', [ProjectsController::class, 'getProjects']);
    Route::post('add', [ProjectsController::class, 'addProject']);
    Route::post('update', [ProjectsController::class, 'updateProject']);
    Route::get('details', [ProjectsController::class, 'getProjectDetails']);

});



Route::prefix("/v1/assets")->middleware('auth:api')->group(function () {
    Route::get('/', [UsersManagementController::class, 'fetchUsers']);
    Route::post('/add', [UsersManagementController::class, 'createUser']);
    Route::post('/update', [UsersManagementController::class, 'updateUser']);
});
