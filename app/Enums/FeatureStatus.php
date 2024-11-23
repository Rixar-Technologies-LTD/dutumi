<?php

namespace App\Enums;

enum FeatureStatus
{

    case DESIGN;
    case DEVELOPMENT;
    case TESTING;
    case LIVE;
    case RETIRED;

}
