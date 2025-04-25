<?php

declare(strict_types=1);

namespace App\Application\Actions\API\Courses;

use App\Application\Actions\API\AbstractAPIAction;
use Psr\Http\Message\ResponseInterface;

class Get extends AbstractAPIAction
{
    protected function action(): ResponseInterface
    {

        return $this->proxyRequest(
            'GET',
            '/api/v1/courses/' . $this->args['course_id']
        );
    }
}
