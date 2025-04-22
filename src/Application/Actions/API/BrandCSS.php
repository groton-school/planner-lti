<?php

declare(strict_types=1);

namespace App\Application\Actions\API;

use Exception;
use Packback\Lti1p3\LtiConstants;
use Psr\Http\Message\ResponseInterface;

class BrandCSS extends AbstractAPIAction
{
    protected function action(): ResponseInterface
    {
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
    }
}
