<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\BaseController;
use App\Models\Project;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProjectsController extends BaseController
{

    /**
     * Display the user's profile form.
     */
    public function getProject(Request $request)
    {
        $projects = Project::query()->paginate(50);
        return $this->returnResponse("Projects",$projects);
    }


    /**
     * Display the user's profile form.
     */
    public function addProject(Request $request)
    {
        $request->validate([
            'project_name' => 'required',
            'project_description' => 'required',
            'project_type' => 'required',
            'start_date' => 'required|date',
            'mvp_date' => 'required|date',
        ]);

        $project = Project::query()->create([
            'owner_user_id'=> Auth::id(),
            'project_name' => $request->input('project_name'),
            'project_description' => $request->input('project_name'),
            'project_type' => $request->input('project_name'),
            'start_date' => $request->input('start_date'),
            'mvp_date' => $request->input('project_name'),
            'status' => Project::$STATUS_ACTIVE
        ]);

        return $this->returnResponse("Projects",$project);
    }


    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

}
