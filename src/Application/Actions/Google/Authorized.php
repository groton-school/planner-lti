<?php

declare(strict_types=1);

namespace App\Application\Actions\Google;

use App\Domain\Google\APIProxy;
use GrotonSchool\Slim\Norms\AbstractAction;
use Slim\Http\ServerRequest;
use Slim\Http\Response;
use Psr\Http\Message\ResponseInterface;
use Slim\Views\PhpRenderer;

class Authorized extends AbstractAction
{
    public function __construct(private PhpRenderer $views, private APIProxy $provider)
    {
    }

    protected function invokeHook(
        ServerRequest $request,
        Response $response,
        array $args = []
    ): ResponseInterface {
        return $this->views->render($response, 'google/authorized.php');
    }
}
