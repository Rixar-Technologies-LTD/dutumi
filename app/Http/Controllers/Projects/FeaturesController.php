<?php

namespace App\Http\Controllers\Projects;

use App\Enums\FeatureStatus;
use App\Enums\TaskType;
use App\Http\Controllers\BaseController;
use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeaturesController extends BaseController
{

    public function getFeature(Request $request)
    {
        $projects = Project::query()->paginate(50);
        return $this->returnResponse("Projects",$projects);
    }

    public function addFeature(Request $request)
    {
        $request->validate([
            'project_id' => 'numeric|required',
            'parent_id' => 'numeric',
            'name' => 'required',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        $project = Task::query()->create([
            'project_id'=> $request->input('project_id'),
            'parent_id'=> $request->input('parent_id'),
            'creator_user_id'=> Auth::id(),
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'start_date' => Carbon::parse($request->input('start_date')),
            'end_date' => Carbon::parse($request->input('end_date')),
            'type' => TaskType::FEATURE->name,
            'status' => FeatureStatus::DEVELOPMENT->name
        ]);

        return $this->returnResponse("Projects",$project);
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
        return $this->returnResponse("Project Updated",$project);
    }

}
