<?php

use App\Enums\FeatureStatus;
use App\Enums\TaskType;
use App\Models\Task;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("project_id")->unsigned();
            $table->bigInteger("creator_id")->unsigned();

            $table->bigInteger("parent_id")->unsigned()->nullable();

            $table->bigInteger("champion_id")->unsigned()->nullable();

            $table->bigInteger("designer_id")->unsigned()->nullable();
            $table->bigInteger("implementor_id")->unsigned()->nullable();
            $table->bigInteger("tester_id")->unsigned()->nullable();
            $table->bigInteger("approver_id")->unsigned()->nullable();
            $table->bigInteger("deployer_id")->unsigned()->nullable();

            $table->string("name");
            $table->string("description",2048)->nullable();
            $table->string("type")->default(TaskType::FEATURE->name);
            $table->string("priority")->nullable();

            $table->dateTime("start_date")->nullable();
            $table->dateTime("end_date")->nullable();
            $table->string("remark")->nullable();

            $table->string("design_status")->nullable();
            $table->string("dev_status")->nullable();
            $table->string("test_status")->nullable();
            $table->string("approval_status")->nullable();
            $table->string("deployment_status")->nullable();
            $table->string("verification_status")->nullable();

            $table->string("status")->default(FeatureStatus::DEVELOPMENT->name);
            $table->string("status_remark")->nullable();

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }

};
