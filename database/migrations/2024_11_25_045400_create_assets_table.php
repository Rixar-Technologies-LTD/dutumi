<?php

use App\Enums\AssetCategory;
use App\Enums\AssetUsageStatus;
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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('project_id')->unsigned();
            $table->bigInteger('asset_group_id')->unsigned();
            $table->bigInteger('author_id')->unsigned();

            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->string('type')->nullable();
            $table->string('category')->default(AssetCategory::SERVER->name);

            $table->string('remarks')->nullable();

            $table->double('unit_price')->default(0);

            $table->string('usage_status')->default(AssetUsageStatus::IN_USE->name);
            $table->integer('subscription_months_count')->default(0);
            $table->dateTime('next_payment_date');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
