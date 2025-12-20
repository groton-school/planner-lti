<?php

declare(strict_types=1);

namespace App\Application\Actions;

use GrotonSchool\Slim\Norms\AbstractAction;
use Slim\Http\ServerRequest;
use Slim\Http\Response;
use Psr\Http\Message\ResponseInterface;
use Slim\Views\PhpRenderer;

class Authorized extends AbstractAction
{
    public function __construct(private PhpRenderer $views)
    {
    }

    protected function action(
        ServerRequest $request,
        Response $response,
        array $args = []
    ): ResponseInterface {
        return $this->views->render($response, 'authorized.php');
    }
}
