<?php

declare(strict_types=1);

namespace App\Application\Actions\Google\Calendar;

use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\CalendarListEntry;
use GrotonSchool\Slim\Norms\AbstractAction;
use Psr\Http\Message\ResponseInterface;
use Slim\Http\ServerRequest;
use Slim\Http\Response;
use Slim\Views\PhpRenderer;

class Accept extends AbstractAction
{
    private Calendar $calendar;

    public function __construct(
        Client $client,
        private SettingsInterface $settings,
        private PhpRenderer $views
    ) {
        $client->setScopes('https://www.googleapis.com/auth/calendar');
        $this->calendar = new Calendar($client);
    }

    protected function invokeHook(
        ServerRequest $request,
        Response $response,
        array $args = []
    ): ResponseInterface {
        // FIXME this is a one-time configuration step
        $entry = new CalendarListEntry();
        $entry->setId($this->settings->getCalendarId());
        $this->calendar->calendarList->insert($entry);
        return $this->views->render($response, 'google/calendar/inserted.php');
    }
}
