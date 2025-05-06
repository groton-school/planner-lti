<?php

declare(strict_types=1);

namespace App\Domain\LTI;

use JsonSerializable;
use Packback\Lti1p3\LtiConstants;
use Packback\Lti1p3\LtiMessageLaunch;

class LaunchData implements JsonSerializable
{
    private array $data;

    /**
     * @param LtiMessageLaunch|array $launch 
     */
    public function __construct(mixed $launch)
    {
        if (is_array($launch)) {
            $this->data = $launch;
        } else if ($launch instanceof LtiMessageLaunch) {
            $this->data = $launch->getLaunchData();
        }
    }

    public function getConsumerInstanceHostname()
    {
        return  parse_url(
            $this->data[LtiConstants::LAUNCH_PRESENTATION]['return_url'],
            PHP_URL_HOST
        );
    }

    public function getConsumerInstanceUrl(): string
    {
        return 'https://' . $this->getConsumerInstanceHostname();
    }

    public function getUserId(): string
    {
        return $this->data[LtiConstants::CUSTOM]['user_id'];
    }

    public function getBrandConfigJSONUrl(): string
    {
        return $this->data[LtiConstants::CUSTOM]['brand_config_json_url'];
    }

    public function jsonSerialize(): mixed
    {
        return $this->data;
    }

    public function getUserEmail()
    {
        return $this->data['email'];
    }
}
