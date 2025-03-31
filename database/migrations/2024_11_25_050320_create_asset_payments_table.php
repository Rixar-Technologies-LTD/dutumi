<?php

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
        Schema::create('asset_payments', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("workspace_id")->nullable();
            $table->bigInteger('project_id')->unsigned();
            $table->bigInteger('asset_group_id')->unsigned();
            $table->bigInteger('asset_id')->unsigned();
            $table->bigInteger('author_id')->unsigned();
            $table->double('amount')->default(0);
            $table->string('currency')->default('TZS');
            $table->double('amount_in_company_currency')->default(0);
            $table->dateTime('payment_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_payments');
    }

};
