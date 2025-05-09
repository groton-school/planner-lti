<?php

declare(strict_types=1);

namespace App\Application\Actions\Canvas\Theme;

use App\Application\Actions\Canvas\Proxy;
use Exception;
use Psr\Http\Message\ResponseInterface;

class Stylesheet extends Proxy
{
    protected function action(): ResponseInterface
    {
        try {
            $brand = json_decode(file_get_contents($this->getLaunchData()->getBrandConfigJSONUrl()), true);
            $css = ':root {';
            foreach ($brand as $key => $value) {
                if ($value !== 'none' && !is_numeric($value) && !preg_match("/#[a-f0-9]{3,6}/i", $value)) {
                    $value = "\"$value\"";
                }
                $css .= "--$key: $value;";
            }
            $css .= "}";
            $this->response->getBody()->write($css);
            return $this->response->withAddedHeader('Content-Type', 'text/css');
        } catch (Exception $e) {
            return $this->response->withStatus(401);
        }
    }
}
