<?php

namespace App\Http\Controllers\Auth\Auth;

use App\Http\Controllers\BaseController;
use App\Models\User;
use App\Models\WorkSpace;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class RegistrationController extends BaseController
{


    /**
     * Update the user's password.
     */
    public function register(Request $request): JsonResponse
    {

        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'min:6'],
            'fullName' => ['required'],
            'workspaceName' => ['required']
        ]);

        $user = User::query()->where(['email' => $request->input('email')])->first();
        if ($user) {
            return $this->clientError('User already exists', ["User does not exist"], 412);
        }

        $user = User::query()->create([
            'name' => $request->input('fullName'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password'))
        ]);

        $workspace = WorkSpace::query()->create([
            'user_id' => $user->id,
            'name' => $request->input('workspaceName'),
            'status' => WorkSpace::STATUS_ACTIVE
        ]);

        // Set Default Workspace
        $user->default_workspace_id = $workspace->id;
        $user->last_login_at = Carbon::now();
        $user->logins_count = ($user->logins_count)+1;
        $user->save();

        $personalAccessTokenResult = $user->createToken('api');
        $responseData['accessToken'] = $personalAccessTokenResult->accessToken;
        $responseData['user'] = $user;
        $responseData['workspace'] = $workspace;
        return $this->returnResponse('User Registered Successfully', $responseData);

    }

}
