<?php

declare(strict_types=1);

namespace App\Application\Actions\Google\Calendar;

use App\Application\Middleware\Authenticated;
use App\Domain\LTI\LaunchData;
use Google\Client;
use Google\Service\Calendar;
use GrotonSchool\Slim\Norms\AbstractAction;
use Psr\Http\Message\ResponseInterface;
use Slim\Http\ServerRequest;
use Slim\Http\Response;

class Events extends AbstractAction
{
    private Calendar $calendar;

    public function __construct(
        Client $client,
        private SettingsInterface $settings
    ) {
        $client->setScopes('https://www.googleapis.com/auth/calendar');
        $this->calendar = new Calendar($client);
    }

    protected function invokeHook(
        ServerRequest $request,
        Response $response,
        array $args = []
    ): ResponseInterface {
        $params = $request->getQueryParams();
        /** @var Launchdata $launch */
        $launch = $request->getAttribute(Authenticated::LAUNCH_MESSAGE);
        if (isset($params['q'])) {
            $params['q'] = $launch->getUserEmail() . ' ' . $params['q'];
        } else {
            $params['q'] = $launch->getUserEmail();
        }
        $events = $this->calendar->events->listEvents(
            $this->settings->getCalendarId(),
            $params
        );
        $response->getBody()->write(json_encode($events));
        return $response;
    }
}
