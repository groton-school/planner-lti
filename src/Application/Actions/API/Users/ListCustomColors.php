<?php

declare(strict_types=1);

namespace App\Application\Actions\API\Users;

use App\Application\Actions\API\AbstractAPIAction;
use Psr\Http\Message\ResponseInterface;

class ListCustomColors extends AbstractAPIAction
{
    protected function action(): ResponseInterface
    {
        return $this->proxyRequest(
            'GET',
            '/api/v1/users/' . $this->args['user_id'] . '/colors'
        );
    }
}
