<?php

declare(strict_types=1);

namespace App\Application\Actions\Google\Calendar;

use App\Domain\OAuth2\AppCredentialsRepositoryInterface;
use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\CalendarListEntry;
use GrotonSchool\Slim\Actions\AbstractAction;
use Psr\Http\Message\ResponseInterface;
use Slim\Views\PhpRenderer;

class Accept extends AbstractAction
{
    private Calendar $calendar;
    private AppCredentialsRepositoryInterface $credentials;

    public function __construct(
        Client $client,
        AppCredentialsRepositoryInterface $credentials,
        private PhpRenderer $views
    ) {
        $client->setScopes('https://www.googleapis.com/auth/calendar');
        $this->calendar = new Calendar($client);
        $this->credentials = $credentials;
    }

    protected function action(): ResponseInterface
    {
        // FIXME this is a one-time configuration step
        $entry = new CalendarListEntry();
        $entry->setId($this->credentials->getCalendarId());
        $this->calendar->calendarList->insert($entry);
        return $this->views->render($this->response, 'calendarInserted.php');
    }
}
