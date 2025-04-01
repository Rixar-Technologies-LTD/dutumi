<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\BaseController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UsersManagementController extends BaseController
{

    public function __construct()
    {

    }

    public function fetchUsers(): JsonResponse
    {

        /** @var LengthAwarePaginator $users */
        $users = User::query()->latest()
            ->where('default_workspace_id', Auth::user()?->default_workspace_id??'')
            ->with('workspace')
            ->paginate(25);

        return $this->returnListResponse('System Users', $users);
    }

    public function createUser(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::query()->create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'status' => $request->input('status',User::STATUS_ACTIVE),
            'default_workspace_id' => Auth::user()?->default_workspace_id??'',
            'password' => Hash::make($request->input('password')),
            'creator_id' => Auth::user()?->id??'',
            'creator_name' =>Auth::user()?->name??'',
            'is_active' => true
        ]);

        $responseData['users'] = $user;
        return $this->returnResponse('User Added', $responseData);
    }

    public function updateUser(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|numeric',
            'name' => 'required',
            'status' => 'required'
        ]);

        $user = User::query()->find($request->input('id'));
        if (!$user) {
            return $this->clientError("User not found", [], 400);
        }

        $user->name = $request->input('name');
        $user->status = $request->input('status');
        $user->save();

        $responseData['user'] = $user;
        return $this->returnResponse('User updated', $responseData);

    }

    public function resetUserPassword(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|numeric',
            'newPassword' => 'required|min:6'
        ]);

        $user = User::query()->find($request->input('id'));
        if (!$user) {
            return $this->clientError("User not found", [], 400);
        }

        $user->password = Hash::make($request->input('newPassword'));
        $user->save();

        $responseData['user'] = $user;
        return $this->returnResponse('User password updated', $responseData);

    }

    public function fetchSystemPermissions(Request $request): JsonResponse
    {

        $permissions = Permission::all();
        $responseData['permissions'] = User::formatPermissions($permissions);
        return $this->returnResponse('System Permissions', $responseData);
    }

    public function assignPermissionsToUser(Request $request): JsonResponse
    {
        Log::info("updating permissions: " . json_encode($request->input()));
        $request->validate([
            'userId' => 'required|numeric',
            'permissions_names' => 'required|array'
        ]);

        $user = User::query()->find($request->input('userId'));
        if (!$user) {
            return $this->clientError("User not found", [], 400);
        }

        $user->syncPermissions($request->input('permissions_names'));

        $responseData['user'] = $user;
        $responseData['assignedPermissions'] = $user->getPermissionNames();
        return $this->returnResponse('System Permissions', $responseData);
    }


}




























