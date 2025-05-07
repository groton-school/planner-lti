<?php

declare(strict_types=1);

namespace App\Application\Actions;

use Psr\Http\Message\ResponseInterface;
use Slim\Views\PhpRenderer;

trait ViewsTrait
{
    protected PhpRenderer $renderer;

    protected function initViews()
    {
        $this->renderer = new PhpRenderer(__DIR__ . '/../../../views/slim');
    }

    protected function renderView(ResponseInterface $response, string $templateFileName, array $data = [])
    {
        return $this->renderer->render($response, $templateFileName, $data);
    }
}
