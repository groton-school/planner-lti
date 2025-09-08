<?php

declare(strict_types=1);

namespace App\Application\Actions\Canvas\Theme;

use App\Application\Middleware\RequireAuthenticationMiddleware;
use App\Domain\LTI\LaunchData;
use Exception;
use GrotonSchool\Slim\Norms\AbstractAction;
use Psr\Http\Message\ResponseInterface;
use Slim\Http\ServerRequest;
use Slim\Http\Response;

class Stylesheet extends AbstractAction
{
    protected function invokeHook(
        ServerRequest $request,
        Response $response,
        array $args = []
    ): ResponseInterface {
        try {
            /** @var LaunchData $launch */
            $launch = $request->getAttribute(RequireAuthenticationMiddleware::LAUNCH_MESSAGE);
            $brand = json_decode(
                file_get_contents(
                    $launch->getBrandConfigJSONUrl()
                ),
                true
            );
            $css = ':root {';
            foreach ($brand as $key => $value) {
                if ($value !== 'none' && !is_numeric($value) && !preg_match("/#[a-f0-9]{3,6}/i", $value)) {
                    $value = "\"$value\"";
                }
                $css .= "--$key: $value;";
            }
            $css .= "}";
            $response->getBody()->write($css);
            return $response->withAddedHeader('Content-Type', 'text/css');
        } catch (Exception $e) {
            return $response->withStatus(401);
        }
    }
}
