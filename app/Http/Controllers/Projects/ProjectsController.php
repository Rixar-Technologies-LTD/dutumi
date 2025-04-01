<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\BaseController;
use App\Models\Project;
use App\Services\ProjectsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectsController extends BaseController
{

    public function getProjects(Request $request)
    {
        $projects = Project::query()
            ->where('workspace_id', Auth::user()?->default_workspace_id ?? '')
            ->paginate(50);
        return $this->returnResponse("Projects", $projects);
    }

    public function getProjectDetails(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric'
        ]);
        $projects = Project::query()
            ->where('workspace_id', Auth::user()?->default_workspace_id ?? '')
            ->where('id', $request->input('id'))
            ->first();
        return $this->returnResponse("Projects", $projects);
    }

    public function addProject(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'type' => 'required',
            'start_date' => 'required|date',
            'mvp_date' => 'required|date',
        ]);

        $project = Project::query()->create([
            'owner_user_id' => Auth::id(),
            'workspace_id' => Auth::user()?->default_workspace_id ?? '',
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'type' => $request->input('type'),
            'start_date' => Carbon::parse($request->input('start_date')),
            'mvp_date' => Carbon::parse($request->input('mvp_date')),
            'status' => Project::$STATUS_ACTIVE
        ]);

        ProjectsService::addProjectMember($project->id, Auth::id());

        return $this->returnResponse("Projects", $project);
    }

    public function updateProject(Request $request)
    {

        $request->validate([
            'id' => 'required|exists:projects,id',
            'name' => 'required',
            'description' => 'required',
            'type' => 'required',
            'start_date' => 'required|date',
            'mvp_date' => 'required|date',
        ]);

        $project = Project::query()->where(['id' => $request->input('id')])
            ->update([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'type' => $request->input('type'),
                'start_date' => Carbon::parse($request->input('start_date')),
                'mvp_date' => Carbon::parse($request->input('mvp_date'))
            ]);
        return $this->returnResponse("Project Updated", $project);
    }

}
