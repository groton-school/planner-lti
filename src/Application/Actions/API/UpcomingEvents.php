<?php

declare(strict_types=1);

namespace App\Application\Actions\API;

use Psr\Http\Message\ResponseInterface;

class UpcomingEvents extends AbstractAPIAction
{
    protected function action(): ResponseInterface
    {
        return $this->passThroughAPIRequest(
            'GET',
            '/api/v1/users/self/upcoming_events'
        );
    }
}
