<?php

namespace App\Http\Controllers\Assets;

use App\Dtos\Feature;
use App\Enums\FeatureStatus;
use App\Enums\TaskType;
use App\Http\Controllers\BaseController;
use App\Models\Task;
use App\Models\TaskActivity;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AssetsGroupsController extends BaseController
{

    public function getAssetGroup(Request $request)
    {

        $projects = A::query()->where(['project_id' => $request->input('projectId')])
            ->whereNull('parent_id')
            ->with(['creator', 'champion', 'designer', 'implementor', 'tester', 'approver', 'deployer'])
            ->paginate(50);


        return $this->returnResponse("Top Level Features", $projects);
    }





    public function getDetails(Request $request)
    {
        $feature = Task::query()->where(['id' => $request->input('id')])
            ->with(['creator', 'champion', 'designer', 'implementor', 'tester', 'approver', 'deployer'])
            ->first();
        if (!$feature) {
            return $this->clientError("Feature Not Found");
        }

        $topParent = Feature::query()->where(['id' => $feature->parent_id])
            ->with(['parent'])
            ->first();

        $parents[] = [
            'id' => $feature->id,
            'name' => $feature->name,
        ];

        while ($topParent != null) {
            $parents[] = [
                'id' => $topParent->id,
                'name' => $topParent->name,
            ];
            $topParent = $topParent->parent;
        }

        $responseData['parents'] = array_reverse($parents);
        $responseData['feature'] = $feature;
        return $this->returnResponse("Feature Details", $responseData);
    }

    public function getSubFeatures(Request $request)
    {
        $projects = Task::query()->where(['parent_id' => $request->input('parentId')])
            ->with(['creator'])
            ->paginate(50);
        return $this->returnResponse("Sub features", $projects);
    }

    public function addFeature(Request $request)
    {
        Log::info("new feature: " . json_encode($request->all()));
        $request->validate([
            'project_id' => 'numeric|required',
            'champion_id' => 'numeric',
            'name' => 'required',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        $project = Task::query()->create([
            'project_id' => $request->input('project_id'),
            'parent_id' => $request->input('parent_id'),
            'champion_id' => $request->input('champion_id'),
            'creator_id' => Auth::id(),
            'name' => $request->input('name'),
            'priority' => $request->input('priority'),
            'description' => $request->input('description'),
            'start_date' => Carbon::parse($request->input('start_date')),
            'end_date' => Carbon::parse($request->input('end_date')),
            'type' => TaskType::FEATURE->name,
            'status' => FeatureStatus::DEVELOPMENT->name
        ]);

        return $this->returnResponse("Feature Added ", $project);
    }

    public function updateFeature(Request $request)
    {

        Log::info("feature update: " . json_encode($request->all()));
        $request->validate([
            'id' => 'required|exists:tasks,id'
        ]);

        $project = Task::query()->where(['id' => $request->input('id')])
            ->update([
                'champion_id' => $request->input('champion_id'),
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'start_date' => Carbon::parse($request->input('start_date')),
                'end_date' => Carbon::parse($request->input('end_date')),
            ]);

        return $this->returnResponse("Feature Updated", $project);
    }

    public function updateFeatureStatus(Request $request)
    {

        $request->validate([
            'id' => 'required|exists:tasks,id',
            'status' => 'required',
        ]);

        $project = Task::query()->where(['id' => $request->input('id')])
            ->update([
                'status' => $request->input('status')
            ]);
        return $this->returnResponse("Feature Updated", $project);
    }

    public function updateProgress(Request $request)
    {

        $request->validate([
            'featureId' => 'required|exists:tasks,id',
            'design_status' => 'required',
            'dev_status' => 'required',
            'test_status' => 'required',
            'approval_status' => 'required',
            'deployment_status' => 'required'
        ]);

        $project = Task::query()->where(['id' => $request->input('featureId')])
            ->update([
                'design_status' => $request->input('design_status'),
                'dev_status' => $request->input('dev_status'),
                'test_status' => $request->input('test_status'),
                'approval_status' => $request->input('approval_status'),
                'deployment_status' => $request->input('deployment_status'),
                'verification_status' => $request->input('verification_status'),
            ]);

        return $this->returnResponse("Feature Updated", $project);
    }

    public function assignMembers(Request $request)
    {

        $request->validate([
            'featureId' => 'required|exists:tasks,id'
        ]);

        $project = Task::query()->where([
            'id' => $request->input('featureId')
        ])
            ->update([
                'designer_id' => $request->input('designer_id'),
                'implementor_id' => $request->input('implementor_id'),
                'tester_id' => $request->input('tester_id'),
                'approver_id' => $request->input('approver_id'),
                'deployer_id' => $request->input('deployer_id')
            ]);
        return $this->returnResponse("Feature Updated", $project);
    }


    public function getActivities(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id'
        ]);

        $activities = TaskActivity::query()
            ->where(['task_id' => $request->input('task_id')])
            ->paginate(50);

        return $this->returnResponse("Activities Posted", $activities);
    }

    public function postActivity(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id'
        ]);

        $project = TaskActivity::query()->create([
                'task_id' => $request->input('task_id'),
                'message' => $request->input('message'),
                'type' => '',
                'attachment_type' => '',
                'attachment_url' => '',
                'author_id' => Auth::id()
            ]);

        return $this->returnResponse("Activities Posted", $project);
    }


}
