<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Projects\ProjectsController;
use App\Http\Controllers\Users\UsersManagementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');


Route::prefix('v1/auth')->group(function () {
    Route::post('login', [LoginController::class,'login']);
});


Route::prefix('v1/projects')->middleware('auth:api')->group(function () {

    Route::get('list', [ProjectsController::class,'getProject']);
    Route::post('add', [ProjectsController::class,'addProject']);
    Route::post('update', [ProjectsController::class,'updateProject']);

    Route::get('members', [ProjectsController::class,'fetchProjectMembers']);
    Route::post('members/add', [ProjectsController::class,'addProjectMember']);
    Route::post('members/remove', [ProjectsController::class,'removeProjectMember']);

});



Route::prefix("/v1/admin/users")->middleware('auth:api')->group(function(){
    Route::get('/', [UsersManagementController::class,'fetchUsers']);
    Route::post('/add', [UsersManagementController::class,'createUser']);
    Route::post('/update', [UsersManagementController::class,'updateUser']);
    Route::post('/password/reset', [UsersManagementController::class,'resetUserPassword']);

    Route::get('/permissions/all', [UsersManagementController::class,'fetchSystemPermissions']);
    Route::post('/permissions/assign', [UsersManagementController::class,'assignPermissionsToUser']);
});
